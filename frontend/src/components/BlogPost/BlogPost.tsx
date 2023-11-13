import { useContext, useState } from 'react';
import { BlogPost as BlogPostObject, deleteBlogPost } from '@api/blog';
import { AuthContext } from '@providers';
import { useNavigation } from '@utils';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ButtonBase } from '../Button';
import './BlogPost.css';

const VITE_APP_AWS_CLOUDFRONT_URL = import.meta.env.VITE_APP_AWS_CLOUDFRONT_URL;

interface BlogPostProps extends BlogPostObject {
  onPostDelete: (deletedBlogId: number) => void;
}

export const BlogPost = ({
  blog_id,
  user_id,
  title,
  content,
  image,
  category,
  preview,
  date_posted,
  last_edited_date,
  onPostDelete,
}: BlogPostProps) => {
  const { user } = useContext(AuthContext);
  const { goToLoginPage, goToUpdateBlogPost, goToBlogPost } = useNavigation();
  const [open, setOpen] = useState<boolean>(false);

  const handleGetUpdatePage = () => {
    if (user) {
      goToUpdateBlogPost(blog_id);
    } else {
      goToLoginPage();
    }
  };

  const handleDeleteBlogPost = async () => {
    if (user) {
      await deleteBlogPost(blog_id);
      onPostDelete(blog_id);
      setOpen(false);
    } else {
      goToLoginPage();
    }
  };

  const handleOpenAlert = () => {
    setOpen(true);
  };

  const handleCloseAlert = () => {
    setOpen(false);
  };

  const handleNavigateToBlogPost = () => {
    goToBlogPost(blog_id);
  };

  return (
    <div className='blog-post'>
      <div className='blog-post-image-container'>
        {user ? (
          <div className='action-icons'>
            <button className='edit-icon' onClick={handleGetUpdatePage}>
              <EditIcon />
            </button>
            <button className='delete-icon' onClick={handleOpenAlert}>
              <DeleteIcon />
            </button>
            <Dialog
              open={open}
              onClose={handleCloseAlert}
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
                <button onClick={handleCloseAlert}>Cancel</button>
                <button onClick={handleDeleteBlogPost} autoFocus>
                  Delete
                </button>
              </DialogActions>
            </Dialog>
          </div>
        ) : null}
        <img
          src={`${VITE_APP_AWS_CLOUDFRONT_URL}${image}`}
          alt={title}
          onClick={handleNavigateToBlogPost}
        />
      </div>
      <div className='date-container'>
        <p>
          {Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(new Date(date_posted))}
        </p>
      </div>

      <h2 className='blog-post-title'>{title}</h2>
      <p className='blog-post-preview'>{preview}</p>

      <div className='button-container'>
        <ButtonBase sx={{ fontSize: '24px' }} onClick={handleNavigateToBlogPost}>
          Read full article
        </ButtonBase>
      </div>
    </div>
  );
};
