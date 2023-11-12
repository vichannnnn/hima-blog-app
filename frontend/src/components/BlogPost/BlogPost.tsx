import { BlogPostType } from './types';
import { ButtonBase } from '../Button';
import './BlogPost.css';

const VITE_APP_AWS_CLOUDFRONT_URL = import.meta.env.VITE_APP_AWS_CLOUDFRONT_URL;

export const BlogPost = ({ title, date, summary, imageUrl }: BlogPostType) => {
  return (
    <div className='blog-post'>
      <img src={`${VITE_APP_AWS_CLOUDFRONT_URL}${imageUrl}`} alt={title} />
      <div className='date-container'>
        <p>{date}</p>
      </div>
      <h2>{title}</h2>
      <p>{summary}</p>
      <div className='button-container'>
        <ButtonBase onClick={() => console.log(`Read more about ${title}`)}>
          Read full article
        </ButtonBase>
      </div>
    </div>
  );
};
