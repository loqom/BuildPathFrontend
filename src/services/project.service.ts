import api from './api';

export const projectService = {
  getAllProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  },
  getProjectById: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  getProblems: async (params?: { search?: string; sector?: string; difficulty?: string; tech?: string; sortBy?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.sector && params.sector !== 'All') query.set('sector', params.sector);
    if (params?.difficulty && params.difficulty !== 'All') query.set('difficulty', params.difficulty);
    if (params?.tech && params.tech !== 'All') query.set('tech', params.tech);
    if (params?.sortBy) query.set('sortBy', params.sortBy);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const response = await api.get(`/problems?${query.toString()}`);
    return response.data;
  },
  saveProject: async (projectId: string) => {
    console.log('[projectService] Saving project:', projectId);
    const response = await api.post('/projects/save', { projectId });
    console.log('[projectService] Save response:', response.data);
    return response.data;
  },
  deleteProject: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};