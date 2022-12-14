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
  const [loading, setLoading] = useState<boolean>(false);

  const toggleShowPassword = () => setShowPassword((p) => !p);

  const fetchCaptcha = async () => {
    const response = await fetch("/api/captcha");
    const body = await response.json();
    setCookies(body.cookies);
    setCaptcha(body.captcha);
    setLoading(false);
  };

  const login = async () => {
    const id = idInputRef.current?.value || "";
    const password = passwordInputRef.current?.value || "";
    const captcha = captchaInputRef.current?.value.toUpperCase() || "";

    if (!id || !password || !captcha) {
      return;
    }

    setLoading(true);

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
        <Flex className="h-full flex-col items-center justify-center">
          <Stack className="max-w-[270px] flex-1 justify-center">
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
                    <Alert status="error">
                      <AlertIcon />
                      {error}
                    </Alert>
                  </>
                )}

                <FormControl>
                  <FormLabel>Identificaci??n</FormLabel>
                  <Input
                    autoComplete="off"
                    disabled={loading}
                    as={InputMask}
                    mask="*-****-****"
                    maskChar={null}
                    name="username"
                    ref={idInputRef}
                    placeholder="1-2345-6789"
                    type="tel"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Contrase??a</FormLabel>
                  <InputGroup>
                    <Input
                      autoComplete="off"
                      disabled={loading}
                      name="password"
                      ref={passwordInputRef}
                      className="pr-20"
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
                <FormLabel>C??digo de verificaci??n</FormLabel>
                <Image
                  className="flex items-center justify-center"
                  alt="Captcha"
                  src={captcha}
                />
                <Input
                  autoComplete="off"
                  disabled={loading}
                  ref={captchaInputRef}
                  className="uppercase"
                  placeholder="71SJRG"
                  maxLength={6}
                />
                <Button
                  isLoading={loading}
                  onClick={login}
                  colorScheme="linkedin"
                  variant="solid"
                >
                  Ingresar
                </Button>
              </>
            )}
          </Stack>
          <footer className="w-full p-2 text-center font-bold">
            <p>
              Desarrollado con <span className="text-red-500">???</span> por{" "}
              <a
                href="https://github.com/ealpizr/orca"
                className="text-blue-500 underline"
              >
                ealpizar
              </a>
            </p>
          </footer>
        </Flex>
      </main>
    </>
  );
};

export default Home;
