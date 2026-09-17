import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <label className="block">
        {label && (
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-ink-500">
            {label}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-xl border border-ink-200 bg-white px-4 py-3.5 text-[15px] text-ink-900 placeholder:text-ink-300 outline-none transition-colors focus:border-navy-700 focus:ring-2 focus:ring-navy-700/10",
            className
          )}
          {...props}
        />
      </label>
    );
  }
);
Input.displayName = "Input";
