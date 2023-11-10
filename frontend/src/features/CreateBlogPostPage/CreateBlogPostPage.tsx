import { useContext, useEffect, ChangeEvent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addNewBlogPost, CreateBlogPost } from '@api/blog';
import { BlogPostValidation, useNavigation } from '@utils';
import { AuthContext } from '@providers';
import { TextField } from '@mui/material';
import MDEditor from '@uiw/react-md-editor';
import { ButtonBase } from '@components';

export const CreateBlogPostPage = () => {
  const { goToHome, goToLoginPage } = useNavigation();
  const { user, isLoading } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateBlogPost>({
    resolver: yupResolver(BlogPostValidation),
  });

  useEffect(() => {
    if (!isLoading && !user) {
      goToLoginPage();
    }
  }, [isLoading, user]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setValue('image', file);
    }
  };

  const submitNewBlogPost = async (formData: CreateBlogPost) => {
    try {
      const payload = {
        ...formData,
        image: formData.image || null,
      };
      await addNewBlogPost(payload);
      goToHome();
    } catch (error) {
      console.error('Error creating blog post', error);
    }
  };

  return (
    <form className='create-blog-post-container' onSubmit={handleSubmit(submitNewBlogPost)}>
      <TextField
        label='Title'
        type='text'
        error={Boolean(errors.title)}
        helperText={errors.title?.message}
        {...register('title')}
        fullWidth
        margin='normal'
        required
      />
      <TextField label='Preview' type='text' {...register('preview')} fullWidth margin='normal' />
      <TextField label='Category' type='text' {...register('category')} fullWidth margin='normal' />
      <Controller
        name='content'
        control={control}
        defaultValue=''
        render={({ field }) => (
          <MDEditor
            {...field}
            value={field.value}
            onChange={(value) => field.onChange(value)}
            placeholder='Blog post content'
          />
        )}
      />
      {errors.content && <p>{errors.content.message}</p>}
      <TextField
        type='file'
        onChange={handleImageChange}
        fullWidth
        margin='normal'
        inputProps={{
          accept: 'image/*',
        }}
      />
      <ButtonBase variant='contained' type='submit'>
        Create
      </ButtonBase>
    </form>
  );
};
