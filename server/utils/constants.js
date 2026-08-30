export const ROLES = {
  CITIZEN: 'citizen',
  UNIVERSITY: 'university',
  FACULTY: 'faculty',
  STUDENT: 'student',
  INDUSTRY: 'industry',
  GOVERNMENT: 'government',
  ADMIN: 'admin',
};

export const ROLE_LIST = Object.values(ROLES);

export const CHALLENGE_CATEGORIES = [
  'Education',
  'Healthcare',
  'Agriculture',
  'Water',
  'Environment',
  'Energy',
  'Sanitation',
  'Accessibility',
  'Urban Development',
  'Rural Livelihood',
  'Public Administration',
  'Other',
];

export const CHALLENGE_STATUSES = [
  'submitted',
  'under_review',
  'validated',
  'rejected',
  'clarification_requested',
  'assigned',
  'accepted',
  'in_progress',
  'completed',
  'merged',
];

export const PROJECT_STATUSES = [
  'research',
  'proposal',
  'prototype',
  'testing',
  'pilot',
  'deployment',
  'impact_measurement',
  'completed',
];

export const MILESTONE_STATUSES = [
  'not_started',
  'in_progress',
  'completed',
  'delayed',
];

export const PRIORITY_LEVELS = {
  CRITICAL: { min: 90, max: 100, label: 'Critical' },
  HIGH: { min: 70, max: 89, label: 'High' },
  MEDIUM: { min: 40, max: 69, label: 'Medium' },
  LOW: { min: 0, max: 39, label: 'Low' },
};

export const JHARKHAND_DISTRICTS = [
  'Ranchi',
  'Jamshedpur',
  'Dhanbad',
  'Bokaro',
  'Hazaribagh',
  'Deoghar',
  'Dumka',
  'Giridih',
  'Palamu',
  'Gumla',
  'Simdega',
  'West Singhbhum',
  'East Singhbhum',
  'Seraikela-Kharsawan',
  'Chatra',
  'Koderma',
  'Ramgarh',
  'Garhwa',
  'Latehar',
  'Lohardaga',
  'Pakur',
  'Sahebganj',
  'Godda',
  'Jamtara',
  'Khunti',
];

export const getPriorityLabel = (score) => {
  if (score >= 90) return 'Critical';
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
};

export const NOTIFICATION_TYPES = [
  'challenge_submitted',
  'challenge_validated',
  'challenge_assigned',
  'project_created',
  'project_milestone',
  'project_completed',
  'match_found',
  'system',
  'admin',
];

export const AUDIT_ACTIONS = [
  'user_login',
  'user_register',
  'challenge_create',
  'challenge_update',
  'challenge_validate',
  'challenge_assign',
  'project_create',
  'project_update',
  'project_milestone',
  'university_create',
  'university_update',
  'industry_create',
  'industry_update',
  'file_upload',
  'admin_action',
];
