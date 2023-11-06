import { apiClient } from '@apiClient';
import { BlogPost } from './types';

export const deleteNewBlogPost = async (note_id: number): Promise<BlogPost> => {
  const response = await apiClient.delete(`/blog/${note_id}`);
  return response.data;
};
