import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  VStack,
  Image,
  useToast,
} from "@chakra-ui/react";
import { BlogPost } from "../utils/blogPostUtils";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import MDEditor from "@uiw/react-md-editor";

interface NewBlogPostModalProps {
  trigger: React.ReactNode;
  onCreatePost?: (
    title: string,
    content: string,
    preview: string,
    image: File | null
  ) => Promise<void>;
  onUpdatePost?: (
    postId: number,
    title: string,
    content: string,
    preview: string,
    image: File | null
  ) => Promise<void>;
  onRefreshPosts: () => void;
  initialPost?: BlogPost;
}

const NewBlogPostModal: React.FC<NewBlogPostModalProps> = ({
  trigger,
  onCreatePost,
  onUpdatePost,
  onRefreshPosts,
  initialPost,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(initialPost?.title || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [preview, setPreview] = useState(initialPost?.preview || "");
  const [image, setImage] = useState<File | null>(null);
  const toast = useToast();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = async () => {
    try {
      if (initialPost && onUpdatePost) {
        await onUpdatePost(initialPost.post_id, title, content, preview, image);
      } else if (onCreatePost) {
        await onCreatePost(title, content, preview, image);
      }
      await onRefreshPosts();
      toast({
        title: "Blog post saved successfully.",
        status: "success",
        isClosable: true,
      });
      closeModal();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error saving the blog post.",
        status: "error",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    setTitle(initialPost?.title || "");
    setContent(initialPost?.content || "");
  }, [initialPost]);

  return (
    <>
      <Box onClick={openModal}>{trigger}</Box>
      <Modal isOpen={isOpen} onClose={closeModal} size="xl">
        <ModalOverlay />
        <ModalContent maxW="80%">
          <ModalHeader>
            {initialPost ? "Edit Blog Post" : "Create New Blog Post"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Blog post title"
              />
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Preview</FormLabel>
              <Input
                value={preview}
                onChange={(e) => setPreview(e.target.value)}
                placeholder="Blog post preview"
              />
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Content</FormLabel>
              <div data-color-mode="light">
                <div className="wmde-markdown-var"> </div>
                <MDEditor
                  value={content}
                  onChange={(value) => setContent(value || "")}
                  placeholder="Blog post content"
                />
              </div>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Image</FormLabel>
              <Input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setImage(e.target.files[0]);
                  } else {
                    setImage(null);
                  }
                }}
              />
            </FormControl>
            {image && (
              <VStack mt={4} spacing={4}>
                <Image
                  src={URL.createObjectURL(image)}
                  alt={title}
                  rounded="md"
                  w="full"
                  h="225px"
                  objectFit="cover"
                />
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              {initialPost ? "Update" : "Create"}
            </Button>
            <Button onClick={closeModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewBlogPostModal;
