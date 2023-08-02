"use client";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  As,
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import InputMask from "react-input-mask";
import UserPickerModal from "~/components/user-picker-modal";
import AppContext from "~/context/app-context";
import OrcaLogo from "~/public/orca.svg";
import { loginSchema } from "~/schemas";
import AuthService from "~/services/auth-service";
import type { UserData } from "~/types";

export default function Page() {
  const { appContext, setAppContext } = useContext(AppContext);
  const toast = useToast({ position: "top" });
  const router = useRouter();

  const idInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const [userPickerState, setUserPickerState] = useState<{
    isOpen: boolean;
    users: UserData[];
  }>({
    isOpen: false,
    users: [],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    id?: string[] | undefined;
    password?: string[] | undefined;
  }>({});

  useEffect(() => {
    if (appContext.user !== null) {
      router.push("/");
    }
  }, [appContext.user, router]);

  const toggleShowPassword = () => setShowPassword((p) => !p);

  const clearFieldErrors = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors((p) => {
      return {
        ...p,
        [e.target.name]: undefined,
      };
    });
  };

  const setActiveUser = (u: UserData) => {
    setAppContext((p) => {
      return {
        user: u,
      };
    });
  };

  async function submit() {
    const validationSchema = loginSchema.safeParse({
      id: idInputRef.current?.value.replaceAll("-", ""),
      password: passwordInputRef.current?.value,
    });

    if (!validationSchema.success) {
      setErrors(validationSchema.error.flatten().fieldErrors);
      return;
    }

    try {
      setLoading(true);
      const userData = await AuthService.login(validationSchema.data);

      if (userData.length === 1 && userData[0]) {
        setActiveUser(userData[0]);
      } else {
        setUserPickerState({
          isOpen: true,
          users: userData,
        });
      }
    } catch (e) {
      setLoading(false);
      toast({
        title: "Error",
        description: (e as Error).message,
        status: "error",
      });
    }
  }

  return (
    <Stack h="100%">
      <Center h="100%">
        <UserPickerModal {...userPickerState} onPick={setActiveUser} />

        <Stack className="max-w-[270px]">
          <Image
            alt="Orca's application logo"
            className="mx-auto w-[200px]"
            src={OrcaLogo}
          />
          <Divider className="py-1" />
          <FormControl isInvalid={errors.id != undefined}>
            <FormLabel>Identificación</FormLabel>
            <Input
              autoComplete="off"
              disabled={loading}
              onChange={clearFieldErrors}
              as={InputMask as As}
              mask="*-****-****"
              maskChar={null}
              name="id"
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
                onChange={clearFieldErrors}
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
            className="text-[var(--chakra-colors-linkedin-500)] underline"
          >
            ealpizar
          </a>
        </p>
      </footer>
    </Stack>
  );
}
