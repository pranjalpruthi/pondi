import { cn } from "@/lib/utils";
import React from "react"; // Import React for React.memo

interface RainbowGlowProps {
  className?: string; // For the thin line itself
  containerClassName?: string; // For the overall container of the glow effect
  position?: "top" | "bottom";
  glowHeight?: string; // e.g., "h-10", "h-16"
  glowOpacity?: number; // e.g., 0.3, 0.5
  blurAmount?: string; // e.g., "blur-2xl", "blur-3xl"
}

export const RainbowGlow = React.memo(({ 
  className, 
  containerClassName, 
  position = "bottom",
  glowHeight = "h-12", // Default softer glow height
  glowOpacity = 0.4, // Default opacity
  blurAmount = "blur-2xl" // Default blur
}: RainbowGlowProps) => {
  const isTop = position === "top";

  // Gradient for the main soft glow, more concentrated at the edge
  const glowGradient = isTop 
    ? "bg-gradient-to-b" 
    : "bg-gradient-to-t";

  return (
    <div className={cn(
      "absolute left-0 right-0 pointer-events-none", // Prevent interaction with glow
      isTop ? "top-0" : "bottom-0",
      glowHeight, // Use prop for height
      containerClassName
    )}>
      {/* Soft, wider gradient glow for depth */}
      <div 
        className={cn(
          "absolute inset-x-0 w-full",
          isTop ? "top-0" : "bottom-0",
          glowHeight,
          glowGradient,
          "from-pink-500/60 via-purple-500/40 to-transparent", // Example gradient, adjust as needed
          blurAmount, // Use prop for blur
          "opacity-[var(--glow-opacity)]" // Use CSS variable for opacity
        )}
        style={{ '--glow-opacity': glowOpacity } as React.CSSProperties}
      />
      
      {/* Thin, sharper rainbow line at the very edge */}
      <div className={cn(
        "absolute left-0 right-0 h-[1.5px] z-[1]", // Thinner line, slightly above the soft glow
        isTop ? "top-0" : "bottom-0",
        className
      )}>
        <div className="relative w-full h-full bg-gradient-to-r
          from-purple-500/80 via-pink-500/80 to-orange-500/80" // Slightly more vibrant line
        />
      </div>
    </div>
  )
});
