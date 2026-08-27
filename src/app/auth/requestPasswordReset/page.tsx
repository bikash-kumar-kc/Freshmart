"use client";

import usePasswordRequest from "@/src/hooks/auth/useRequestPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

const schemaForSession = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ILoginType = z.infer<typeof schemaForSession>;

const ReqeustForPasswordReset = () => {
  const {
    mutateAsync: RequestPasswordReset,
    isPending: loading,
    isSuccess,
  } = usePasswordRequest();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "" },
    resolver: zodResolver(schemaForSession),
  });

  const handleSubmitHandler = async (data: ILoginType) => {
    try {
      await RequestPasswordReset({ email: data.email });
      toast.success("Request For Password Reset Successfully.");
      reset();
    } catch(error) {
        console.log(error)
      toast.error("Failed to send Password Reset");
    }
  };

  return (
    <>
      <div className="w-full  flex flex-col justify-center items-center shadow-lg min-h-screen px-8 sm:px-12 bg-amber-50">
        <div className=" w-full md:w-[40%]  rounded-lg shadow-lg p-8 ">
          <div className="mb-10 flex flex-col items-center">
            <Link href={"/"}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🌿</span>
                <span className="text-lg font-bold text-green-700 tracking-wider">
                  FRESHMART
                </span>
              </div>
            </Link>
            {/* <p className="text-gray-400 text-sm">Sign in to your account</p> */}
          </div>

          <form
            onSubmit={handleSubmit(handleSubmitHandler)}
            className="flex flex-col gap-5 w-full"
          >
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
                placeholder="Enter your email..."
                {...register("email")}
                className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition placeholder:text-gray-400"
              />
              {errors.email?.message && (
                <p className="text-red-500 text-xs text-center">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* <div className="flex flex-col gap-1.5"> */}
            {/* <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-green-600 hover:text-green-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div> */}

            {/* <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password..."
                  {...register("password")}
                  className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 pr-11 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition placeholder:text-gray-400"
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
              )} */}
            {/* </div> */}

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-semibold py-2.5 rounded-sm transition-colors duration-200 mt-1"
            >
              {loading ? "Requesting..." : "Request Password Reset"}
            </button>
          </form>

          {isSuccess && (
            <p className="text-blue-500 text-[12px] mt-6 text-center">
              Check your mail and click on Password Reset for further steps.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ReqeustForPasswordReset;
