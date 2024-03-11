import { apiClient } from '@apiClient';
import { BlogPost } from './types';

export const getBlogPost = async (slug: string): Promise<BlogPost> => {
  const response = await apiClient.get(`/blog/${slug}`);
  return response.data;
};
