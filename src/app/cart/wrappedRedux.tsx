"use client";
import React from "react";
import ReduxProvider from "../providers/ReduxProvider";
import { SessionProvider } from "next-auth/react";

const WrappedRedux = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ReduxProvider>{children}</ReduxProvider>
    </SessionProvider>
  );
};

export default WrappedRedux;
