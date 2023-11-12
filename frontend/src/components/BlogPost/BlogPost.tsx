import { useContext } from 'react';
import { BlogPost as BlogPostObject } from '@api/blog';
import { AuthContext } from '@providers';
import { useNavigation } from '@utils';
import EditIcon from '@mui/icons-material/Edit';
import { ButtonBase } from '../Button';
import './BlogPost.css';

const VITE_APP_AWS_CLOUDFRONT_URL = import.meta.env.VITE_APP_AWS_CLOUDFRONT_URL;

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
}: BlogPostObject) => {
  const { user } = useContext(AuthContext);
  const { goToLoginPage, goToUpdateBlogPost } = useNavigation();

  const handleGetUpdatePage = () => {
    if (user) {
      goToUpdateBlogPost(blog_id);
    } else {
      goToLoginPage();
    }
  };

  return (
    <div className='blog-post'>
      <div className='blog-post-image-container'>
        <button className='edit-icon' onClick={handleGetUpdatePage}>
          <EditIcon />
        </button>
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
      <h2>{title}</h2>
      <p>{preview}</p>
      <div className='button-container'>
        <ButtonBase onClick={() => console.log(`Read more about ${title}`)}>
          Read full article
        </ButtonBase>
      </div>
    </div>
  );
};
