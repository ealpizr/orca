"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import Spinner from "~/components/spinner";
import AppContext from "~/context/app-context";

export default function Page() {
  const { appContext } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    if (appContext.user === null) {
      router.push("/login");
    }
  }, []);

  return appContext.user !== null ? (
    <h1>Hello {appContext.user.fullName}</h1>
  ) : (
    <Spinner />
  );
}
