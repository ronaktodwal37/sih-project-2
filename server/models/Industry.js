import mongoose from 'mongoose';
import { JHARKHAND_DISTRICTS } from '../utils/constants.js';

const mentorshipSchema = new mongoose.Schema(
  {
    available: { type: Boolean, default: false },
    domains: [{ type: String, trim: true }],
    hoursPerMonth: { type: Number, min: 0 },
    description: { type: String, trim: true },
  },
  { _id: false }
);

const pilotSupportSchema = new mongoose.Schema(
  {
    available: { type: Boolean, default: false },
    types: [{ type: String, trim: true }],
    maxBudget: { type: Number, min: 0 },
    description: { type: String, trim: true },
  },
  { _id: false }
);

const industrySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      unique: true,
    },
    description: { type: String, trim: true, maxlength: 3000 },
    expertise: [{ type: String, trim: true }],
    csrDomains: [{ type: String, trim: true }],
    fundingCapacity: {
      min: { type: Number, min: 0, default: 0 },
      max: { type: Number, min: 0, default: 0 },
      currency: { type: String, default: 'INR' },
    },
    mentorship: mentorshipSchema,
    pilotSupport: pilotSupportSchema,
    technologyAreas: [{ type: String, trim: true }],
    districts: [{ type: String, enum: JHARKHAND_DISTRICTS }],
    verified: { type: Boolean, default: false },
    contactEmail: { type: String, trim: true, lowercase: true },
    contactPhone: { type: String, trim: true },
    website: { type: String, trim: true },
    logo: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

industrySchema.index({ companyName: 'text', description: 'text', expertise: 'text' });
industrySchema.index({ districts: 1 });
industrySchema.index({ verified: 1 });

const Industry = mongoose.model('Industry', industrySchema);
export default Industry;
