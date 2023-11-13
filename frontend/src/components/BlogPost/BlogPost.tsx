import { useContext, useState } from 'react';
import { BlogPost as BlogPostObject, deleteBlogPost } from '@api/blog';
import { AuthContext } from '@providers';
import { useNavigation } from '@utils';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ButtonBase } from '../Button';
import './BlogPost.css';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

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
              <DialogTitle id='alert-dialog-title'>{"Use Google's location service?"}</DialogTitle>
              <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                  Let Google help apps determine location. This means sending anonymous location
                  data to Google, even when no apps are running.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseAlert}>Disagree</Button>
                <Button onClick={handleDeleteBlogPost} autoFocus>
                  Agree
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        ) : null}
        <img src={`${VITE_APP_AWS_CLOUDFRONT_URL}${image}`} alt={title} />
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
        <ButtonBase onClick={handleNavigateToBlogPost}>Read full article</ButtonBase>
      </div>
    </div>
  );
};
