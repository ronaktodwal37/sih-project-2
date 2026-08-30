export const ROLES = {
  CITIZEN: 'citizen',
  UNIVERSITY: 'university',
  FACULTY: 'faculty',
  STUDENT: 'student',
  INDUSTRY: 'industry',
  GOVERNMENT: 'government',
  ADMIN: 'admin',
};

export const ROLE_DASHBOARD_PATHS = {
  [ROLES.CITIZEN]: '/citizen/dashboard',
  [ROLES.UNIVERSITY]: '/university/dashboard',
  [ROLES.FACULTY]: '/faculty/dashboard',
  [ROLES.STUDENT]: '/student/dashboard',
  [ROLES.INDUSTRY]: '/industry/dashboard',
  [ROLES.GOVERNMENT]: '/government/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
};

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

export const getPriorityColor = (level) => {
  const colors = {
    Critical: 'bg-red-100 text-red-800 border-red-200',
    High: 'bg-orange-100 text-orange-800 border-orange-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Low: 'bg-green-100 text-green-800 border-green-200',
  };
  return colors[level] || colors.Low;
};
