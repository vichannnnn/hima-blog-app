import { apiClient } from '@apiClient';
import { BlogPost, UpdateBlogPost } from './types';
import { AxiosError } from 'axios';

export const updateBlogPost = async (slug: string, data: UpdateBlogPost): Promise<BlogPost> => {
  const filteredData = {
    ...(data.title != undefined && { title: data.title }),
    ...(data.content != undefined && { content: data.content }),
    ...(data.preview != undefined && { preview: data.preview }),
  };

  const queryParams = new URLSearchParams(filteredData).toString();

  const formData = new FormData();
  if (data.image) {
    formData.append('image', data.image, data.image.name);
  }

  try {
    return await apiClient.put(`/blog/${slug}?${queryParams}`, formData, {
      headers: data.image ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
  } catch (error) {
    throw error as AxiosError;
  }
};
