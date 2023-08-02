import { useState } from "react";
import { AppContextType, ComponentWithChildren } from "~/types";
import AppContext from "./app-context";

const DEFAULT_VALUE: AppContextType = {
  user: null,
};

export default function AppContextProvider({
  children,
}: ComponentWithChildren) {
  const [appContext, setAppContext] = useState<AppContextType>(DEFAULT_VALUE);

  return (
    <AppContext.Provider value={{ appContext, setAppContext }}>
      {children}
    </AppContext.Provider>
  );
}
