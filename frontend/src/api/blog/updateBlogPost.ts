import { apiClient } from '@apiClient';
import { BlogPost, UpdateBlogPost } from './types';

export const updateBlogPost = async (note_id: number, data: UpdateBlogPost): Promise<BlogPost> => {
  const response = await apiClient.put(`/blog/${note_id}`, data);
  return response.data;
};
