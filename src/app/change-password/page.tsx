'use client';

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import apiClient from "@/api/api";
import { ENDPOINTS } from "@/api/endpoints";
import { clearStoredUser } from "@/lib/auth";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await apiClient.post(ENDPOINTS.CHANGE_PASSWORD, { currentPassword, newPassword });
      const data = response.data;

      toast.success(data?.message || "Password changed");
      setCurrentPassword("");
      setNewPassword("");
      clearStoredUser();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to change password";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 py-16 px-4">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-7 shadow-lg">
        <h1 className="text-2xl font-bold text-zinc-900">Change Password</h1>
        <p className="mt-2 text-sm text-zinc-600">Update your account password securely.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            type="password"
            required
            placeholder="Current password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          />
          <input
            type="password"
            required
            placeholder="New password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </main>
  );
}
