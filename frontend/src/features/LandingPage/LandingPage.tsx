import { BlogPost } from '@components';
import { Hero } from '../Hero';
import { useEffect, useState } from 'react';
import { getAllBlogPosts, BlogPost as BlogPostObject } from '@api/blog';
import './LandingPage.css';

export const LandingPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPostObject[]>([]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const getBlogPosts = await getAllBlogPosts();
        if (isMounted) {
          setBlogPosts(getBlogPosts);
        }
      } catch (error) {
        console.error('Error fetching blog posts', error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Hero />
      <div className='landing-page'>
        {blogPosts.map((post, index) => (
          <BlogPost
            key={index}
            title={post.title}
            date={Intl.DateTimeFormat('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }).format(new Date(post.date_posted))}
            summary={post.preview}
            imageUrl={post.image}
          />
        ))}
      </div>
    </>
  );
};
