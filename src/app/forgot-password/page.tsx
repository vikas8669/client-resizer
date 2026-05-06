'use client';

import { FormEvent, useState } from "react";

import { toast } from "sonner";
import { Mail, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import apiClient from "@/api/api";
import { ENDPOINTS } from "@/api/endpoints";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await apiClient.post(ENDPOINTS.FORGOT_PASSWORD, { email });
      toast.success(response.data?.message || "Reset link sent");
      setIsSent(true);
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to process request";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,#fafafa_0%,#f5f5f5_100%)] py-20 px-4">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>

        {isSent ? (
          <div className="text-center py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
              <Mail className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900">Check your email</h1>
            <p className="mt-3 text-zinc-600">
              We've sent a password reset link to <span className="font-semibold text-zinc-900">{email}</span>.
            </p>
            <p className="mt-6 text-sm text-zinc-500">
              Didn't receive it? Check your spam folder or{" "}
              <button onClick={() => setIsSent(false)} className="text-orange-600 font-semibold hover:underline">try again</button>.
            </p>
          </div>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 mb-6">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900">Forgot password?</h1>
            <p className="mt-2 text-sm text-zinc-600">No worries, we'll send you reset instructions.</p>

            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 ml-1 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 pl-10 py-2.5 text-sm outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending link...
                  </>
                ) : "Send Reset Link"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

