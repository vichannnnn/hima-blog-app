import { apiClient } from '@apiClient';
import { BlogPost } from './types';

export const getBlogPost = async (blog_id: number): Promise<BlogPost> => {
  const response = await apiClient.get(`/blog/${blog_id}`);
  return response.data;
};
