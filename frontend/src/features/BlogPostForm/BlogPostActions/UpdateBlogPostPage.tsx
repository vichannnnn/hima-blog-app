import { useEffect, useState } from 'react';
import { BlogPost, getBlogPost, updateBlogPost, UpdateBlogPost } from '@api/blog';
import { useNavigation } from '@utils';
import { BlogPostForm } from '../BlogPostForm';
import { Action } from '../types';
import { useParams } from 'react-router-dom';

export const UpdateBlogPostPage = () => {
  const { blog_id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const { goToHome } = useNavigation();

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
      goToHome();
    } catch (error) {
      console.error('Error creating blog post', error);
    }
  };

  return !isLoading ? (
    <BlogPostForm initialData={blogPost} onSubmit={submitUpdateBlogPost} action={Action.UPDATE} />
  ) : null;
};
