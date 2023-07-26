"use client";

import { Center, Spinner as ChakraSpinner } from "@chakra-ui/react";

export default function Spinner() {
  return (
    <Center h="100%">
      <ChakraSpinner
        thickness="5px"
        speed="0.75s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Center>
  );
}
