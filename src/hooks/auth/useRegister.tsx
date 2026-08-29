"use client";
import { authservice } from "@/src/lib/api calls/client/auth/auth";
import { useMutation } from "@tanstack/react-query";

const useRegister = () => {
  return useMutation({
    mutationFn: authservice.createAccount,
  });
};

export default useRegister;
