import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solutions | Tailored Image Workflows",
  description: "Explore how PrintPix solves complex image processing challenges for photographers, e-commerce, and print services.",
};

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
