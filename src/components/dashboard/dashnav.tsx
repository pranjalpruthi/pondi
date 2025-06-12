import { Link } from '@tanstack/react-router'
import { cn } from "@/lib/utils"
import React, { useState } from "react"
import { 
  Home,
  Users,
  Settings,
  BarChart,
  ChevronsUpDown,
  Check,
  Building2,
  LogOut,
  ArrowLeft
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger }  from "@/components/animate-ui/radix/dialog"
import { SignOutButton, UserButton } from '@clerk/tanstack-react-start'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ModeToggle } from "@/components/mode-toggle"

const navigationLinks = [
  { label: "Dashboard", to: "/dashboard", icon: <Home className="h-4 w-4" /> },
  { label: "Analytics", to: "/dashboard/analytics", icon: <BarChart className="h-4 w-4" /> },
  { label: "Users", to: "/dashboard/users", icon: <Users className="h-4 w-4" /> },
  { label: "Settings", to: "/dashboard/settings", icon: <Settings className="h-4 w-4" /> },
]

const organizations = [
  {
    label: "ISKM Pondicherry",
    value: "iskm-pondy",
    icon: "/assets/iskm-d_vectorizednobg.png",
  },
  {
    label: "ISKM Australia",
    value: "iskm-australia",
    icon: "/assets/iskm-d_vectorizednobg.png",
  },
  {
    label: "ISKM Singapore",
    value: "iskm-singapore",
    icon: "/assets/iskm-d_vectorizednobg.png",
  },
  {
    label: "ISKM Canada",
    value: "iskm-canada",
    icon: "/assets/iskm-d_vectorizednobg.png",
  },
  {
    label: "ISKM France",
    value: "iskm-france",
    icon: "/assets/iskm-d_vectorizednobg.png",
  },
  {
    label: "ISKM Ukraine",
    value: "iskm-ukraine",
    icon: "/assets/iskm-d_vectorizednobg.png",
  },
];

const OrganizationSwitcher = () => {
  const { state } = useSidebar();
  const [open, setOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(organizations[0]);
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={selectedOrg.icon} alt={selectedOrg.label} />
                <AvatarFallback className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                  <Building2 className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{selectedOrg.label}</span>
                  <span className="truncate text-xs">Branch</span>
                </div>
              )}
              {!isCollapsed && <ChevronsUpDown className="ml-auto h-4 w-4" />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isCollapsed ? "right" : "bottom"}
            align={isCollapsed ? "start" : "end"}
            sideOffset={4}
          >
            <Command>
              <CommandInput placeholder="Search organization..." />
              <CommandList>
                <CommandEmpty>No organization found.</CommandEmpty>
                <CommandGroup>
                  {organizations.map((org) => (
                    <CommandItem
                      key={org.value}
                      onSelect={() => {
                        setSelectedOrg(org);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={org.icon} alt={org.label} />
                        <AvatarFallback className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                          <Building2 className="h-4 w-4 text-white" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1">
                        <span className="font-medium">{org.label}</span>
                        <span className="text-xs text-muted-foreground">Branch</span>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedOrg.value === org.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const AnnouncementCard = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative cursor-pointer hover:opacity-90 transition-opacity">
          <div className="absolute -top-1 -right-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
          </div>
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium">New Features</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-xs text-muted-foreground">
                Check out our latest platform updates!
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Latest Updates</DialogTitle>
        </DialogHeader>
        <Carousel className="w-full max-w-xs mx-auto">
          <CarouselContent>
            {[1, 2, 3].map((_, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">Feature {index + 1}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DialogContent>
    </Dialog>
  )
}

const UserSwitcher = () => {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
          <div className="flex items-center justify-center">
            <UserButton />
            {!isCollapsed && (
              <div className="ml-2">
                <SignOutButton>
                  <button>
                    <LogOut className="size-4" />
                  </button>
                </SignOutButton>
              </div>
            )}
          </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

const NavigationLink = ({ link, isCollapsed }: { 
  link: { to: string; label: string; icon: React.ReactElement };
  isCollapsed: boolean;
}) => {
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <Link
          key={link.to}
          to={link.to}
          className={cn(
            "flex items-center rounded-lg text-muted-foreground transition-all hover:text-foreground",
            "data-[active]:bg-gradient-to-r data-[active]:from-blue-500/10 data-[active]:to-purple-500/10 data-[active]:text-blue-600 dark:data-[active]:text-blue-400",
            isCollapsed 
              ? "h-10 w-10 justify-center mx-auto" 
              : "w-full gap-3 px-3 py-2"
          )}
          activeProps={{
            "data-active": true
          }}
        >
          {React.cloneElement(link.icon as React.ReactElement<{ className?: string }>, {
            className: cn(
              "transition-all",
              isCollapsed ? "h-5 w-5" : "h-4 w-4"
            )
          })}
          {!isCollapsed && (
            <span className="flex-1 whitespace-nowrap">{link.label}</span>
          )}
        </Link>
      </HoverCardTrigger>
      {isCollapsed && (
        <HoverCardContent side="right" className="w-40 p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{link.label}</p>
            <p className="text-xs text-muted-foreground">
              Navigate to {link.label.toLowerCase()}
            </p>
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  )
}

export const DashNav = () => {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <Link to="/" className={cn("flex items-center gap-2 font-semibold", isCollapsed ? "justify-center" : "px-3 py-2")}>
          <ArrowLeft className="h-5 w-5" />
          {!isCollapsed && <span>Back to Home</span>}
        </Link>
        <Separator />
        <OrganizationSwitcher />
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <nav className="flex flex-col items-center gap-1">
            {navigationLinks.map((link) => (
              <NavigationLink 
                key={link.to} 
                link={link} 
                isCollapsed={isCollapsed} 
              />
            ))}
          </nav>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className={cn(
          "flex flex-col items-center gap-4",
          isCollapsed ? "px-0" : "p-4"
        )}>
          <ModeToggle />
          {!isCollapsed && (
            <>
              <Separator />
              <AnnouncementCard />
            </>
          )}
        </div>
        <UserSwitcher />
      </SidebarFooter>
    </Sidebar>
  )
}
