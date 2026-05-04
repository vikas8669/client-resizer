'use client';

import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import { Github, Instagram, Linkedin, Facebook } from "lucide-react";

export function Footer() {
  const socialLinks = [
    { icon: <Instagram size={18} />, href: "#" },
    { icon: <Facebook size={18} />, href: "#" },
    { icon: <Linkedin size={18} />, href: "#" },
    { icon: <Github size={18} />, href: "#" },
  ];

  return (
    <footer className="w-full bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-white/10 mt-20">
      <div className="container mx-auto px-6 py-16">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* LEFT - ABOUT */}
          <div className="md:col-span-6 space-y-6">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md leading-relaxed">
              PrintPix helps you edit, optimize, and print photos instantly with a studio-level experience.
              Built for speed, simplicity, and modern workflows.
            </p>

            {/* OWNER */}
            <div className="flex items-center gap-4 p-3 rounded-2xl  dark:bg-zinc-90  dark:border-white/5 w-fit hover:shadow-md transition">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border b dark:bg-zinc-800">
                <Image 
                  src="/vikas2.png" 
                  alt="Vikas"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Mr. Vikas Kumar
                </h4>
                <p className="text-xs text-zinc-500">
                  {/* Founder  */}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT - LINKS */}
          <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
                Product
              </h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-primary transition">Features</Link></li>
                <li><Link href="#editor" className="hover:text-primary transition">Editor</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
                Company
              </h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-primary transition">Contact</Link></li>
                <li><Link href="#" className="hover:text-primary transition">Upwork</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
                Social
              </h3>
              <div className="flex gap-3">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-white hover:bg-black dark:hover:bg-white dark:hover:text-black transition"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-16 pt-6 border-t border-zinc-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* LEFT TEXT */}
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} PrintPix. All rights reserved.
          </p>

          {/* RIGHT LOGO (YOUR REQUEST ✅) */}
          <div className="opacity-80 hover:opacity-100 transition">
            <Logo />
          </div>
        </div>
      </div>
    </footer>
  );
}