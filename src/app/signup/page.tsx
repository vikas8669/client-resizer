'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Check, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import * as z from "zod";
import { useAuth } from '@/hooks/useAuth';
import { getDashboardPath, getStoredUser } from '@/lib/auth';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// ✅ Schema (no confirm password, space handled only in password)
const signupSchema = z.object({
  name: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  password: z.string()
    .transform((val) => val.replace(/\s/g, ""))
    .pipe(
      z.string()
        .min(8, "8+ chars")
        .regex(/[A-Z]/)
        .regex(/[0-9]/)
        .regex(/[^A-Za-z0-9]/)
    ),
});

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      router.replace(getDashboardPath(user));
      return;
    }
    setCheckingAuth(false);
  }, [router]);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: { name: "", email: "", password: "" },
  });

  // password UI logic (same as before)
  const rawPassword = form.watch("password") || "";
  const passwordValue = rawPassword.replace(/\s/g, "");

  const requirements = [
    { label: "8+ chars", met: passwordValue.length >= 8 },
    { label: "Uppercase", met: /[A-Z]/.test(passwordValue) },
    { label: "Number", met: /[0-9]/.test(passwordValue) },
    { label: "Special", met: /[^A-Za-z0-9]/.test(passwordValue) },
  ];


  
  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    try {
      setIsSubmitting(true);
      await signup.mutateAsync({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });
      toast.success("Account created!");
      form.reset();
      const user = getStoredUser();
      router.push(getDashboardPath(user));
    } catch (err) {
      toast.error("Signup failed");
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
    <main className="relative flex min-h-screen overflow-hidden bg-white dark:bg-zinc-950">
      
      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.07] dark:opacity-[0.05]">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* LEFT SIDE */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-blue-600 p-10 lg:flex dark:bg-blue-700">
        <div className="relative z-10 text-xl font-bold tracking-tighter text-white">PrintPix</div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4">Master your workflow.</h2>
          <p className="text-blue-100 text-sm max-w-xs">The all-in-one studio management platform.</p>
        </div>
        <div className="relative z-10 text-blue-200 text-xs italic">Trusted by industry leaders worldwide.</div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center px-6 py-8 lg:w-1/2">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[380px] space-y-6"
        >
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Create account</h1>
            <p className="text-sm text-zinc-500">Sign up to start printing smarter.</p>
          </div>

          {/* GOOGLE BUTTON (same UI + SVG) */}
          <Button 
            variant="outline" 
            type="button"
            onClick={() => toast.info("Google signup will be enabled after OAuth setup")}
            className="w-full h-10 rounded-lg text-xs font-semibold gap-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-center"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* NAME */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Alex Rivera" className="rounded-lg h-9 text-sm" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="alex@studio.com" className="rounded-lg h-9 text-sm" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              {/* PASSWORD */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs">Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type={showPassword ? "text" : "password"} className="rounded-lg h-9 pr-9" {...field} />
                      </FormControl>
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 text-zinc-400">
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>

                    {/* Strength */}
                    <div className="flex h-1 gap-1 pt-1.5">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className={`h-full flex-1 rounded-full ${
                          requirements.filter(r => r.met).length >= i
                            ? 'bg-blue-500'
                            : 'bg-zinc-100 dark:bg-zinc-800'
                        }`} />
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
                      {requirements.map((req) => (
                        <div key={req.label} className="flex items-center gap-1.5">
                          <Check className={`h-3 w-3 ${req.met ? 'text-blue-500' : 'text-zinc-200 dark:text-zinc-800'}`} />
                          <span className={`text-[10px] ${req.met ? 'text-zinc-900 dark:text-zinc-100 font-medium' : 'text-zinc-400'}`}>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              {/* BUTTON */}
              <Button
                disabled={!form.formState.isValid || isSubmitting}
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 h-10 text-sm shadow-lg shadow-blue-500/10"
              >
                {isSubmitting ? "Creating..." : "Sign Up"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

            </form>
          </Form>

          <p className="text-center text-xs text-zinc-500">
            Already have an account? <Link href="/login" className="font-bold text-zinc-900 dark:text-white"><span className='font-semibold text-blue-700 underline pl-1'>Log in</span></Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
