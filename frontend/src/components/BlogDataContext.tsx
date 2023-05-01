import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchBlogData } from "../utils/blogDataUtils";
import useAuth from "../api/useAuth";

export interface BlogData {
  logo_type: number;
  logo: string;
  title_tag: string;
  hero_title: string;
  hero_content: string;
  user_id: number;
}

const BlogDataContext = createContext<{
  blogData: BlogData | null;
  setBlogData: React.Dispatch<React.SetStateAction<BlogData | null>>;
}>({
  blogData: null,
  setBlogData: () => {},
});

export const useBlogData = () => {
  const context = useContext(BlogDataContext);
  if (!context) {
    throw new Error("useBlogData must be used within a BlogDataProvider");
  }
  return context;
};

export const BlogDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchBlogData()
      .then((data) => setBlogData(data))
      .catch((error) =>
        console.error("Error fetching blog data using user_id:", error)
      );
  }, [user]);

  return (
    <BlogDataContext.Provider value={{ blogData, setBlogData }}>
      {children}
    </BlogDataContext.Provider>
  );
};

export default BlogDataContext;
