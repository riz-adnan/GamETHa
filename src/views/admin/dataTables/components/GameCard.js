import React from "react";
import { Box, Image, Text, Button, VStack, HStack } from "@chakra-ui/react";

const GameCard = ({icon, heading, detail}) => {
  return (
    <Box
      bg="gray.800"
      color="white"
      p={4}
      borderRadius="md"
      width="200px"
      boxShadow="lg"
      shadow="0 0 20px 1px white"
    >
      <VStack spacing={4} align="start">
        <HStack spacing={3}>
          {icon}
          <Text fontSize="lg" fontWeight="bold">{heading}</Text>
        </HStack>
        <Button
          size="sm"
          bg="transparent"
          color="red.500"
          _hover={{ bg: "red.600" }}
        >
          {detail}
        </Button>
      </VStack>
    </Box>
  );
};

export default GameCard;