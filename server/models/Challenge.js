import mongoose from 'mongoose';
import { CHALLENGE_CATEGORIES, CHALLENGE_STATUSES, JHARKHAND_DISTRICTS } from '../utils/constants.js';

const locationSchema = new mongoose.Schema(
  {
    district: {
      type: String,
      enum: JHARKHAND_DISTRICTS,
      required: true,
    },
    block: { type: String, trim: true },
    village: { type: String, trim: true },
    coordinates: {
      type: { type: String, enum: ['Point'] },
      coordinates: { type: [Number] },
    },
    address: { type: String, trim: true },
  },
  { _id: false }
);

const evidenceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['image', 'video', 'document', 'audio', 'link'],
      required: true,
    },
    url: { type: String, required: true },
    caption: { type: String, trim: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const aiAnalysisSchema = new mongoose.Schema(
  {
    summary: { type: String, trim: true },
    category: { type: String, enum: CHALLENGE_CATEGORIES },
    suggestedTags: [{ type: String, trim: true }],
    rootCauses: [{ type: String, trim: true }],
    stakeholders: [{ type: String, trim: true }],
    impactAreas: [{ type: String, trim: true }],
    feasibilityScore: { type: Number, min: 0, max: 100 },
    urgencyScore: { type: Number, min: 0, max: 100 },
    confidence: { type: Number, min: 0, max: 1 },
    provider: { type: String, enum: ['gemini', 'rule-based', 'fallback'], default: 'rule-based' },
    analyzedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const duplicateCandidateSchema = new mongoose.Schema(
  {
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
    similarityScore: { type: Number, min: 0, max: 1 },
    matchReason: { type: String, trim: true },
  },
  { _id: false }
);

const validationSchema = new mongoose.Schema(
  {
    isValid: { type: Boolean, default: false },
    validatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    validatedAt: Date,
    notes: { type: String, trim: true },
    rejectionReason: { type: String, trim: true },
    clarificationRequest: { type: String, trim: true },
  },
  { _id: false }
);

const universityAssignmentSchema = new mongoose.Schema(
  {
    universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
    assignedAt: { type: Date, default: Date.now },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'completed'],
      default: 'pending',
    },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const industryAssignmentSchema = new mongoose.Schema(
  {
    industryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Industry', required: true },
    assignedAt: { type: Date, default: Date.now },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'completed'],
      default: 'pending',
    },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 5000,
    },
    category: {
      type: String,
      enum: CHALLENGE_CATEGORIES,
      required: true,
    },
    status: {
      type: String,
      enum: CHALLENGE_STATUSES,
      default: 'submitted',
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      type: locationSchema,
      required: true,
    },
    evidence: [evidenceSchema],
    tags: [{ type: String, trim: true }],
    affectedPopulation: { type: Number, min: 0 },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    aiAnalysis: aiAnalysisSchema,
    duplicateCandidates: [duplicateCandidateSchema],
    validation: validationSchema,
    assignedUniversities: [universityAssignmentSchema],
    assignedIndustries: [industryAssignmentSchema],
    priorityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    priorityExplanation: [{ type: String, trim: true }],
    mergedInto: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
    viewCount: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

challengeSchema.index({ title: 'text', description: 'text', tags: 'text' });
challengeSchema.index({ status: 1, category: 1 });
challengeSchema.index({ 'location.district': 1 });
challengeSchema.index({ priorityScore: -1 });
challengeSchema.index({ submittedBy: 1 });

challengeSchema.pre('save', function cleanCoordinates() {
  const coords = this.location?.coordinates;
  if (coords && (!coords.type || !coords.coordinates?.length)) {
    this.location.coordinates = undefined;
  }
});

const Challenge = mongoose.model('Challenge', challengeSchema);
export default Challenge;
