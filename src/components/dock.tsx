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
import { Menu, Search, Volume2, VolumeX, Gift, Globe as GlobeIcon } from "lucide-react"; // Added GlobeIcon
import { useSound } from 'use-sound';
import { useSoundSettings } from '@/components/context/sound-context'; // Assuming path
import { SoundProvider } from '@/components/context/sound-context'; // Assuming path
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TempleEvents } from '@/components/temple-events'; // Assuming path
import { DeityDarshan } from '@/components/deity-darshan'; // Import the new DeityDarshan component
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
  { icon: GlobeIcon, label: 'Centers', to: '/centers', iconClassName: "text-primary/80" }, // Added Centers
  { icon: IconInfo, label: 'About', to: '/about', iconClassName: "text-primary/80" },
  { icon: IconDonate, label: 'Donate', to: '/donate', iconClassName: "text-primary/80" },
]

// Define a type for individual nav item
interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>; // More specific type for icon components
  label: string;
  to: string;
  iconClassName?: string;
}

// Memoized Nav Item Component
interface NavItemDisplayProps {
  item: NavItemProps;
  isActive: boolean;
  isDrawerOpen?: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  componentType: 'link' | 'button';
}

const NavItemDisplay = React.memo(({ item, isActive, isDrawerOpen, onClick, onMouseEnter, componentType }: NavItemDisplayProps) => {
  const isEffective = isActive || isDrawerOpen; // Combined active state for styling

  const content = (
    <div className="relative flex flex-col items-center gap-1 w-full h-full">
      {isEffective && (
        <motion.div
          layout
          layoutId={`nav-active-${item.to}`} // Dynamic layoutId
          className="absolute inset-0 -inset-x-1 sm:-inset-x-1.5 -z-10 rounded-2xl bg-pink-100/20 dark:bg-pink-800/30 shadow-sm"
          transition={{ type: "spring", bounce: 0.15 }}
          />
        )}
        {/* Removed the hover effect background div */}
        <div className="relative rounded-xl p-1.5">
        {/* No longer need to cast to any after updating NavItemProps */}
        <item.icon
          className={cn(
            "size-[1.25rem] sm:size-5 transition-all duration-200",
            item.iconClassName || "text-foreground/80",
            "group-hover:text-primary",
            isEffective && "text-primary"
          )}
        />
      </div>
      <span className="font-medium px-1 pb-0.5 text-[0.65rem] sm:text-[0.7rem] sm:px-1.5">{item.label}</span>
    </div>
  );

  const commonClassNames = cn(
    "group relative flex flex-col items-center rounded-2xl px-2 py-1.5 sm:px-3",
    "text-xs font-medium text-foreground/90 transition-colors duration-200",
    "hover:text-primary hover:bg-white/10 dark:hover:bg-white/20",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-primary focus-visible:ring-offset-2",
    isEffective && "text-primary"
  );

  if (componentType === 'link') {
    return (
      <Link
        to={item.to}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        className={commonClassNames}
        activeProps={{ className: "text-primary relative isolate" }} // Keep activeProps for Link's own active state detection
      >
        {content}
      </Link>
    );
  } else {
    return (
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        className={commonClassNames}
      >
        {content}
      </button>
    );
  }
});


function NavbarContent() {
  // --- State ---
  const [open, setOpen] = React.useState(false); // Command Dialog state
  const [mainMenuOpen, setMainMenuOpen] = React.useState(false); // Main Menu Drawer state
  const [eventsOpen, setEventsOpen] = React.useState(false); // Events Dialog state
  const [deitiesOpen, setDeitiesOpen] = React.useState(false); // Deities Dialog state - NEW
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
      <nav className="fixed bottom-0 left-0 z-40 w-full pb-safe mb-6 pointer-events-none">
        <div className="container relative mx-auto flex justify-center px-2 pb-2 sm:px-4">
          {/* Added pointer-events-auto here */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative w-full max-w-md rounded-3xl bg-pink-50/60 p-1.5 shadow-lg shadow-black/5 ring-1 ring-pink-100/60 backdrop-blur-md dark:bg-pink-900/40 dark:shadow-black/10 dark:ring-pink-900/40 sm:max-w-fit pointer-events-auto"
          >
            {/* Adjusted grid back to grid-cols-5 */}
            <div className="grid w-full grid-cols-5 sm:auto-cols-min sm:grid-flow-col">
              {/* Main Nav Items (first 3 - Home, Deities, Events) */}
              {navItems.slice(0, 3).map((item) => {
                const isEventsButton = item.to === '/events';
                const isDeitiesButton = item.to === '/deities';
                // Centers page is a direct link, not a drawer
                const componentType = isEventsButton || isDeitiesButton ? 'button' : 'link';
                
                let onClickAction = () => handleNavClick(item.to); // Default for links
                if (isEventsButton) {
                  onClickAction = () => { setEventsOpen(true); safePlayClick(); };
                } else if (isDeitiesButton) {
                  onClickAction = () => { setDeitiesOpen(true); playTempleBell(); };
                }

                // Determine active state for styling (Link active state or drawer open state)
                const isActuallyActive = 
                  (componentType === 'link' && typeof window !== 'undefined' && window.location.pathname === item.to) ||
                  (isEventsButton && eventsOpen) ||
                  (isDeitiesButton && deitiesOpen);

                return (
                  <NavItemDisplay
                    key={item.to}
                    item={item}
                    isActive={isActuallyActive} // Pass calculated active state
                    isDrawerOpen={(isEventsButton && eventsOpen) || (isDeitiesButton && deitiesOpen)}
                    onClick={onClickAction}
                    onMouseEnter={safePlayHover}
                    componentType={componentType}
                  />
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

                      {/* Mobile Only Donation Button */}
                      {isMobile && (
                        <>
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
                        const isEventsMenuButton = item.to === '/events';
                        const isDeitiesMenuButton = item.to === '/deities';
                        // Centers is a direct link
                        const MenuComponent = isEventsMenuButton || isDeitiesMenuButton ? 'button' : Link;
                        
                        let menuOnClickAction = () => { // Default for links
                          setMainMenuOpen(false);
                          handleNavClick(item.to);
                        };

                        if (isEventsMenuButton) {
                          menuOnClickAction = () => {
                            setEventsOpen(true);
                            setMainMenuOpen(false);
                            safePlayClick();
                          };
                        } else if (isDeitiesMenuButton) {
                          menuOnClickAction = () => {
                            setDeitiesOpen(true);
                            setMainMenuOpen(false);
                            playTempleBell();
                          };
                        }
                        
                        const menuLinkProps = MenuComponent === Link ? { to: item.to } : { type: 'button' as const };

                        return (
                          // @ts-ignore
                          <MenuComponent
                            key={`menu-${item.to}`}
                            {...menuLinkProps}
                            onClick={menuOnClickAction}
                            onMouseEnter={safePlayHover}
                            className="flex w-full items-center space-x-2 rounded-lg p-2 hover:bg-accent"
                          >
                            <item.icon className={cn("size-5", item.iconClassName)} />
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
                    } else if (item.to === '/deities') {
                      setDeitiesOpen(true);
                      playTempleBell();
                    } else { // For Centers and other direct links
                      handleNavClick(item.to);
                      // For TanStack Router, navigation should be done via <Link to="..."> or router.navigate()
                      // Using window.location.href is a full page reload.
                      // If this component is within a TanStack Router context, prefer router.navigate()
                      // For simplicity here, assuming Link component handles navigation correctly when not a drawer.
                      // The `Link` component from `@tanstack/react-router` should handle this.
                      // If direct navigation is needed for some reason: router.navigate({ to: item.to })
                      // For now, we assume the Link component handles it, or if it's a button, the onClick does.
                      // The onSelect here is for CommandItem, so direct navigation might be intended.
                      // Let's use router.navigate if available, or fallback.
                      // Since router isn't directly in scope, window.location.href is a fallback.
                      // However, for <Link> components, this onSelect might be redundant if Link itself navigates.
                      // For items that are not drawers (like /centers, /about, /donate), they should be Links.
                       if (typeof window !== 'undefined') window.location.href = item.to; // Fallback if not a drawer
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
        
        {/* Add Deity Darshan Dialog */}
        <DeityDarshan
          open={deitiesOpen}
          onOpenChange={setDeitiesOpen}
          
        />

        {/* Donation Drawer Content */}
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
