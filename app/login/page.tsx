"use client";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import InputMask from "react-input-mask";
import Spinner from "~/components/spinner";
import AppContext from "~/context/app-context";

export default function Page() {
  const { appContext } = useContext(AppContext);

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword((p) => !p);

  return appContext.EDUSAPIToken ? (
    <Stack h="100%">
      <Center h="100%">
        <Stack className="max-w-[270px]">
          <Image className="mx-auto max-w-[200px]" src="/orca.svg" />
          <Divider className="py-1" />
          <FormControl>
            <FormLabel>Identificación</FormLabel>
            <Input
              autoComplete="off"
              //disabled={loading}
              as={InputMask}
              mask="*-****-****"
              maskChar={null}
              name="username"
              //ref={idInputRef}
              placeholder="1-2345-6789"
              type="tel"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Contraseña</FormLabel>
            <InputGroup>
              <Input
                autoComplete="off"
                //disabled={loading}
                name="password"
                //ref={passwordInputRef}
                className="pr-20"
                placeholder="**********"
                type={showPassword ? "text" : "password"}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    //login();
                  }
                }}
              />
              <InputRightElement>
                <Box
                  className="flex cursor-pointer items-center justify-center rounded-lg bg-gray-200 p-2 transition-all hover:bg-gray-300"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Box>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Divider className="py-1" />
          <Button
            //isLoading={loading}
            // onClick={login}
            colorScheme="linkedin"
            variant="solid"
            className="bg-[var(--chakra-colors-linkedin-500)]"
          >
            Ingresar
          </Button>
        </Stack>
      </Center>
      <footer className="w-full p-2 text-center font-bold">
        <p>
          Desarrollado con <span className="text-red-500">♥</span> por{" "}
          <a
            href="https://github.com/ealpizr/orca"
            className="text-blue-500 underline"
          >
            ealpizar
          </a>
        </p>
      </footer>
    </Stack>
  ) : (
    <Spinner />
  );
}
