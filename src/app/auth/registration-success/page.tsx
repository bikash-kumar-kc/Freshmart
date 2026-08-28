"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function RegistrationSuccess() {
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const router = useRouter();

  const onVerifyClick = () => {
    if (!email) {
      return;
    }

    router.push(`auth/verify-otp?email=${encodeURIComponent(email)}`);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
      <div className="w-full max-w-md rounded-[10px] bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>

          <p className="mb-6 text-center text-[13px] leading-6 tracking-wider text-gray-500">
            Your vendor application has been successfully registered.
            <br />
            An OTP has been sent to your email for verification.
          </p>

          <Button
            className="w-full rounded-[10px] bg-green-600 py-6 text-white tracking-wider transition-all duration-200 hover:bg-green-400 hover:shadow-md"
            onClick={onVerifyClick}
          >
            Verify Email
          </Button>
        </div>
      </div>
    </div>
  );
}

const page = () => {
  return (
    <Suspense fallback={"loading..."}>
      <RegistrationSuccess />
    </Suspense>
  );
};

export default page;
