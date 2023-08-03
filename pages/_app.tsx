import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import AppContextProvider from "~/context/app-context-provider";
import "~/styles/main.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <CacheProvider>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </CacheProvider>
    </AppContextProvider>
  );
}
