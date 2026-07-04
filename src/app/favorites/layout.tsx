import React from "react";
import WrappedRedux from "./WrappedRedux";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <WrappedRedux>{children}</WrappedRedux>;
};

export default Layout;
