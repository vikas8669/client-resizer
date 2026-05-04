'use client';

import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
import { Github, Instagram, Linkedin, Facebook, ExternalLink } from "lucide-react";

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
            <a 
              href="https://vk-port-six.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-3 -ml-3 rounded-2xl border border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:border-zinc-200 dark:hover:border-white/10 w-fit hover:shadow-sm transition cursor-pointer"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <Image 
                  src="/vikas2.png" 
                  alt="Vikas"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="flex items-center gap-1.5 text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-primary transition-colors">
                  Mr. Vikas Kumar
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Portfolio &rarr;
                </p>
              </div>
            </a>
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