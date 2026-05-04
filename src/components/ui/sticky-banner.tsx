"use client";
import React, { SVGProps, useState, forwardRef } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyBanner = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    children: React.ReactNode;
    hideOnScroll?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(({ className, children, hideOnScroll = false, onOpenChange }, ref) => {
  const [open, setOpen] = useState(true);
  const { scrollY } = useScroll();

  const handleSetOpen = (value: boolean) => {
    setOpen(value);
    onOpenChange?.(value);
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (hideOnScroll && latest > 40) {
      handleSetOpen(false);
    } else {
      handleSetOpen(true);
    }
  });

  return (
    // Outer wrapper: always fixed to the top of the viewport
    <motion.div
      ref={ref}
      initial={false}
      animate={{ height: open ? "auto" : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ overflow: "hidden" }}
      className="fixed inset-x-0 top-0 z-[200] w-full"
    >
      {/* Inner div: receives gradient + visual className; min-h-10 + py-2 allows text wrap on mobile */}
      <div
        className={cn(
          "relative flex min-h-10 w-full items-center justify-center px-8 py-2",
          className,
        )}
      >
        {children}

        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: open ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
          onClick={() => handleSetOpen(!open)}
          aria-label="Close banner"
        >
          <CloseIcon className="h-5 w-5 text-white" />
        </motion.button>
      </div>
    </motion.div>
  );
});

StickyBanner.displayName = "StickyBanner";

const CloseIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </svg>
  );
};
