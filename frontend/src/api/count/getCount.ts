import { apiClient } from '@apiClient';
import { Count } from './types';

export const getCount = async (): Promise<Count> => {
  const response = await apiClient.get(`/count`);
  return response.data;
};
