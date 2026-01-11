import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router' // Added useRouterState
import { useEffect } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { SoundProvider } from '@/components/context/sound-context' // Import SoundProvider
import { InitialPageLoader } from '@/components/ui/initial-page-loader'; // Import InitialPageLoader
import { Analytics } from '@/components/analytics';
import { Analytics as VercelAnalytics } from "@vercel/analytics/react"
import Navbar from '../components/dock'
import { NavBar } from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from 'sonner'; // Import Toaster from sonner
import { ClerkProvider } from '@clerk/tanstack-react-start'
import { CookieToast } from '@/components/cookie-toast';
import GoogleTranslate from '../components/google-translate';

export const Route = createRootRoute({
  pendingComponent: InitialPageLoader,
  component: () => {
    const pathname = useRouterState({ select: (s) => s.location.pathname });
    const isDashboardPage = pathname.startsWith('/dashboard');

    // Inject TweakCN live preview script
    useEffect(() => {
      // Check if script already exists
      const existingScript = document.querySelector('script[src="https://tweakcn.com/live-preview.min.js"]');
      if (existingScript) return;

      const script = document.createElement('script');
      script.src = 'https://tweakcn.com/live-preview.min.js';
      script.crossOrigin = 'anonymous';
      script.async = true;
      document.head.appendChild(script);

      return () => {
        // Cleanup: remove script on unmount if it exists
        if (script.parentNode) {
          document.head.removeChild(script);
        }
      };
    }, []);


    return (
      <ClerkProvider
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
      >
        <ThemeProvider defaultTheme="light">
          <SoundProvider> {/* Wrap with SoundProvider */}
            {/* <TanstackQueryProvider> */}
            <div className="relative min-h-screen flex flex-col bg-background">
              {!isDashboardPage && <NavBar />} {/* Conditionally render top NavBar */}
              <main className={`flex-1 ${!isDashboardPage ? 'pt-16 sm:pt-20' : ''}`}> {/* Adjust padding based on NavBar visibility */}
                <Outlet />
              </main>
              <Analytics />
              <VercelAnalytics />
              {!isDashboardPage && <Navbar />} {/* Conditionally render Navbar/Dock */}
              {!isDashboardPage && <Footer />} {/* Conditionally render Footer */}
              {/* <TanstackQueryLayout /> */}
              <Toaster richColors position="top-right" /> {/* Add Toaster component */}
              {!isDashboardPage && <CookieToast />} {/* Conditionally render CookieToast */}
              {!isDashboardPage && <GoogleTranslate />}
            </div>
            {/* </TanstackQueryProvider> */}
          </SoundProvider>
        </ThemeProvider>
      </ClerkProvider>
    )
  },
});
