import mongoose from 'mongoose';
import { PROJECT_STATUSES, MILESTONE_STATUSES, JHARKHAND_DISTRICTS } from '../utils/constants.js';

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    dueDate: Date,
    status: {
      type: String,
      enum: MILESTONE_STATUSES,
      default: 'not_started',
    },
    completedAt: Date,
    deliverables: [{ type: String, trim: true }],
  },
  { _id: true, timestamps: true }
);

const documentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    type: { type: String, trim: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const studentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, trim: true },
    role: { type: String, trim: true },
    department: { type: String, trim: true },
  },
  { _id: true }
);

const industryPartnerSchema = new mongoose.Schema(
  {
    industryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Industry' },
    contribution: { type: String, trim: true },
    fundingAmount: { type: Number, min: 0 },
    status: {
      type: String,
      enum: ['proposed', 'confirmed', 'active', 'completed'],
      default: 'proposed',
    },
  },
  { _id: true }
);

const budgetSchema = new mongoose.Schema(
  {
    allocated: { type: Number, min: 0, default: 0 },
    spent: { type: Number, min: 0, default: 0 },
    currency: { type: String, default: 'INR' },
    breakdown: [
      {
        category: { type: String, trim: true },
        amount: { type: Number, min: 0 },
      },
    ],
  },
  { _id: false }
);

const impactMetricsSchema = new mongoose.Schema(
  {
    beneficiaries: { type: Number, min: 0 },
    districtsReached: [{ type: String, enum: JHARKHAND_DISTRICTS }],
    co2Reduced: { type: Number, min: 0 },
    jobsCreated: { type: Number, min: 0 },
    customMetrics: [
      {
        name: { type: String, trim: true },
        value: { type: Number },
        unit: { type: String, trim: true },
      },
    ],
    lastUpdated: { type: Date, default: Date.now },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    industryPartners: [industryPartnerSchema],
    facultyMentor: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, trim: true },
      department: { type: String, trim: true },
    },
    students: [studentSchema],
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: 200,
    },
    description: { type: String, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: PROJECT_STATUSES,
      default: 'research',
    },
    milestones: [milestoneSchema],
    documents: [documentSchema],
    budget: budgetSchema,
    pilotLocation: {
      district: { type: String, enum: JHARKHAND_DISTRICTS },
      address: { type: String, trim: true },
      coordinates: {
        type: { type: String, enum: ['Point'] },
        coordinates: { type: [Number] },
      },
    },
    impactMetrics: impactMetricsSchema,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

projectSchema.index({ challengeId: 1 });
projectSchema.index({ universityId: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ title: 'text', description: 'text' });

const Project = mongoose.model('Project', projectSchema);
export default Project;
