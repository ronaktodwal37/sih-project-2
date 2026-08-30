import api, { setAuthToken } from './api.js';

export const authService = {
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    if (res.data.token) setAuthToken(res.data.token);
    return res.data;
  },

  login: async (data) => {
    const res = await api.post('/auth/login', data);
    if (res.data.token) setAuthToken(res.data.token);
    return res.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    setAuthToken(null);
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};
