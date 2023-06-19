"use client";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useContext, useRef, useState } from "react";
import InputMask from "react-input-mask";
import Spinner from "~/components/spinner";
import AppContext from "~/context/app-context";
import { loginSchema } from "~/schemas";
import { APIError } from "~/types";

export default function Page() {
  const { appContext } = useContext(AppContext);
  const toast = useToast({ position: "top" });

  const idInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    id?: string[] | undefined;
    password?: string[] | undefined;
  }>({});

  const toggleShowPassword = () => setShowPassword((p) => !p);

  const clearErrors = () => setErrors({});

  async function submit() {
    clearErrors();

    const validationSchema = loginSchema.safeParse({
      id: idInputRef.current?.value.replaceAll("-", ""),
      password: passwordInputRef.current?.value,
      token: appContext.EDUSAPIToken,
    });

    if (!validationSchema.success) {
      setErrors(validationSchema.error.flatten().fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(validationSchema.data),
      });

      if (response.status != 200) {
        throw new APIError("Credenciales inválidas");
      }
    } catch (e) {
      let message = "Ha ocurrido un error inesperado";
      if (e instanceof APIError) {
        message = e.message;
      }

      setLoading(false);
      toast({
        title: "Error",
        description: message,
        status: "error",
      });
    }
  }

  return appContext.EDUSAPIToken ? (
    <Stack h="100%">
      <Center h="100%">
        <Stack className="max-w-[270px]">
          <Image className="mx-auto max-w-[200px]" src="/orca.svg" />
          <Divider className="py-1" />
          <FormControl isInvalid={errors.id != undefined}>
            <FormLabel>Identificación</FormLabel>
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
            <FormErrorMessage>Identificación inválida</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password != undefined}>
            <FormLabel>Contraseña</FormLabel>
            <InputGroup>
              <Input
                autoComplete="off"
                disabled={loading}
                name="password"
                ref={passwordInputRef}
                className="pr-20"
                placeholder="**********"
                type={showPassword ? "text" : "password"}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    submit();
                  }
                }}
              />
              <InputRightElement hidden={loading}>
                <Box
                  className="flex cursor-pointer items-center justify-center rounded-lg bg-gray-200 p-2 transition-all hover:bg-gray-300"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Box>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>Contraseña inválida</FormErrorMessage>
          </FormControl>
          <Divider className="py-1" />
          <Button
            isLoading={loading}
            onClick={submit}
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
