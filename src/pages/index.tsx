import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { type NextPage } from "next";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((p) => !p);
  const [captcha, setCaptcha] = useState<string | null>(null);

  const fetchCaptcha = async () => {
    const response = await fetch("/api/captcha");
    const body = await response.json();
    setCaptcha(body.captcha);
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  return (
    <>
      <main className="h-full">
        <Flex className="h-full items-center justify-center">
          <Stack>
            {!captcha ? (
              <Spinner
                thickness="5px"
                speed="0.75s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            ) : (
              <>
                <FormControl>
                  <FormLabel>Identificación</FormLabel>
                  <Input
                    className="max-w-[400px]"
                    placeholder="1-2345-6789"
                    type="number"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Contraseña</FormLabel>
                  <InputGroup>
                    <Input
                      className="max-w-[400px] pr-20"
                      placeholder="**********"
                      type={showPassword ? "text" : "password"}
                    />
                    <InputRightElement className="w-20">
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
                <FormLabel>Código de verificación</FormLabel>
                <Image
                  className="flex items-center justify-center"
                  alt="Captcha"
                  src={captcha}
                />
                <Input
                  className="max-w-[400px]"
                  placeholder="71SJRG"
                  maxLength={6}
                />
                <Button colorScheme="teal" variant="solid">
                  Ingresar
                </Button>
              </>
            )}
          </Stack>
        </Flex>
      </main>
    </>
  );
};

export default Home;
