import { z } from 'zod';
import { PROJECT_STATUSES, MILESTONE_STATUSES, JHARKHAND_DISTRICTS } from '../utils/constants.js';

const milestoneSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().optional(),
  dueDate: z.coerce.date().optional(),
  status: z.enum(MILESTONE_STATUSES).optional(),
  deliverables: z.array(z.string()).optional(),
});

const studentSchema = z.object({
  userId: z.string().optional(),
  name: z.string().optional(),
  role: z.string().optional(),
  department: z.string().optional(),
});

const industryPartnerSchema = z.object({
  industryId: z.string(),
  contribution: z.string().optional(),
  fundingAmount: z.number().min(0).optional(),
  status: z.enum(['proposed', 'confirmed', 'active', 'completed']).optional(),
});

export const createProjectSchema = z.object({
  challengeId: z.string().min(1, 'Challenge ID is required'),
  universityId: z.string().min(1, 'University ID is required'),
  title: z.string().min(5).max(200),
  description: z.string().max(5000).optional(),
  industryPartners: z.array(industryPartnerSchema).optional().default([]),
  facultyMentor: z
    .object({
      userId: z.string().optional(),
      name: z.string().optional(),
      department: z.string().optional(),
    })
    .optional(),
  students: z.array(studentSchema).optional().default([]),
  status: z.enum(PROJECT_STATUSES).optional(),
  budget: z
    .object({
      allocated: z.number().min(0).optional(),
      currency: z.string().optional(),
    })
    .optional(),
  pilotLocation: z
    .object({
      district: z.enum(JHARKHAND_DISTRICTS).optional(),
      address: z.string().optional(),
    })
    .optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const updateProjectSchema = createProjectSchema.partial().omit({ challengeId: true });

export const createMilestoneSchema = milestoneSchema;

export const updateMilestoneSchema = milestoneSchema.partial();

export const projectQuerySchema = z.object({
  status: z.enum(PROJECT_STATUSES).optional(),
  universityId: z.string().optional(),
  challengeId: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});
