"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "../../lib/serverAction";
import { useRouter } from "next/navigation";

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },

    resolver: zodResolver(schemaForRegister),
  });

  const handleSubmitHandler = async (data: IREGISTERTYPES) => {
    try {
      const user = await registerUser(data);
      console.log("User created successfully! userId: ", user.id);
      router.push("/login");
      reset();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Failed to create user ! msg: ", error.message);
        return;
      }
      console.log(error);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center text-white bg-gray-900">
      <div className="w-full flex flex-col items-center gap-4">
        <form
          onSubmit={handleSubmit(handleSubmitHandler)}
          className="w-full max-w-md"
        >
          <div className="w-full flex flex-col  gap-y-4 px-6 py-6 rounded-xl border border-cyan-400 hover:border-cyan-500 transition-colors">
            <h2 className="text-xl font-bold text-center">Create Account</h2>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm text-gray-200">
                Email
              </label>
              <input
                type="text"
                id="email"
                {...register("email")}
                className="w-full bg-transparent border border-cyan-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder:text-gray-400"
              />
              <p className="text-red-400 text-xs">
                {errors.email?.message ?? ""}
              </p>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm text-gray-200">
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password")}
                className="w-full bg-transparent border border-cyan-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400 text-white"
              />
              <p className="text-red-400 text-xs">
                {errors.password?.message ?? ""}
              </p>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirmPassword"
                className="text-sm text-gray-200"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword")}
                className="w-full bg-transparent border border-cyan-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400 text-white"
              />
              <p className="text-red-400 text-xs">
                {errors.confirmPassword?.message ?? ""}
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
            >
              Register
            </button>
          </div>
        </form>

        {/* Login link */}
        <p className="text-gray-300 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-cyan-300 hover:text-cyan-400 underline transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
