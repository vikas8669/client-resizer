import { StickyBanner } from "@/components/ui/sticky-banner";

export function StickyBannerDemo() {
  return (
    <div className="relative flex h-[60vh] w-full flex-col overflow-y-auto">
      
      <StickyBanner className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <p className="mx-0 max-w-[95%] text-white drop-shadow-md text-sm md:text-base font-medium">
          👋 Welcome to <span className="font-bold">PrintPix</span> — your next-gen AI image processing platform.{" "}
          Built for speed, creativity, and smart automation.{" "}
          <a
            href="#"
            className="ml-2 underline underline-offset-4 hover:opacity-80 transition"
          >
            Explore features
          </a>
        </p>
      </StickyBanner>

      <DummyContent />
    </div>
  );
}

const DummyContent = () => {
  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 py-8 px-4">
      <div className="h-96 w-full animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
      <div className="h-96 w-full animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
      <div className="h-96 w-full animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
    </div>
  );
};