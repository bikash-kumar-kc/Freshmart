'use client'
import usePasswordReset from "@/src/hooks/auth/usePasswordReset";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

const schemaForRegister = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

export type ISignupTypes = z.infer<typeof schemaForRegister>;

const PasswordReset = () => {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const {
    mutateAsync: passwordReset,
    isPending: loading,
    isError,
  } = usePasswordReset();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(schemaForRegister),
  });

  const handleSubmitHandler = async (data: ISignupTypes) => {
    try {
      if (!token?.trim() || !email?.trim()) {
        toast.error("Token or email is missing");
        return;
      }
      await passwordReset({
        newPassword: data.password,
        token,
        email,
      });
      reset();
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Failed to reset passwordgit  ", error.message);
        toast.error("Failed to reset password ! Try again");
        return;
      }
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col justify-center lg:items-center min-h-screen px-8 sm:px-12 bg-amber-50 shadow-lg">
        <div className=" w-full md:w-[40%]  rounded-lg shadow-lg p-8">
          <div className="mb-10 flex flex-col items-center w-full">
            <Link href={"/"}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🌿</span>
                <span className="text-lg font-bold text-green-700 tracking-wider">
                  FRESHMART
                </span>
              </div>
            </Link>
          </div>

          <form
            onSubmit={handleSubmit(handleSubmitHandler)}
            className="flex flex-col gap-5 "
          >
            {/* <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                placeholder="Enter your email..."
                {...register("email")}
                autoComplete={"off"}
                className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
              {errors.email?.message && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div> */}

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="new-password"
                  className="text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="new-password"
                  placeholder="Enter your password..."
                  {...register("password")}
                  className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 pr-11 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition placeholder:text-gray-300"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) =>
                      getValues("password").trim() ? !prev : prev,
                    )
                  }
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password?.message && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="confirm-new-password"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-new-password"
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  autoComplete={"off"}
                  className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition placeholder:text-gray-300"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) =>
                      getValues("confirmPassword").trim() ? !prev : prev,
                    )
                  }
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {errors.confirmPassword?.message && (
                <p className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-semibold py-2.5 rounded-sm transition-colors duration-200 mt-1"
            >
              {loading ? "In process..." : "Password Reset"}
            </button>
          </form>

          {isError && (
            <p className="text-red-500 text-sm mt-6 text-center">
              Failed to reset?{" "}
              <Link
                href="/login"
                className="text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                Try again
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default PasswordReset;
