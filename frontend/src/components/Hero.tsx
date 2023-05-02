import React from "react";
import { Box, Text, Container } from "@chakra-ui/react";
import { useBlogData } from "./BlogDataContext";

const Hero: React.FC = () => {
  const { blogData } = useBlogData();
  const textContentMaxWidth = "600px";

  const fontStyle = {
    fontFamily: "Helvetica, Arial, sans-serif",
  };

  return (
    <Box
      py={{ base: 24, md: 32 }}
      px={8}
      width="100%"
      bgColor="#f2feff"
      textAlign="center"
    >
      <Text
        as="p"
        fontSize={{ base: "4xl", md: "5xl" }}
        fontWeight="bold"
        color="black"
        {...fontStyle}
      >
        {blogData?.hero_title || "Default title."}
      </Text>
      <Container maxW={textContentMaxWidth} centerContent>
        <Text
          as="p"
          fontSize={{ base: "lg", md: "xl" }}
          color="#aeb3b4"
          mt={4}
          {...fontStyle}
        >
          {blogData?.hero_content || "Default text."}
        </Text>
      </Container>
    </Box>
  );
};

export default Hero;
