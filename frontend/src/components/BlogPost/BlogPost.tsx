import { useRouter } from 'next/navigation';
import { BlogPost as BlogPostObject, deleteBlogPost } from '@api/blog';
import { Button } from '../index';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from '../../styles/components/BlogPost.module.css';

const NEXT_PUBLIC_AWS_CLOUDFRONT_URL = process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL;

interface BlogPostProps extends BlogPostObject {
  onPostDelete: (slug: string) => void;
  isDesktop: boolean;
  isAuthenticated: boolean;
  isOpen: boolean;
  onOpenDialog: () => void;
  onCloseDialog: () => void;
}

export const BlogPost = ({
  slug,
  user_id,
  title,
  content,
  image,
  category,
  preview,
  date_posted,
  last_edited_date,
  onPostDelete,
  isDesktop,
  isAuthenticated,
  isOpen,
  onOpenDialog,
  onCloseDialog,
}: BlogPostProps) => {
  const router = useRouter();

  const handleGetUpdatePage = () => {
    if (isAuthenticated) {
      const updatePagePath = `/update/${slug}`;
      router.push(updatePagePath);
    } else {
      router.push('/login');
    }
  };

  const handleDeleteBlogPost = async () => {
    if (isAuthenticated) {
      await deleteBlogPost(slug);
      onPostDelete(slug);
      onCloseDialog();
    } else {
      router.push('/login');
    }
  };

  const handleNavigateToBlogPost = () => {
    const pagePath = `/post/${slug}`;
    router.push(pagePath);
  };

  return (
    <div className={styles.blogPost}>
      <div className={styles.blogPostImageContainer}>
        {isAuthenticated && (
          <div className={styles.actionIcons}>
            <button className={styles.editIcon} onClick={handleGetUpdatePage}>
              <EditIcon />
            </button>
            <button className={styles.deleteIcon} onClick={onOpenDialog}>
              <DeleteIcon />
            </button>
            <Dialog
              open={isOpen}
              onClose={onCloseDialog}
              aria-labelledby='alert-dialog-title'
              aria-describedby='alert-dialog-description'
            >
              <DialogTitle id='alert-dialog-title'>Delete this blog post?</DialogTitle>
              <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                  Please confirm that you want to delete this blog post.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <button onClick={onCloseDialog}>Cancel</button>
                <button onClick={handleDeleteBlogPost} autoFocus>
                  Delete
                </button>
              </DialogActions>
            </Dialog>
          </div>
        )}
        <img
          src={`${NEXT_PUBLIC_AWS_CLOUDFRONT_URL}${image}`}
          alt={title}
          onClick={handleNavigateToBlogPost}
          style={{
            width: '100%',
            height: '320px',
            objectFit: 'cover',
            borderRadius: '12px',
            cursor: 'pointer',
          }}
        />
      </div>
      <div className={styles.dateContainer}>
        <p>
          {Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(new Date(date_posted))}
        </p>
      </div>

      <h2 className={styles.blogPostTitle}>{title}</h2>
      <p className={styles.blogPostPreview}>{preview}</p>

      <div className={styles.buttonContainer}>
        <Button
          sx={{
            backgroundColor: '#b8e9f7',
            fontSize: isDesktop ? '22px' : '16px',
            '&:hover': {
              backgroundColor: '#a6d2de',
              border: 'none',
            },
          }}
          onClick={handleNavigateToBlogPost}
        >
          Read full article
        </Button>
      </div>
    </div>
  );
};
