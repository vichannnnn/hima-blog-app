import React, { useState } from "react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { AuthProvider } from "./components/authContext";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import BlogPostList from "./components/BlogPostList";
import FullBlogPost from "./components/FullBlogPost";
import Footer from "./components/Footer";
import { BlogDataProvider } from "./components/BlogDataContext";
import { BlogPostContextProvider } from "./components/BlogPostContext";
import useAuth from "./api/useAuth";

const BlogApp: React.FC = () => {
  return (
    <AuthProvider>
      <ChakraProvider>
        <BlogPostContextProvider>
          <BlogDataProvider>
            <Content />
          </BlogDataProvider>
        </BlogPostContextProvider>
      </ChakraProvider>
    </AuthProvider>
  );
};

const Content: React.FC = () => {
  const { user } = useAuth();

  const [showFullPost, setShowFullPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleReadFullArticle = (post) => {
    setSelectedPost(post);
    setShowFullPost(true);
  };

  const handleBackToBlogPostList = () => {
    setShowFullPost(false);
  };

  return (
    <>
      <Box overflowX="hidden">
        <NavBar />
        <Hero />
        {showFullPost ? (
          <FullBlogPost
            post={selectedPost}
            onBackClick={handleBackToBlogPostList}
          />
        ) : (
          <BlogPostList user={user} onReadFullArticle={handleReadFullArticle} />
        )}
      </Box>
    </>
  );
};

export default BlogApp;
