import { apiClient } from '@apiClient';
import { BlogPost } from './types';

export const deleteBlogPost = async (slug: string): Promise<BlogPost> => {
  const response = await apiClient.delete(`/blog/${slug}`);
  return response.data;
};
