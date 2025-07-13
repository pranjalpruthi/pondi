import * as React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Heart, MapPin, Phone, ExternalLink, Sparkles, Clock, Calendar } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useSound } from 'use-sound';
import { useSoundSettings } from '@/components/context/sound-context';
import { cn } from '@/lib/utils';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/animate-ui/radix/popover';
import { CopyButton } from '@/components/animate-ui/buttons/copy';
import { Button } from '@/components/ui/button';
import { IconBrandFacebook, IconBrandTelegram, IconBrandInstagram, IconBrandYoutube, IconBrandWhatsapp } from '@tabler/icons-react';

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
  const location = useLocation();
  const onCalendarPage = location.pathname === '/calender';
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
                  +91 80565 13859
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
          <div className="mt-6 md:mt-0 flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6 md:gap-8">
            {/* Temple Timings Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-16 h-16 p-1.5 rounded-xl shadow-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 border-blue-500/70 text-blue-700 dark:text-blue-300">
                  <div className="flex flex-col items-center justify-center gap-0.5">
                    <Clock className="h-6 w-6" />
                    <span className="text-[10px] font-semibold">Timings</span>
                  </div>
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
                <Button variant="outline" className="w-16 h-16 p-1.5 rounded-xl shadow-lg bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800 dark:hover:bg-yellow-700 border-yellow-500/70 text-yellow-700 dark:text-yellow-300">
                  <div className="flex flex-col items-center justify-center gap-0.5">
                    <Heart className="h-6 w-6" />
                    <span className="text-[10px] font-semibold">Donate</span>
                  </div>
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

            {/* Vaishnava Calendar Button */}
            {onCalendarPage ? (
              <Button
                variant="outline"
                className="w-16 h-16 p-1.5 rounded-xl shadow-lg bg-purple-200 dark:bg-purple-700 border-purple-500/70 text-purple-700 dark:text-purple-300"
              >
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <Calendar className="h-6 w-6" />
                  <span className="text-[10px] font-semibold">Here!</span>
                </div>
              </Button>
            ) : (
              <Link to="/calender" className="inline-block w-16 h-16">
                <Button variant="outline" className="w-16 h-16 p-1.5 rounded-xl shadow-lg bg-purple-100 hover:bg-purple-200 dark:bg-purple-800 dark:hover:bg-purple-700 border-purple-500/70 text-purple-700 dark:text-purple-300">
                  <div className="flex flex-col items-center justify-center gap-0.5">
                    <Calendar className="h-6 w-6" />
                    <span className="text-[10px] font-semibold">Calendar</span>
                  </div>
                </Button>
              </Link>
            )}

            {/* Contact Details Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-16 h-16 p-1.5 rounded-xl shadow-lg bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-700 border-green-500/70 text-green-700 dark:text-green-300">
                  <div className="flex flex-col items-center justify-center gap-0.5">
                    <Phone className="h-6 w-6" />
                    <span className="text-[10px] font-semibold">Contact</span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" align="center" className="w-full max-w-xs sm:max-w-sm bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-gray-300 dark:border-gray-700 shadow-xl rounded-xl">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-semibold text-green-600 dark:text-green-400">Contact Us</h4>
                      <CopyButton size="sm" variant="ghost" content="+91 80565 13859\niskm.pondicherry@gmail.com" className="text-green-600 dark:text-green-400" />
                    </div>
                    <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                        <a href="tel:+919042642103" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">+91 80565 13859</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-envelope text-green-600 dark:text-green-400" viewBox="0 0 16 16">
                          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                        </svg>
                        <a href="mailto:iskm.pondicherry@gmail.com" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">iskm.pondicherry@gmail.com</a>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-3.5 w-3.5 text-green-600 dark:text-green-400 mt-0.5" />
                        <p>Pudhuvai Vrindavanam (Hare Krishna Temple), RS No-54/3, Koodappakkam Main Rd, near Pogo Land, Pathukannu, Puducherry 605502</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="grid grid-cols-2 gap-2">
                      <a href="https://facebook.com/iskm.pondy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <IconBrandFacebook className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs">Facebook</span>
                      </a>
                      <a href="https://t.me/ISKMVaishnavasanga" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
                        <IconBrandTelegram className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                        <span className="text-xs">Telegram</span>
                      </a>
                      <a href="https://instagram.com/iskm_pondy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                        <IconBrandInstagram className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                        <span className="text-xs">Instagram</span>
                      </a>
                      <a href="https://www.youtube.com/@ISKMPondy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                        <IconBrandYoutube className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <span className="text-xs">YouTube</span>
                      </a>
                      <a href="https://wa.me/918056626108" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                        <IconBrandWhatsapp className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-xs">WhatsApp</span>
                      </a>
                      <a href="https://maps.app.goo.gl/8CGJUsGp4Vt8fLdN7" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                        <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-xs">Google Maps</span>
                      </a>
                    </div>
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
              <IconBrandFacebook className="h-4 w-4" />
            </a>
            <a 
              href="https://instagram.com/iskm_pondy" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#ffc547] dark:text-gray-400 dark:hover:text-[#ffc547] transition-colors"
              aria-label="Instagram"
            >
              <IconBrandInstagram className="h-4 w-4" />
            </a>
            <a 
              href="https://www.youtube.com/@ISKMPondy" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#0a84ff] dark:text-gray-400 dark:hover:text-[#0a84ff] transition-colors"
              aria-label="YouTube"
            >
              <IconBrandYoutube className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
