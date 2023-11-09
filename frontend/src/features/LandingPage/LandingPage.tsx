import { BlogPost, BlogPostType } from '@components';
import './LandingPage.css';

interface LandingPageProps {
  posts: BlogPostType[];
}

export const LandingPage = ({ posts }: LandingPageProps) => {
  return (
    <div className='landing-page'>
      {posts.map((post, index) => (
        <BlogPost
          key={index}
          title={post.title}
          date={post.date}
          summary={post.summary}
          imageUrl={post.imageUrl}
        />
      ))}
    </div>
  );
};
