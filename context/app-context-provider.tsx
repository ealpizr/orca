import { useEffect, useState } from "react";
import { AppContextType, ComponentWithChildren } from "~/types";
import AppContext from "./app-context";

const DEFAULT_VALUE: AppContextType = {
  EDUSAPIToken: null,
  user: null,
};

export default function AppContextProvider({
  children,
}: ComponentWithChildren) {
  const [appContext, setAppContext] = useState<AppContextType>(DEFAULT_VALUE);

  async function getToken() {
    const response = await fetch("/api/token");
    if (response.status !== 200) {
      throw new Error("Could not get token");
    }

    const token = await response.text();

    setAppContext((p) => {
      return {
        ...p,
        EDUSAPIToken: token,
      };
    });
  }

  useEffect(() => {
    getToken();
  }, []);

  return (
    <AppContext.Provider value={{ appContext, setAppContext }}>
      {children}
    </AppContext.Provider>
  );
}
