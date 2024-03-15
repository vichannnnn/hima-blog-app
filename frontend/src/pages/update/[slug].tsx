import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BlogPost, getBlogPost, updateBlogPost, UpdateBlogPost } from '@api/blog';
import { BlogPostForm } from '@components/BlogPostForm';
import { Action } from '@components/BlogPostForm/types';
import { NextSeo } from 'next-seo';

const Update = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const fetchBlogPostData = async () => {
      try {
        const data = await getBlogPost(slug as string);
        setBlogPost(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching blog post data', error);
      }
    };

    if (slug) {
      fetchBlogPostData().catch((err) => {
        console.error('Failed to fetch blog post:', err);
      });
    }
  }, []);

  const submitUpdateBlogPost = async (formData: UpdateBlogPost) => {
    try {
      const payload = {
        ...formData,
        image: formData.image instanceof File ? formData.image : undefined,
      };
      await updateBlogPost(slug as string, payload);
      router.push('/');
    } catch (error) {
      console.error('Error creating blog post', error);
    }
  };

  return !isLoading ? (
    <>
      <NextSeo title="Update Blog Post - Hima's Blog" />
      <BlogPostForm initialData={blogPost} onSubmit={submitUpdateBlogPost} action={Action.UPDATE} />
    </>
  ) : null;
};

export default Update;
