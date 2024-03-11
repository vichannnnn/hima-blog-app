import { useEffect, useState, useContext } from 'react';
import styles from '../styles/pages/index.module.css';
import { getAllBlogPosts, BlogPost as BlogPostObject } from '@api/blog';
import { BlogPost } from '@components';
import { MediaQueryContext, AuthContext } from '@providers';
import { Hero } from '../components/Hero';

const HomePage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPostObject[]>([]);
  const [openDialogSlug, setOpenDialogSlug] = useState<string | null>(null);
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

  const handlePostDeletion = (slug: string) => {
    setBlogPosts((currentPosts) => currentPosts.filter((post) => post.slug !== slug));
  };

  const handleOpenDialog = (slug: string) => {
    setOpenDialogSlug(slug);
  };

  const handleCloseDialog = () => {
    setOpenDialogSlug(null);
  };

  return (
    <>
      <Hero />
      <div className={styles.page}>
        {blogPosts.map((post, index) => (
          <BlogPost
            key={index}
            slug={post.slug}
            user_id={post.user_id}
            title={post.title}
            content={post.content}
            category={post.category}
            date_posted={post.date_posted}
            last_edited_date={post.last_edited_date}
            preview={post.preview}
            image={post.image}
            onPostDelete={handlePostDeletion}
            isOpen={openDialogSlug === post.slug}
            onOpenDialog={() => handleOpenDialog(post.slug)}
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
