import { useContext, useEffect, ChangeEvent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { BlogPost, CreateBlogPost } from '@api/blog';
import { ButtonBase, Description, ErrorText, Title } from '@components';
import { AuthContext } from '@providers';
import { BlogPostValidation, useNavigation } from '@utils';
import { TextField } from '@mui/material';
import MDEditor from '@uiw/react-md-editor';
import { Action } from './types';
import './BlogPostForm.css';

interface BlogPostFormProps {
  initialData?: BlogPost | null;
  onSubmit: (data: CreateBlogPost) => Promise<void>;
  action: Action;
}

export const BlogPostForm = ({ initialData, onSubmit, action }: BlogPostFormProps) => {
  const { goToLoginPage } = useNavigation();
  const { user, isLoading } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateBlogPost>({
    resolver: yupResolver(BlogPostValidation),
    defaultValues: initialData
      ? {
          title: initialData.title,
          preview: initialData.preview,
          content: initialData.content,
          category: initialData.category,
        }
      : {},
  });

  const watchAll = watch();
  console.log(initialData);
  console.log(watchAll);

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

  return (
    <div className='blog-post-form-container'>
      <div>
        <Title>Create new blog post</Title>
        <Description>Lorem ipsum dolor sit amet.</Description>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        {errors.content && <ErrorText>{errors.content.message}</ErrorText>}
        <div className='blog-post-image-upload-container'>
          <TextField
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
