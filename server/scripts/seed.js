import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Challenge from '../models/Challenge.js';
import University from '../models/University.js';
import Industry from '../models/Industry.js';
import Project from '../models/Project.js';
import Notification from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';
import ImpactMetric from '../models/ImpactMetric.js';
import { ROLES, CHALLENGE_CATEGORIES, JHARKHAND_DISTRICTS } from '../utils/constants.js';
import { calculatePriority } from '../services/matching/priorityEngine.js';

dotenv.config();

const DEMO_PASSWORD = 'Demo@1234';

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickN = (arr, n) => [...arr].sort(() => 0.5 - Math.random()).slice(0, n);

const challengeTemplates = [
  { title: 'Clean Drinking Water in Remote Villages', category: 'Water', urgency: 'critical' },
  { title: 'Digital Literacy for Tribal Youth', category: 'Education', urgency: 'high' },
  { title: 'Telemedicine for Rural Healthcare', category: 'Healthcare', urgency: 'high' },
  { title: 'Smart Irrigation for Small Farmers', category: 'Agriculture', urgency: 'medium' },
  { title: 'Solar Street Lighting in Tribal Hamlets', category: 'Energy', urgency: 'medium' },
  { title: 'Community Sanitation Awareness Program', category: 'Sanitation', urgency: 'high' },
  { title: 'Waste Management in Market Areas', category: 'Environment', urgency: 'medium' },
  { title: 'Accessible Ramps for Public Buildings', category: 'Accessibility', urgency: 'medium' },
  { title: 'Traffic Management at School Zones', category: 'Urban Development', urgency: 'high' },
  { title: 'Handicraft E-commerce for Rural Artisans', category: 'Rural Livelihood', urgency: 'medium' },
  { title: 'Single Window Citizen Service Portal', category: 'Public Administration', urgency: 'low' },
  { title: 'Maternal Health Monitoring System', category: 'Healthcare', urgency: 'critical' },
  { title: 'Rainwater Harvesting in Drought Areas', category: 'Water', urgency: 'high' },
  { title: 'Forest Fire Early Warning System', category: 'Environment', urgency: 'critical' },
  { title: 'Vocational Training for School Dropouts', category: 'Education', urgency: 'high' },
  { title: 'Organic Farming Certification Support', category: 'Agriculture', urgency: 'low' },
  { title: 'Biogas Plants for Rural Households', category: 'Energy', urgency: 'medium' },
  { title: 'Public Toilet Maintenance Tracking', category: 'Sanitation', urgency: 'medium' },
  { title: 'Bridge Connectivity for Monsoon Season', category: 'Rural Livelihood', urgency: 'critical' },
  { title: 'Air Quality Monitoring in Industrial Zones', category: 'Environment', urgency: 'high' },
  { title: 'Mid-Day Meal Quality Assurance', category: 'Education', urgency: 'high' },
  { title: 'Ambulance GPS Tracking System', category: 'Healthcare', urgency: 'critical' },
];

const universityData = [
  { name: 'Ranchi University', district: 'Ranchi', expertise: ['Education', 'Public Administration', 'Environment'] },
  { name: 'BIT Mesra', district: 'Ranchi', expertise: ['Energy', 'Technology', 'Urban Development'] },
  { name: 'XLRI Jamshedpur', district: 'Jamshedpur', expertise: ['Rural Livelihood', 'Public Administration'] },
  { name: 'NIT Jamshedpur', district: 'Jamshedpur', expertise: ['Energy', 'Water', 'Environment'] },
  { name: 'Vinoba Bhave University', district: 'Hazaribagh', expertise: ['Agriculture', 'Education', 'Healthcare'] },
  { name: 'Kolhan University', district: 'West Singhbhum', expertise: ['Mining', 'Environment', 'Rural Livelihood'] },
  { name: 'Sidho Kanho Birsa University', district: 'Dumka', expertise: ['Agriculture', 'Rural Livelihood'] },
  { name: 'Nilamber-Pitamber University', district: 'Palamu', expertise: ['Agriculture', 'Water', 'Rural Livelihood'] },
  { name: 'Central University of Jharkhand', district: 'Ranchi', expertise: ['Education', 'Healthcare', 'Environment'] },
  { name: 'Jharkhand Rai University', district: 'Ranchi', expertise: ['Healthcare', 'Technology'] },
  { name: 'Arka Jain University', district: 'Jamshedpur', expertise: ['Energy', 'Urban Development'] },
  { name: 'Usha Martin University', district: 'Ranchi', expertise: ['Engineering', 'Agriculture'] },
];

const industryData = [
  { companyName: 'Tata Steel', districts: ['Jamshedpur', 'West Singhbhum'], expertise: ['Energy', 'Environment', 'Rural Livelihood'] },
  { companyName: 'Tata Motors', districts: ['Jamshedpur', 'Ranchi'], expertise: ['Urban Development', 'Energy'] },
  { companyName: 'Usha Martin', districts: ['Ranchi', 'Bokaro'], expertise: ['Rural Livelihood', 'Education'] },
  { companyName: 'Central Coalfields Limited', districts: ['Ranchi', 'Dhanbad', 'Bokaro'], expertise: ['Environment', 'Energy'] },
  { companyName: 'Bokaro Steel Plant', districts: ['Bokaro'], expertise: ['Water', 'Environment', 'Healthcare'] },
  { companyName: 'Hindustan Copper Limited', districts: ['East Singhbhum'], expertise: ['Environment', 'Rural Livelihood'] },
  { companyName: 'Jindal Steel & Power', districts: ['Ramgarh', 'Ranchi'], expertise: ['Energy', 'Agriculture'] },
  { companyName: 'NTPC Patratu', districts: ['Ramgarh'], expertise: ['Energy', 'Environment'] },
  { companyName: 'SAIL Bokaro', districts: ['Bokaro'], expertise: ['Healthcare', 'Education', 'Sanitation'] },
  { companyName: 'Reliance Retail Jharkhand', districts: ['Ranchi', 'Jamshedpur', 'Dhanbad'], expertise: ['Rural Livelihood', 'Agriculture'] },
  { companyName: 'Adani Power Jharkhand', districts: ['Godda'], expertise: ['Energy', 'Environment'] },
  { companyName: 'Infosys Jharkhand CSR', districts: ['Ranchi'], expertise: ['Education', 'Technology', 'Digital Literacy'] },
];

const seed = async () => {
  await connectDB();
  console.log('Clearing existing data...');

  await Promise.all([
    User.deleteMany({}),
    Challenge.deleteMany({}),
    University.deleteMany({}),
    Industry.deleteMany({}),
    Project.deleteMany({}),
    Notification.deleteMany({}),
    AuditLog.deleteMany({}),
    ImpactMetric.deleteMany({}),
  ]);

  console.log('Creating demo users...');
  const users = await User.create([
    { name: 'Admin User', email: 'admin@jsip.gov.in', password: DEMO_PASSWORD, role: ROLES.ADMIN, isVerified: true },
    { name: 'Gov Officer', email: 'gov@jsip.gov.in', password: DEMO_PASSWORD, role: ROLES.GOVERNMENT, district: 'Ranchi', isVerified: true },
    { name: 'Citizen One', email: 'citizen1@example.com', password: DEMO_PASSWORD, role: ROLES.CITIZEN, district: 'Ranchi', isVerified: true },
    { name: 'Citizen Two', email: 'citizen2@example.com', password: DEMO_PASSWORD, role: ROLES.CITIZEN, district: 'Dhanbad', isVerified: true },
    { name: 'Citizen Three', email: 'citizen3@example.com', password: DEMO_PASSWORD, role: ROLES.CITIZEN, district: 'Jamshedpur', isVerified: true },
    { name: 'Uni Admin', email: 'university@bitmesra.ac.in', password: DEMO_PASSWORD, role: ROLES.UNIVERSITY, district: 'Ranchi', isVerified: true },
    { name: 'Dr. Priya Sharma', email: 'faculty@bitmesra.ac.in', password: DEMO_PASSWORD, role: ROLES.FACULTY, district: 'Ranchi', isVerified: true },
    { name: 'Amit Kumar', email: 'student@bitmesra.ac.in', password: DEMO_PASSWORD, role: ROLES.STUDENT, district: 'Ranchi', isVerified: true },
    { name: 'Industry Partner', email: 'csr@tatasteel.com', password: DEMO_PASSWORD, role: ROLES.INDUSTRY, district: 'Jamshedpur', isVerified: true },
  ]);

  const [admin, gov, citizen1, citizen2, citizen3, uniUser, faculty, student, industryUser] = users;

  console.log('Creating universities...');
  const validDistricts = JHARKHAND_DISTRICTS;
  const universities = await University.insertMany(
    universityData.map((u) => ({
      ...u,
      district: validDistricts.includes(u.district) ? u.district : 'Ranchi',
      description: `${u.name} is a leading institution contributing to societal innovation in Jharkhand.`,
      departments: pickN(['CSE', 'ECE', 'Mechanical', 'Civil', 'Management', 'Agriculture', 'Medicine'], 4),
      faculty: [
        { name: 'Dr. Rajesh Kumar', department: 'CSE', expertise: u.expertise, email: 'rajesh@edu.in', designation: 'Professor' },
        { name: 'Dr. Sunita Devi', department: 'Civil', expertise: ['Water', 'Environment'], email: 'sunita@edu.in', designation: 'Associate Professor' },
      ],
      labs: [{ name: 'Innovation Lab', focus: u.expertise, equipment: ['3D Printer', 'IoT Kits'], capacity: 30 }],
      innovationCenters: [{ name: 'TBI Center', type: 'innovation', focus: u.expertise, capacity: 20 }],
      incubationCenters: [{ name: 'Startup Incubator', type: 'incubation', focus: ['Technology', 'Social Impact'], capacity: 15 }],
      pastProjects: [
        { title: `Past ${u.expertise[0]} Project`, category: u.expertise[0], year: 2024, outcome: 'Successful pilot', impact: '500+ beneficiaries' },
      ],
      studentSkills: pickN(['IoT', 'AI/ML', 'Web Development', 'Data Analysis', 'Field Research', 'Prototyping'], 4),
      availableCapacity: { projects: 5 + Math.floor(Math.random() * 10), students: 50 + Math.floor(Math.random() * 100), facultyMentors: 10 },
      location: { district: validDistricts.includes(u.district) ? u.district : 'Ranchi' },
      verified: true,
      contactEmail: `contact@${u.name.toLowerCase().replace(/\s+/g, '')}.edu.in`,
      createdBy: admin._id,
    }))
  );

  uniUser.universityId = universities[1]._id;
  faculty.universityId = universities[1]._id;
  student.universityId = universities[1]._id;
  await Promise.all([uniUser.save(), faculty.save(), student.save()]);

  console.log('Creating industries...');
  const industries = await Industry.insertMany(
    industryData.map((ind) => ({
      ...ind,
      districts: ind.districts.filter((d) => validDistricts.includes(d)).length
        ? ind.districts.filter((d) => validDistricts.includes(d))
        : ['Ranchi'],
      description: `${ind.companyName} CSR initiatives supporting Jharkhand societal challenges.`,
      csrDomains: ind.expertise,
      fundingCapacity: { min: 100000, max: 5000000, currency: 'INR' },
      mentorship: { available: true, domains: ind.expertise, hoursPerMonth: 20, description: 'Expert mentorship for student teams' },
      pilotSupport: { available: true, types: ['funding', 'infrastructure', 'field testing'], maxBudget: 1000000 },
      technologyAreas: pickN(['IoT', 'AI', 'Renewable Energy', 'Mobile Apps', 'Data Analytics'], 3),
      verified: true,
      contactEmail: `csr@${ind.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      createdBy: admin._id,
    }))
  );

  industryUser.industryId = industries[0]._id;
  await industryUser.save();

  console.log('Creating challenges...');
  await Challenge.syncIndexes();
  const statuses = ['submitted', 'under_review', 'validated', 'assigned', 'in_progress', 'completed'];
  const citizens = [citizen1, citizen2, citizen3];

  const challenges = await Challenge.insertMany(
    challengeTemplates.map((tpl, i) => {
      const district = pick(validDistricts);
      const status = statuses[i % statuses.length];
      const aiAnalysis = {
        summary: `AI analysis of ${tpl.title} in ${district}`,
        category: tpl.category,
        suggestedTags: [tpl.category.toLowerCase(), district.toLowerCase()],
        rootCauses: ['Infrastructure gap', 'Resource shortage'],
        stakeholders: ['citizens', 'local government', 'NGOs'],
        impactAreas: [tpl.category],
        feasibilityScore: 50 + Math.floor(Math.random() * 40),
        urgencyScore: tpl.urgency === 'critical' ? 90 : tpl.urgency === 'high' ? 75 : 50,
        confidence: 0.7,
        provider: 'rule-based',
        analyzedAt: new Date(),
      };
      const challengeObj = {
        title: tpl.title,
        description: `This challenge addresses ${tpl.title.toLowerCase()} affecting communities in ${district}, Jharkhand. Local residents have reported significant difficulties requiring innovative solutions from universities and industry partners.`,
        category: tpl.category,
        status,
        submittedBy: citizens[i % citizens.length]._id,
        location: { district, block: `Block ${(i % 5) + 1}`, village: `Village ${(i % 10) + 1}` },
        evidence: [{ type: 'image', url: 'https://placehold.co/600x400', caption: 'Field evidence photo' }],
        tags: [tpl.category.toLowerCase(), district.toLowerCase()],
        affectedPopulation: 100 + Math.floor(Math.random() * 50000),
        urgency: tpl.urgency,
        aiAnalysis,
        priorityScore: 0,
        priorityExplanation: [],
        validation:
          status !== 'submitted'
            ? { isValid: true, validatedBy: gov._id, validatedAt: new Date(), notes: 'Validated for pilot' }
            : undefined,
      };
      const priority = calculatePriority(challengeObj);
      challengeObj.priorityScore = priority.priorityScore;
      challengeObj.priorityExplanation = priority.explanation;
      return challengeObj;
    })
  );

  console.log('Creating projects...');
  const projectStatuses = ['research', 'proposal', 'prototype', 'testing', 'pilot', 'deployment', 'completed'];
  const projects = await Project.insertMany(
    Array.from({ length: 12 }, (_, i) => {
      const challenge = challenges[i % challenges.length];
      const university = universities[i % universities.length];
      const industry = industries[i % industries.length];
      return {
        challengeId: challenge._id,
        universityId: university._id,
        industryPartners: [{ industryId: industry._id, contribution: 'Funding and mentorship', fundingAmount: 200000, status: 'active' }],
        facultyMentor: { userId: faculty._id, name: faculty.name, department: 'CSE' },
        students: [{ userId: student._id, name: student.name, role: 'Team Lead', department: 'CSE' }],
        title: `Project: ${challenge.title.slice(0, 50)}`,
        description: `University-industry collaboration to solve: ${challenge.title}`,
        status: projectStatuses[i % projectStatuses.length],
        milestones: [
          { title: 'Literature Review', status: i > 2 ? 'completed' : 'in_progress', deliverables: ['Review document'] },
          { title: 'Prototype Development', status: i > 5 ? 'completed' : 'not_started', deliverables: ['Working prototype'] },
          { title: 'Field Testing', status: 'not_started', deliverables: ['Test report'] },
        ],
        budget: { allocated: 500000, spent: 100000 * (i % 4), currency: 'INR' },
        pilotLocation: { district: challenge.location.district, address: 'Pilot site address' },
        impactMetrics: { beneficiaries: 200 + i * 100, jobsCreated: 5 + i, districtsReached: [challenge.location.district] },
        createdBy: uniUser._id,
        startDate: new Date(2025, 0, 1),
      };
    })
  );

  console.log('Creating impact metrics...');
  await ImpactMetric.insertMany(
    projects.slice(0, 8).map((project, i) => ({
      projectId: project._id,
      challengeId: project.challengeId,
      recordedBy: gov._id,
      period: { start: new Date(2025, 0, 1), end: new Date(2025, 5, 30), label: 'H1 2025' },
      beneficiaries: 500 + i * 200,
      districtsReached: [pick(validDistricts)],
      co2ReducedKg: 100 * i,
      jobsCreated: 10 + i,
      customMetrics: [{ name: 'Villages Covered', value: 3 + i, unit: 'villages' }],
      verified: i % 2 === 0,
    }))
  );

  console.log('Creating notifications...');
  await Notification.insertMany([
    { recipient: gov._id, type: 'challenge_submitted', title: 'New Challenge', message: 'A new challenge has been submitted.', isRead: false },
    { recipient: citizen1._id, type: 'challenge_validated', title: 'Challenge Validated', message: 'Your challenge has been validated.', isRead: true, readAt: new Date() },
    { recipient: uniUser._id, type: 'challenge_assigned', title: 'Challenge Assigned', message: 'A new challenge has been assigned to your university.', isRead: false },
    { recipient: industryUser._id, type: 'match_found', title: 'Partnership Opportunity', message: 'A matching challenge was found for your CSR program.', isRead: false },
  ]);

  console.log('Creating audit logs...');
  await AuditLog.insertMany([
    { action: 'user_register', performedBy: citizen1._id, targetType: 'User', targetId: citizen1._id, success: true },
    { action: 'challenge_create', performedBy: citizen1._id, targetType: 'Challenge', targetId: challenges[0]._id, success: true },
    { action: 'challenge_validate', performedBy: gov._id, targetType: 'Challenge', targetId: challenges[2]._id, success: true },
    { action: 'project_create', performedBy: uniUser._id, targetType: 'Project', targetId: projects[0]._id, success: true },
  ]);

  console.log('\n✅ Seed completed successfully!\n');
  console.log('Demo credentials (password for all):', DEMO_PASSWORD);
  console.log('  Admin:     admin@jsip.gov.in');
  console.log('  Government: gov@jsip.gov.in');
  console.log('  Citizen:   citizen1@example.com');
  console.log('  University: university@bitmesra.ac.in');
  console.log('  Faculty:   faculty@bitmesra.ac.in');
  console.log('  Student:   student@bitmesra.ac.in');
  console.log('  Industry:  csr@tatasteel.com');
  console.log(`\nCreated: ${challenges.length} challenges, ${universities.length} universities, ${industries.length} industries, ${projects.length} projects`);
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
