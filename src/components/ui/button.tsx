import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium select-none outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:enabled:scale-[0.96] transition-[scale,background-color,color,box-shadow,opacity] duration-150 ease-out",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-fg shadow-[0_0_0_1px_rgb(62_224_234_/_0.2)] hover:bg-primary/90",
        secondary:
          "bg-elevated text-fg shadow-[0_0_0_1px_rgb(232_244_246_/_0.08)] hover:shadow-[0_0_0_1px_rgb(62_224_234_/_0.28)]",
        ghost: "bg-transparent text-muted hover:text-fg hover:bg-elevated",
        danger: "bg-crimson text-fg hover:bg-crimson/90",
        outline:
          "bg-transparent text-fg shadow-[0_0_0_1px_rgb(232_244_246_/_0.12)] hover:shadow-[0_0_0_1px_rgb(62_224_234_/_0.4)]",
      },
      size: {
        default: "h-11 px-4 text-sm",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-5 text-sm",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
