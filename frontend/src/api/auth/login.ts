import { apiClient } from '@apiClient';
import { LogInDetails, CurrentUserWithJWT } from '@providers';
import { AxiosError, AxiosResponse } from 'axios';

export async function login(formData: LogInDetails): Promise<CurrentUserWithJWT> {
  try {
    const response: AxiosResponse<CurrentUserWithJWT> = await apiClient.post(
      '/auth/login',
      formData,
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.status === 401) {
      throw axiosError;
    } else if (axiosError.response && axiosError.response.status === 422) {
      throw axiosError;
    }
    throw error;
  }
}
