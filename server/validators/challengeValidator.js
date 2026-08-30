import { z } from 'zod';
import { CHALLENGE_CATEGORIES, CHALLENGE_STATUSES, JHARKHAND_DISTRICTS } from '../utils/constants.js';

const locationSchema = z.object({
  district: z.enum(JHARKHAND_DISTRICTS),
  block: z.string().optional(),
  village: z.string().optional(),
  address: z.string().optional(),
  coordinates: z
    .object({
      type: z.literal('Point').optional(),
      coordinates: z.array(z.number()).length(2).optional(),
    })
    .optional(),
});

const evidenceSchema = z.object({
  type: z.enum(['image', 'video', 'document', 'audio', 'link']),
  url: z.string().url('Invalid evidence URL'),
  caption: z.string().optional(),
});

export const createChallengeSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000),
  category: z.enum(CHALLENGE_CATEGORIES),
  location: locationSchema,
  evidence: z.array(evidenceSchema).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  affectedPopulation: z.number().min(0).optional(),
  urgency: z.enum(['low', 'medium', 'high', 'critical']).optional().default('medium'),
});

export const updateChallengeSchema = createChallengeSchema.partial();

export const validateChallengeSchema = z.object({
  isValid: z.boolean(),
  notes: z.string().optional(),
  rejectionReason: z.string().optional(),
  clarificationRequest: z.string().optional(),
});

export const assignChallengeSchema = z.object({
  universityIds: z.array(z.string()).optional().default([]),
  industryIds: z.array(z.string()).optional().default([]),
  notes: z.string().optional(),
});

export const challengeQuerySchema = z.object({
  status: z.enum(CHALLENGE_STATUSES).optional(),
  category: z.enum(CHALLENGE_CATEGORIES).optional(),
  district: z.enum(JHARKHAND_DISTRICTS).optional(),
  urgency: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  sortBy: z.enum(['createdAt', 'priorityScore', 'title']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
