import * as React from 'react'; // Added React import
import { Link } from '@tanstack/react-router'
import { Heart, MapPin, Phone, ExternalLink, Sparkles } from 'lucide-react' // Added Sparkles
import { Badge } from "@/components/ui/badge" // Added Badge import
import { useSound } from 'use-sound';
import { useSoundSettings } from '@/components/context/sound-context';
import { cn } from '@/lib/utils';

export default function Footer() {
  const { isSoundEnabled } = useSoundSettings();
  const [playHaribolSound, { stop: stopHaribolSound }] = useSound('/sounds/haribol.mp3', {
    volume: 0.75,
    soundEnabled: isSoundEnabled,
  });

  const safePlayHaribol = React.useCallback(() => {
    if (isSoundEnabled) {
      stopHaribolSound(); // Stop if already playing, to allow retrigger
      playHaribolSound();
    }
  }, [isSoundEnabled, playHaribolSound, stopHaribolSound]);

  return (
    <footer className="relative backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-t border-gray-200 dark:border-gray-800">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent dark:from-gray-950/90 dark:to-transparent -z-10"></div>
      {/* <RainbowGlow className="opacity-80" /> Removed RainbowGlow component */}
      
      <div className="container mx-auto px-0 xs:px-2 sm:px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Temple Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-[#e94a9c] via-[#ffc547] to-[#0a84ff] text-transparent bg-clip-text">ISKM Pondicherry</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              International Sri Krishna Mandir, established under the guidance of Srila Prabhupada's original teachings.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#e94a9c] mt-1 flex-shrink-0" />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Pudhuvai Vrindavanam, RS No-54/3, Koodappakkam, Main Road, Near Pogo Land, Pathukannu, Puducherry 605502
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#ffc547]" />
                <a href="tel:+919042642103" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#0a84ff] dark:hover:text-[#0a84ff] transition-colors">
                  +91 90426 42103
                </a>
              </div>
              <a 
                href="https://maps.app.goo.gl/8CGJUsGp4Vt8fLdN7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs inline-flex items-center gap-1 text-[#0a84ff] hover:underline mt-2"
              >
                <ExternalLink className="h-3 w-3" /> Get Directions
              </a>
            </div>
          </div>
          
          {/* Temple Timings */}
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-[#0a84ff] via-[#e94a9c] to-[#ffc547] text-transparent bg-clip-text">Temple Timings</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex justify-between">
                <span>Mangal Aarati</span>
                <span className="text-[#e94a9c]">4:30 AM</span>
              </li>
              <li className="flex justify-between">
                <span>Darshan Aarati</span>
                <span className="text-[#e94a9c]">7:15 AM</span>
              </li>
              <li className="flex justify-between">
                <span>Guru Puja</span>
                <span className="text-[#e94a9c]">7:20 AM</span>
              </li>
              <li className="flex justify-between">
                <span>Bhagvatam Discourse</span>
                <span className="text-[#e94a9c]">8:00 AM</span>
              </li>
              <li className="flex justify-between">
                <span>Temple Closes</span>
                <span className="text-[#e94a9c]">12:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Gaura Arati</span>
                <span className="text-[#e94a9c]">5:30 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Temple Closes</span>
                <span className="text-[#e94a9c]">6:30 PM</span>
              </li>
            </ul>
          </div>
          
          {/* Donate */}
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-[#ffc547] via-[#0a84ff] to-[#e94a9c] text-transparent bg-clip-text">Support Our Mission</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Your contribution helps us spread Krishna consciousness, distribute prasadam, and maintain our Gokulam Goshala.
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-xs">
              <h4 className="font-medium mb-2 text-[#ffc547]">Bank Transfer Details</h4>
              <div className="space-y-1 text-gray-600 dark:text-gray-400">
                <p><span className="font-medium">Account Name:</span> ISKM PONDICHERRY</p>
                <p><span className="font-medium">Account Type:</span> SAVINGS ACCOUNT</p>
                <p><span className="font-medium">Account No:</span> 1197110110052583</p>
                <p><span className="font-medium">IFSC Code:</span> UJVN0001197</p>
                <p><span className="font-medium">Bank:</span> UJJIVAN BANK, PONDICHERRY BRANCH</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Social Media & Copyright */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand and Copyright */}
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"> {/* Increased gap slightly */}
            <Link to="/" className="flex-shrink-0">
              <img
                src="/assets/iskmj.jpg"
                alt="ISKM Logo"
                width={28} // Smaller size for footer
                height={28}
                className="rounded-full"
              />
            </Link>
            <span>© {new Date().getFullYear()}</span>
            <Link to="/" className="font-semibold bg-gradient-to-r from-[#e94a9c] via-[#ffc547] to-[#0a84ff] bg-clip-text text-transparent">
              ISKM Pondicherry
            </Link>
            <span className="flex items-center gap-1">
              Built with <Heart className="h-4 w-4 text-[#e94a9c]" /> for Devotees
            </span>
          </div>
          
          {/* Social Links & Haribol Badge Group */}
          <div className="flex items-center gap-4">
            {/* Haribol Badge - Placed before social icons but within the same flex group for right alignment */}
            <Badge 
              variant="outline" 
              onClick={safePlayHaribol}
              className={cn(
                "cursor-pointer select-none px-3 py-1.5 text-sm font-medium rounded-full transition-all order-last md:order-first", // Order for mobile vs desktop
                "border-yellow-400 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-300 dark:hover:bg-yellow-800/50",
                "shadow-sm hover:shadow-md active:scale-95"
              )}
            >
              Haribol ! <Sparkles className="ml-1.5 h-4 w-4 text-yellow-500" />
            </Badge>
            
            {/* Social Links */}
            <a 
              href="https://facebook.com/iskm.pondy" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#e94a9c] dark:text-gray-400 dark:hover:text-[#e94a9c] transition-colors"
              aria-label="Facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
              </svg>
            </a>
            <a 
              href="https://instagram.com/iskm_pondy" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#ffc547] dark:text-gray-400 dark:hover:text-[#ffc547] transition-colors"
              aria-label="Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
              </svg>
            </a>
            <a 
              href="https://www.youtube.com/@ISKMPondy" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#0a84ff] dark:text-gray-400 dark:hover:text-[#0a84ff] transition-colors"
              aria-label="YouTube"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-youtube" viewBox="0 0 16 16">
                <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
