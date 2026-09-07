import api from './api';
import { TeamMember } from '../types';

export const teamsService = {
  getTeamMembers: async (params?: { search?: string; role?: string; tech?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.role && params.role !== 'All') query.set('role', params.role);
    if (params?.tech && params.tech !== 'All') query.set('tech', params.tech);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const response = await api.get(`/teams?${query.toString()}`);
    return response.data;
  },
  postTeamRequest: async (data: Partial<TeamMember>) => {
    const response = await api.post('/teams', data);
    return response.data;
  },
  getMyTeamPosts: async () => {
    const response = await api.get('/teams/myposts');
    return response.data;
  },
  getMyApplications: async () => {
    const response = await api.get('/teams/my-applications');
    return response.data;
  },
  applyToTeam: async (teamId: string, message?: string) => {
    const response = await api.post(`/teams/${teamId}/apply`, { message });
    return response.data;
  },
  acceptApplication: async (teamId: string, applicationId: string) => {
    const response = await api.put(`/teams/${teamId}/applications/${applicationId}/accept`);
    return response.data;
  },
  rejectApplication: async (teamId: string, applicationId: string) => {
    const response = await api.put(`/teams/${teamId}/applications/${applicationId}/reject`);
    return response.data;
  },
  deleteTeamProfile: async () => {
    const response = await api.delete('/teams/me');
    return response.data;
  },
};