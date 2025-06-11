import * as React from 'react';
import { Link } from '@tanstack/react-router';
import { Heart, MapPin, Phone, ExternalLink, Sparkles, Clock } from 'lucide-react'; // Removed Info, Added Clock
import { Badge } from "@/components/ui/badge";
import { useSound } from 'use-sound';
import { useSoundSettings } from '@/components/context/sound-context';
import { cn } from '@/lib/utils';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/animate-ui/radix/popover'; // Added Popover
import { CopyButton } from '@/components/animate-ui/buttons/copy'; // Added CopyButton
import { Button } from '@/components/ui/button'; // Added Button

// Data for footer
const templeTimingsData = [
  { event: "Mangal Aarati", time: "4:30 AM" },
  { event: "Darshan Aarati", time: "7:15 AM" },
  { event: "Guru Puja", time: "7:20 AM" },
  { event: "Bhagvatam Discourse", time: "8:00 AM" },
  { event: "Temple Closes", time: "12:00 PM" },
  { event: "Gaura Arati", time: "5:30 PM" },
  { event: "Temple Closes", time: "6:30 PM" }
];

const bankDetailsData = {
  accountName: "ISKM PONDICHERRY",
  accountType: "SAVINGS ACCOUNT",
  accountNo: "1197110110052583",
  ifscCode: "UJVN0001197",
  bankName: "UJJIVAN BANK, PONDICHERRY BRANCH"
};

const formatTimingsForCopy = () => {
  return templeTimingsData.map(timing => `${timing.event}: ${timing.time}`).join('\n');
};

const formatBankDetailsForCopy = () => {
  return `Account Name: ${bankDetailsData.accountName}\nAccount Type: ${bankDetailsData.accountType}\nAccount No: ${bankDetailsData.accountNo}\nIFSC Code: ${bankDetailsData.ifscCode}\nBank: ${bankDetailsData.bankName}`;
};


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
      
      <div className="container mx-auto px-4 sm:px-4 py-10 md:py-12"> {/* Adjusted py for mobile */}
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-8"> {/* Changed to md:grid-cols-2 */}
          {/* Temple Info */}
          <div className="md:pr-6"> {/* Added padding to the right for desktop */}
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 bg-gradient-to-r from-[#e94a9c] via-[#ffc547] to-[#0a84ff] text-transparent bg-clip-text">ISKM Pondicherry</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
              International Sri Krishna Mandir, under Srila Prabhupada's original teachings.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#e94a9c] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Pudhuvai Vrindavanam, RS No-54/3, Koodappakkam Main Rd, Pathukannu, Puducherry 605502
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#ffc547]" />
                <a href="tel:+919042642103" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-[#0a84ff] dark:hover:text-[#0a84ff] transition-colors">
                  +91 90426 42103
                </a>
              </div>
              <a
                href="https://maps.app.goo.gl/8CGJUsGp4Vt8fLdN7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs inline-flex items-center gap-1 text-[#0a84ff] hover:underline mt-1"
              >
                <ExternalLink className="h-3 w-3" /> Get Directions
              </a>
            </div>
          </div>

          {/* Timings & Donation Popovers Section */}
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
            {/* Temple Timings Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto rounded-full border-blue-500/70 text-blue-600 hover:bg-blue-500/10 dark:border-blue-500/50 dark:text-blue-400 dark:hover:bg-blue-500/20 shadow-sm hover:shadow-md transition-all">
                  <Clock className="mr-2 h-4 w-4" /> View Temple Timings
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" align="center" className="w-full max-w-xs bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-gray-300 dark:border-gray-700 shadow-xl rounded-xl">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-semibold text-[#0a84ff]">Temple Timings</h4>
                    <CopyButton size="sm" variant="ghost" content={formatTimingsForCopy()} className="text-[#0a84ff]" />
                  </div>
                  <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                    {templeTimingsData.map((timing, index) => (
                      <li key={index} className="flex justify-between">
                        <span className="mr-4">{timing.event}</span>
                        <span className="font-medium text-[#e94a9c]">{timing.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </PopoverContent>
            </Popover>

            {/* Donation Details Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto rounded-full border-yellow-500/70 text-yellow-600 hover:bg-yellow-500/10 dark:border-yellow-500/50 dark:text-yellow-400 dark:hover:bg-yellow-500/20 shadow-sm hover:shadow-md transition-all">
                  <Heart className="mr-2 h-4 w-4" /> Donation Details
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" align="center" className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-gray-300 dark:border-gray-700 shadow-xl rounded-xl">
                <div className="space-y-4">
                  <div className="pt-0">
                     <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-semibold text-[#ffc547]">Bank Transfer Details</h4>
                        <CopyButton size="sm" variant="ghost" content={formatBankDetailsForCopy()} className="text-[#ffc547]" />
                    </div>
                    <div className="space-y-0.5 text-xs text-gray-700 dark:text-gray-300">
                      <p><strong>Account Name:</strong> {bankDetailsData.accountName}</p>
                      <p><strong>Account Type:</strong> {bankDetailsData.accountType}</p>
                      <p><strong>Account No:</strong> {bankDetailsData.accountNo}</p>
                      <p><strong>IFSC Code:</strong> {bankDetailsData.ifscCode}</p>
                      <p><strong>Bank:</strong> {bankDetailsData.bankName}</p>
                    </div>
                  </div>
                  {/* UPI QR Code Section */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">Scan to Pay with UPI</h4>
                    <div className="flex justify-center items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <img 
                        src="/assets/extra/miniqr.png" 
                        alt="UPI QR Code" 
                        className="w-28 h-auto object-contain" 
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Or use UPI ID:</p>
                      <div className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800/50 px-3 py-1.5 rounded-md max-w-xs mx-auto">
                        <span className="text-sm font-mono text-purple-600 dark:text-purple-400">ISKM.04@idfcbank</span>
                        <CopyButton size="sm" variant="ghost" content="ISKM.04@idfcbank" className="text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                        Your contribution supports our mission.
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

          {/* Social Media & Copyright */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Brand and Copyright */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <Link to="/" className="flex-shrink-0 order-1 sm:order-none">
                <img
                  src="/assets/iskmj.jpg"
                  alt="ISKM Logo"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </Link>
              <span className="order-2 sm:order-none">© {new Date().getFullYear()}</span>
              <Link to="/" className="font-semibold bg-gradient-to-r from-[#e94a9c] via-[#ffc547] to-[#0a84ff] bg-clip-text text-transparent order-3 sm:order-none">
                ISKM Pondicherry
              </Link>
              <span className="flex items-center gap-1 order-4 sm:order-none">
                Built with <Heart className="h-3.5 w-3.5 text-[#e94a9c]" /> for Devotees
              </span>
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <Link to="/terms-and-conditions" className="hover:text-[#0a84ff] transition-colors">
                Terms
              </Link>
              <Link to="/privacy-policy" className="hover:text-[#0a84ff] transition-colors">
                Privacy
              </Link>
              <Link to="/refund-and-cancellation-policy" className="hover:text-[#0a84ff] transition-colors">
                Refunds
              </Link>
            </div>

            {/* Social Links & Haribol Badge Group */}
            <div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-4">
            {/* Haribol Badge - Placed before social icons but within the same flex group for right alignment */}
            <Badge
              variant="outline"
              onClick={safePlayHaribol}
              className={cn(
                "cursor-pointer select-none px-2.5 py-1 text-xs sm:text-sm font-medium rounded-full transition-all order-last md:order-first", // Adjusted padding and font size
                "border-yellow-400 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-300 dark:hover:bg-yellow-800/50",
                "shadow-sm hover:shadow-md active:scale-95"
              )}
            >
              Haribol ! <Sparkles className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-500" /> {/* Adjusted sparkle size */}
            </Badge>
            
            {/* Social Links */}
            <a 
              href="https://facebook.com/iskm.pondy" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#e94a9c] dark:text-gray-400 dark:hover:text-[#e94a9c] transition-colors"
              aria-label="Facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16"> {/* Adjusted icon size */}
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
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16"> {/* Adjusted icon size */}
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
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-youtube" viewBox="0 0 16 16"> {/* Adjusted icon size */}
                <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
