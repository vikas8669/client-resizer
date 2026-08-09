"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Logo() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <Image
      src={currentTheme === "dark" ? "/pp-d.svg" : "/pp.svg"}
      alt="PrintPix"
      width={140}
      height={40}
      priority
      // style={{ width: "auto", height: "140" }}
      className="transition-all duration-300 h-15 w-auto"
    />
  );
}