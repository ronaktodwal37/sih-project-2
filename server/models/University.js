import mongoose from 'mongoose';
import { JHARKHAND_DISTRICTS } from '../utils/constants.js';

const locationSchema = new mongoose.Schema(
  {
    district: { type: String, enum: JHARKHAND_DISTRICTS, required: true },
    address: { type: String, trim: true },
    coordinates: {
      type: { type: String, enum: ['Point'] },
      coordinates: { type: [Number] },
    },
  },
  { _id: false }
);

const facultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    department: { type: String, trim: true },
    expertise: [{ type: String, trim: true }],
    email: { type: String, trim: true, lowercase: true },
    designation: { type: String, trim: true },
  },
  { _id: true }
);

const labSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    focus: [{ type: String, trim: true }],
    equipment: [{ type: String, trim: true }],
    capacity: { type: Number, min: 0 },
  },
  { _id: true }
);

const centerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['innovation', 'incubation', 'research'], required: true },
    focus: [{ type: String, trim: true }],
    capacity: { type: Number, min: 0 },
  },
  { _id: true }
);

const pastProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    year: { type: Number },
    outcome: { type: String, trim: true },
    impact: { type: String, trim: true },
  },
  { _id: true }
);

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'University name is required'],
      trim: true,
      unique: true,
    },
    description: { type: String, trim: true, maxlength: 3000 },
    district: {
      type: String,
      enum: JHARKHAND_DISTRICTS,
      required: true,
    },
    departments: [{ type: String, trim: true }],
    expertise: [{ type: String, trim: true }],
    faculty: [facultySchema],
    labs: [labSchema],
    innovationCenters: [centerSchema],
    incubationCenters: [centerSchema],
    pastProjects: [pastProjectSchema],
    studentSkills: [{ type: String, trim: true }],
    availableCapacity: {
      projects: { type: Number, min: 0, default: 5 },
      students: { type: Number, min: 0, default: 50 },
      facultyMentors: { type: Number, min: 0, default: 10 },
    },
    location: locationSchema,
    verified: { type: Boolean, default: false },
    contactEmail: { type: String, trim: true, lowercase: true },
    contactPhone: { type: String, trim: true },
    website: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

universitySchema.index({ name: 'text', description: 'text', expertise: 'text' });
universitySchema.index({ district: 1 });
universitySchema.index({ verified: 1 });

const University = mongoose.model('University', universitySchema);
export default University;
