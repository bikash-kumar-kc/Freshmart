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
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="black"
        icon={false}
      />
    </div>
  );
};

export default ToastContainerProvider;
