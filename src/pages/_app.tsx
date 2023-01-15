import { ChakraProvider, Flex, Spinner } from "@chakra-ui/react";
import { type AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";
import { useEffect, useState } from "react";

import "../styles/globals.css";
import "../styles/reset.css";
import { UserData } from "../types";

const MyApp: AppType = ({ Component, pageProps }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    (async () => {
      const tokenResponse = await fetch("/api/token");
      setToken(await tokenResponse.text());
    })();
  }, []);

  return (
    <ChakraProvider>
      <Head>
        <title>Orca</title>
      </Head>
      {!token ? (
        <Flex className="h-full flex-1 flex-col items-center justify-center">
          <Spinner
            thickness="5px"
            speed="0.75s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      ) : (
        <Component
          {...pageProps}
          token={token}
          userData={userData}
          setUserData={setUserData}
        />
      )}
    </ChakraProvider>
  );
};

export default MyApp;
