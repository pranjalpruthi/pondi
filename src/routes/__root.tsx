import { createRootRoute, Outlet, useMatches } from '@tanstack/react-router'
import { ThemeProvider } from '@/components/theme-provider'
import { SoundProvider } from '@/components/context/sound-context' // Import SoundProvider
import Navbar from '../components/dock'
import { NavBar } from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from 'sonner'; // Import Toaster from sonner

export const Route = createRootRoute({
  component: () => {
    const matches = useMatches()
    // Check if any of the matched routes starts with '/dashboard'
    const isDashboardRoute = matches.some(match => 
      match.routeId.startsWith('/dashboard')
    )

    return (
      <ThemeProvider defaultTheme="system">
        <SoundProvider> {/* Wrap with SoundProvider */}
          {/* <TanstackQueryProvider> */}
            <div className="relative min-h-screen flex flex-col bg-background">
              {!isDashboardRoute && <NavBar />}
              <main className="flex-1 pt-5">
                <Outlet />
              </main>
              {!isDashboardRoute && <Navbar />}
              {!isDashboardRoute && <Footer/>}
              {/* <TanstackQueryLayout /> */}
              <Toaster richColors position="top-right" /> {/* Add Toaster component */}
            </div>
          {/* </TanstackQueryProvider> */}
        </SoundProvider>
      </ThemeProvider>
    );
  },
});
