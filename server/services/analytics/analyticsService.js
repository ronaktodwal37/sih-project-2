import Challenge from '../../models/Challenge.js';
import Project from '../../models/Project.js';
import University from '../../models/University.js';
import Industry from '../../models/Industry.js';
import User from '../../models/User.js';
import ImpactMetric from '../../models/ImpactMetric.js';
import { CHALLENGE_CATEGORIES, JHARKHAND_DISTRICTS, getPriorityLabel } from '../../utils/constants.js';

export const getGovernmentKPIs = async () => {
  const [
    totalChallenges,
    validatedChallenges,
    assignedChallenges,
    completedChallenges,
    totalProjects,
    activeProjects,
    completedProjects,
    totalUniversities,
    verifiedUniversities,
    totalIndustries,
    verifiedIndustries,
    totalUsers,
    impactAgg,
  ] = await Promise.all([
    Challenge.countDocuments(),
    Challenge.countDocuments({ status: 'validated' }),
    Challenge.countDocuments({ status: { $in: ['assigned', 'accepted', 'in_progress'] } }),
    Challenge.countDocuments({ status: 'completed' }),
    Project.countDocuments(),
    Project.countDocuments({
      status: { $in: ['research', 'proposal', 'prototype', 'testing', 'pilot', 'deployment'] },
    }),
    Project.countDocuments({ status: 'completed' }),
    University.countDocuments(),
    University.countDocuments({ verified: true }),
    Industry.countDocuments(),
    Industry.countDocuments({ verified: true }),
    User.countDocuments({ isActive: true }),
    ImpactMetric.aggregate([
      {
        $group: {
          _id: null,
          totalBeneficiaries: { $sum: '$beneficiaries' },
          totalJobs: { $sum: '$jobsCreated' },
          totalCo2: { $sum: '$co2ReducedKg' },
        },
      },
    ]),
  ]);

  const impact = impactAgg[0] || { totalBeneficiaries: 0, totalJobs: 0, totalCo2: 0 };

  return {
    challenges: {
      total: totalChallenges,
      validated: validatedChallenges,
      assigned: assignedChallenges,
      completed: completedChallenges,
      validationRate: totalChallenges ? Math.round((validatedChallenges / totalChallenges) * 100) : 0,
    },
    projects: {
      total: totalProjects,
      active: activeProjects,
      completed: completedProjects,
      completionRate: totalProjects ? Math.round((completedProjects / totalProjects) * 100) : 0,
    },
    ecosystem: {
      universities: totalUniversities,
      verifiedUniversities,
      industries: totalIndustries,
      verifiedIndustries,
      activeUsers: totalUsers,
    },
    impact: {
      beneficiaries: impact.totalBeneficiaries,
      jobsCreated: impact.totalJobs,
      co2ReducedKg: impact.totalCo2,
    },
  };
};

export const getChallengesByCategory = async () => {
  const data = await Challenge.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  return data.map((d) => ({ category: d._id, count: d.count }));
};

export const getChallengesByDistrict = async () => {
  const data = await Challenge.aggregate([
    { $group: { _id: '$location.district', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  return data.map((d) => ({ district: d._id, count: d.count }));
};

export const getChallengesByStatus = async () => {
  const data = await Challenge.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  return data.map((d) => ({ status: d._id, count: d.count }));
};

export const getPriorityDistribution = async () => {
  const challenges = await Challenge.find().select('priorityScore').lean();
  const distribution = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  challenges.forEach((c) => {
    const label = getPriorityLabel(c.priorityScore || 0);
    distribution[label] = (distribution[label] || 0) + 1;
  });
  return Object.entries(distribution).map(([level, count]) => ({ level, count }));
};

export const getProjectsByStatus = async () => {
  const data = await Project.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  return data.map((d) => ({ status: d._id, count: d.count }));
};

export const getMonthlyTrends = async (months = 6) => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const [challenges, projects] = await Promise.all([
    Challenge.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    Project.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
  ]);

  return { challenges, projects };
};

export const getChartData = async () => {
  const [kpis, byCategory, byDistrict, byStatus, priorityDist, projectsByStatus, trends] =
    await Promise.all([
      getGovernmentKPIs(),
      getChallengesByCategory(),
      getChallengesByDistrict(),
      getChallengesByStatus(),
      getPriorityDistribution(),
      getProjectsByStatus(),
      getMonthlyTrends(),
    ]);

  return {
    kpis,
    charts: {
      challengesByCategory: byCategory,
      challengesByDistrict: byDistrict,
      challengesByStatus: byStatus,
      priorityDistribution: priorityDist,
      projectsByStatus,
      monthlyTrends: trends,
    },
    districts: JHARKHAND_DISTRICTS,
    categories: CHALLENGE_CATEGORIES,
  };
};

export default {
  getGovernmentKPIs,
  getChallengesByCategory,
  getChallengesByDistrict,
  getChallengesByStatus,
  getPriorityDistribution,
  getProjectsByStatus,
  getMonthlyTrends,
  getChartData,
};
