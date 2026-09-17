import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", fullWidth, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-[15px] font-semibold transition-all active:scale-[0.98]",
          variant === "primary" && "bg-navy-900 text-white shadow-[0_8px_20px_-6px_rgba(20,40,61,0.5)] hover:bg-navy-800",
          variant === "secondary" && "bg-white text-navy-900 border border-ink-200 hover:border-ink-300",
          variant === "ghost" && "bg-transparent text-navy-900 hover:bg-ink-100",
          variant === "destructive" && "bg-white text-red-600 border border-red-200 hover:bg-red-50",
          fullWidth && "w-full",
          props.disabled && "opacity-50 pointer-events-none",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
