import { BlogPostType } from './types';
import { ButtonBase } from '../Button';
import './BlogPost.css';

export const BlogPost = ({ title, date, summary, imageUrl }: BlogPostType) => {
  return (
    <div className='blog-post'>
      <img src={imageUrl} alt={title} />
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
