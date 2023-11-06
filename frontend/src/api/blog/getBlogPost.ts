import { apiClient } from '@apiClient';
import { BlogPost } from './types';

export const getBlogPost = async (note_id: number): Promise<BlogPost> => {
  const response = await apiClient.get(`/blog/${note_id}`);
  return response.data;
};
