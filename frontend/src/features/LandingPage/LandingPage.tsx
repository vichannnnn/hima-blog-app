import { useEffect, useState } from 'react';
import { getAllBlogPosts, BlogPost as BlogPostObject } from '@api/blog';
import { BlogPost } from '@components';
import { Hero } from '../Hero';
import './LandingPage.css';

export const LandingPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPostObject[]>([]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const getBlogPosts = await getAllBlogPosts();
        if (isMounted) {
          setBlogPosts(getBlogPosts.items);
        }
      } catch (error) {
        console.error('Error fetching blog posts', error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePostDeletion = (deletedBlogId: number) => {
    setBlogPosts((currentPosts) => currentPosts.filter((post) => post.blog_id !== deletedBlogId));
  };

  return (
    <>
      <Hero />
      <div className='landing-page'>
        {blogPosts.map((post, index) => (
          <BlogPost
            key={index}
            blog_id={post.blog_id}
            user_id={post.user_id}
            title={post.title}
            content={post.content}
            category={post.category}
            date_posted={post.date_posted}
            last_edited_date={post.last_edited_date}
            preview={post.preview}
            image={post.image}
            onPostDelete={handlePostDeletion}
          />
        ))}
      </div>
    </>
  );
};
