'use client'

import { use, useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiLock, FiArrowRight } from "react-icons/fi";
import { useMutation } from "@tanstack/react-query";
import { newPasswordRequest } from "@/lib/axios/resetPasswordAxios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { MdFileDownloadDone } from "react-icons/md";
import { useTranslations } from "next-intl";
import { AuthModalContext } from "@/store/AuthModalContext";
import { z } from "zod";

const passwordRequirements = [
  { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
  { label: "One uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter", test: (pw: string) => /[a-z]/.test(pw) },
  { label: "One number", test: (pw: string) => /\d/.test(pw) },
  { label: "One special character", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
];

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "One uppercase letter")
    .regex(/[a-z]/, "One lowercase letter")
    .regex(/\d/, "One number")
    .regex(/[^A-Za-z0-9]/, "One special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordProps = {
  params: Promise<{ token: string }>;
};

const ResetPasswordPage = ({ params }: ResetPasswordProps) => {
  const t = useTranslations("resetPassword");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [incomingToken, setIncomingToken] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const { token } = use(params);

  const router = useRouter();
  const { openAuthModal } = useContext(AuthModalContext);

  useEffect(() => {
    setIncomingToken(token);
  }, [token]);

  const passwordsMatch = password === confirmPassword && password.length > 0;

  const { mutate: mutateRestPassword, isPending: isPendingRestpassword } =
    useMutation({
      mutationFn: newPasswordRequest,
      onSuccess: () => {
        setSuccess(true);
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const result = passwordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      // Show first error for each field
      const errors: { password?: string; confirmPassword?: string } = {};
      for (const issue of result.error.issues) {
        if (issue.path[0] === "password" && !errors.password) {
          errors.password = issue.message;
        }
        if (issue.path[0] === "confirmPassword" && !errors.confirmPassword) {
          errors.confirmPassword = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }
    mutateRestPassword({ newPassword: password, token: incomingToken });
  };

  function handleSuccessButton() {
    openAuthModal();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="pr-bg p-6 text-center">
            <div className="flex justify-center mb-4">
              <FiLock className="text-white text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              {success ? t("success.title") : t("title")}
            </h1>
            <p className="text-blue-100 mt-2">
              {success ? t("success.message") : t("description")}
            </p>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">
            {success ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="mb-6 text-center flex justify-center">
                  <MdFileDownloadDone size={90} className="pr-text" />
                </div>
                <button
                  onClick={handleSuccessButton}
                  className="inline-flex items-center justify-center px-6 py-3 pr-bg text-white font-medium rounded-lg transition-colors"
                >
                  {t("success.button")}
                  <FiArrowRight className="ml-2" />
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {error && (
                    <p className=" text-red-400 text-center">{error}</p>
                  )}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("form.newPassword")}
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder={t("form.newPasswordPlaceholder")}
                        required
                        minLength={8}
                      />
                      <FiLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    {fieldErrors.password && (
                      <div className="text-red-600 text-xs mt-1">{fieldErrors.password}</div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("form.confirmPassword")}
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder={t("form.confirmPasswordPlaceholder")}
                        required
                        minLength={8}
                      />
                      <FiLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    {fieldErrors.confirmPassword && (
                      <div className="text-red-600 text-xs mt-1">{fieldErrors.confirmPassword}</div>
                    )}
                  </div>
                </div>

                {/* Password requirements checklist */}
                <div className="mt-4 mb-2">
                  <ul className="text-xs text-gray-600 space-y-1">
                    {passwordRequirements.map((req, i) => (
                      <li key={i} className="flex items-center">
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${req.test(password) ? "bg-green-500" : "bg-gray-300"
                            }`}
                        ></span>
                        {req.label}
                      </li>
                    ))}
                    <li className="flex items-center">
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${passwordsMatch ? "bg-green-500" : "bg-gray-300"
                          }`}
                      ></span>
                      {t("requirements.match")}
                    </li>
                  </ul>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isPendingRestpassword}
                  className={`w-full mt-6 px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-colors ${isPendingRestpassword
                      ? "bg-gray-300 cursor-not-allowed"
                      : "pr-bg text-white"
                    }`}
                >
                  {isPendingRestpassword ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t("form.updating")}
                    </>
                  ) : (
                    <>
                      {t("form.updateButton")}
                      <FiArrowRight className="ml-2" />
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
