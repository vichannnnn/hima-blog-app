import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { addNewBlogPost, CreateBlogPost } from '@api/blog';
import { BlogPostForm } from '@components/BlogPostForm';
import { Action } from '@components/BlogPostForm/types';

const Create = () => {
  const router = useRouter();

  const submitNewBlogPost = async (formData: CreateBlogPost) => {
    try {
      const payload = {
        ...formData,
        image: formData.image ? formData.image : undefined,
      };

      await addNewBlogPost(payload);
      router.push('/');
    } catch (error) {
      console.error('Error creating blog post', error);
    }
  };

  return (
    <>
      <Head>
        <title>Create New Blog Post - Hima&apos;s Blog</title>
      </Head>
      <BlogPostForm onSubmit={submitNewBlogPost} action={Action.CREATE} />
    </>
  );
};

export default Create;
