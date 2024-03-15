import { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import { getAllBlogPosts, BlogPost as BlogPostObject } from '@api/blog';
import { BlogPost } from '@components';
import { MediaQueryContext, AuthContext } from '@providers';
import styles from '@styles/pages/index.module.css';
import { NextSeo } from 'next-seo';

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
      <NextSeo title="Hima's Engineering Blog" description="Welcome to Hima's ramblings!" />
      <div className={styles.heroContainer}>
        <Image
          src='https://image.himaa.me/hima-chan-posing.png'
          alt='Hima!'
          width='225'
          height='225'
          loading='lazy'
        />
        <div>
          <h1>Welcome to Hima&apos;s Engineering Blog</h1>
          <p className={styles.heroSubtitle}>
            This is where the ramblings and yapping of my software engineering journey lies. It
            could be about engineering-related stuff like work, personal projects, or it could be
            anything! I would ideally like to update the blog with new post every other week to
            document down my engineering journey but we shall see how it goes!
          </p>
        </div>
      </div>
      <div className={styles.page}>
        {blogPosts.map((post, index) => (
          <BlogPost
            blog_id={post.blog_id}
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
