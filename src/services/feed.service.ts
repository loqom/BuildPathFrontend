import api from './api';

export const feedService = {
  getFeedPosts: async (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const response = await api.get(`/feed?${query.toString()}`);
    return response.data;
  },
  createFeedPost: async (data: { 
    content: string; 
    codeSnippet?: { language: string; code: string };
    repoUrl?: string;
    badgeText?: string;
  }) => {
    const response = await api.post('/feed', data);
    return response.data;
  },
  toggleLike: async (postId: string) => {
    const response = await api.post(`/feed/${postId}/like`);
    return response.data;
  },
  addComment: async (postId: string, text: string) => {
    const response = await api.post(`/feed/${postId}/comments`, { text });
    return response.data;
  },
  getTrending: async () => {
    const response = await api.get('/feed/trending');
    return response.data;
  },
  getTopBuilders: async () => {
    const response = await api.get('/feed/top-builders');
    return response.data;
  },
};