"use client";
import { authservice } from "@/src/lib/api calls/client/auth/auth";
import { useMutation } from "@tanstack/react-query";

const useVerifyOtp = () => {
  return useMutation({
    mutationFn: authservice.verifyOtp,
  });
};

export default useVerifyOtp;
