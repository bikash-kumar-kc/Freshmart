// "use client";

// import Link from "next/link";
// import { useForm } from "react-hook-form";
// import z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";

// const schemaForSession = z.object({
//   email: z.string().email("Please enter a valid email addresss"),
//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters")
//     .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
//     .regex(/[a-z]/, "Password must contain at least one lowercase letter")
//     .regex(/[0-9]/, "Password must contain at least one number"),
// });

// export type ISESSIONTYPES = z.infer<typeof schemaForSession>;

// const Page = () => {
//   const router = useRouter();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       email: "",
//       password: "",
//     },

//     resolver: zodResolver(schemaForSession),
//   });

//   const handleSubmitHandler = async (data: ISESSIONTYPES) => {
//     const result = await signIn("credentials", {
//       email: data.email,
//       password: data.password,
//       redirect: false,
//     });

//     if (result?.error) {
//       console.log(result.error, "error");
//       router.push("/register");
//       return;
//     }

//     console.log("Login successful !", "success");

//     router.push("/");
//   };

//   return (
//      <div className="w-full min-h-screen flex justify-center items-center text-white bg-gray-900">
//   <div className="w-full flex flex-col items-center gap-4">

//     <form onSubmit={handleSubmit(handleSubmitHandler)} className="w-full max-w-md">
//       <div className="w-full flex flex-col  gap-y-4 px-6 py-6 rounded-xl border border-cyan-400 hover:border-cyan-500 transition-colors">

//         <h2 className="text-xl font-bold text-center">Log In</h2>

//         {/* Email */}
//         <div className="flex flex-col gap-1">
//           <label htmlFor="email" className="text-sm text-gray-200">Email</label>
//           <input
//             type="text"
//             id="email"
//             {...register("email")}
//             className="w-full bg-transparent border border-cyan-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder:text-gray-400"
//           />
//           <p className="text-red-400 text-xs">{errors.email?.message ?? ""}</p>
//         </div>

//         {/* Password */}
//         <div className="flex flex-col gap-1">
//           <label htmlFor="password" className="text-sm text-gray-200">Password</label>
//           <input
//             type="password"
//             id="password"
//             {...register("password")}
//             className="w-full bg-transparent border border-cyan-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400 text-white"
//           />
//           <p className="text-red-400 text-xs">{errors.password?.message ?? ""}</p>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
//         >
//           Log In
//         </button>

//       </div>
//     </form>

//     {/* Login link */}
//     <p className="text-gray-300 text-sm">
//       Create new account?{" "}
//       <Link href="/register" className="text-cyan-300 hover:text-cyan-400 underline transition-colors">
//         Sign up
//       </Link>
//     </p>

//   </div>
// </div>
//   );
// };

// export default Page;

"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

const Page = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(schemaForSession),
  });

  const handleSubmitHandler = async (data: ISESSIONTYPES) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      router.push("/auth/register");
      return;
    }

    router.push("/");
  };

  return (
    <>
      {/* ── Left: Image panel (hidden on mobile) ───────────────────────── */}
     
      {/* ── Right: Form panel ───────────────────────────────────────────── */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-8 sm:px-12 bg-amber-50">
        {/* Logo / brand name */}
        <div className="mb-10 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🌿</span>
            <span className="text-lg font-bold text-green-700 tracking-tight">
              YourBrandName
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
            Sign in
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

export default Page;
