"use client";

import { useEffect, useState } from "react";
import { AppContextType, ComponentWithChildren, UserData } from "~/types";
import AppContext from "./app-context";

const DEFAULT_VALUE: AppContextType = {
  user: null,
};

export default function AppContextProvider({
  children,
}: ComponentWithChildren) {
  const [appContext, setAppContext] = useState<AppContextType>(DEFAULT_VALUE);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData === null) return;

    const user: UserData = JSON.parse(userData);

    setAppContext({
      user,
    });
  }, []);

  return (
    <AppContext.Provider value={{ appContext, setAppContext }}>
      {children}
    </AppContext.Provider>
  );
}
