import React, { useRef, useState } from "react";
import {
  Box,
  Grid,
  VStack,
  Heading,
  Text,
  Image,
  Button,
  HStack,
  Flex,
  Spacer,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Switch,
} from "@chakra-ui/react";
import { useBlogPostContext } from "./BlogPostContext";
import { BlogPost } from "../utils/blogPostUtils";
import apiClient from "../api/apiClient";
import { User } from "./authContext";
import { AdminActions } from "./AdminActions";
import { updateBlogPost, handleCreatePost } from "./BlogPost";
import NewBlogPostModal from "./NewBlogPostModal";
import { AddIcon } from "@chakra-ui/icons";
import ArticleList from "./ArticleList";

const VITE_IMAGE_VOLUME_URL = "https://image.fumi.moe/images/"

interface BlogPostListProps {
  user: User | null;
  onReadFullArticle: (post: BlogPost) => void;
}

function truncateText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

const BlogPostList: React.FC<BlogPostListProps> = ({
  user,
  onReadFullArticle,
}) => {
  const leastDestructiveRef = useRef(null);
  const { blogPosts, refreshBlogPosts } = useBlogPostContext();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deletePostId, setDeletePostId] = React.useState<number | null>(null);

  const isLoggedInAndOwnsBlog = user;
  const hasNoPosts = blogPosts.length === 0;

  const [isArticleView, setIsArticleView] = useState(false);

  const handleToggleView = () => {
    setIsArticleView(!isArticleView);
  };

  const deleteBlogPost = async (postId: number | null): Promise<void> => {
    if (postId === null) {
      return;
    }
    await apiClient.delete(`/post/delete?post_id=${postId}`);
    refreshBlogPosts();
  };

  const handlePostCreation = async (
    title: string,
    content: string,
    preview: string,
    image: File | null
  ) => {
    await handleCreatePost(title, content, preview, image);
  };

  return (
    <Box bg="white" minHeight="100vh">
      <Box px={[2, 8]} py={12} maxW="container.xl" mx="auto">
        <Box
          borderBottom="1px"
          borderColor="gray.200"
          pb={6}
          mb={8}
          w={{ base: "100%", md: "calc(100% - 16px)" }}
        >
          <HStack spacing={4}>
            {/* {["All", "Last Week", "Last Month", "Last Year"].map(
              (label, index) => (
                <Link
                  key={index}
                  color="gray.500"
                  _hover={{ textDecoration: "underline", color: "gray.700" }}
                  _focus={{ outline: "none" }}
                >
                  {label}
                </Link>
              )
            )} */}
            <Spacer />
            <HStack spacing={4}>
              <Text>Article View:</Text>
              <Switch
                isChecked={isArticleView}
                onChange={handleToggleView}
                size="md"
              />
            </HStack>
            {isLoggedInAndOwnsBlog && (
              <>
                <NewBlogPostModal
                  onCreatePost={handlePostCreation}
                  onRefreshPosts={refreshBlogPosts}
                  trigger={
                    <IconButton
                      aria-label="Add new blog post"
                      icon={<AddIcon />}
                      size="md"
                      variant="outline"
                      _hover={{ bg: "grey.100" }}
                    />
                  }
                />
              </>
            )}
          </HStack>
        </Box>
        {hasNoPosts ? (
          <Flex
            justifyContent="center"
            alignItems="center"
            height="200px"
            textAlign="center"
          >
            {isLoggedInAndOwnsBlog
              ? "You do not have any blog posts yet."
              : "This user does not have any blog posts yet."}
          </Flex>
        ) : isArticleView ? (
          <ArticleList
            posts={blogPosts}
            onReadFullArticle={onReadFullArticle}
          />
        ) : (
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(3, 1fr)",
            }}
            gap={8}
          >
            {blogPosts.map((post) => (
              <VStack
                key={post.post_id}
                p={6}
                bg="white"
                alignItems="start"
                spacing={4}
                position="relative"
              >
                <AdminActions
                  user={user}
                  onDelete={() => {
                    setDeletePostId(post.post_id);
                    setIsDeleteDialogOpen(true);
                  }}
                  onUpdatePost={updateBlogPost}
                  onRefreshPosts={refreshBlogPosts}
                  post={post}
                />
                <Image
                  src={`${VITE_IMAGE_VOLUME_URL}/${post.image}`}
                  alt={post.title}
                  rounded="md"
                  w="full"
                  h="225px"
                  objectFit="cover"
                />
                <Text fontSize="sm" color="gray.500">
                  {post.date_posted}
                </Text>
                <Heading size="md">{post.title}</Heading>
                <Flex
                  direction="column"
                  justifyContent="space-between"
                  flex="1"
                >
                  <Text
                    flex="1"
                    noOfLines={3}
                    overflowWrap="break-word"
                    overflow="hidden"
                  >
                    {truncateText(post.preview, 200)}
                  </Text>
                  <HStack spacing={2} mt="15px">
                    <Button
                      size="sm"
                      bg="#3fe87c"
                      alignSelf="flex-start"
                      px={6}
                      onClick={() => onReadFullArticle(post)}
                    >
                      Read full article
                    </Button>
                  </HStack>
                </Flex>
              </VStack>
            ))}
          </Grid>
        )}

        <AlertDialog
          isOpen={isDeleteDialogOpen}
          leastDestructiveRef={leastDestructiveRef}
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Blog Post
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to delete this blog post? This action
                cannot be undone.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={async () => {
                    await deleteBlogPost(deletePostId);
                    refreshBlogPosts();
                    setIsDeleteDialogOpen(false);
                  }}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </Box>
  );
};

export default BlogPostList;
