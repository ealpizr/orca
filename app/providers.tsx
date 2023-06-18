"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import AppContextProvider from "~/context/app-context-provider";
import { ComponentWithChildren } from "~/types";

export function Providers({ children }: ComponentWithChildren) {
  return (
    <AppContextProvider>
      <CacheProvider>
        <ChakraProvider>{children}</ChakraProvider>
      </CacheProvider>
    </AppContextProvider>
  );
}
