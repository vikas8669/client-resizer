'use client';

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardPath, getStoredUser, storeUser, setTokens } from "@/lib/auth";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import apiClient from "@/api/api";
import { ENDPOINTS } from "@/api/endpoints";
import { useSearchParams } from "next/navigation";




const GoogleIcon = () => (
            <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
);

import { Suspense } from "react";

function LoginContent() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Rate limit state
  const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);
  const [limitMessage, setLimitMessage] = useState('');

  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for tokens from Google OAuth Redirect
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userData = searchParams.get('user');

    if (accessToken && refreshToken && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        setTokens(accessToken, refreshToken);
        storeUser(user);
        
        toast.success("Logged in with Google");
        router.replace(getDashboardPath(user));
        return;
      } catch (e) {
        console.error("Failed to parse Google login data", e);
      }
    }


    const user = getStoredUser();
    if (user) {
      router.replace(getDashboardPath(user));
      return;
    }
    setCheckingAuth(false);
  }, [router, searchParams]);


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

  const handleGoogleLogin = () => {
    const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
    window.location.href = `${backendUrl}/api/auth/google`;
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
              — Bom~ X, Studio Lead
            </footer>
          </blockquote>
        </div>

        <div className="relative z-10 text-sm text-blue-200">
          © 2026 PrintPix Inc. All rights reserved.
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
                <span className="underline">Create an account</span>
              </Link>
            </p>
          </div>

          {/* Social Login */}
          <div className="mt-8">
            <button
              type="button"
              onClick={() => handleGoogleLogin()}
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
                  <span className="underline">Forgot Password?</span>
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-zinc-500">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

