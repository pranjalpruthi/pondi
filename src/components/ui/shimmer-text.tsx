import { cn } from "@/lib/utils";
import React from "react";

interface ShimmerTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  text: string;
}

const ShimmerText = React.forwardRef<HTMLParagraphElement, ShimmerTextProps>(
  ({ text, className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          "animate-shimmer bg-clip-text text-transparent bg-[linear-gradient(110deg,theme(colors.slate.300),45%,theme(colors.slate.100),55%,theme(colors.slate.300))] bg-[length:200%_100%]",
          "dark:bg-[linear-gradient(110deg,theme(colors.slate.400),45%,theme(colors.slate.200),55%,theme(colors.slate.400))]",
          "text-lg font-medium text-center",
          className
        )}
        {...props}
      >
        {text}
      </p>
    );
  }
);

ShimmerText.displayName = "ShimmerText";

export default ShimmerText;
