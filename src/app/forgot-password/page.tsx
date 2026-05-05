'use client';

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import apiClient from "@/api/api";
import { ENDPOINTS } from "@/api/endpoints";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await apiClient.post(ENDPOINTS.FORGOT_PASSWORD, { email });
      const data = response.data;

      toast.success(data?.message || "Reset link sent");
      setEmail("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to process forgot password";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 py-16 px-4">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-7 shadow-lg">
        <h1 className="text-2xl font-bold text-zinc-900">Forgot Password</h1>
        <p className="mt-2 text-sm text-zinc-600">Enter your email and we will send a password reset link.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </main>
  );
}
