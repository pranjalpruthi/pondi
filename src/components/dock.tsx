import { Link } from '@tanstack/react-router'
import { motion, MotionConfig } from 'framer-motion'
import * as React from 'react'
import { cn } from '@/lib/utils'
import IconHome from 'virtual:icons/line-md/home-md-alt-twotone'
import IconTemple from 'virtual:icons/fluent-emoji-flat/hindu-temple'
import IconCalendar from 'virtual:icons/uim/calender'
import IconInfo from 'virtual:icons/line-md/alert-circle-twotone-loop'
import IconDonate from 'virtual:icons/fluent-emoji/love-letter'
import { BottomBlurOut } from '@/components/cuicui/bottom-blur-out'
import { ModeToggle } from '@/components/mode-toggle'
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Menu, Search, Volume2, VolumeX } from "lucide-react"
import { useSound } from 'use-sound'
import { useSoundSettings } from '@/components/context/sound-context'
import { SoundProvider } from '@/components/context/sound-context'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { TempleEvents } from '@/components/temple-events'

const navItems = [
  { 
    icon: IconHome, 
    label: 'Home', 
    to: '/',
    iconClassName: "text-primary/80" 
  },
  { icon: IconTemple, label: 'Deities', to: '/deities', iconClassName: "text-primary/80" },
  { icon: IconCalendar, label: 'Events', to: '/events', iconClassName: "text-primary/80" },
  { icon: IconInfo, label: 'About', to: '/about', iconClassName: "text-primary/80" },
  { icon: IconDonate, label: 'Donate', to: '/donate', iconClassName: "text-primary/80" },
]

function NavbarContent() {
  const [open, setOpen] = React.useState(false)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const { isSoundEnabled, toggleSound } = useSoundSettings()
  const queryClient = useQueryClient()
  const [eventsOpen, setEventsOpen] = React.useState(false)

  // Use React Query for sound loading state
  const { data: soundsLoaded = false } = useQuery({
    queryKey: ['soundsLoaded'],
    queryFn: async () => {
      // Preload all sounds
      const sounds = [
        '/sounds/switch-on.mp3',
        '/sounds/click.wav',
        '/sounds/enable-sound.mp3',
        '/sounds/disable-sound.mp3',
        '/sounds/templebell.mp3'
      ]
      
      await Promise.all(
        sounds.map(sound => 
          new Promise((resolve) => {
            const audio = new Audio(sound)
            audio.addEventListener('canplaythrough', resolve, { once: true })
            audio.load()
          })
        )
      )
      return true
    },
    staleTime: Infinity // Sound loading state won't go stale
  })

  // Sound effects with memoization
  const [playHover] = useSound('/sounds/switch-on.mp3', { 
    volume: 0.5,
    soundEnabled: isSoundEnabled
  })
  
  const [playClick] = useSound('/sounds/click.wav', { 
    volume: 0.25,
    soundEnabled: isSoundEnabled
  })

  const [playEnableSound] = useSound('/sounds/enable-sound.mp3', { 
    volume: 0.5,
    soundEnabled: true
  })
  
  const [playDisableSound] = useSound('/sounds/disable-sound.mp3', { 
    volume: 0.5,
    soundEnabled: true
  })

  const [playTempleBell] = useSound('/sounds/templebell.mp3', { 
    volume: 0.5,
    soundEnabled: isSoundEnabled
  })

  // Safe play functions using React Query state
  const safePlayHover = () => {
    if (soundsLoaded && isSoundEnabled) {
      playHover()
    }
  }

  const safePlayClick = () => {
    if (soundsLoaded && isSoundEnabled) {
      playClick()
    }
  }

  const handleSoundToggle = () => {
    if (!isSoundEnabled) {
      playEnableSound()
    } else {
      playDisableSound()
    }
    toggleSound()
    // Invalidate any queries that depend on sound state
    queryClient.invalidateQueries({ queryKey: ['soundState'] })
  }

  // Handle navigation with special sounds
  const handleNavClick = (to: string) => {
    if (to === '/deities' && isSoundEnabled) {
      playTempleBell()
    } else {
      safePlayClick()
    }
  }

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <MotionConfig transition={{ layout: { duration: 0.35, type: 'spring', bounce: 0.1 } }}>
      <nav className="fixed bottom-0 left-0 z-40 w-full pb-safe mb-6">
        <div className="absolute inset-x-0 -bottom-8 h-32">
          <BottomBlurOut />
        </div>
        
        <div className="container relative mx-auto flex justify-center px-2 pb-2 sm:px-4">
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative w-full max-w-md rounded-3xl bg-pink-50/60 p-1.5 shadow-lg shadow-black/5 ring-1 ring-pink-100/60 backdrop-blur-md dark:bg-pink-900/40 dark:shadow-black/10 dark:ring-pink-900/40 sm:max-w-fit"
          >
            <div className="grid w-full grid-cols-5 sm:auto-cols-[5rem] sm:grid-flow-col">
              {/* Main Nav Items (first 3) */}
              {navItems.slice(0, 3).map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    // Special handling for Events link
                    if (item.to === '/events') {
                      setEventsOpen(true)
                      safePlayClick()
                    } else {
                      handleNavClick(item.to)
                    }
                  }}
                  onMouseEnter={safePlayHover}
                  className={cn(
                    "group relative flex flex-col items-center rounded-2xl px-2 py-1.5 sm:px-3",
                    "text-xs font-medium text-foreground/90 transition-colors duration-200",
                    "hover:text-primary hover:bg-white/10 dark:hover:bg-white/20",
                    "focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-primary focus-visible:ring-offset-2",
                    "data-[active]:text-primary"
                  )}
                  activeProps={{
                    className: "text-primary relative isolate"
                  }}
                >
                  <div className="relative flex flex-col items-center gap-1 w-full h-full">
                    {/* Enhanced background card for active state with better visibility */}
                    {item.to === location.pathname && (
                      <motion.div
                        layout
                        layoutId="nav-active"
                        className="absolute inset-0 -inset-x-1 sm:-inset-x-1.5 -z-10 rounded-2xl bg-pink-100/20 dark:bg-pink-800/30 shadow-sm"
                        transition={{ type: "spring", bounce: 0.15 }}
                      />
                    )}
                    {/* Add hover effect background */}
                    <div className="absolute inset-0 -inset-x-1 sm:-inset-x-1.5 -z-10 rounded-2xl bg-pink-100/0 dark:bg-pink-800/0 transition-colors duration-200 group-hover:bg-pink-100/10 dark:group-hover:bg-pink-800/[0.08]"></div>
                    <div className="relative rounded-xl p-1.5">
                      <item.icon 
                        className={cn(
                          "size-[1.25rem] sm:size-5 transition-all duration-200",
                          "text-foreground/80 group-hover:text-primary",
                          "group-data-[active]:text-primary"
                        )} 
                      />
                    </div>
                    <span className="font-medium px-1 pb-0.5 text-[0.65rem] sm:text-[0.7rem] sm:px-1.5">{item.label}</span>
                  </div>
                </Link>
              ))}

              {/* Search Button */}
              <button
                onClick={() => {
                  setOpen(true)
                  handleNavClick('/')
                }}
                onMouseEnter={safePlayHover}
                className="group relative flex flex-col items-center rounded-2xl px-2 py-1.5 sm:px-3 hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200"
              >
                <div className="relative flex flex-col items-center gap-1 w-full h-full">
                  {/* Add hover effect background */}
                  <div className="absolute inset-0 -inset-x-1 sm:-inset-x-1.5 -z-10 rounded-2xl bg-pink-100/0 dark:bg-pink-800/0 transition-colors duration-200 group-hover:bg-pink-100/10 dark:group-hover:bg-pink-800/[0.08]"></div>
                  <div className="relative rounded-xl p-1.5">
                    <Search className="size-[1.25rem] sm:size-5 text-foreground/80 group-hover:text-primary transition-colors duration-200" />
                  </div>
                  <span className="font-medium px-1 pb-0.5 text-[0.65rem] sm:text-[0.7rem] sm:px-1.5">Search</span>
                </div>
              </button>

              {/* Menu Button */}
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <button 
                    className="group relative flex flex-col items-center rounded-2xl px-2 py-1.5 sm:px-3 hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200"
                    onMouseEnter={safePlayHover}
                    onClick={(e) => {
                      // Special handling for Events link
                      if (e.currentTarget.getAttribute('data-to') === '/events') {
                        setEventsOpen(true)
                        safePlayClick()
                      } else {
                        handleNavClick(e.currentTarget.getAttribute('data-to') || '/')
                      }
                    }}
                  >
                    <div className="relative flex flex-col items-center gap-1 w-full h-full">
                      {/* Add hover effect background */}
                      <div className="absolute inset-0 -inset-x-1 sm:-inset-x-1.5 -z-10 rounded-2xl bg-pink-100/0 dark:bg-pink-800/0 transition-colors duration-200 group-hover:bg-pink-100/10 dark:group-hover:bg-pink-800/[0.08]"></div>
                      <div className="relative rounded-xl p-1.5">
                        <Menu className="size-[1.25rem] sm:size-5 text-foreground/80 group-hover:text-primary transition-colors duration-200" />
                      </div>
                      <span className="font-medium px-1 pb-0.5 text-[0.65rem] sm:text-[0.7rem] sm:px-1.5">Menu</span>
                    </div>
                  </button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="p-4">
                    <div className="space-y-4">
                      {/* Sound Toggle Button */}
                      <button
                        onClick={handleSoundToggle}
                        onMouseEnter={safePlayHover}
                        className="flex w-full items-center space-x-2 rounded-lg p-2 hover:bg-accent"
                      >
                        {isSoundEnabled ? (
                          <>
                            <Volume2 className="size-5" />
                            <span>Disable Sound</span>
                          </>
                        ) : (
                          <>
                            <VolumeX className="size-5" />
                            <span>Enable Sound</span>
                          </>
                        )}
                      </button>

                      {/* Theme Toggle Button */}
                      <div className="flex w-full items-center space-x-2 rounded-lg p-2">
                        <ModeToggle iconOnly={false} />
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-border" />

                      {/* Navigation Items */}
                      {navItems.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => {
                            setDrawerOpen(false)
                            if (item.to === '/events') {
                              setEventsOpen(true)
                              safePlayClick()
                            } else {
                              handleNavClick(item.to)
                            }
                          }}
                          onMouseEnter={safePlayHover}
                          className="flex items-center space-x-2 rounded-lg p-2 hover:bg-accent"
                        >
                          <item.icon className="size-5" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </motion.div>
        </div>

        {/* Command Dialog */}
        <CommandDialog open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) handleNavClick('/')
        }}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              {navItems.map((item) => (
                <CommandItem
                  key={item.to}
                  onSelect={() => {
                    setOpen(false)
                    if (item.to === '/events') {
                      setEventsOpen(true)
                      safePlayClick()
                    } else {
                      handleNavClick(item.to)
                      window.location.href = item.to
                    }
                  }}
                  onMouseEnter={safePlayHover}
                >
                  <item.icon className="mr-2 size-4" />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>

        {/* Add Events Dialog */}
        <TempleEvents 
          open={eventsOpen} 
          onOpenChange={setEventsOpen}
          _onSoundPlay={safePlayClick}
        />

        {/* Safe area spacing */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </MotionConfig>
  )
}

export default function Navbar() {
  return (
    <SoundProvider>
      <NavbarContent />
    </SoundProvider>
  )
}