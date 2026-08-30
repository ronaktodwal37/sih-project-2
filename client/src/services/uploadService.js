import api from './api.js';

export const uploadService = {
  uploadFile: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
        ? (e) => onProgress(Math.round((e.loaded * 100) / (e.total || 1)))
        : undefined,
    });
    return res.data;
  },

  uploadMultiple: async (files, onProgress) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const res = await api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
        ? (e) => onProgress(Math.round((e.loaded * 100) / (e.total || 1)))
        : undefined,
    });
    return res.data;
  },

  deleteFile: async (fileId) => {
    const res = await api.delete(`/upload/${fileId}`);
    return res.data;
  },
};
