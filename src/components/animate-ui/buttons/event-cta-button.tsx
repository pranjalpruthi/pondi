"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface EventCtaButtonProps {
  className?: string;
  icon: ReactNode;
  defaultText: string;
  hoverText: string;
  emoji?: string;
  pulseColor?: string;
}

export default function EventCtaButton({
  className,
  icon,
  defaultText,
  hoverText,
  emoji,
  pulseColor = "rgba(34, 197, 94, 0.4)",
}: EventCtaButtonProps) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        boxShadow: [
          `0 0 0 0 ${pulseColor}`,
          `0 0 0 10px rgba(34, 197, 94, 0)`,
          `0 0 0 0 ${pulseColor}`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="rounded-2xl"
    >
      <button
        className={cn(
          "group w-28 hover:w-48 h-20 p-2 rounded-2xl flex items-center justify-center gap-2 shadow-lg text-white font-bold relative overflow-hidden transition-all duration-500",
          className
        )}
        type="button"
      >
        <motion.span
          className="absolute inset-0 block"
          style={{
            background:
              "linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.4) 50%, transparent 80%)",
          }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />
        <div className="relative z-10 flex items-center justify-center gap-2">
          {icon}
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold">{defaultText}</span>
            <div className="w-fit max-h-0 max-w-0 overflow-hidden transition-all duration-500 group-hover:max-h-5 group-hover:max-w-32">
                <span className="whitespace-nowrap text-xs opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {hoverText} {emoji}
                </span>
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  );
}
