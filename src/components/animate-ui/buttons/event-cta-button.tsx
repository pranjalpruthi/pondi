"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React, { type ReactNode } from "react";

interface EventCtaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  icon: ReactNode;
  defaultText: string;
  hoverText: string;
  emoji?: string;
  pulseColor?: string;
  isExpanded?: boolean;
  hasPulse?: boolean;
  hasShimmer?: boolean;
}

const EventCtaButton = React.forwardRef<HTMLButtonElement, EventCtaButtonProps>(
  ({
    className,
    icon,
    defaultText,
    hoverText,
    emoji,
    pulseColor = "rgba(34, 197, 94, 0.4)",
    isExpanded = false,
    hasPulse = true,
    hasShimmer = true,
    ...props
  }, ref) => {
    return (
      <motion.div
        animate={hasPulse ? {
          scale: [1, 1.05, 1],
          boxShadow: [
            `0 0 0 0 ${pulseColor}`,
            `0 0 0 10px rgba(34, 197, 94, 0)`,
            `0 0 0 0 ${pulseColor}`,
          ],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="rounded-2xl"
      >
        <button
          className={cn(
            "group rounded-2xl flex items-center justify-center shadow-lg text-white font-bold relative overflow-hidden transition-all duration-500",
            isExpanded
              ? "h-16 w-20 p-1.5" // Mobile: small, fixed size
              : "h-20 w-24 p-1 hover:w-48 hover:p-2", // Desktop: expands on hover
            className,
          )}
          type="button"
          ref={ref}
          {...props}
        >
          {hasShimmer && (
            <motion.span
              className="absolute inset-0 block"
              style={{
                background:
                  "linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.4) 50%, transparent 80%)",
              }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          )}
          <div
            className={cn(
              "relative z-10 flex justify-center items-center transition-all duration-300",
              isExpanded
                ? "flex-col gap-1" // Mobile: always column
                : "flex-col gap-1 group-hover:flex-row group-hover:gap-2", // Desktop: column, becomes row on hover
            )}
          >
            {icon}
            <div
              className={cn(
                "flex flex-col",
                isExpanded ? "items-center" : "items-center group-hover:items-start", // Mobile: always center, Desktop: center, becomes start on hover
              )}
            >
              <span className="text-sm font-semibold">{defaultText}</span>
              <div
                className={cn(
                  "w-fit overflow-hidden transition-all duration-500",
                  isExpanded
                    ? "max-h-0 max-w-0" // Mobile: text hidden
                    : "max-h-0 max-w-0 group-hover:max-h-5 group-hover:max-w-32", // Desktop: text shows on hover
                )}
              >
                <span
                  className={cn(
                    "whitespace-nowrap text-xs transition-opacity duration-500",
                    isExpanded
                      ? "opacity-0" // Mobile: text transparent
                      : "opacity-0 group-hover:opacity-100", // Desktop: text becomes visible on hover
                  )}
                >
                  {hoverText} {emoji}
                </span>
              </div>
            </div>
          </div>
        </button>
      </motion.div>
    );
  }
);

EventCtaButton.displayName = "EventCtaButton";

export default EventCtaButton;
