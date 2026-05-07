import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { SiteLayout } from "@/components/SiteLayout";

export const metadata: Metadata = {
  title: {
    default: "PrintPix | AI-Powered Image Processing & Layout Builder",
    template: "%s | PrintPix",
  },
  description: "The intelligent operating system for images. Resize, compress, optimize, and generate high-quality print layouts directly in your browser with privacy and speed.",
  keywords: ["image resizer", "image optimizer", "print layout builder", "online photo editor", "AI image processing", "batch image resize", "printpix"],
  authors: [{ name: "PrintPix Team" }],
  creator: "PrintPix",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://printpix.app",
    title: "PrintPix | Professional Image Processing Online",
    description: "Resize, compress, and optimize images with professional quality. Privacy-focused and browser-based.",
    siteName: "PrintPix",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrintPix | AI-Powered Image Processing",
    description: "The intelligent operating system for images. Professional quality, browser-based.",
    creator: "@printpix",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-500">
        <Providers>
          <SiteLayout>
            {children}
          </SiteLayout>
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
