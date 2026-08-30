import api from './api.js';

export const projectService = {
  getAll: async (params = {}) => {
    const res = await api.get('/projects', { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/projects/${id}`);
    return res.data;
  },

  getMy: async (params = {}) => {
    const res = await api.get('/projects/my', { params });
    return res.data;
  },

  create: async (data) => {
    const res = await api.post('/projects', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/projects/${id}`, data);
    return res.data;
  },

  updateProgress: async (id, data) => {
    const res = await api.patch(`/projects/${id}/progress`, data);
    return res.data;
  },

  getStats: async () => {
    const res = await api.get('/projects/stats');
    return res.data;
  },
};
