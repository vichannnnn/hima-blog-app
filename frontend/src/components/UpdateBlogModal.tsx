import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useBlogData } from "./BlogDataContext";
import AuthContext from "./authContext";

interface UpdateBlogModalProps {
  trigger: React.ReactNode;
  onUpdateBlog: (
    titleTag: string,
    heroTitle: string,
    heroContent: string,
    logoContent: string
  ) => void;
}

const UpdateBlogModal: React.FC<UpdateBlogModalProps> = ({
  trigger,
  onUpdateBlog,
}) => {
  const toast = useToast();
  const { user, updateUser } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [titleTag, setTitleTag] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroContent, setHeroContent] = useState("");
  const [logoContent, setLogoContent] = useState("");
  const { blogData, setBlogData } = useBlogData();

  useEffect(() => {
    if (blogData) {
      setTitleTag(blogData.title_tag);
      setHeroTitle(blogData.hero_title);
      setHeroContent(blogData.hero_content);
      setLogoContent(blogData.logo);
    }
  }, [blogData]);

  const handleSubmit = () => {
    onUpdateBlog(titleTag, heroTitle, heroContent, logoContent);

    if (blogData) {
      setBlogData({
        ...blogData,
        title_tag: titleTag,
        hero_title: heroTitle,
        hero_content: heroContent,
        logo: logoContent,
      });
    }

    onClose();
  };

  return (
    <>
      {React.cloneElement(trigger as React.ReactElement, { onClick: onOpen })}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Blog Content</ModalHeader>
          <ModalCloseButton />
          <FormControl id="title_tag" mb={4}>
            <FormLabel>Title Tag</FormLabel>
            <Input
              type="text"
              value={titleTag}
              onChange={(e) => setTitleTag(e.target.value)}
            />
          </FormControl>
          <FormControl id="logo" mb={4}>
            <FormLabel>Logo</FormLabel>
            <Input
              type="text"
              value={logoContent}
              onChange={(e) => setLogoContent(e.target.value)}
            />
          </FormControl>
          <FormControl id="hero_title" mb={4}>
            <FormLabel>Hero Title</FormLabel>
            <Input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
            />
          </FormControl>
          <FormControl id="hero_content" mb={4}>
            <FormLabel>Hero Content</FormLabel>
            <Textarea
              value={heroContent}
              onChange={(e) => setHeroContent(e.target.value)}
              size="sm"
              minHeight="200px"
            />
          </FormControl>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateBlogModal;
