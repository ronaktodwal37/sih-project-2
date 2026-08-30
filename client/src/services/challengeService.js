import api from './api.js';

export const challengeService = {
  getAll: async (params = {}) => {
    const res = await api.get('/challenges', { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/challenges/${id}`);
    return res.data;
  },

  getMy: async (params = {}) => {
    const res = await api.get('/challenges/my', { params });
    return res.data;
  },

  create: async (data) => {
    const res = await api.post('/challenges', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/challenges/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/challenges/${id}`);
    return res.data;
  },

  validate: async (id, data) => {
    const res = await api.post(`/challenges/${id}/validate`, data);
    return res.data;
  },

  getStats: async () => {
    const res = await api.get('/challenges/stats');
    return res.data;
  },

  getTimeline: async (id) => {
    const res = await api.get(`/challenges/${id}/timeline`);
    return res.data;
  },
};
