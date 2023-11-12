import { addNewBlogPost, CreateBlogPost } from '@api/blog';
import { useNavigation } from '@utils';
import { BlogPostForm } from '../BlogPostForm';
import { Action } from '../types';

export const UpdateBlogPostPage = () => {
  const { goToHome } = useNavigation();

  const submitNewBlogPost = async (formData: CreateBlogPost) => {
    try {
      const payload = {
        ...formData,
        image: formData.image instanceof File ? formData.image : null,
      };
      await addNewBlogPost(payload);
      goToHome();
    } catch (error) {
      console.error('Error creating blog post', error);
    }
  };

  return <BlogPostForm onSubmit={submitNewBlogPost} action={Action.UPDATE} />;
};
