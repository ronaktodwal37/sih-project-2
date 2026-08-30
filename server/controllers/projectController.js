import Project from '../models/Project.js';
import Challenge from '../models/Challenge.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { logAudit } from '../utils/auditLogger.js';
import { createNotification } from '../services/notification/notificationService.js';
import User from '../models/User.js';
import { ROLES } from '../utils/constants.js';

const populateOptions = [
  { path: 'challengeId', select: 'title category status location' },
  { path: 'universityId', select: 'name district expertise' },
  { path: 'industryPartners.industryId', select: 'companyName expertise' },
  { path: 'facultyMentor.userId', select: 'name email' },
  { path: 'students.userId', select: 'name email' },
  { path: 'createdBy', select: 'name email role' },
];

export const getProjects = catchAsync(async (req, res) => {
  const { status, universityId, challengeId, search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;
  if (universityId) query.universityId = universityId;
  if (challengeId) query.challengeId = challengeId;
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [projects, total] = await Promise.all([
    Project.find(query).populate(populateOptions).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Project.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: projects,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

export const getProject = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id).populate(populateOptions);
  if (!project) throw new AppError('Project not found', 404);
  res.status(200).json({ success: true, data: project });
});

export const createProject = catchAsync(async (req, res) => {
  const challenge = await Challenge.findById(req.body.challengeId);
  if (!challenge) throw new AppError('Challenge not found', 404);

  const project = await Project.create({
    ...req.body,
    createdBy: req.user._id,
  });

  challenge.status = 'in_progress';
  await challenge.save({ validateBeforeSave: false });

  await logAudit({
    action: 'project_create',
    performedBy: req.user._id,
    targetType: 'Project',
    targetId: project._id,
    details: { title: project.title, challengeId: project.challengeId },
    req,
  });

  const govUsers = await User.find({ role: ROLES.GOVERNMENT, isActive: true }).select('_id');
  await Promise.all(
    govUsers.map((u) =>
      createNotification({
        recipient: u._id,
        type: 'project_created',
        title: 'New Project Created',
        message: `Project "${project.title}" has been initiated.`,
        link: `/government/projects/${project._id}`,
        metadata: { projectId: project._id },
      })
    )
  );

  res.status(201).json({ success: true, data: project });
});

export const updateProject = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new AppError('Project not found', 404);

  Object.assign(project, req.body);
  await project.save();

  await logAudit({
    action: 'project_update',
    performedBy: req.user._id,
    targetType: 'Project',
    targetId: project._id,
    req,
  });

  res.status(200).json({ success: true, data: project });
});

export const deleteProject = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new AppError('Project not found', 404);
  await Project.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Project deleted' });
});

export const addMilestone = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new AppError('Project not found', 404);

  project.milestones.push(req.body);
  await project.save();

  await logAudit({
    action: 'project_milestone',
    performedBy: req.user._id,
    targetType: 'Project',
    targetId: project._id,
    details: { action: 'add', milestone: req.body.title },
    req,
  });

  res.status(201).json({ success: true, data: project });
});

export const updateMilestone = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new AppError('Project not found', 404);

  const milestone = project.milestones.id(req.params.milestoneId);
  if (!milestone) throw new AppError('Milestone not found', 404);

  Object.assign(milestone, req.body);
  if (req.body.status === 'completed') milestone.completedAt = new Date();
  await project.save();

  await logAudit({
    action: 'project_milestone',
    performedBy: req.user._id,
    targetType: 'Project',
    targetId: project._id,
    details: { action: 'update', milestoneId: req.params.milestoneId },
    req,
  });

  res.status(200).json({ success: true, data: project });
});

export const deleteMilestone = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new AppError('Project not found', 404);

  const milestone = project.milestones.id(req.params.milestoneId);
  if (!milestone) throw new AppError('Milestone not found', 404);

  milestone.deleteOne();
  await project.save();
  res.status(200).json({ success: true, data: project });
});

export const getMyProjects = catchAsync(async (req, res) => {
  let query = {};
  if (req.user.role === ROLES.UNIVERSITY && req.user.universityId) {
    query.universityId = req.user.universityId;
  } else if (req.user.role === ROLES.FACULTY) {
    query['facultyMentor.userId'] = req.user._id;
  } else if (req.user.role === ROLES.STUDENT) {
    query['students.userId'] = req.user._id;
  } else {
    query.createdBy = req.user._id;
  }

  const projects = await Project.find(query).populate(populateOptions).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: projects });
});
