import React, { useState } from "react";
import {
  Box,
  Flex,
  Link,
  Text,
  Button,
  useDisclosure,
  Collapse,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { HamburgerIcon, ChevronDownIcon } from "@chakra-ui/icons";
import UpdateBlogModal from "./UpdateBlogModal";
import apiClient from "../api/apiClient";
import { useBlogData } from "./BlogDataContext";
import { handleUpdateBlog } from "./BlogPost";
import useAuth from "../api/useAuth";
import { AxiosError } from "axios";
import UpdatePasswordModal from "./UpdatePasswordModal";

const NavBar: React.FC = () => {
  const { blogData } = useBlogData();
  const { isOpen, onToggle } = useDisclosure();
  const { user, login, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const {
    isOpen: isLoginModalOpen,
    onOpen: onLoginModalOpen,
    onClose: onLoginModalClose,
  } = useDisclosure();

  const toast = useToast();

  const handleUpdatePassword = async (
    password: string,
    updatePassword: string,
    repeatPassword: string
  ): Promise<boolean> => {
    try {
      await apiClient.post("/auth/update_password", {
        before_password: password,
        password: updatePassword,
        repeat_password: repeatPassword,
      });

      toast({
        title: "Password successfully updated.",
        description: "Your password has been changed.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      return true;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response && axiosError.response.status === 422) {
        toast({
          title: "Update failed.",
          description:
            "An error occurred while updating your password. Please make sure your input is correct.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      return false;
    }
  };

  const handleLogin = async () => {
    try {
      await login(username, password);

      onLoginModalClose();
    } catch (error) {
      let errorDescription = "Invalid username or password.";
      toast({
        title: "Login failed.",
        description: errorDescription,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = async () => {
    try {
      logout();
    } catch (error) {
      toast({
        title: "Logout failed.",
        description: "An error occurred while logging out.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const NavContent = () => (
    <>
      {/* {["Blog", "About", "Contact Us"].map((label) => (
        <Link
          key={label}
          mx={4}
          color="black"
          _hover={{ textDecoration: "underline" }}
        >
          {label}
        </Link>
      ))} */}
      {!user ? (
        <>
          <Button
            bg="#3fe87c"
            mx={4}
            color="black"
            size="sm"
            _hover={{ bg: "#34d56a" }}
            onClick={onLoginModalOpen}
          >
            Log in
          </Button>
        </>
      ) : (
        <Menu>
          <MenuButton
            as={Button}
            bg="#3fe87c"
            color="black"
            size="sm"
            _hover={{ bg: "#34d56a" }}
            rightIcon={<ChevronDownIcon />}
          >
            {user.username}
          </MenuButton>
          <MenuList>
            <MenuItem>
              <UpdateBlogModal
                onUpdateBlog={handleUpdateBlog}
                trigger={
                  <Box as="span" cursor="pointer">
                    Your Blog Settings
                  </Box>
                }
              />
            </MenuItem>

            <MenuItem>
              <UpdatePasswordModal
                onUpdatePassword={handleUpdatePassword}
                trigger={
                  <Box as="span" cursor="pointer">
                    Update Password
                  </Box>
                }
              />
            </MenuItem>
            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
          </MenuList>
        </Menu>
      )}
    </>
  );

  return (
    <>
      <Flex
        as="nav"
        alignItems="center"
        justifyContent="space-between"
        p={{ base: 6, md: 8 }}
        w="100vw"
        position="sticky"
        top={0}
        zIndex={10}
        bgColor="#f2feff"
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          w="container.xl"
          mx="auto"
          px={[2, 8]}
        >
          <Text fontSize="lg" fontWeight="bold" color="black">
            {blogData?.logo || "My Blog"}
          </Text>
          <Box
            display={{ base: "none", md: "flex" }}
            alignItems="center"
            ml="auto"
          >
            <NavContent />
          </Box>
          <Box
            display={{ base: "block", md: "none" }}
            ml="auto"
            onClick={onToggle}
          >
            <HamburgerIcon boxSize={6} />
          </Box>
        </Flex>
        <Collapse in={isOpen} animateOpacity>
          <VStack
            alignItems="start"
            spacing={4}
            mt={4}
            bg="#f2feff"
            p={4}
            rounded="md"
            boxShadow="md"
            w="full"
          >
            <NavContent />
          </VStack>
        </Collapse>
      </Flex>
      <Modal isOpen={isLoginModalOpen} onClose={onLoginModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="username" mt={4}>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleLogin}>
              Login
            </Button>
            <Button variant="ghost" onClick={onLoginModalClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NavBar;
