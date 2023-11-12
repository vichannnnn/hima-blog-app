import { apiClient } from '@apiClient';
import { AxiosError } from 'axios';
import { BlogPost, CreateBlogPost } from './types';

export const addNewBlogPost = async (data: CreateBlogPost): Promise<BlogPost> => {
  try {
    return await apiClient.post(`/blog`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    throw error as AxiosError;
  }
};
