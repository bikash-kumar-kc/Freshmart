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
      console.error(result.error, "error");
      router.push("/register");
      return;
    }

    console.log("Login successful !", "success");

    router.push("/");
  };

  return (
    <div className="w-full  min-h-screen  flex justify-center items-center bg-black text-white ">
      <div className="w-full max-w-md flex flex-col justify-center px-2 py-4 items-center rounded-2xl gap-3 border">
        <h1 className="font-bold text-purple-700">Log In</h1>
        <form
          onSubmit={handleSubmit(handleSubmitHandler)}
          className=" w-full max-w-sm "
        >
          <div className="w-full max-w-sm flex flex-col gap-y-3 px-3 py-2 rounded-[10px] border-cyan-400 hover:border-cyan-500">
            <div className="w-full max-w-md flex flex-col px-2 gap-y-1">
              <label htmlFor="name" className="font-serif font-semibold text-gray-400 tracking-wide text-[15px]">Email:</label>
              <input type="text" id="Email" {...register("email")} className="px-2 py-1 rounded border-2 border-gray-400 text-gray-300 focus:border-white  outline-0" />
              <p className="text-red-700">{errors.email?.message ?? ""}</p>
            </div>

            <div className="w-full max-w-md flex flex-col px-2 gap-1">
              <label htmlFor="password" className="font-serif font-semibold text-gray-400 tracking-wide text-[15px]">Password: </label>
              <input type="password" id="password" {...register("password")} className="px-2 py-1 rounded border-2 border-gray-400 text-gray-300 focus:border-white  outline-0" />
              <p className="text-red-700">{errors.password?.message ?? ""}</p>
            </div>

            <div className="w-full flex justify-center items-center py-2 ">
              <button type="submit" className="border-2 px-2 py-1 rounded text-gray-400 active:text-white">Login In</button>
            </div>
          </div>
        </form>

        <div>
          <p>
            Create new account?{" "}
            <Link href={"/register"} className="text-purple-700">
              Register
            </Link>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
