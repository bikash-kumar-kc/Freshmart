"use client";
import { authservice } from "@/src/lib/api calls/client/auth/auth";
import { useMutation } from "@tanstack/react-query";

const useResendOtp = () => {
  return useMutation({
    mutationFn: authservice.resendOtp,
  });
};

export default useResendOtp;
