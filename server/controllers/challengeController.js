import Challenge from '../models/Challenge.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ROLES, getPriorityLabel } from '../utils/constants.js';
import { logAudit } from '../utils/auditLogger.js';
import { analyzeChallenge } from '../services/ai/challengeAnalyzer.js';
import { findDuplicates } from '../services/ai/duplicateDetector.js';
import { analyzeRootCauses } from '../services/ai/rootCauseAnalyzer.js';
import { calculatePriority } from '../services/matching/priorityEngine.js';
import { matchUniversities } from '../services/matching/universityMatcher.js';
import { matchIndustries } from '../services/matching/industryMatcher.js';
import { createNotification } from '../services/notification/notificationService.js';
import User from '../models/User.js';

const populateOptions = [
  { path: 'submittedBy', select: 'name email role district' },
  { path: 'validation.validatedBy', select: 'name email role' },
  { path: 'assignedUniversities.universityId', select: 'name district expertise' },
  { path: 'assignedIndustries.industryId', select: 'companyName districts expertise' },
];

export const getChallenges = catchAsync(async (req, res) => {
  const {
    status,
    category,
    district,
    urgency,
    search,
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  const query = {};
  if (status) query.status = status;
  if (category) query.category = category;
  if (district) query['location.district'] = district;
  if (urgency) query.urgency = urgency;
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [challenges, total] = await Promise.all([
    Challenge.find(query).populate(populateOptions).sort(sort).skip(skip).limit(Number(limit)),
    Challenge.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: challenges,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

export const getChallenge = catchAsync(async (req, res) => {
  const challenge = await Challenge.findById(req.params.id).populate(populateOptions);
  if (!challenge) throw new AppError('Challenge not found', 404);

  challenge.viewCount += 1;
  await challenge.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, data: challenge });
});

export const createChallenge = catchAsync(async (req, res) => {
  const challenge = await Challenge.create({
    ...req.body,
    submittedBy: req.user._id,
    status: 'submitted',
  });

  try {
    const aiAnalysis = await analyzeChallenge(challenge);
    const duplicates = await findDuplicates(challenge);
    const priority = calculatePriority({ ...challenge.toObject(), aiAnalysis });

    challenge.aiAnalysis = aiAnalysis;
    challenge.duplicateCandidates = duplicates;
    challenge.priorityScore = priority.priorityScore;
    challenge.priorityExplanation = priority.explanation;
    if (aiAnalysis.suggestedTags?.length) {
      challenge.tags = [...new Set([...(challenge.tags || []), ...aiAnalysis.suggestedTags])];
    }
    await challenge.save();
  } catch (error) {
    console.warn('AI analysis on create failed:', error.message);
  }

  await logAudit({
    action: 'challenge_create',
    performedBy: req.user._id,
    targetType: 'Challenge',
    targetId: challenge._id,
    details: { title: challenge.title },
    req,
  });

  const govUsers = await User.find({ role: ROLES.GOVERNMENT, isActive: true }).select('_id');
  await Promise.all(
    govUsers.map((u) =>
      createNotification({
        recipient: u._id,
        type: 'challenge_submitted',
        title: 'New Challenge Submitted',
        message: `"${challenge.title}" has been submitted for review.`,
        link: `/government/challenges/${challenge._id}`,
        metadata: { challengeId: challenge._id },
      })
    )
  );

  res.status(201).json({ success: true, data: challenge });
});

export const updateChallenge = catchAsync(async (req, res) => {
  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) throw new AppError('Challenge not found', 404);

  const isOwner = challenge.submittedBy.toString() === req.user._id.toString();
  const isGovOrAdmin = [ROLES.GOVERNMENT, ROLES.ADMIN].includes(req.user.role);
  if (!isOwner && !isGovOrAdmin) {
    throw new AppError('Not authorized to update this challenge', 403);
  }

  Object.assign(challenge, req.body);
  await challenge.save();

  await logAudit({
    action: 'challenge_update',
    performedBy: req.user._id,
    targetType: 'Challenge',
    targetId: challenge._id,
    req,
  });

  res.status(200).json({ success: true, data: challenge });
});

export const deleteChallenge = catchAsync(async (req, res) => {
  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) throw new AppError('Challenge not found', 404);

  await Challenge.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Challenge deleted' });
});

export const validateChallenge = catchAsync(async (req, res) => {
  const { isValid, notes, rejectionReason, clarificationRequest } = req.body;
  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) throw new AppError('Challenge not found', 404);

  challenge.validation = {
    isValid,
    validatedBy: req.user._id,
    validatedAt: new Date(),
    notes,
    rejectionReason,
    clarificationRequest,
  };

  if (isValid) {
    challenge.status = 'validated';
  } else if (clarificationRequest) {
    challenge.status = 'clarification_requested';
  } else {
    challenge.status = 'rejected';
  }

  await challenge.save();

  await logAudit({
    action: 'challenge_validate',
    performedBy: req.user._id,
    targetType: 'Challenge',
    targetId: challenge._id,
    details: { isValid, status: challenge.status },
    req,
  });

  await createNotification({
    recipient: challenge.submittedBy,
    type: isValid ? 'challenge_validated' : 'system',
    title: isValid ? 'Challenge Validated' : 'Challenge Update',
    message: isValid
      ? `Your challenge "${challenge.title}" has been validated.`
      : `Your challenge "${challenge.title}" requires attention.`,
    link: `/citizen/challenges/${challenge._id}`,
    metadata: { challengeId: challenge._id },
  });

  res.status(200).json({ success: true, data: challenge });
});

export const analyzeChallengeAI = catchAsync(async (req, res) => {
  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) throw new AppError('Challenge not found', 404);

  const [aiAnalysis, duplicates, rootCauses] = await Promise.all([
    analyzeChallenge(challenge),
    findDuplicates(challenge),
    analyzeRootCauses(challenge),
  ]);

  const priority = calculatePriority({ ...challenge.toObject(), aiAnalysis });

  challenge.aiAnalysis = { ...aiAnalysis, rootCauses: rootCauses.rootCauses };
  challenge.duplicateCandidates = duplicates;
  challenge.priorityScore = priority.priorityScore;
  challenge.priorityExplanation = priority.explanation;
  await challenge.save();

  res.status(200).json({
    success: true,
    data: {
      challenge,
      rootCauses,
      priority: { ...priority, label: getPriorityLabel(priority.priorityScore) },
    },
  });
});

export const assignChallenge = catchAsync(async (req, res) => {
  const { universityIds = [], industryIds = [], notes } = req.body;
  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) throw new AppError('Challenge not found', 404);

  if (challenge.status !== 'validated' && challenge.status !== 'assigned') {
    throw new AppError('Only validated challenges can be assigned', 400);
  }

  const now = new Date();
  challenge.assignedUniversities = universityIds.map((id) => ({
    universityId: id,
    assignedAt: now,
    assignedBy: req.user._id,
    status: 'pending',
    notes,
  }));
  challenge.assignedIndustries = industryIds.map((id) => ({
    industryId: id,
    assignedAt: now,
    assignedBy: req.user._id,
    status: 'pending',
    notes,
  }));
  challenge.status = 'assigned';
  await challenge.save();

  await logAudit({
    action: 'challenge_assign',
    performedBy: req.user._id,
    targetType: 'Challenge',
    targetId: challenge._id,
    details: { universityIds, industryIds },
    req,
  });

  res.status(200).json({ success: true, data: challenge });
});

export const getUniversityMatches = catchAsync(async (req, res) => {
  const challenge = await Challenge.findById(req.params.id).lean();
  if (!challenge) throw new AppError('Challenge not found', 404);

  const matches = await matchUniversities(challenge, {
    limit: Number(req.query.limit) || 10,
    minScore: Number(req.query.minScore) || 20,
  });

  res.status(200).json({ success: true, data: matches });
});

export const getIndustryMatches = catchAsync(async (req, res) => {
  const challenge = await Challenge.findById(req.params.id).lean();
  if (!challenge) throw new AppError('Challenge not found', 404);

  const matches = await matchIndustries(challenge, {
    limit: Number(req.query.limit) || 10,
    minScore: Number(req.query.minScore) || 20,
  });

  res.status(200).json({ success: true, data: matches });
});

export const getMyChallenges = catchAsync(async (req, res) => {
  const challenges = await Challenge.find({ submittedBy: req.user._id })
    .sort({ createdAt: -1 })
    .populate(populateOptions);
  res.status(200).json({ success: true, data: challenges });
});
