import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCircleIcon as User,
  EyeIcon as Eye,
  EyeSlashIcon as EyeSlash,
  SparkleIcon as Sparkle,
  CheckIcon as Check,
  EnvelopeIcon as Envelope,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import { signUpUser } from "@/lib/auth.service";

// Zod validation schema
const schema = zod.object({
  email: zod
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Enter a valid email address" }),
  first_name: zod
    .string()
    .trim()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must not exceed 50 characters" }),
  last_name: zod
    .string()
    .trim()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must not exceed 50 characters" }),
  password: zod
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(64, { message: "Password must not exceed 64 characters" })
    .regex(/[A-Z]/, { message: "Password must include at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must include at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must include at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must include at least one special character",
    }),
  // job_titles: zod
  //   .array(zod.string())
  //   .min(1, { message: "At least one job title is required" }),
  // work_location: zod
  //   .array(zod.string())
  //   .min(1, { message: "At least one location is required" }),
});

export type Values = zod.infer<typeof schema>;

const defaultValues = {
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  // job_titles: [],
  // work_location: [],
} satisfies Values;

export function Page(): React.JSX.Element {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);

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
      const payload = {
        email: values.email,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
        // preferences: {
        //   job_titles: values.job_titles,
        //   work_location: values.work_location,
        // },
      };

      const response = await signUpUser(payload);

      if (response.success) {
        navigate("/auth/signin");
      } else {
        setError("root", {
          type: "server",
          message: response.message || "Signup failed",
        });
      }
    } catch (error) {
      setError("root", {
        type: "server",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Google sign up");
  };

  const benefits = [
    {
      icon: <Check size={20} weight="bold" className="text-white" />,
      text: "Join 10,000+ professionals",
    },
    {
      icon: <Check size={20} weight="bold" className="text-white" />,
      text: "Automated job searching 24/7",
    },
    {
      icon: <Check size={20} weight="bold" className="text-white" />,
      text: "Smart resume optimization",
    }
  ];

  return (
    <div className="h-[calc(100vh-4.1rem)] flex items-center justify-center p-4 bg-gray-50/50 overflow-hidden">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">

        {/* Left Side - Brand & Graphics */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-indigo-600 to-purple-700 p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 mb-8">
              <Sparkle weight="fill" className="text-yellow-300" size={16} />
              <span className="text-white text-sm font-medium">Free during beta</span>
            </div>

            <h1 className="text-4xl font-bold text-white mb-2 leading-tight">
              Create your <br />
              <span className="text-indigo-200">account</span> now.
            </h1>
            <p className="text-indigo-100 text-lg opacity-90">
              Set up your profile in minutes and let our AI handle your job search.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  {benefit.icon}
                </div>
                <span className="text-white font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className="relative z-10 pt-8 opacity-70 text-xs text-indigo-200">
            By signing up, you agree to our Terms & Privacy Policy.
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full md:w-7/12 p-4 md:p-4 overflow-y-auto max-h-[calc(100vh-6rem)]">
          <div className="max-w-xl mx-auto w-full">
            <div className="mb-3">
              <h2 className="text-2xl font-bold text-gray-900">Get Started</h2>
              <p className="text-gray-500">
                Create your account to start automating your applications.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <Controller
                  name="first_name"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <div className="relative">
                        <input
                          {...field}
                          type="text"
                          className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2
                             ${errors.first_name ? 'border-red-300 focus:border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-600 focus:ring-indigo-50'}`}
                          placeholder="John"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <User size={18} />
                        </div>
                      </div>
                      {errors.first_name && <p className="text-sm text-red-500">{errors.first_name.message}</p>}
                    </div>
                  )}
                />

                {/* Last Name */}
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2
                          ${errors.last_name ? 'border-red-300 focus:border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-600 focus:ring-indigo-50'}`}
                        placeholder="Doe"
                      />
                      {errors.last_name && <p className="text-sm text-red-500">{errors.last_name.message}</p>}
                    </div>
                  )}
                />
              </div>

              {/* Email */}
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                      <input
                        {...field}
                        type="email"
                        className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2
                           ${errors.email ? 'border-red-300 focus:border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-600 focus:ring-indigo-50'}`}
                        placeholder="john@example.com"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Envelope size={18} />
                      </div>
                    </div>
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                  </div>
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <div className="relative group">
                        <button
                          type="button"
                          aria-label="Password requirements"
                          className="w-4 h-4 rounded-full border border-gray-300 text-[10px] leading-none text-gray-500 flex items-center justify-center hover:border-indigo-400 hover:text-indigo-500 transition-colors"
                        >
                          i
                        </button>
                        <div className="pointer-events-none absolute z-20 left-1/2 -translate-x-1/2 top-6 w-72 rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          Use 8-64 characters with at least one uppercase letter, one lowercase letter, one number, and one special character.
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 pr-10
                           ${errors.password ? 'border-red-300 focus:border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-600 focus:ring-indigo-50'}`}
                        placeholder="Min 8 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                  </div>
                )}
              />
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <Controller
                  name="job_titles"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Job Titles</label>
                      <Autocomplete
                        multiple
                        freeSolo
                        options={jobTitleOptions}
                        value={value || []}
                        onChange={(_, newValue) => onChange(newValue)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              label={option}
                              {...getTagProps({ index })}
                              size="small"
                              className="bg-indigo-50 text-indigo-700 border border-indigo-100 font-medium"
                              deleteIcon={<span className="text-indigo-400 hover:text-indigo-600 px-1">×</span>}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <div ref={params.InputProps.ref} className="relative">
                            <input
                              {...params.inputProps}
                              className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 pl-10
                                  ${errors.job_titles ? 'border-red-300 focus:border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-600 focus:ring-indigo-50'}`}
                              placeholder={value?.length > 0 ? "" : "Select job titles"}
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                              <Briefcase size={18} />
                            </div>
                          </div>
                        )}
                      />
                      {errors.job_titles && <p className="text-sm text-red-500">{errors.job_titles.message}</p>}
                    </div>
                  )}
                />

                <Controller
                  name="work_location"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Locations</label>
                      <Autocomplete
                        multiple
                        freeSolo
                        options={locationOptions}
                        value={value || []}
                        onChange={(_, newValue) => onChange(newValue)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              label={option}
                              {...getTagProps({ index })}
                              size="small"
                              className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium"
                              deleteIcon={<span className="text-emerald-400 hover:text-emerald-600 px-1">×</span>}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <div ref={params.InputProps.ref} className="relative">
                            <input
                              {...params.inputProps}
                              className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 outline-none transition-all focus:bg-white focus:ring-2 pl-10
                                  ${errors.work_location ? 'border-red-300 focus:border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-600 focus:ring-indigo-50'}`}
                              placeholder={value?.length > 0 ? "" : "Select locations"}
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                              <MapPin size={18} />
                            </div>
                          </div>
                        )}
                      />
                      {errors.work_location && <p className="text-sm text-red-500">{errors.work_location.message}</p>}
                    </div>
                  )}
                />
              </div> */}
              {/* Error Alert */}
              {errors.root && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                  <div className="text-red-500 mt-0.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 9V14M12 17.5V18M12 3L2 21H22L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-sm text-red-600 font-medium">{errors.root.message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending || !isValid}
                className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isPending ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or sign up with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Sign up with Google
            </button>

            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/auth/signin")}
                className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-all"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
