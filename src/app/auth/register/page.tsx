"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { getLocally, saveLocally } from "@/src/lib/localstorage";
import { toast } from "react-toastify";
import { useState } from "react";
import { registerUser } from "@/src/lib/server actions/auth.server.action";

const schemaForRegister = z
  .object({
    email: z.string().email("Please enter a valid email addresss"),
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

export type IREGISTERTYPES = z.infer<typeof schemaForRegister>;

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const localAuth = getLocally("auth");
  let localEmail;
  let localPassword;
  if (localAuth) {
    localEmail = localAuth.email;
    localPassword = localAuth.password;
  }
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: localEmail ?? "",
      password: localPassword ?? "",
      confirmPassword: "",
    },
    resolver: zodResolver(schemaForRegister),
  });

  const handleSubmitHandler = async (data: IREGISTERTYPES) => {
    setLoading(true);
    try {
      const user = await registerUser(data);
      console.log("User created successfully! userId: ", user.id);
      saveLocally({
        type: "auth",
        data: { auth: { email: data.email, password: data.password } },
      });
      router.push("/auth/login");
      reset();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Failed to create user ! msg: ", error.message);
        toast.error(error.message);
        return;
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Left: Form panel ───────────────────────────────────────────── */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-8 sm:px-12 bg-amber-50">
        {/* Logo / brand name */}
        <div className="mb-10 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🌿</span>
            <span className="text-lg font-bold text-green-700 tracking-wider">
              FRESHMART
            </span>
          </div>
          <p className="text-gray-400 text-sm">Create your account</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleSubmitHandler)}
          className="flex flex-col gap-5"
        >
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              placeholder="enter your email..."
              {...register("email")}
              autoComplete={"off"}
              className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
            {errors.email?.message && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="enter your password..."
              {...register("password")}
              autoComplete={"off"}
              className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
            {errors.password?.message && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="confirm your password"
              {...register("confirmPassword")}
              autoComplete={"off"}
              className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
            {errors.confirmPassword?.message && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-semibold py-2.5 rounded-sm transition-colors duration-200 mt-1"
          >
            {loading ? "loading..." : " Create Account"}
          </button>
        </form>

        {/* Login link */}
        <p className="text-gray-500 text-sm mt-6 text-center">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
};

export default Page;
