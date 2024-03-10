import { useContext, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { BlogPost, CreateBlogPost } from '@api/blog';
import { Button, Description, ErrorText, Title } from '@components';
import { AuthContext } from '@providers';
import { BlogPostValidation } from '@utils';
import { TextField } from '@mui/material';
import { Action } from './types';
import styles from '../../styles/components/BlogPostForm.module.css';
import dynamic from 'next/dynamic';

const MDEditor = dynamic(() => import('@uiw/react-md-editor').then((mod) => mod.default), {
  ssr: false,
});

interface BlogPostFormProps {
  initialData?: BlogPost | null;
  onSubmit: (data: CreateBlogPost) => Promise<void>;
  action: Action;
}

export const BlogPostForm = ({ initialData, onSubmit, action }: BlogPostFormProps) => {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
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

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setValue('image', file);
    }
  };

  return (
    <div className={styles.blogPostFormContainer}>
      <div>
        <Title>{action == Action.CREATE ? 'Create' : 'Update'} new blog post</Title>
        <Description>
          This is where Hima {action == Action.CREATE ? 'creates' : 'updates'} their blog post!
        </Description>
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
              data-color-mode='light'
              height='512px'
            />
          )}
        />
        {errors.content && <ErrorText>{errors.content.message}</ErrorText>}
        <div className={styles.blogPostImageUploadContainer}>
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
        <div className={styles.blogPostFormButtonContainer}>
          <Button variant='contained' type='submit'>
            {action == Action.CREATE ? 'Create' : 'Update'}
          </Button>
        </div>
      </form>
    </div>
  );
};
