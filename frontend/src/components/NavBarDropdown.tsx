import React from "react";
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useMediaQuery,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import UpdateBlogModal from "./UpdateBlogModal";
import UpdatePasswordModal from "./UpdatePasswordModal";

interface NavBarDropdownProps {
  user: any;
  onLoginModalOpen: () => void;
  handleUpdateBlog: (data: any) => void;
  handleUpdatePassword: (
    password: string,
    updatePassword: string,
    repeatPassword: string
  ) => Promise<boolean>;
  handleLogout: () => void;
}

const NavBarDropdown: React.FC<NavBarDropdownProps> = ({
  user,
  onLoginModalOpen,
  handleUpdateBlog,
  handleUpdatePassword,
  handleLogout,
}) => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  if (!user) {
    if (isLargerThan768) {
      return (
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
      );
    } else {
      return (
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
      );
    }
  } else {
    return (
      <Menu>
        <MenuButton
          as={Button}
          bg="#3fe87c"
          color="black"
          size="sm"
          _hover={{ bg: "#34d56a" }}
          rightIcon={isLargerThan768 ? <ChevronDownIcon /> : null}
        >
          {isLargerThan768 ? user.username : user.username}
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
    );
  }
};

export default NavBarDropdown;
