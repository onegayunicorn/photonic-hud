import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
  {
    variants: {
      tone: {
        primary: "bg-primary/12 text-primary",
        crimson: "bg-crimson/12 text-crimson",
        indigo: "bg-indigo/15 text-indigo",
        emerald: "bg-emerald/12 text-emerald",
        amber: "bg-amber/14 text-amber",
        muted: "bg-elevated text-muted",
      },
    },
    defaultVariants: { tone: "muted" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
