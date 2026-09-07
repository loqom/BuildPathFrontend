import api from './api';
import { ProblemItem } from '../types';

export const problemService = {
  upvoteProblem: async (problemId: string) => {
    const response = await api.post(`/problems/${problemId}/like`);
    return response.data;
  },
  submitProblem: async (data: Partial<ProblemItem>) => {
    const response = await api.post('/problems', data);
    return response.data;
  },
};