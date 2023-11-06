import { apiClient } from '@apiClient';
import { BlogPost } from './types';

export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  const response = await apiClient.get(`/blogs`);
  return response.data;
};
