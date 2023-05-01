import React from "react";
import apiClient from "../api/apiClient";

export interface BlogPost {
  post_id: number;
  title: string;
  content: string;
  preview: string;
  date_posted: string;
  image: string;
}

interface BlogPostProps {
  post: BlogPost;
}

interface Config {
  params: URLSearchParams;
  headers?: {
    "Content-Type": string;
  };
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  return (
    <article className="bg-white shadow-md p-4 rounded">
      <h1 className="text-2xl font-semibold mb-2">{post.title}</h1>
      <p className="text-gray-500 text-sm mb-4">{post.date_posted}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
};

const handleRequest = async (
  method: "post" | "put",
  endpoint: string,
  queryParams: URLSearchParams,
  file: File | null,
  image_type: string
) => {
  const config: Config = {
    params: queryParams,
  };

  if (file) {
    config.headers = {
      "Content-Type": "multipart/form-data",
    };

    const formData = new FormData();

    if (image_type === "image") {
      formData.append("image", file);
    }

    await apiClient[method](endpoint, formData, config);
  } else {
    await apiClient[method](endpoint, {}, config);
  }
};

export const handleCreatePost = async (
  title: string,
  content: string,
  preview: string,
  image: File | null
) => {
  try {
    const queryParams = new URLSearchParams({
      title: title,
      content: content,
      preview: preview,
    });

    await handleRequest("post", "/post", queryParams, image, "image");
  } catch (error) {
    console.error("Error creating new blog post:", error);
  }
};

export const handleUpdateBlog = async (
  titleTag: string,
  heroTitle: string,
  heroContent: string,
  logoContent: string,
  uploadedFile: File | null,
  toast: (options: any) => void
) => {
  try {
    const queryParams = new URLSearchParams({
      logo: logoContent,
      title_tag: titleTag,
      hero_title: heroTitle,
      hero_content: heroContent,
    });

    await handleRequest(
      "put",
      "/blog",
      queryParams,
      uploadedFile,
      "favicon"
    );

    toast({
      title: "Update successful.",
      description: `Your blog layout has been successfully updated.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
  }
};

export const updateBlogPost = async (
  postId: number,
  title: string,
  content: string,
  preview: string,
  image: File | null
): Promise<void> => {
  const queryParams = new URLSearchParams({
    post_id: postId.toString(),
    title: title,
    content: content,
    preview: preview,
  });

  await handleRequest("put", "/post", queryParams, image, "image");
};

export default BlogPost;
