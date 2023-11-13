import { apiClient } from '@apiClient';
import { PaginatedBlogPosts } from './types';

export const getAllBlogPosts = async (): Promise<PaginatedBlogPosts> => {
  const response = await apiClient.get(`/blogs`);
  return response.data;
};
