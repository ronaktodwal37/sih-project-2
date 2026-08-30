import api from './api.js';

export const governmentService = {
  getDashboard: async () => {
    const res = await api.get('/government/dashboard');
    return res.data;
  },

  getAnalytics: async (params = {}) => {
    const res = await api.get('/government/analytics', { params });
    return res.data;
  },

  getMapData: async (params = {}) => {
    const res = await api.get('/government/map', { params });
    return res.data;
  },

  getImpact: async () => {
    const res = await api.get('/government/impact');
    return res.data;
  },

  getChallenges: async (params = {}) => {
    const res = await api.get('/government/challenges', { params });
    return res.data;
  },

  getProjects: async (params = {}) => {
    const res = await api.get('/government/projects', { params });
    return res.data;
  },
};
