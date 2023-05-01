import apiClient from "../api/apiClient";
import { updateFaviconAndTitle } from "./updateFaviconAndTitle";
import { BlogData } from "../components/BlogDataContext";

export const fetchBlogData = async (): Promise<BlogData> => {
  try {
    const response = await apiClient.get<BlogData>(`/blog`);
    updateFaviconAndTitle(response.data.title_tag);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog data:", error);
    throw error;
  }
};
