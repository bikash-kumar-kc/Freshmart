import React from "react";
import WrappedRedux from "./wrappedRedux";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <WrappedRedux>{children}</WrappedRedux>;
};

export default layout;
