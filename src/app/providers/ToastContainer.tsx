"use client";
import React from "react";
import { ToastContainer } from "react-toastify";

const ToastContainerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div>
      {children}
      <ToastContainer />
    </div>
  );
};

export default ToastContainerProvider;
