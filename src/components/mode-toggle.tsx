import * as React from "react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "motion/react"
import { useSound } from 'use-sound';
import { useSoundSettings } from '@/components/context/sound-context';
import { cn } from "@/lib/utils";

interface ModeToggleProps {
  className?: string;
}

const ModeToggleComponent = ({ className }: ModeToggleProps) => {
  const { theme, setTheme } = useTheme()
  const { isSoundEnabled } = useSoundSettings();
  const [playHaribol] = useSound('/sounds/haribol.mp3', {
    volume: 0.75,
    soundEnabled: isSoundEnabled
  });
  const [mounted, setMounted] = React.useState(false)
  const [isPressed, setIsPressed] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const playToggleSound = React.useCallback(() => {
    if (isSoundEnabled) {
      // Consider stopping sound if you want it to retrigger cleanly on rapid clicks
      // stopHaribol(); // if you had a stop function from useSound
      playHaribol();
    }
  }, [isSoundEnabled, playHaribol]);

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
    playToggleSound();
  }, [theme, setTheme, playToggleSound])

  const handlePointerDown = React.useCallback(() => setIsPressed(true), [])
  const handlePointerUp = React.useCallback(() => setIsPressed(false), [])
  const handlePointerLeave = React.useCallback(() => setIsPressed(false), [])

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className={cn("relative z-50", className)}
    >
      <div className="absolute inset-0 pointer-events-none z-30">
        {/* Simplified Glow Effect (2 layers for performance) */}
        {/* Outer Glow Layer */}
        <div className={`
          absolute -inset-5 rounded-full blur-lg
          [animation:_pulse_3.5s_ease-in-out_infinite]
          ${theme === "dark"
            ? "bg-amber-400/20" // Adjusted color/opacity
            : "bg-yellow-200/30" // Adjusted color/opacity
          }
        `} />
        {/* Inner Glow Layer */}
        <div className={`
          absolute -inset-3 rounded-full blur-lg
          [animation:_pulse_2.2s_ease-in-out_infinite]
          ${theme === "dark"
            ? "bg-amber-300/40" // Adjusted color/opacity
            : "bg-yellow-100/50" // Adjusted color/opacity
          }
        `} />
      </div>
      <Button
        variant="ghost"
        onClick={toggleTheme}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className={`
          rounded-full p-0 overflow-hidden
          transition-all duration-300
          w-28 h-28
          active:scale-95 relative z-40
          bg-transparent border-0
        `}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 80, damping: 8 }}
          className="relative flex items-center justify-center w-full h-full"
        >
          <img
            src="/assets/pondi.webp"
            alt="Pondi Logo"
            width={112}
            height={112}
            className="rounded-full object-cover max-w-[112px] max-h-[112px]"
          />

          {/* Text Overlay on Press */}
          <AnimatePresence>
            {isPressed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className={`
                  absolute inset-0 flex items-center justify-center
                  rounded-full backdrop-blur-sm
                  ${theme === "dark"
                    ? "bg-zinc-900/80"
                    : "bg-white/80"
                  }
                `}
              >
                <span className={`
                  text-xs sm:text-sm font-medium
                  ${theme === "dark"
                    ? "text-zinc-200"
                    : "text-zinc-800"
                  }
                `}>
                  Awaken the Soul
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <span className="sr-only">
          Switch to {theme === "dark" ? "light" : "dark"} mode
        </span>
      </Button>
    </motion.div>
  )
}

export const ModeToggle = React.memo(ModeToggleComponent)
