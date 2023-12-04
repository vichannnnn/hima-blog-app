import { apiClient } from '@apiClient';
import { Count } from './types';

export const addCount = async (): Promise<Count> => {
  const response = await apiClient.post(`/count`);
  return response.data;
};
