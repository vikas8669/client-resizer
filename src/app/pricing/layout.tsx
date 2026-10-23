import { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-Card Cutter Pricing",
  description:
    "View current PrintPix E-Card Cutter subscription plans and prices. Choose secure, one-time access for document cutting and print-ready exports.",
  keywords: [
    "E-Card Cutter pricing",
    "document cutter subscription",
    "Aadhaar card cutter price",
    "PAN card cutter price",
    "PrintPix pricing",
  ],
  alternates: {
    canonical: "https://printpix.app/pricing",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://printpix.app/pricing",
    siteName: "PrintPix",
    title: "E-Card Cutter Pricing | PrintPix",
    description: "Compare the current E-Card Cutter plans and prices from PrintPix.",
  },
  twitter: {
    card: "summary",
    title: "E-Card Cutter Pricing | PrintPix",
    description: "Compare the current E-Card Cutter plans and prices from PrintPix.",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
