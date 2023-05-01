import React, { createContext, useContext, useState, useEffect } from "react";
import { BlogPost, fetchBlogPosts } from "../utils/blogPostUtils";
import useAuth from "../api/useAuth";

interface BlogPostContextValue {
  blogPosts: BlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  refreshBlogPosts: () => void;
}

const BlogPostContext = createContext<BlogPostContextValue>({
  blogPosts: [],
  setBlogPosts: () => {},
  refreshBlogPosts: () => {},
});

export const useBlogPostContext = () => {
  const context = useContext(BlogPostContext);
  if (!context) {
    throw new Error(
      "useBlogPostContext must be used within a BlogPostContextProvider"
    );
  }
  return context;
};

export const BlogPostContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const { user } = useAuth();
  const refreshBlogPosts = async () => {
    const posts = await fetchBlogPosts();
    setBlogPosts(posts);
  };

  useEffect(() => {
    refreshBlogPosts();
  }, [user]);

  return (
    <BlogPostContext.Provider
      value={{ blogPosts, setBlogPosts, refreshBlogPosts }}
    >
      {children}
    </BlogPostContext.Provider>
  );
};

export default BlogPostContext;
