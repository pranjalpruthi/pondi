"use client"

import { motion } from "motion/react";

interface CollapsibleButtonProps {
    onClick: () => void;
    className?: string;
}

export function CollapsibleButton({ onClick, className }: CollapsibleButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            className={`
                group relative inline-flex h-10 items-center justify-center 
                overflow-hidden rounded-full bg-white/80 dark:bg-transparent
                text-[#b5387d] dark:text-[#ee96d4]
                hover:bg-white/90 dark:hover:bg-accent
                transition-all duration-300 hover:w-32
                w-10 ${className}
            `}
        >
            <div className="inline-flex items-center whitespace-nowrap
                opacity-0 transition-all duration-200 
                group-hover:opacity-100 group-hover:-translate-x-3"
            >
                Donate
            </div>
            <div className="absolute right-2.5">
                <img 
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Beating%20Heart.png" 
                    alt="Beating Heart" 
                    width="20" 
                    height="20" 
                />
            </div>
        </motion.button>
    );
}
