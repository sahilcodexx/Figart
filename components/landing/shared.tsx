import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const landingContainer =
  "mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-[68px]";

export function Brand() {
  return (
    <Link
      href="/"
      aria-label="Figart home"
      className="inline-flex items-center gap-2.5 text-[21px] font-semibold tracking-[-0.7px]"
    >
      <span className="text-[26px] font-semibold tracking-[-1px]">
        figart<span className="text-[#147bd0]">.</span>
      </span>
    </Link>
  );
}

export function LandingButton({
  children,
  href,
  secondary = false,
  className,
  arrow = true,
}: {
  children: React.ReactNode;
  href: string;
  secondary?: boolean;
  className?: string;
  arrow?: boolean;
}) {
  return (
    <Button
      asChild
      className={cn(
        "h-[39px] gap-1.5 rounded-[9px] px-4 text-[16px] font-normal tracking-[-0.1px] transition-colors focus-visible:ring-[#147bd0]/30",
        secondary
          ? "bg-[#f1f1f1] text-[#555555] shadow-none hover:bg-[#e7e8e7]"
          : "border border-[#1381d8] bg-linear-to-b from-[#2189dd] to-[#1172c7] text-white shadow-[inset_0_1px_1px_#ffffff50,0_1px_2px_#00000014] hover:from-[#147acb] hover:to-[#0865b6]",
        className,
      )}
    >
      <Link href={href}>
        {children}
        {arrow && <ChevronRight className="size-3.5" />}
      </Link>
    </Button>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-1.5 text-[13px] text-[#797979]">
      <span className="h-1.5 w-3 rounded-full bg-[#535353]" />
      {children}
    </p>
  );
}
