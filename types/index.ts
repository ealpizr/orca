export class APIError extends Error {
  message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}

export type ComponentWithChildren = {
  children: React.ReactNode;
};

export type AppContextType = {
  EDUSAPIToken: string | null;
  user: UserData | null;
};

export type UserData = {
  userId: number;
  fullName: string;
  gender: "F" | "M";
  healthCenterCode: number;
};
