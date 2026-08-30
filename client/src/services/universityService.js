import api from './api.js';

export const universityService = {
  getAll: async (params = {}) => {
    const res = await api.get('/universities', { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/universities/${id}`);
    return res.data;
  },

  getAssignedChallenges: async (params = {}) => {
    const res = await api.get('/universities/challenges', { params });
    return res.data;
  },

  getProjects: async (params = {}) => {
    const res = await api.get('/universities/projects', { params });
    return res.data;
  },

  getStats: async () => {
    const res = await api.get('/universities/stats');
    return res.data;
  },
};
