"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { getLocally } from "@/src/lib/localstorage/localstorage";
import { toast } from "react-toastify";
import { Suspense, useEffect, useState } from "react";
import AuthContextProvider, { useAuthContext } from "@/src/context/AuthContext";

const schemaForSession = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export type ISESSIONTYPES = z.infer<typeof schemaForSession>;

const SignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { updateAuthStatus } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [localAuth, setLocalAuth] = useState<{
    email: string;
    password: string;
  } | null>(null);

  useEffect(() => {
    const auth = getLocally("auth") as { email: string; password: string };

    if (auth) {
      setLocalAuth(auth);
    }
  }, []);

  const localEmail = localAuth?.email ?? "kcbikash886@gmail.com";
  const localPassword = localAuth?.password ?? "123456789";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: localEmail ?? "", password: localPassword ?? "" },
    resolver: zodResolver(schemaForSession),
  });

  const handleSubmitHandler = async (data: ISESSIONTYPES) => {
    setLoading(true);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      toast.error(
        result?.error === "CredentialsSignin"
          ? "Invalid Credentials "
          : result?.error,
      );
      setLoading(false);
      if (redirect) {
        router.push("/auth/register?redirect=/cart");
        return;
      }
      router.push("/auth/register");
      return;
    }

    setLoading(false);

    if (redirect) {
      router.push(`${redirect}`);
      return;
    }
    updateAuthStatus({ isLoggedIn: true, email: data.email, userId: "" });
    router.push("/");
  };

  return (
    <>
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-8 sm:px-12 bg-amber-50">
        <div className="mb-10 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🌿</span>
            <span className="text-lg font-bold text-green-700 tracking-wider">
              FRESHMART
            </span>
          </div>
          <p className="text-gray-400 text-sm">Sign in to your account</p>
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
              className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
            {errors.email?.message && (
              <p className="text-red-500 text-xs text-center">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-green-600 hover:text-green-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              placeholder="enter your password..."
              {...register("password")}
              className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
            {errors.password?.message && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-semibold py-2.5 rounded-sm transition-colors duration-200 mt-1"
          >
            {loading ? "loading..." : "Sign in"}
          </button>
        </form>

        {/* Register link */}
        <p className="text-gray-500 text-sm mt-6 text-center">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </>
  );
};
const Page = () => {
  return (
    <Suspense fallback={<p>Signin form loading...</p>}>
        <SignInForm />
    </Suspense>
  );
};

export default Page;
