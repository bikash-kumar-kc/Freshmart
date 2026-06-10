"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const schemaForSession = z.object({
  email: z.string().email("Please enter a valid email addresss"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export type ISESSIONTYPES = z.infer<typeof schemaForSession>;

const Page = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    resolver: zodResolver(schemaForSession),
  });

  const handleSubmitHandler = async (data: ISESSIONTYPES) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      console.log(result.error, "error");
      router.push("/register");
      return;
    }

    console.log("Login successful !", "success");

    router.push("/");
  };

  return (
     <div className="w-full min-h-screen flex justify-center items-center text-white bg-gray-900">
  <div className="w-full flex flex-col items-center gap-4">

    <form onSubmit={handleSubmit(handleSubmitHandler)} className="w-full max-w-md">
      <div className="w-full flex flex-col  gap-y-4 px-6 py-6 rounded-xl border border-cyan-400 hover:border-cyan-500 transition-colors">

        <h2 className="text-xl font-bold text-center">Log In</h2>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm text-gray-200">Email</label>
          <input
            type="text"
            id="email"
            {...register("email")}
            className="w-full bg-transparent border border-cyan-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder:text-gray-400"
          />
          <p className="text-red-400 text-xs">{errors.email?.message ?? ""}</p>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm text-gray-200">Password</label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className="w-full bg-transparent border border-cyan-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400 text-white"
          />
          <p className="text-red-400 text-xs">{errors.password?.message ?? ""}</p>
        </div>

       
        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
        >
          Log In
        </button>

      </div>
    </form>

    {/* Login link */}
    <p className="text-gray-300 text-sm">
      Create new account?{" "}
      <Link href="/register" className="text-cyan-300 hover:text-cyan-400 underline transition-colors">
        Sign up
      </Link>
    </p>

  </div>
</div>
  );
};

export default Page;
