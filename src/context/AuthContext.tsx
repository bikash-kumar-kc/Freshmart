
"use client"
import { createContext, useContext, useState } from "react";

interface IUserAuthType {
  isLoggedIn: boolean;
  userId: string;
  email: string;
}

interface AuthContextValue {
  user: IUserAuthType;
  updateAuthStatus: (user: IUserAuthType) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUserAuthType>({
    isLoggedIn: false,
    userId: "",
    email: "",
  });

  const updateAuthStatus = ({ isLoggedIn, userId, email }: IUserAuthType) => {
    console.log("auth status updated !")
    setUser({
      isLoggedIn,
      userId,
      email,
    });
  };

  const value = {
    user,
    updateAuthStatus,
  };

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthContextProvider");
  }

  return {
    user: context.user,
    updateAuthStatus: context.updateAuthStatus,
  };
};

export default AuthContextProvider;
