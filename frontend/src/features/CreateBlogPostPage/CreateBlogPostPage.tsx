import { useContext, useEffect, ChangeEvent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addNewBlogPost, CreateBlogPost } from '@api/blog';
import { ButtonBase, Description, Title } from '@components';
import { AuthContext } from '@providers';
import { BlogPostValidation, useNavigation } from '@utils';
import { TextField } from '@mui/material';
import MDEditor from '@uiw/react-md-editor';
import './CreateBlogPostPage.css';

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
        image: formData.image instanceof File ? formData.image : null,
      };
      await addNewBlogPost(payload);
      goToHome();
    } catch (error) {
      console.error('Error creating blog post', error);
    }
  };

  return (
    <div className='blog-post-form-container'>
      <div>
        <Title>Create new blog post</Title>
        <Description>Lorem ipsum dolor sit amet.</Description>
      </div>
      <form onSubmit={handleSubmit(submitNewBlogPost)}>
        <TextField
          label='Title'
          type='text'
          error={Boolean(errors.title)}
          helperText={errors.title?.message}
          {...register('title')}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Preview'
          type='text'
          error={Boolean(errors.preview)}
          helperText={errors.preview?.message}
          {...register('preview')}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Category'
          type='text'
          {...register('category')}
          fullWidth
          margin='normal'
        />
        <Controller
          {...register('content')}
          control={control}
          defaultValue=''
          render={({ field }) => (
            <MDEditor
              {...field}
              value={field.value}
              onChange={(value) => field.onChange(value)}
              placeholder='Blog post content'
              data-color-mode='light'
            />
          )}
        />
        {errors.content && <p>{errors.content.message}</p>}
        <div className='blog-post-image-upload-container'>
          <TextField
            {...register('image')}
            type='file'
            onChange={handleImageChange}
            fullWidth
            margin='normal'
            inputProps={{
              accept: 'image/*',
            }}
          />
        </div>
        <div className='blog-post-form-button-container'>
          <ButtonBase variant='contained' type='submit'>
            Create
          </ButtonBase>
        </div>
      </form>
    </div>
  );
};
