import { useEffect, useState, useContext } from 'react';
import styles from '../styles/pages/index.module.css';
import { getAllBlogPosts, BlogPost as BlogPostObject } from '@api/blog';
import { BlogPost } from '@components';
import { MediaQueryContext, AuthContext } from '@providers';
import { Hero } from '../components/Hero';

const HomePage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPostObject[]>([]);
  const [openDialogBlogId, setOpenDialogBlogId] = useState<number | null>(null);
  const { isDesktop } = useContext(MediaQueryContext);
  const { user } = useContext(AuthContext);
  const isAuthenticated = !!user;

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

  const handleOpenDialog = (blogId: number) => {
    setOpenDialogBlogId(blogId);
  };

  const handleCloseDialog = () => {
    setOpenDialogBlogId(null);
  };

  return (
    <>
      <Hero />
      <div className={styles.page}>
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
            isOpen={openDialogBlogId === post.blog_id}
            onOpenDialog={() => handleOpenDialog(post.blog_id)}
            onCloseDialog={handleCloseDialog}
            isAuthenticated={isAuthenticated}
            isDesktop={isDesktop}
          />
        ))}
      </div>
    </>
  );
};

export default HomePage;
