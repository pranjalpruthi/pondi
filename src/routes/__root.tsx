import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router' // Added useRouterState
import { ThemeProvider } from '@/components/theme-provider'
import { SoundProvider } from '@/components/context/sound-context' // Import SoundProvider
import { InitialPageLoader } from '@/components/ui/initial-page-loader'; // Import InitialPageLoader
import Navbar from '../components/dock'
import { NavBar } from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from 'sonner'; // Import Toaster from sonner
import { ClerkProvider } from '@clerk/tanstack-react-start'
import { CookieToast } from '@/components/cookie-toast';

export const Route = createRootRoute({
  pendingComponent: InitialPageLoader,
  component: () => {
    const pathname = useRouterState({ select: (s) => s.location.pathname });
    const isDashboardPage = pathname.startsWith('/dashboard');

    return (
      <ClerkProvider 
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
      >
        <ThemeProvider defaultTheme="system">
          <SoundProvider> {/* Wrap with SoundProvider */}
            {/* <TanstackQueryProvider> */}
              <div className="relative min-h-screen flex flex-col bg-background">
                {!isDashboardPage && <NavBar />} {/* Conditionally render top NavBar */}
                <main className={`flex-1 ${!isDashboardPage ? 'pt-16 sm:pt-20' : ''}`}> {/* Adjust padding based on NavBar visibility */}
                  <Outlet />
                </main>
                <Navbar isDashboardPage={isDashboardPage} /> {/* Pass isDashboardPage to Dock */}
                {!isDashboardPage && <Footer/>} {/* Conditionally render Footer */}
                {/* <TanstackQueryLayout /> */}
                <Toaster richColors position="top-right" /> {/* Add Toaster component */}
                {!isDashboardPage && <CookieToast />} {/* Conditionally render CookieToast */}
              </div>
            {/* </TanstackQueryProvider> */}
          </SoundProvider>
        </ThemeProvider>
      </ClerkProvider>
    )
  },
});
