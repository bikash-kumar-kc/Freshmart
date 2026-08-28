"use client";

import { Suspense, useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

import { toast } from "react-toastify";
import { AUTH_CONSTANT } from "@/src/utils/auth.constant";
import useVerifyOtp from "@/src/hooks/auth/useVerifyOtp";
import useResendOtp from "@/src/hooks/auth/useResendOtp";
import { useRouter, useSearchParams } from "next/navigation";

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;

  return `${m}:${s.toString().padStart(2, "0")}`;
}

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [rateLimit, setRateLimit] = useState(false);

  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(
    AUTH_CONSTANT.OTP_LIFETIME_SECONDS,
  );

  const [resendCooldown, setResendCooldown] = useState(
    AUTH_CONSTANT.RESEND_COOLDOWN_SECONDS,
  );

  const verifyOtp = useVerifyOtp();
  const resendOtp = useResendOtp();

  const isExpired = secondsLeft <= 0;
  const canResend = resendCooldown <= 0;

  useEffect(() => {
    setSecondsLeft(AUTH_CONSTANT.OTP_LIFETIME_SECONDS);
    setResendCooldown(AUTH_CONSTANT.RESEND_COOLDOWN_SECONDS);
    setOtp("");
    setRateLimit(false);
  }, []);

  useEffect(() => {
    if (isExpired) return;

    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isExpired]);

  useEffect(() => {
    if (canResend) return;

    const interval = setInterval(() => {
      setResendCooldown((s) => Math.max(0, s - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [canResend]);

  const handleVerify = () => {
    if (!otp || !email) return;

    verifyOtp.mutate(
      {
        email,
        otp,
      },
      {
        onSuccess: () => {
          toast.success("Your email is verified successfully.");
          router.push("/auth/login");
        },

        onError: (error: any) => {
          const status = error?.response?.status;

          if (status === 400) {
            setOtp("");
            toast.error("OTP not matched.");
            return;
          }

          if (status === 429) {
            setRateLimit(true);
            toast.error("You have to wait a few minutes before trying again!");
            return;
          }

          toast.error("Failed to verify OTP.");
        },
      },
    );
  };

  const handleResend = () => {
    if (!email) return;

    resendOtp.mutate(
      {
        email: email,
      },
      {
        onSuccess: () => {
          setSecondsLeft(AUTH_CONSTANT.OTP_LIFETIME_SECONDS);
          setResendCooldown(AUTH_CONSTANT.RESEND_COOLDOWN_SECONDS);
          setOtp("");
          setRateLimit(false);

          toast.success("A new code has been sent.");
        },

        onError: (error: any) => {
          const status = error?.response?.status;

          if (status === 429) {
            setRateLimit(true);
            toast.error("You have to wait a few minutes before trying again!");
            return;
          }

          toast.error("Failed to generate OTP.");
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4  transition-all">
      <div className="w-full max-w-md rounded-[10px] bg-white p-8 shadow-sm hover:shadow-md">
        <div className="space-y-1">
          <h1 className="text-center text-2xl font-semibold tracking-wider text-gray-700">
            Verify your email
          </h1>

          <p className="text-center text-[12px] leading-6 tracking-wider text-muted-foreground">
            Enter the 6-digit verification code sent to your email.
          </p>
        </div>

        <div className="flex justify-center py-6">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            disabled={isExpired || verifyOtp.isPending}
          >
            <InputOTPGroup className="gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="
                    h-12
                    w-12
                    rounded-[10px]
                    border
                    bg-primary/5
                    text-lg
                    text-primary
                    outline-none
                    transition-all
                    duration-200
                    data-[active=true]:border-green-400
                  "
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <p
          className={`mb-4 text-center text-xs tracking-wide ${
            isExpired ? "text-rose-500" : "text-gray-500"
          }`}
        >
          {isExpired
            ? "Code expired — request a new one"
            : `Expires in ${formatTime(secondsLeft)}`}
        </p>

        <div className="flex w-full items-center gap-2">
          <Button
            className="
              h-12
              flex-1
              rounded-[6px]
              bg-green-600
              text-base
              font-medium
              tracking-wider
              text-white
              transition-all
              duration-200
              hover:bg-green-700
              hover:shadow-md
              disabled:opacity-60
            "
            disabled={
              rateLimit || isExpired || otp.length < 6 || verifyOtp.isPending
            }
            onClick={handleVerify}
          >
            {verifyOtp.isPending ? "Verifying..." : "Verify OTP"}
          </Button>

          {canResend && (
            <Button
              className="
                h-12
                flex-1
                rounded-[6px]
                border
                border-gray-200
                bg-cta
                text-base
                font-medium
                tracking-wider
                text-gray-700
                transition-colors
                duration-200
                hover:border-gray-400
                disabled:opacity-60
              "
              disabled={rateLimit || resendOtp.isPending}
              onClick={handleResend}
            >
              {resendOtp.isPending ? "Sending..." : "Resend OTP"}
            </Button>
          )}
        </div>

        {!canResend && (
          <p className="mt-2 text-center text-xs text-gray-400">
            You can resend in {formatTime(resendCooldown)}
          </p>
        )}
      </div>
    </div>
  );
}

const page = () => {
  return (
    <Suspense fallback={"loading..."}>
      <VerifyEmail />
    </Suspense>
  );
};

export default page;
