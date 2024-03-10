// @ts-nocheck
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useEffect, ReactNode } from 'react';
import { BlogPost, getBlogPost } from '@api/blog';
import { Button, Description, Title } from '@components';
import { Home } from '@mui/icons-material';
import 'github-markdown-css/github-markdown-light.css';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import styles from '../../styles/pages/post.module.css';

const Prism = dynamic(() =>
  import('react-syntax-highlighter').then((mod) => mod.Prism || mod.default),
);

interface CodeBlockProps {
  node?: string;
  inline?: boolean;
  className?: string;
  children?: ReactNode;
}

const CodeBlock = ({ node, inline, className, children, ...props }: CodeBlockProps) => {
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <Prism language={match[1]} PreTag='div' {...props}>
      {String(children).replace(/\n$/, '')}
    </Prism>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

interface FullBlogPostProps {
  blogPostData: BlogPost;
  mdxSource: MDXRemoteSerializeResult;
}

const FullBlogPost = ({ blogPostData, mdxSource }: FullBlogPostProps) => {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!blogPostData) {
    router.push('/404');
  }

  const goToHome = () => {
    router.push('/');
  };

  return (
    <>
      <div className={styles.fullBlogPostContainer}>
        <div className={styles.fullBlogPostHeader}>
          <Title className={styles.fullBlogPostTitle}>{blogPostData?.title}</Title>
        </div>
        <Description className={styles.fullBlogPostDate}>
          Post created on{' '}
          {blogPostData &&
            Intl.DateTimeFormat('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }).format(new Date(blogPostData?.date_posted))}
        </Description>
        <div className={styles.contentContainer}>
          <div
            className='markdown-body'
            style={{
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif",
              fontSize: '16px',
              lineHeight: '1.6',
              marginTop: '1rem',
              backgroundColor: '#fcfbf8',
            }}
          >
            <MDXRemote {...mdxSource} components={{ code: CodeBlock }} />
          </div>
        </div>
        <div className={styles.fullBlogPostButtonContainer}>
          <Button onClick={goToHome}>
            <Home />
          </Button>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const { blog_id } = context.params;

  try {
    const data = await getBlogPost(Number(blog_id));
    const mdxSource = await serialize(data.content);
    return { props: { blogPostData: data, mdxSource } };
  } catch (error) {
    return { props: { blogPostData: null, mdxSource: null } };
  }
}

export default FullBlogPost;
