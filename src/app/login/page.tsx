'use client';

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardPath, getStoredUser } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const GoogleIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 4 1.5l2.7-2.6C17 3.2 14.7 2.2 12 2.2 6.8 2.2 2.6 6.4 2.6 11.6S6.8 21 12 21c6.9 0 9.2-4.8 9.2-7.3 0-.5-.1-.9-.1-1.3H12z" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Rate limit state
  const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);
  const [limitMessage, setLimitMessage] = useState('');

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      router.replace(getDashboardPath(user));
      return;
    }
    setCheckingAuth(false);
  }, [router]);

  const onEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      console.log('Sending login request...', { email });
      await login.mutateAsync({ email, password });
      toast.success("Logged in successfully");
      const user = getStoredUser();
      router.push(getDashboardPath(user));
    } catch (error: any) {
      console.error('Login failed', error);
      if (error.response?.data?.code === 'RATE_LIMIT_EXCEEDED') {
        setLimitMessage(error.response.data.message);
        setIsLimitDialogOpen(true);
      } else {
        const backendMessage = error.response?.data?.message || "Login failed";
        toast.error(backendMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <div className="text-sm text-zinc-500">Checking session...</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-white dark:bg-zinc-950">
      {/* LEFT SIDE: Brand/Marketing (Hidden on Mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-blue-600 p-12 lg:flex dark:bg-blue-700">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        <div className="relative z-10">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white">
            PrintPix
          </Link>
        </div>

        <div className="relative z-10">
          <blockquote className="space-y-4">
            <p className="text-3xl font-medium leading-relaxed text-blue-50">
              "The most intuitive workflow for modern print studios. We've cut our processing time by 40%."
            </p>
            <footer className="text-sm font-semibold text-blue-200 uppercase tracking-wider">
              — Alex Rivera, Studio Lead
            </footer>
          </blockquote>
        </div>

        <div className="relative z-10 text-sm text-blue-200">
          © 2024 PrintPix Inc. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-24">
        <div className="mx-auto w-full max-w-sm">
          {/* Header */}
          <div className="flex flex-col gap-2 transition-all">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Welcome back
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              New to PrintPix?{" "}
              <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Create an account
              </Link>
            </p>
          </div>

          {/* Social Login */}
          <div className="mt-8">
            <button
              type="button"
              onClick={() => toast.info("Google login coming soon")}
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">Or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email</label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-blue-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
                <Link href="/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-blue-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              {isSubmitting ? "Authenticating..." : "Log In"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-200">Terms of Service</Link>.
          </p>
        </div>
      </div>

      <Dialog open={isLimitDialogOpen} onOpenChange={setIsLimitDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600 dark:text-red-500">
              Access Restricted
            </DialogTitle>
            <DialogDescription className="text-zinc-600 dark:text-zinc-400 pt-2 text-base">
              {limitMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 p-4 rounded-xl mt-2">
            <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
              We've detected too many requests from your IP address. To prevent abuse, your access has been temporarily limited.
            </p>
          </div>
          <DialogFooter className="mt-4">
            <Button 
              className="w-full h-12 rounded-xl bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white font-bold" 
              onClick={() => setIsLimitDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
