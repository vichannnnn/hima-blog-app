import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BlogPost, getBlogPost, updateBlogPost, UpdateBlogPost } from '@api/blog';
import { BlogPostForm } from '../../components/BlogPostForm';
import { Action } from '../../components/BlogPostForm/types';

const Update = () => {
  const router = useRouter();
  const { blog_id } = router.query;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const fetchBlogPostData = async () => {
      try {
        const data = await getBlogPost(Number(blog_id));
        setBlogPost(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching blog post data', error);
      }
    };

    if (blog_id) {
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
      await updateBlogPost(Number(blog_id), payload);
      router.push('/');
    } catch (error) {
      console.error('Error creating blog post', error);
    }
  };

  return !isLoading ? (
    <BlogPostForm initialData={blogPost} onSubmit={submitUpdateBlogPost} action={Action.UPDATE} />
  ) : null;
};

export default Update;
