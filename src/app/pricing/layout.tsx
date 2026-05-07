import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Affordable Image Processing Plans",
  description: "Simple and transparent pricing for PrintPix. Choose a plan that fits your needs, from free for beginners to Pro for power users.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
