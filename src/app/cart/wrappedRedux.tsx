"use client"
import React from "react";
import ReduxProvider from "../providers/ReduxProvider";

const WrappedRedux = ({ children }: { children: React.ReactNode }) => {
  return <ReduxProvider>{children}</ReduxProvider>;
};

export default WrappedRedux;
