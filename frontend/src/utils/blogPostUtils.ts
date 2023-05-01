import apiClient from "../api/apiClient";

export interface BlogPost {
  post_id: number;
  title: string;
  content: string;
  preview: string;
  image: string;
  date_posted: string;
}

export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  const response = await apiClient.get<BlogPost[]>(`/posts`);
  return response.data;
};
