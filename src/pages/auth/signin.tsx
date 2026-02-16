import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  EyeIcon as Eye,
  EyeSlashIcon as EyeSlash,
  CheckIcon as Check,
  LockKeyIcon as Lock,
  EnvelopeIcon as Envelope,
  SparkleIcon as Sparkle,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import { useAuth } from "@/context/AuthContext";

// -------------------- Validation --------------------
const schema = zod.object({
  email: zod
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Enter a valid email address" }),

  password: zod
    .string()
    .min(1, { message: "Password is required" })
    .max(64, { message: "Password must not exceed 64 characters" }),
});

export type Values = zod.infer<typeof schema>;
const defaultValues = { email: "", password: "" } satisfies Values;

// -------------------- Page --------------------
export function Page(): React.JSX.Element {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  React.useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/copilot", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<Values>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: Values) => {
    setIsPending(true);
    try {
      const response = await login(values.email, values.password);
      if (response.success) {
        navigate("/copilot");
      } else {
        setError("root", {
          type: "server",
          message: response?.message || "Invalid credentials",
        });
      }
    } catch {
      setError("root", {
        type: "server",
        message: "An error occurred. Please try again.",
      });
    } finally {
      setIsPending(false);
    }
  };

  const benefits = [
    "One click apply using AI copilot",
    "Get relevant job recommendations",
    "Track application status in real-time",
  ];

  return (
    <div className="h-[calc(100vh-4.1rem)] overflow-hidden flex items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">

        {/* LEFT PANEL */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-violet-700 p-10 flex-col justify-between relative">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
              <Sparkle size={16} weight="fill" className="text-yellow-300" />
              <span className="text-white text-sm font-medium">Top Rated Job AI</span>
            </div>

            <h1 className="text-4xl font-bold text-white leading-tight mb-3">
              Supercharge your <br />
              <span className="text-indigo-200">job search</span> today.
            </h1>

            <p className="text-indigo-100 text-base">
              Join thousands of professionals landing their dream jobs faster with our automated copilot.
            </p>
          </div>

          <div className="space-y-3">
            {benefits.map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                  <Check size={16} weight="bold" className="text-white" />
                </div>
                <span className="text-white text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-indigo-200 opacity-70">
            © 2024 Copilot Job Search. All rights reserved.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">

            {/* HEADER */}
            <div className="mb-6 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Lock size={22} weight="duotone" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                <p className="text-gray-500 text-sm">Please enter your details to sign in.</p>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative mt-1">
                      <input
                        {...field}
                        className={`w-full px-4 py-3 rounded-xl border bg-gray-50 outline-none focus:ring-2
                          ${errors.email
                            ? "border-red-300 focus:ring-red-100"
                            : "border-gray-200 focus:ring-indigo-100"}`}
                        placeholder="john@example.com"
                      />
                      <Envelope size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                  </div>
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative mt-1">
                      <input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className={`w-full px-4 py-3 rounded-xl border bg-gray-50 outline-none focus:ring-2 pr-10
                          ${errors.password
                            ? "border-red-300 focus:ring-red-100"
                            : "border-gray-200 focus:ring-indigo-100"}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                  </div>
                )}
              />

              {errors.root && (
                <p className="text-sm text-red-600">{errors.root.message}</p>
              )}

              <button
                type="submit"
                disabled={!isValid || isPending}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                {isPending ? "Logging in..." : "Sign In"}
              </button>
            </form>

            <div className="my-6 text-center text-sm text-gray-500">
              Or continue with
            </div>

            <button className="w-full py-3 rounded-xl border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" />
              Sign in with Google
            </button>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <button
                onClick={() => navigate("/auth/signup")}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Create an account
              </button>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
