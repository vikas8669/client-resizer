import Link from "next/link";

export default function SolutionsPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-background text-foreground py-24">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Hello Solutions
      </h1>
      <Link href="/" className="px-6 py-3 rounded-full bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20">
        Back to Home
      </Link>
    </div>
  );
}
