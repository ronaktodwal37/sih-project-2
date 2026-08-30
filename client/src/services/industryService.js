import api from './api.js';

export const industryService = {
  getAll: async (params = {}) => {
    const res = await api.get('/industry', { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/industry/${id}`);
    return res.data;
  },

  getPartners: async (params = {}) => {
    const res = await api.get('/industry/partners', { params });
    return res.data;
  },

  getStats: async () => {
    const res = await api.get('/industry/stats');
    return res.data;
  },
};
