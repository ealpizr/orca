import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
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
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import InputMask from "react-input-mask";

const Home: NextPage = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [cookies, setCookies] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const idInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const captchaInputRef = useRef<HTMLInputElement>(null);

  const toggleShowPassword = () => setShowPassword((p) => !p);

  const fetchCaptcha = async () => {
    const response = await fetch("/api/captcha");
    const body = await response.json();
    setCookies(body.cookies);
    setCaptcha(body.captcha);
  };

  const login = async () => {
    const id = idInputRef.current?.value || "";
    const password = passwordInputRef.current?.value || "";
    const captcha = captchaInputRef.current?.value.toUpperCase() || "";

    if (!id || !password || !captcha) {
      return;
    }

    console.log({
      id,
      password,
      captcha,
      cookies,
    });

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id.replaceAll("-", ""),
        password,
        captcha,
        cookies,
      }),
    });

    if (response.status === 400) {
      setError("Datos invalidos");
      if (captchaInputRef.current) {
        captchaInputRef.current.value = "";
      }
      return fetchCaptcha();
    }

    if (response.status !== 200) {
      setError((await response.json()).error);
      return fetchCaptcha();
    }

    router.push(
      { pathname: "/appointments", query: { cookies } },
      "/appointments"
    );
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
                <Image className="mx-auto max-w-[200px]" src="/orca.svg" />
                <Divider className="py-1" />
                {error && (
                  <>
                    <Alert className="max-w-[270px]" status="error">
                      <AlertIcon />
                      {error}
                    </Alert>
                  </>
                )}

                <FormControl>
                  <FormLabel>Identificación</FormLabel>
                  <Input
                    as={InputMask}
                    mask="*-****-****"
                    maskChar={null}
                    name="username"
                    ref={idInputRef}
                    className="max-w-[400px]"
                    placeholder="1-2345-6789"
                    type="tel"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Contraseña</FormLabel>
                  <InputGroup>
                    <Input
                      name="password"
                      ref={passwordInputRef}
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
                  ref={captchaInputRef}
                  className="max-w-[400px] uppercase"
                  placeholder="71SJRG"
                  maxLength={6}
                />
                <Button onClick={login} colorScheme="teal" variant="solid">
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
