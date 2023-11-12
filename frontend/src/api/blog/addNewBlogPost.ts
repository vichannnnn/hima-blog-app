import { apiClient } from '@apiClient';
import { AxiosError } from 'axios';
import { BlogPost, CreateBlogPost } from './types';

export const addNewBlogPost = async (data: CreateBlogPost): Promise<BlogPost> => {
  const queryParams = new URLSearchParams({
    title: data.title,
    content: data.content,
    preview: data.preview,
  }).toString();

  const formData = new FormData();
  if (data.image) {
    formData.append('image', data.image, data.image.name);
  }

  try {
    if (data.image) {
      return await apiClient.post(`/blog?${queryParams}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      return await apiClient.post(`/blog?${queryParams}`, formData);
    }
  } catch (error) {
    throw error as AxiosError;
  }
};
