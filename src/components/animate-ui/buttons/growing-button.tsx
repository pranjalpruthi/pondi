"use client";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface GrowingButtonProps {
  children?: ReactNode;
  className?: string;
  icon: ReactNode;
  text: string;
}

export default function GrowingButton({ children, className, icon, text }: GrowingButtonProps) {
  return (
    <button
      className={cn(
        "group flex transform-gpu items-center gap-2 rounded-2xl px-3 py-2 transition-all duration-500 hover:w-48 h-20 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 active:bg-neutral-400/25",
        className
      )}
      type="button"
    >
      {icon}
      <span className="w-fit max-w-0 transform-gpu overflow-hidden transition-all duration-500 group-hover:max-w-24">
        <span className="transform-gpu whitespace-nowrap text-neutral-600 dark:text-neutral-300 text-sm opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          {text}
        </span>
      </span>
      {children}
    </button>
  );
}
