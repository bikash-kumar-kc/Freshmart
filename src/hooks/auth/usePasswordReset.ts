
'use client'
import { authservice } from "@/src/lib/api calls/client/auth/auth";
import { useMutation } from "@tanstack/react-query";

const usePasswordReset = () => {
  return useMutation({
    mutationFn: authservice.passwordReset,
  });
};

export default usePasswordReset;
