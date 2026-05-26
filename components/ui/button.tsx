import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "neon";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-ink-900 text-white hover:bg-ink-800 disabled:bg-ink-300 shadow-sm",
  secondary:
    "bg-white text-ink-900 border border-ink-200 hover:bg-ink-50 disabled:opacity-60",
  ghost:
    "bg-transparent text-ink-700 hover:bg-ink-100/70 disabled:opacity-60",
  outline:
    "bg-transparent text-ink-800 border border-ink-300 hover:bg-ink-50",
  neon: "bg-accent-blue text-white hover:bg-blue-600 shadow-neon-blue",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-10 px-5 text-sm gap-2",
};

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
  }
>(({ className, variant = "primary", size = "md", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/40 disabled:cursor-not-allowed",
      VARIANTS[variant],
      SIZES[size],
      className,
    )}
    {...props}
  />
));
Button.displayName = "Button";
