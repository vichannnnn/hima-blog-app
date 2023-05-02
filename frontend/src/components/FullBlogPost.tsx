import React, { useEffect } from "react";
import { Box, Heading, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { BlogPost } from "../utils/blogPostUtils";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown-light.css";

interface FullBlogPostProps {
  post: BlogPost;
  onBackClick: () => void;
}

const CodeBlock: React.FC<any> = ({
  node,
  inline,
  className,
  children,
  ...props
}) => {
  const match = /language-(\w+)/.exec(className || "");
  return !inline && match ? (
    <SyntaxHighlighter
      style={materialDark}
      language={match[1]}
      PreTag="div"
      {...props}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

const FullBlogPost: React.FC<FullBlogPostProps> = ({ post, onBackClick }) => {
  const postDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(post.date_posted));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box
      px={[2, 8]}
      py={12}
      maxW="container.xl"
      mx="auto"
      minHeight="100vh"
      w="100vw"
      bgColor="white"
    >
      <IconButton
        aria-label="Go back"
        icon={<ArrowBackIcon />}
        size="md"
        variant="outline"
        _hover={{ bg: "gray.100" }}
        onClick={onBackClick}
        mb={4}
      />

      <Heading
        as="h1"
        size="2xl"
        mb={4}
        textAlign="center"
        style={{
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif",
        }}
      >
        {post.title}
      </Heading>

      <Text fontSize="12" color="gray.600" mb={12} textAlign="center">
        Post created on {postDate}
      </Text>
      <div style={{ fontFamily: "Calibri, sans-serif" }}>
        <div
          className="markdown-body"
          style={{
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif",
            fontSize: "16px",
            lineHeight: "1.6",
            marginTop: "1rem",
          }}
        >
          <ReactMarkdown
            components={{ code: CodeBlock }}
            remarkPlugins={[remarkGfm]}
            children={post.content}
          />
        </div>
      </div>
    </Box>
  );
};

export default FullBlogPost;
