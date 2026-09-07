import api from './api';

export const authService = {
  register: async (data: { firstName: string; lastName: string; email: string; password: string; techStack: string[]; skillLevel: string; goal: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  googleSignIn: async (credential: string, clientId: string) => {
    const response = await api.post('/auth/google', { credential, clientId });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  updateProfile: async (data: { firstName?: string; lastName?: string; githubHandle?: string; linkedin?: string; bio?: string; techStack?: string[]; skillLevel?: string; goal?: string; avatar?: string }) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
  setPassword: async (newPassword: string) => {
    const response = await api.post('/auth/password', { newPassword });
    return response.data;
  },
  deleteAccount: async (confirmation: string) => {
    const response = await api.delete('/auth/account', { data: { confirmation } });
    return response.data;
  },
};