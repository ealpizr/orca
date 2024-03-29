"use client";

import { Dispatch, SetStateAction, createContext } from "react";
import { AppContextType } from "~/types";

export default createContext<{
  appContext: AppContextType;
  setAppContext: Dispatch<SetStateAction<AppContextType>>;
}>({
  appContext: { user: null },
  setAppContext: () => {},
});
