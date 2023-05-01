// ArticleList.tsx
import React from "react";
import { Box, VStack, Heading, Text, Flex, Divider } from "@chakra-ui/react";
import { BlogPost } from "../utils/blogPostUtils";

interface ArticleListProps {
  posts: BlogPost[];
  onReadFullArticle: (post: BlogPost) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({
  posts,
  onReadFullArticle,
}) => {
  return (
    <VStack spacing={4} alignItems="stretch">
      {posts.map((post) => (
        <Box
          key={post.post_id}
          onClick={() => onReadFullArticle(post)}
          cursor="pointer"
        >
          <Flex direction="column" p={6} bg="white" boxShadow="base">
            <Heading size="md">{post.title}</Heading>
            <Text noOfLines={3} overflowWrap="break-word" overflow="hidden">
              {truncateText(post.preview, 200)}
            </Text>
          </Flex>
          <Divider my={2} />
        </Box>
      ))}
    </VStack>
  );
};

function truncateText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

export default ArticleList;
