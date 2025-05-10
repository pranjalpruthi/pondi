import { Link } from '@tanstack/react-router';
import { motion, MotionConfig } from 'motion/react';
import * as React from 'react';
import { cn } from '@/lib/utils'; // Assuming path is correct
import IconHome from 'virtual:icons/line-md/home-md-alt-twotone'
import IconTemple from 'virtual:icons/fluent-emoji-flat/hindu-temple'
import IconCalendar from 'virtual:icons/uim/calender'
import IconInfo from 'virtual:icons/line-md/alert-circle-twotone-loop';
import IconDonate from 'virtual:icons/fluent-emoji/love-letter';
import { ModeToggle } from '@/components/mode-toggle'; // Assuming path
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"; // Assuming path
import { Button } from "@/components/ui/button"; // Assuming path
import { Separator } from "@/components/ui/separator"; // Assuming path
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"; // Assuming path
import { Menu, Search, Volume2, VolumeX, Gift } from "lucide-react"; // Added Newspaper, Gift
import { useSound } from 'use-sound';
import { useSoundSettings } from '@/components/context/sound-context'; // Assuming path
import { SoundProvider } from '@/components/context/sound-context'; // Assuming path
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TempleEvents } from '@/components/temple-events'; // Assuming path
import { useIsMobile } from "@/hooks/use-mobile"; // Import useIsMobile

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
  // --- State ---
  const [open, setOpen] = React.useState(false); // Command Dialog state
  const [mainMenuOpen, setMainMenuOpen] = React.useState(false); // Main Menu Drawer state
  const [eventsOpen, setEventsOpen] = React.useState(false); // Events Dialog state
  // Removed newsOpen state
  const [donationOpen, setDonationOpen] = React.useState(false); // Donation Drawer state

  // --- Hooks ---
  const { isSoundEnabled, toggleSound } = useSoundSettings();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile(); // Check mobile status

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
      {/* Floating Buttons (Desktop Only) */}
      {!isMobile && (
        <>
          {/* Removed News Floating Button/Drawer */}
          {/* <Drawer open={newsOpen} onOpenChange={setNewsOpen}>
            <DrawerTrigger asChild>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 150, damping: 15 }}
                className="fixed bottom-6 left-6 z-50"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-12 w-12 shadow-lg bg-background/80 backdrop-blur-md border-primary/30 hover:bg-primary/10"
                  aria-label="Temple News"
                  onClick={safePlayClick}
                  onMouseEnter={safePlayHover}
                >
                  <Newspaper className="h-5 w-5 text-primary" />
                </Button>
              </motion.div>
            </DrawerTrigger>
          </Drawer> */}

          {/* Donation Floating Button/Drawer */}
          <Drawer open={donationOpen} onOpenChange={setDonationOpen}>
            <DrawerTrigger asChild>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 150, damping: 15 }}
                className="fixed bottom-6 right-6 z-50"
              >
                <Button
                  size="icon"
                  className="rounded-full h-12 w-12 shadow-lg bg-gradient-to-br from-pink-500 to-yellow-500 text-white hover:opacity-90"
                  aria-label="Donate Now"
                  onClick={safePlayClick}
                  onMouseEnter={safePlayHover}
                >
                  <Gift className="h-5 w-5" />
                </Button>
              </motion.div>
            </DrawerTrigger>
          </Drawer>
        </>
      )}

      {/* Main Dock Navigation */}
      <nav className="fixed bottom-0 left-0 z-40 w-full pb-safe mb-6 pointer-events-none"> {/* Added pointer-events-none */}
        {/* Removed BottomBlurOut component */}
        {/* <div className="absolute inset-x-0 -bottom-8 h-32">
          <BottomBlurOut />
        </div> */}

        <div className="container relative mx-auto flex justify-center px-2 pb-2 sm:px-4">
          {/* Added pointer-events-auto here */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative w-full max-w-md rounded-3xl bg-pink-50/60 p-1.5 shadow-lg shadow-black/5 ring-1 ring-pink-100/60 backdrop-blur-md dark:bg-pink-900/40 dark:shadow-black/10 dark:ring-pink-900/40 sm:max-w-fit pointer-events-auto"
          >
            <div className="grid w-full grid-cols-5 sm:auto-cols-[5rem] sm:grid-flow-col">
              {/* Main Nav Items (first 3) */}
              {navItems.slice(0, 3).map((item) => {
                // Use a button for Events, Link for others
                const Component = item.to === '/events' ? 'button' : Link;
                const props = item.to === '/events'
                  ? { // Props for button
                      type: 'button' as const,
                      onClick: () => { // Only open drawer, no navigation
                        setEventsOpen(true);
                        safePlayClick();
                      },
                    }
                  : { // Props for Link
                      to: item.to,
                      onClick: () => handleNavClick(item.to), // Keep original nav click for others
                      activeProps: { className: "text-primary relative isolate" }
                    };

                return (
                  <Component
                    key={item.to}
                    {...props} // Spread appropriate props
                    onMouseEnter={safePlayHover}
                    className={cn(
                      "group relative flex flex-col items-center rounded-2xl px-2 py-1.5 sm:px-3",
                    "text-xs font-medium text-foreground/90 transition-colors duration-200",
                    "hover:text-primary hover:bg-white/10 dark:hover:bg-white/20",
                    "focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-primary focus-visible:ring-offset-2",
                      "text-xs font-medium text-foreground/90 transition-colors duration-200",
                      "hover:text-primary hover:bg-white/10 dark:hover:bg-white/20",
                      "focus-visible:outline-none focus-visible:ring-2",
                      "focus-visible:ring-primary focus-visible:ring-offset-2",
                      // Apply active style manually if it's the button and events are open, or via activeProps for Link
                      (item.to !== '/events' ? "data-[active]:text-primary" : ""),
                      (item.to === '/events' && eventsOpen ? "text-primary" : "") // Style button when drawer is open
                    )}
                >
                  <div className="relative flex flex-col items-center gap-1 w-full h-full">
                    {/* Enhanced background card for active state */}
                    {/* Show for Link active state OR if it's the button and its drawer is open */}
                    {(item.to !== '/events' && item.to === location.pathname || item.to === '/events' && eventsOpen) && (
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
                          // Apply active style manually if it's the button and events are open, or via activeProps for Link
                          (item.to !== '/events' ? "group-data-[active]:text-primary" : ""),
                          (item.to === '/events' && eventsOpen ? "text-primary" : "")
                        )}
                      />
                    </div>
                    <span className="font-medium px-1 pb-0.5 text-[0.65rem] sm:text-[0.7rem] sm:px-1.5">{item.label}</span>
                  </div>
                  </Component> // Close Component (Link or button)
                );
              })}

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
              <Drawer open={mainMenuOpen} onOpenChange={setMainMenuOpen}>
                <DrawerTrigger asChild>
                  <button
                    className="group relative flex flex-col items-center rounded-2xl px-2 py-1.5 sm:px-3 hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200"
                    onMouseEnter={safePlayHover}
                    onClick={() => safePlayClick()} // Keep this simplified click for opening the drawer
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

                      {/* Theme Toggle Button - unchanged */}
                      <div className="flex w-full items-center space-x-2 rounded-lg p-2">
                        <ModeToggle iconOnly={false} />
                      </div>

                      {/* Divider */}
                      <Separator className="my-2" />

                      {/* Mobile Only News & Donation Buttons */}
                      {isMobile && (
                        <>
                          {/* Removed News Button */}
                          {/* <button
                            onClick={() => { setNewsOpen(true); setMainMenuOpen(false); safePlayClick(); }}
                            onMouseEnter={safePlayHover}
                            className="flex w-full items-center space-x-2 rounded-lg p-2 hover:bg-accent"
                          >
                            <Newspaper className="size-5" />
                            <span>Temple News</span>
                          </button> */}
                          <button
                            onClick={() => { setDonationOpen(true); setMainMenuOpen(false); safePlayClick(); }}
                            onMouseEnter={safePlayHover}
                            className="flex w-full items-center space-x-2 rounded-lg p-2 hover:bg-accent"
                          >
                            <Gift className="size-5" />
                            <span>Donate Now</span>
                          </button>
                          <Separator className="my-2" />
                        </>
                      )}

                      {/* Navigation Items */}
                      {navItems.map((item) => {
                        // Render button or Link in the main menu drawer as well
                        const MenuComponent = item.to === '/events' ? 'button' : Link;
                        const menuProps = item.to === '/events'
                          ? { // Props for button
                              type: 'button' as const,
                              onClick: () => {
                                setEventsOpen(true); // Open events drawer
                                setMainMenuOpen(false); // Close main menu
                                safePlayClick();
                              },
                            }
                          : { // Props for Link
                              to: item.to,
                              onClick: () => {
                                setMainMenuOpen(false); // Close main menu
                                handleNavClick(item.to); // Handle other nav clicks
                              }
                            };

                        return (
                          <MenuComponent
                            key={item.to}
                            {...menuProps}
                            onMouseEnter={safePlayHover}
                            className="flex w-full items-center space-x-2 rounded-lg p-2 hover:bg-accent" // Added w-full for button
                          >
                            <item.icon className="size-5" />
                            <span>{item.label}</span>
                          </MenuComponent>
                        );
                      })}
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
                    setOpen(false);
                    if (item.to === '/events') {
                      setEventsOpen(true);
                      safePlayClick();
                    } else {
                      handleNavClick(item.to);
                      window.location.href = item.to;
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

        {/* Removed News Drawer Content */}
        {/* <Drawer open={newsOpen} onOpenChange={setNewsOpen}>
          <DrawerContent>
            <div className="p-4 h-[50vh]">
              <h2 className="text-lg font-semibold mb-4">Latest News Headlines</h2>
              <p>News content will load here...</p>
            </div>
          </DrawerContent>
        </Drawer> */}

        {/* Donation Drawer Content (Rendered outside main nav structure) */}
        <Drawer open={donationOpen} onOpenChange={setDonationOpen}>
          <DrawerContent>
            {/* Placeholder for DonationDrawerContent component */}
            <div className="p-4 h-[50vh]"> {/* Added height for visibility */}
              <h2 className="text-lg font-semibold mb-4">Donate / Top Donors</h2>
              {/* TODO: Replace with DonationDrawerContent component */}
              <p>Donation options and top donors will load here...</p>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Safe area spacing - unchanged */}
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