import api from './api';

export const pipelineService = {
  startPipeline: async (data: { techStack: string[]; skillLevel: string; timeAvailable: string; goal: string }) => {
    const response = await api.post('/pipeline/start', data);
    return response.data;
  },
  getPipelineStatus: async (sessionId: string) => {
    const response = await api.get(`/pipeline/status/${sessionId}`);
    return response.data;
  },
  getPipelineResults: async (sessionId: string) => {
    const response = await api.get(`/pipeline/results/${sessionId}`);
    return response.data;
  },
};