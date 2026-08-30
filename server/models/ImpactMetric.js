import mongoose from 'mongoose';
import { JHARKHAND_DISTRICTS } from '../utils/constants.js';

const impactMetricSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    period: {
      start: Date,
      end: Date,
      label: { type: String, trim: true },
    },
    beneficiaries: { type: Number, min: 0, default: 0 },
    districtsReached: [{ type: String, enum: JHARKHAND_DISTRICTS }],
    co2ReducedKg: { type: Number, min: 0, default: 0 },
    waterSavedLiters: { type: Number, min: 0, default: 0 },
    jobsCreated: { type: Number, min: 0, default: 0 },
    costSavings: { type: Number, min: 0, default: 0 },
    customMetrics: [
      {
        name: { type: String, trim: true, required: true },
        value: { type: Number, required: true },
        unit: { type: String, trim: true },
        description: { type: String, trim: true },
      },
    ],
    evidence: [{ type: String, trim: true }],
    notes: { type: String, trim: true },
    verified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: Date,
  },
  { timestamps: true }
);

impactMetricSchema.index({ projectId: 1, createdAt: -1 });
impactMetricSchema.index({ challengeId: 1 });

const ImpactMetric = mongoose.model('ImpactMetric', impactMetricSchema);
export default ImpactMetric;
