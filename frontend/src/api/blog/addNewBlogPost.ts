import { apiClient } from '@apiClient';
import { BlogPost, CreateBlogPost } from './types';

export const addNewBlogPost = async (data: CreateBlogPost): Promise<BlogPost> => {
  const response = await apiClient.post(`/blog`, data);
  return response.data;
};
