import * as React from "react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface ModeToggleProps {
  iconOnly?: boolean
}

export function ModeToggle({}: ModeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [isPressed, setIsPressed] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="relative z-50"
    >
      <div className="absolute inset-0 pointer-events-none z-30">
        {/* Outer glow - slowest, largest */}
        <div className={`
          absolute -inset-6 rounded-full blur-2xl
          [animation:_pulse_4s_ease-in-out_infinite]
          ${theme === "dark" 
            ? "bg-amber-500/60" 
            : "bg-yellow-300/70"
          }
        `} />
        {/* Middle outer glow */}
        <div className={`
          absolute -inset-5 rounded-full blur-xl
          [animation:_pulse_3s_ease-in-out_infinite]
          ${theme === "dark" 
            ? "bg-amber-400/55" 
            : "bg-yellow-200/65"
          }
        `} />
        {/* Middle inner glow */}
        <div className={`
          absolute -inset-4 rounded-full blur-lg
          [animation:_pulse_2.5s_ease-in-out_infinite]
          ${theme === "dark" 
            ? "bg-amber-300/50" 
            : "bg-yellow-100/60"
          }
        `} />
        {/* Inner glow - fastest, smallest */}
        <div className={`
          absolute -inset-2 rounded-full blur-md
          [animation:_pulse_2s_ease-in-out_infinite]
          ${theme === "dark" 
            ? "bg-amber-200/45" 
            : "bg-yellow-50/55"
          }
        `} />
      </div>
      <Button 
        variant="ghost" 
        onClick={toggleTheme}
        onPointerDown={() => setIsPressed(true)}
        onPointerUp={() => setIsPressed(false)}
        onPointerLeave={() => setIsPressed(false)}
        className={`
          rounded-full p-0 overflow-hidden
          transition-all duration-300
          w-14 h-14
          hover:shadow-lg hover:shadow-amber-200/20
          active:scale-95 relative z-40
          ${theme === "dark" 
            ? "bg-zinc-900/90 border border-zinc-800" 
            : "bg-white/90 border border-zinc-200"
          }
        `}
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 12 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative"
        >
          <img
            src="/assets/iskmj.jpg"
            alt="ISKM Logo"
            width={48}
            height={48}
            className="rounded-full object-cover w-14 h-14"
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
                  Switch to {theme === "dark" ? "Light" : "Dark"}
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