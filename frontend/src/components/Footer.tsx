import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Footer: React.FC = () => {
  return (
    <Box bgColor="#f2feff" w="100vw" py={4} px={8}>
      <Text fontSize="md" fontWeight="medium" color="black" textAlign="center">
        My Blog &copy; {new Date().getFullYear()}
      </Text>
    </Box>
  );
};

export default Footer;
