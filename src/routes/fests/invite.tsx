import { createFileRoute, useLocation } from '@tanstack/react-router';
import { useEffect, useState, useRef, type FC, type ReactNode, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Confetti, type ConfettiRef } from '@/components/magicui/confetti';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Play, Share2, Copy, Check, XIcon, PlusIcon } from "lucide-react";
import {
    IconBrandWhatsapp,
    IconBrandFacebook,
    IconBrandX,
    IconBrandTelegram,
} from '@tabler/icons-react';
import {
    MorphingDialog,
    MorphingDialogContainer,
    MorphingDialogContent,
    MorphingDialogClose,
    MorphingDialogTitle,
    useMorphingDialog,
    MorphingDialogTrigger,
    MorphingDialogImage
} from '@/components/motion-primitives/morphing-dialog';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import ShimmerText from '@/components/ui/shimmer-text';
import { AuroraText } from '@/components/magicui/aurora-text';
import NumberFlow, { NumberFlowGroup } from '@number-flow/react';
import { SponsorshipSection } from '@/components/homepage/sponsorship-section';
import { Marquee } from '@/components/magicui/marquee';
import { HighlightText } from '@/components/animate-ui/text/highlight';
import BookOpen from '~icons/fluent-emoji/open-book';
import Feather from '~icons/fluent-emoji/feather';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MorphingDialogSubtitle } from '@/components/motion-primitives/morphing-dialog';
import { FireworksBackground } from '@/components/animate-ui/backgrounds/fireworks';

// --- Reusable Components for the New Design ---

const OrnateDivider: FC = () => (
    <div className="flex items-center justify-center my-2 md:my-4">
        <div className="w-1/5 h-px bg-gradient-to-r from-transparent to-amber-700/50 dark:to-amber-500/50" />
        <Feather className="h-4 w-4 mx-2 text-amber-700/80 dark:text-amber-500/80" />
        <div className="w-1/5 h-px bg-gradient-to-l from-transparent to-amber-700/50 dark:to-amber-500/50" />
    </div>
);

const ScrollSection: FC<{ children: ReactNode; className?: string; id?: string }> = ({ children, className, id }) => (
    <section id={id} className={cn("py-12 px-4 sm:px-6 md:py-16", className)}>
        <div className="max-w-6xl mx-auto">
            {children}
        </div>
    </section>
);

const ScrollSectionTitle: FC<{ title: string; subtitle: ReactNode }> = ({ title, subtitle }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
    >
        <h2 className="text-2xl md:text-4xl font-serif font-bold text-indigo-900 dark:text-indigo-200 mb-2">
            {title}
        </h2>
        <div className="text-xs md:text-base text-stone-600 dark:text-stone-400 max-w-3xl mx-auto">{subtitle}</div>
    </motion.div>
);

const CountdownTimer = () => {
    const { t } = useTranslation();
    const eventDate = new Date("2025-08-16T15:00:00");
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [isExpired, setIsExpired] = useState(false);
    const [showFireworks, setShowFireworks] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = eventDate.getTime() - now.getTime();

            if (difference <= 0) {
                if (!isExpired) {
                    setIsExpired(true);
                    setShowFireworks(true);
                    // Hide fireworks after 10 seconds
                    setTimeout(() => setShowFireworks(false), 10000);
                }
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [isExpired]);

    if (isExpired) {
        return (
            <div className="relative text-center">
                {showFireworks && (
                    <div className="absolute inset-0 -m-8 pointer-events-none z-10">
                        <FireworksBackground
                            className="w-full h-full"
                            population={3}
                            color={["#ff6b35", "#f7931e", "#ffd700", "#ff1744", "#e91e63"]}
                            fireworkSize={{ min: 5, max: 10 }}
                            fireworkSpeed={{ min: 6, max: 10 }}
                            particleSize={{ min: 3, max: 8 }}
                            particleSpeed={{ min: 4, max: 8 }}
                        />
                    </div>
                )}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                    className="relative z-20"
                >
                    <h3 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-pulse mb-2">
                        🎉 Happy Śrī Kṛṣṇa Janmāṣṭamī! 🎉
                    </h3>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {t('countdown.expired')}
                    </p>
                </motion.div>
            </div>
        );
    }

    const timeUnits = Object.entries(timeLeft);

    return (
        <div className="inline-block">
            <div className="inline-flex justify-center items-center gap-1 sm:gap-1.5 p-2 bg-black/5 dark:bg-white/5 rounded-lg backdrop-blur-sm">
                <NumberFlowGroup>
                    {timeUnits.map(([unit, value], index) => (
                        <Fragment key={unit}>
                            <div className="flex flex-col items-center">
                                <p style={{ fontVariantNumeric: 'tabular-nums' }} className="text-lg sm:text-2xl font-bold text-indigo-900 dark:text-white">
                                    <NumberFlow value={value} format={{ minimumIntegerDigits: 2 }} />
                                </p>
                                <p className="text-[0.5rem] sm:text-[0.6rem] text-stone-600 dark:text-stone-400 uppercase tracking-wider">{t(`countdown.${unit}`)}</p>
                            </div>
                            {index < timeUnits.length - 1 && <p className="text-lg sm:text-2xl font-bold text-indigo-900/50 dark:text-white/50">:</p>}
                        </Fragment>
                    ))}
                </NumberFlowGroup>
            </div>
        </div>
    );
};


// --- Page Sections (Redesigned) ---

import { useInView } from 'motion/react';

const SponsorshipProgress: FC<{ sponsored: number; total: number }> = ({ sponsored, total }) => {
    const { t } = useTranslation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const percentage = (sponsored / total) * 100;

    return (
        <div ref={ref} className="w-full">
            <div className="text-center mb-2">
                <p className="text-sm text-stone-600 dark:text-stone-400" dangerouslySetInnerHTML={{
                    __html: t('sponsorshipProgress.sponsored', { sponsored: `<span class="font-bold text-indigo-800 dark:text-indigo-300">${sponsored.toLocaleString()}</span>`, total: `<span class="font-bold text-indigo-800 dark:text-indigo-300">${total.toLocaleString()}</span>` })
                }} />
            </div>
            <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-3 overflow-hidden">
                <motion.div
                    className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: isInView ? `${percentage}%` : '0%' }}
                    transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                />
            </div>
            <p style={{ fontVariantNumeric: 'tabular-nums' }} className="text-right text-xs font-semibold text-orange-600 dark:text-orange-400 mt-1">
                <NumberFlow value={isInView ? percentage : 0} format={{ maximumFractionDigits: 1, minimumFractionDigits: 1 }} />{t('sponsorshipProgress.progress')}
            </p>
        </div>
    );
};


const InviteHero: FC<{ onSponsorClick: () => void }> = ({ onSponsorClick }) => {
    const { t } = useTranslation();
    const [isInteracted, setIsInteracted] = useState(false);
    const [showHeroFireworks, setShowHeroFireworks] = useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const videoId = "AuZtQraCBd4";
    const silentUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`;
    const interactiveUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`;

    const handleInteraction = () => {
        if (!isInteracted) {
            setIsInteracted(true);
        }
    };

    // Show fireworks periodically for festive atmosphere
    useEffect(() => {
        const showFireworksInterval = setInterval(() => {
            setShowHeroFireworks(true);
            setTimeout(() => setShowHeroFireworks(false), 5000);
        }, 30000); // Show fireworks every 30 seconds

        // Show initial fireworks after 3 seconds
        const initialTimeout = setTimeout(() => {
            setShowHeroFireworks(true);
            setTimeout(() => setShowHeroFireworks(false), 5000);
        }, 3000);

        return () => {
            clearInterval(showFireworksInterval);
            clearTimeout(initialTimeout);
        };
    }, []);

    return (
        <div className="relative min-h-screen flex items-center justify-center text-stone-800 dark:text-stone-200 bg-amber-50/50 dark:bg-gray-900 px-4 overflow-hidden">
            {/* Festive Fireworks Background */}
            {showHeroFireworks && (
                <div className="absolute inset-0 pointer-events-none z-0">
                    <FireworksBackground
                        className="w-full h-full opacity-60"
                        population={2}
                        color={["#ff6b35", "#f7931e", "#ffd700", "#ff1744", "#e91e63", "#9c27b0"]}
                        fireworkSize={{ min: 3, max: 7 }}
                        fireworkSpeed={{ min: 4, max: 8 }}
                        particleSize={{ min: 2, max: 5 }}
                        particleSpeed={{ min: 3, max: 6 }}
                    />
                </div>
            )}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-teal-500/10 rounded-full filter blur-3xl opacity-50 dark:opacity-30" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full filter blur-3xl opacity-50 dark:opacity-30" />

            <div className="relative z-10 container mx-auto flex flex-col lg:grid lg:grid-cols-2 lg:gap-16 items-center justify-center min-h-screen pt-24 pb-32 md:pt-12">
                
                {/* Content Column (Left on Desktop) */}
                <div className="lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full"
                    >
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-serif text-indigo-900 dark:text-white leading-tight">
                            <AuroraText colors={["#be185d", "#fb923c", "#fde047"]}>
                                {t('inviteHero.title')}
                            </AuroraText>
                        </h1>
                        <p className="mt-3 text-lg sm:text-2xl md:text-3xl text-orange-600 dark:text-orange-400 font-semibold">{t('inviteHero.subtitle')}</p>
                    </motion.div>

                    {/* Video for Mobile/Tablet */}
                    <motion.div
                        ref={ref}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 100 }}
                        className="w-full max-w-3xl lg:hidden my-8"
                    >
                        {/* Animated Register Button - Above Video */}
                        <motion.div
                            className="flex justify-center mb-4"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="relative px-6 py-3 text-base rounded-full font-bold shadow-lg select-none bg-gradient-to-r from-blue-500 to-indigo-600 text-white transition-all duration-200 ring-1 ring-transparent hover:ring-blue-400 hover:shadow-xl flex items-center gap-2"
                            >
                                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Diya%20Lamp.png" alt="Diya Lamp" width={20} height={20} />
                                Secure your Free Spot
                            </button>
                        </motion.div>
                        <div className="w-full mx-auto rounded-3xl shadow-2xl border-8 border-white dark:border-gray-800 ring-4 ring-amber-300 dark:ring-amber-500 overflow-hidden">
                            <div className="aspect-video bg-black relative group" onClick={handleInteraction}>
                                <iframe
                                    key={isInteracted ? 'interactive-mobile' : 'silent-mobile'}
                                    src={isInteracted ? interactiveUrl : silentUrl}
                                    title="Janmashtami Festival Invitation"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                    allowFullScreen
                                    className="w-full h-full"
                                />
                                {!isInteracted && (
                                    <div className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/10 group-hover:bg-black/30 transition-colors duration-300">
                                        <Play className="h-16 w-16 text-white/70 drop-shadow-lg transition-transform duration-300 group-hover:scale-110" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="w-full flex flex-col items-center lg:items-start mt-8 lg:mt-8"
                    >
                        <CountdownTimer />
                        <div className="my-6 w-full max-w-md lg:max-w-none">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                                <div className="flex items-center justify-center gap-2 p-2.5 bg-black/5 dark:bg-white/5 rounded-lg">
                                    <Calendar className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                    <span className="font-medium text-[10px] sm:text-sm">{t('inviteHero.date')}</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 p-2.5 bg-black/5 dark:bg-white/5 rounded-lg">
                                    <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                    <span className="font-medium text-[10px] sm:text-sm">{t('inviteHero.time')}</span>
                                </div>
                                <a href="https://maps.app.goo.gl/k5wX9LMEtFX7UraEA" target="_blank" rel="noopener noreferrer" className="md:col-span-1 flex items-center justify-center gap-2 p-2.5 bg-black/5 dark:bg-white/5 rounded-lg group">
                                    <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                    <span className="font-medium text-[10px] sm:text-sm group-hover:underline">{t('inviteHero.venue')}</span>
                                </a>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full max-w-lg">
                            <Button
                                onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
                                size="lg"
                                className="w-full sm:w-auto h-auto min-h-[3rem] py-2 px-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Ticket.png" alt="Ticket" width="22" height="22" className="flex-shrink-0" />
                                    <span className="whitespace-normal text-center">{t('inviteHero.reserveButton')}</span>
                                </div>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                className="w-full sm:w-auto h-12 px-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-green-500 hover:to-emerald-600 text-sm"
                            >
                                <a href="https://pages.razorpay.com/pl_QrNlMduF5wojLm/view" target="_blank" rel="noopener noreferrer" onClick={onSponsorClick} className="flex items-center justify-center gap-2">
                                    <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Love%20Letter.png" alt="Love Letter" width="23" height="23" />
                                    {t('inviteHero.sponsorButton')}
                                </a>
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Video Column (Right on Desktop) */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 100 }}
                    className="w-full lg:col-span-1 order-1 lg:order-2 hidden lg:block"
                >
                    {/* Animated Register Button - Above Video */}
                    <motion.div
                        className="flex justify-center mb-4"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="relative px-6 py-3 text-base rounded-full font-bold shadow-lg select-none bg-gradient-to-r from-blue-500 to-indigo-600 text-white transition-all duration-200 ring-1 ring-transparent hover:ring-blue-400 hover:shadow-xl flex items-center gap-2"
                        >
                            <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Diya%20Lamp.png" alt="Diya Lamp" width={20} height={20} />
                            Secure your Free Spot
                        </button>
                    </motion.div>
                    <div className="w-full mx-auto rounded-3xl shadow-2xl border-8 border-white dark:border-gray-800 ring-4 ring-amber-300 dark:ring-amber-500 overflow-hidden">
                        <div className="aspect-video bg-black relative group" onClick={handleInteraction}>
                            {isInView && (
                                <iframe
                                    key={isInteracted ? 'interactive-desktop' : 'silent-desktop'}
                                    src={isInteracted ? interactiveUrl : silentUrl}
                                    title="Janmashtami Festival Invitation"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                    allowFullScreen
                                    className="w-full h-full"
                                />
                            )}
                            {!isInteracted && (
                                <div className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/10 group-hover:bg-black/30 transition-colors duration-300">
                                    <Play className="h-16 w-16 text-white/70 drop-shadow-lg transition-transform duration-300 group-hover:scale-110" />
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
                
                {/* Bottom Progress Bar */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="lg:col-span-2 w-full absolute bottom-4 left-0 right-0 px-4 sm:px-6 lg:px-8 order-3"
                >
                    <SponsorshipProgress sponsored={2458} total={5108} />
                </motion.div>
            </div>
        </div>
    );
};

const DetailsAndRegistrationSection = () => {
    const { t } = useTranslation();
    const [isFormLoading, setIsFormLoading] = useState(true);
    const handleAddToCalendar = () => {
        const eventDateStr = "Saturday, 16th August 2025";
        const eventTimeStr = "3:00 PM onwards";
        const venueName = "Jayaram Thirumana Nilayam, Puducherry";
        const venueMapLink = "https://maps.app.goo.gl/8CGJUsGp4Vt8fLdN7";

        const fullDescription = `Join us for the divine appearance day of Lord Sri Krishna.

Date: ${eventDateStr}
Time: ${eventTimeStr}
Venue: ${venueName}
Google Maps: ${venueMapLink}

Event details: https://pudhuvai.vrindavanam.org.in/fests/invite

Stay connected with us:
Facebook: https://facebook.com/iskm.pondy
Telegram: https://t.me/ISKMVaishnavasanga
Instagram: https://instagram.com/iskm_pondy
YouTube: https://www.youtube.com/@ISKMPondy
WhatsApp: https://wa.me/918056626108`;

        const event = {
            title: "Śrī Kṛṣṇa Janmāṣṭamī Grand Festival",
            start: "20250816T150000",
            end: "20250817T000000",
            description: fullDescription,
            location: venueName
        };
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
        window.open(googleCalendarUrl, '_blank');
    };

    const handleViewLocation = () => {
        window.open('https://maps.app.goo.gl/k5wX9LMEtFX7UraEA', '_blank');
    };

    const detailItems = [
        { icon: Calendar, title: t('detailsAndRegistration.calendarTitle'), subtitle: t('detailsAndRegistration.calendarSubtitle'), buttonText: t('detailsAndRegistration.calendarButton'), action: handleAddToCalendar },
        { icon: Clock, title: t('detailsAndRegistration.clockTitle'), subtitle: t('detailsAndRegistration.clockSubtitle'), buttonText: t('detailsAndRegistration.clockButton'), action: handleAddToCalendar },
        { icon: MapPin, title: t('detailsAndRegistration.mapTitle'), subtitle: t('detailsAndRegistration.mapSubtitle'), buttonText: t('detailsAndRegistration.mapButton'), action: handleViewLocation }
    ];

    return (
        <ScrollSection id="register" className="bg-stone-100/70 dark:bg-gray-800/20">
            <div className="grid lg:grid-cols-3 gap-12 items-start pt-12">
                {/* Form Section - Appears first on mobile */}
                <div className="lg:col-span-2 lg:order-2">
                    <Card className="max-w-4xl mx-auto shadow-2xl border-amber-200 dark:border-amber-800 border-2 overflow-hidden bg-white dark:bg-gray-900">
                        <CardContent className="p-2 bg-white relative">
                            {isFormLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-10 p-4">
                                    <ShimmerText className="text-lg sm:text-xl md:text-2xl leading-loose" text={t('detailsAndRegistration.shimmerText')} />
                                </div>
                            )}
                            <iframe
                                data-tally-src="https://tally.so/embed/mDoRD5?alignLeft=1&transparentBackground=1&dynamicHeight=1"
                                loading="lazy"
                                width="100%"
                                height="600"
                                frameBorder="0"
                                marginHeight={0}
                                marginWidth={0}
                                title={t('detailsAndRegistration.formTitle')}
                                className={cn("rounded-lg transition-opacity duration-500", isFormLoading ? 'opacity-0' : 'opacity-100')}
                                onLoad={() => setIsFormLoading(false)}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Details Section - Appears below form on mobile */}
                <div className="lg:col-span-1 lg:order-1 flex flex-col gap-8">
                    <div className="grid grid-cols-2 gap-4">
                        {detailItems.slice(0, 2).map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="p-3 sm:p-4 rounded-xl bg-white dark:bg-gray-800/50 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center justify-between h-full"
                            >
                                <div>
                                    <div className="p-2 sm:p-3 bg-orange-100 dark:bg-orange-500/10 rounded-full mb-2 sm:mb-3 inline-block">
                                        <item.icon className="h-5 w-5 sm:h-8 sm:w-8 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <p className="text-sm sm:text-lg font-bold text-indigo-900 dark:text-indigo-200 leading-tight">{item.title}</p>
                                    <p className="text-[10px] sm:text-sm text-stone-500 dark:text-stone-400">{item.subtitle}</p>
                                </div>
                                {item.action && (
                                    <Button
                                        onClick={item.action}
                                        size="sm"
                                        className="mt-3 sm:mt-4 w-full rounded-full font-semibold transition-all duration-300 bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:hover:bg-orange-900/80 text-[10px] sm:text-sm"
                                    >
                                        {item.buttonText}
                                    </Button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                    {(() => {
                        const item = detailItems[2];
                        return (
                            <motion.div
                                key={2}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="p-4 sm:p-6 rounded-xl bg-white dark:bg-gray-800/50 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-between text-center h-full"
                            >
                                <div>
                                    <div className="p-3 sm:p-4 bg-orange-100 dark:bg-orange-500/10 rounded-full mb-3 sm:mb-4 inline-block">
                                        <item.icon className="h-6 w-6 sm:h-10 sm:w-10 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <p className="text-base sm:text-2xl font-bold text-indigo-900 dark:text-indigo-200">{item.title}</p>
                                    <p className="text-xs sm:text-md text-stone-500 dark:text-stone-400">{item.subtitle}</p>
                                </div>
                                {item.action && (
                                    <Button
                                        onClick={item.action}
                                        className="mt-4 sm:mt-6 w-full rounded-full py-2 sm:py-3 px-4 sm:px-6 text-xs sm:text-lg font-semibold transition-all duration-300 bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:hover:bg-orange-900/80 dark:hover:shadow-[0_0_15px_rgba(251,146,60,0.5)]"
                                    >
                                        {item.buttonText}
                                    </Button>
                                )}
                            </motion.div>
                        );
                    })()}
                </div>
            </div>
        </ScrollSection>
    );
};


const QuoteSection: FC<{ quote: { text: string; source: string }, index: number }> = ({ quote, index }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const fullQuote = `“${quote.text}”\n— ${quote.source}`;
        navigator.clipboard.writeText(fullQuote);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        const shareData = {
            title: 'Sacred Wisdom from the Janmāṣṭamī Invitation',
            text: `A beautiful verse from the scriptures:\n\n“${quote.text}”\n— ${quote.source}\n\n`,
            url: 'https://pondi.vercel.app/fests/invite'
        };
        try {
            if (navigator.share) {
                navigator.share(shareData);
            } else {
                // Fallback for browsers that don't support Web Share API
                handleCopy();
                alert("Quote copied to clipboard! You can now paste it to share.");
            }
        } catch (error) {
            console.error("Error sharing:", error);
            handleCopy();
            alert("Quote copied to clipboard! You can now paste it to share.");
        }
    };

    return (
        <ScrollSection id={`wisdom-${index}`}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.2 }}
            >
                <Card className="shadow-lg border-l-4 border-amber-500 bg-white dark:bg-gray-800/30 overflow-hidden">
                    <CardContent className="p-6 md:p-8">
                        <blockquote className="text-center">
                            <p className="text-lg md:text-2xl font-serif text-stone-700 dark:text-stone-300 leading-relaxed mb-4 italic">
                                “{quote.text}”
                            </p>
                            <footer className="text-sm md:text-base font-semibold text-amber-700 dark:text-amber-500">
                                — {quote.source}
                            </footer>
                        </blockquote>
                        <div className="flex justify-center gap-4 mt-6">
                            <Button variant="outline" onClick={handleCopy}>
                                {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
                                {copied ? t('quote.copied') : t('quote.copy')}
                            </Button>
                            <Button variant="outline" onClick={handleShare}>
                                <Share2 className="h-4 w-4 mr-2" />
                                {t('quote.share')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </ScrollSection>
    );
};

const SocialShare = () => {
    const { t } = useTranslation();
    const shareText = `🙌 Hare Kṛṣṇa! You are joyfully invited to the Grand Janmāṣṭamī Festival! 🙏\n\nJoin us to celebrate the divine appearance of Lord Krishna with ecstatic kirtan, enlightening discourses, and delicious prasadam.\n\n📅 Date: 16 AUG 2025\n⏰ Time: 3 PM - 12 MIDNIGHT\n📍 Venue: Jayaram Thirumana Nilayam, Puducherry\n\n"One who knows the transcendental nature of My appearance and activities...attains My eternal abode." - Gita 4.9`;
    const eventUrl = "https://pudhuvai.vrindavanam.org.in/fests/invite";
    const shareActions = [
        { name: "WhatsApp", icon: IconBrandWhatsapp, color: "bg-[#25D366] hover:bg-[#25D366]/90", action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + eventUrl)}`, '_blank') },
        { name: "Facebook", icon: IconBrandFacebook, color: "bg-[#1877F2] hover:bg-[#1877F2]/90", action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`, '_blank') },
        { name: "Twitter", icon: IconBrandX, color: "bg-black hover:bg-black/90", action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("Join us for the Grand Śrī Kṛṣṇa Janmāṣṭamī Festival! 🙏 #Janmashtami #Krishna #ISKM")}&url=${encodeURIComponent(eventUrl)}`, '_blank') },
        { name: "Telegram", icon: IconBrandTelegram, color: "bg-[#229ED9] hover:bg-[#229ED9]/90", action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(shareText)}`, '_blank') }
    ];

    return (
        <div className="text-center">
            <p className="text-lg font-semibold text-indigo-900 dark:text-indigo-200 mb-4">{t('socialShare.title')}</p>
            <div className="flex justify-center items-center gap-3">
                {shareActions.map(action => (
                    <motion.button
                        key={action.name}
                        onClick={action.action}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn("w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg", action.color)}
                        aria-label={`Share on ${action.name}`}
                    >
                        <action.icon className="h-7 w-7" />
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

const Janmashtami2024Highlights = () => {
    const { t } = useTranslation();
    const [isInteracted, setIsInteracted] = useState(false);
    const [copied, setCopied] = useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    const videoId = "DuZm2EPOPkI";
    const silentUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`;
    const interactiveUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`;

    const handleInteraction = () => {
        if (!isInteracted) {
            setIsInteracted(true);
        }
    };

    const verses = [
        { text: "One who knows the transcendental nature of My appearance and activities does not, upon leaving the body, take his birth again in this material world, but attains My eternal abode, O Arjuna.", source: "Bhagavad-gita As It Is 4.9" },
        { text: "My Lord, You are the well-wisher of the cows and the Brahmanas. You are the well-wisher of the entire human society and world.", source: "Vishnu Purana 1.19.65" },
    ];

    const combinedQuoteText = verses.map(q => `“${q.text}”\n— ${q.source}`).join('\n\n');

    const handleCopy = () => {
        navigator.clipboard.writeText(combinedQuoteText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        const shareData = {
            title: 'Sacred Wisdom from the Janmāṣṭamī Invitation',
            text: `Beautiful verses from the scriptures:\n\n${combinedQuoteText}\n\n`,
            url: 'https://pondi.vercel.app/fests/invite'
        };
        try {
            if (navigator.share) {
                navigator.share(shareData);
            } else {
                handleCopy();
                alert("Quotes copied to clipboard! You can now paste them to share.");
            }
        } catch (error) {
            console.error("Error sharing:", error);
            handleCopy();
            alert("Quotes copied to clipboard! You can now paste them to share.");
        }
    };

    return (
        <section id="janmashtami-2024-highlights" className="bg-stone-100/70 dark:bg-gray-800/20 py-12 md:py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid md:grid-cols-3 gap-12 items-center">
                    <div className="md:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6 }}
                            className="text-center md:text-left mb-8"
                        >
                            <h2 className="text-3xl md:text-5xl font-serif font-bold text-indigo-900 dark:text-indigo-200">
                                {t('highlights.title')}
                            </h2>
                        </motion.div>
                        <motion.div
                            ref={ref}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-8 border-white dark:border-gray-800 ring-4 ring-amber-300 dark:ring-amber-500 relative group" onClick={handleInteraction}>
                                {isInView && (
                                    <iframe
                                        key={isInteracted ? 'interactive' : 'silent'}
                                        src={isInteracted ? interactiveUrl : silentUrl}
                                        title="Sri Krishna Janmashtami Celebration Highlights"
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                        allowFullScreen
                                    />
                                )}
                                {!isInteracted && (
                                    <div className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/10 group-hover:bg-black/30 transition-colors duration-300">
                                        <Play className="h-16 w-16 text-white/70 drop-shadow-lg transition-transform duration-300 group-hover:scale-110" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                    <div className="md:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <Card className="shadow-lg bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        {verses.map((quote, index) => (
                                            <Fragment key={index}>
                                                <blockquote className="text-center">
                                                    <p className="text-sm md:text-base font-serif text-stone-700 dark:text-stone-300 leading-relaxed italic">
                                                        “{quote.text}”
                                                    </p>
                                                    <footer className="mt-2 text-xs md:text-sm font-semibold text-amber-700 dark:text-amber-500">
                                                        — {quote.source}
                                                    </footer>
                                                </blockquote>
                                                {index < verses.length - 1 && (
                                                    <div className="flex items-center justify-center">
                                                        <Feather className="h-5 w-5 text-amber-700/50 dark:text-amber-500/50" />
                                                    </div>
                                                )}
                                            </Fragment>
                                        ))}
                                    </div>
                                    <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-stone-200 dark:border-gray-700">
                                        <Button variant="outline" size="sm" onClick={handleCopy}>
                                            {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
                                            {copied ? t('quote.copied') : t('quote.copy')}
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={handleShare}>
                                            <Share2 className="h-4 w-4 mr-2" />
                                            {t('quote.share')}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
            <motion.div 
                className="mt-12"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7 }}
            >
                <GalleryMarquee images={festImages} from_bg="from-stone-100/70 dark:from-gray-800/20" />
            </motion.div>
        </section>
    );
};

const VideoHighlightsSection = () => {
    const { t } = useTranslation();
    const videos = [
        { icon: Play, title: t('videoHighlights.video1Title'), subtitle: t('videoHighlights.video1Subtitle'), videoId: "rQNBQ3NXZ90?t=1988" },
        { icon: BookOpen, title: t('videoHighlights.video2Title'), subtitle: t('videoHighlights.video2Subtitle'), videoId: "8RePAEXjiDg" }
    ];

    return (
        <ScrollSection id="inspiration">
            <ScrollSectionTitle title={t('videoHighlights.title')} subtitle={t('videoHighlights.subtitle')} />
            <div className="grid md:grid-cols-2 gap-8 items-start">
                {videos.map((video, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                        <Card className="overflow-hidden shadow-xl h-full flex flex-col bg-white dark:bg-gray-800/50">
                            <CardHeader className="p-4 md:p-6">
                                <video.icon className="h-8 w-8 md:h-10 md:w-10 text-orange-600 dark:text-orange-400 mb-2" />
                                <CardTitle className="text-lg md:text-xl font-bold text-indigo-900 dark:text-indigo-200">{video.title}</CardTitle>
                                <CardDescription className="text-sm md:text-base text-stone-500 dark:text-stone-400 mt-1">{video.subtitle}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 flex-grow">
                                <div className="aspect-video bg-black">
                                    <iframe src={`https://www.youtube.com/embed/${video.videoId}`} title={video.title} className="w-full h-full" allowFullScreen />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </ScrollSection>
    );
};

// --- Main Page Component ---

const MainAltarWorshipIcon = ({ className }: { className?: string }) => <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Folded%20Hands.png" alt="Folded Hands" className={className} />;
const PrasadamIcon = ({ className }: { className?: string }) => <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Cook.png" alt="Cook" className={className} />;
const BooksAndStallsIcon = ({ className }: { className?: string }) => <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Teacher.png" alt="Woman Teacher" className={className} />;
const CommunityOutreachIcon = ({ className }: { className?: string }) => <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Revolving%20Hearts.png" alt="Revolving Hearts" className={className} />;
const CulturalIcon = ({ className }: { className?: string }) => <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Halo.png" alt="Smiling Face with Halo" className={className} />;

const festImages = [
    'f1.jpeg', 'f4.jpeg', 'f6.jpeg', 'f8.jpeg', 'f9.jpeg',
    'f10.jpeg', 'f11.jpeg', 'f12.jpeg', 'f13.jpeg', 'f14.jpeg',
    'f15.jpeg', 'f17.jpeg', 'f18.jpeg', 'f19.jpeg'
].map(img => `/fest/${img}`);

const ImageCard = ({ src, alt }: { src: string; alt: string }) => (
    <MorphingDialog>
        <MorphingDialogTrigger>
            <figure className={cn(
                "relative w-64 h-40 cursor-pointer overflow-hidden rounded-xl border p-1 mr-4",
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
            )}>
                <MorphingDialogImage src={src} alt={alt} className="w-full h-full object-cover rounded-lg" />
            </figure>
        </MorphingDialogTrigger>
        <MorphingDialogContainer>
            <MorphingDialogContent className='relative'>
                <MorphingDialogImage
                    src={src}
                    alt={alt}
                    className='h-auto w-full max-w-[90vw] rounded-lg object-cover lg:h-[90vh]'
                />
            </MorphingDialogContent>
            <MorphingDialogClose
                className='fixed right-4 top-4 h-fit w-fit rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm p-1.5'
                variants={{
                    initial: { opacity: 0 },
                    animate: {
                        opacity: 1,
                        transition: { delay: 0.3, duration: 0.1 },
                    },
                    exit: { opacity: 0, transition: { duration: 0 } },
                }}
            >
                <XIcon className='h-5 w-5 text-stone-700 dark:text-stone-300' />
            </MorphingDialogClose>
        </MorphingDialogContainer>
    </MorphingDialog>
);

const GalleryMarquee = ({ images, from_bg }: { images: string[], from_bg: string }) => {
    const firstRow = images.slice(0, Math.ceil(images.length / 2));
    const secondRow = images.slice(Math.ceil(images.length / 2));

    return (
        <div className="relative h-96 w-full overflow-hidden rounded-lg">
            <Marquee pauseOnHover className="[--duration:60s]">
                {firstRow.map((src, i) => <ImageCard key={`r1-${i}`} src={src} alt={`Gallery image ${i + 1}`} />)}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:60s]">
                {secondRow.map((src, i) => <ImageCard key={`r2-${i}`} src={src} alt={`Gallery image ${i + 1 + firstRow.length}`} />)}
            </Marquee>
            <div className={cn("pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r to-transparent", from_bg)} />
            <div className={cn("pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l to-transparent", from_bg)} />
        </div>
    );
};

import { Trans } from 'react-i18next';

const EventActivitiesSection = () => {
    const { t } = useTranslation();
    const eventActivities = [
        {
            category: t('eventActivities.mainAltar.category'),
            icon: MainAltarWorshipIcon,
            isCustom: true,
            description: t('eventActivities.mainAltar.description'),
            activities: Object.values(t('eventActivities.mainAltar.activities', { returnObjects: true }) as Record<string, { title: string, description: string }>)
        },
        {
            category: t('eventActivities.cultural.category'),
            icon: CulturalIcon,
            isCustom: true,
            description: t('eventActivities.cultural.description'),
            activities: Object.values(t('eventActivities.cultural.activities', { returnObjects: true }) as Record<string, { title: string, description: string }>)
        },
        {
            category: t('eventActivities.prasadam.category'),
            icon: PrasadamIcon,
            isCustom: true,
            description: t('eventActivities.prasadam.description'),
            activities: Object.values(t('eventActivities.prasadam.activities', { returnObjects: true }) as Record<string, { title: string, description: string }>)
        },
        {
            category: t('eventActivities.stalls.category'),
            icon: BooksAndStallsIcon,
            isCustom: true,
            description: t('eventActivities.stalls.description'),
            activities: Object.values(t('eventActivities.stalls.activities', { returnObjects: true }) as Record<string, { title: string, description: string }>)
        },
        {
            category: t('eventActivities.outreach.category'),
            icon: CommunityOutreachIcon,
            isCustom: true,
            description: t('eventActivities.outreach.description'),
            activities: Object.values(t('eventActivities.outreach.activities', { returnObjects: true }) as Record<string, { title: string, description: string }>)
        },
    ];
    return (
    <ScrollSection id="activities" className="bg-stone-100/70 dark:bg-gray-800/20">
        <ScrollSectionTitle 
            title={t('activities.title')}
            subtitle={
                <Trans i18nKey="activities.subtitle">
                    Immerse yourself in a variety of spiritual and cultural activities. Here’s a glimpse of what awaits you at <HighlightText text="Śrī Kṛṣṇa Janmāṣṭamī 2025" className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-500/30 dark:to-orange-500/30 text-orange-800 dark:text-orange-200" />.
                </Trans>
            }
        />
        {/* Responsive Grid: 3 columns on mobile, auto-fit on desktop */}
        <div className="grid grid-cols-3 gap-2 md:gap-6 md:[grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
            {eventActivities.map((category, index) => (
                <motion.div
                    key={category.category}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={cn(
                        "md:aspect-auto",
                        eventActivities.length % 3 === 2 && index === eventActivities.length - 1
                            ? "col-span-2 aspect-[2/1]"
                            : "aspect-square"
                    )}
                >
                    <MorphingDialog
                        transition={{
                            type: 'spring',
                            bounce: 0.05,
                            duration: 0.25,
                        }}
                    >
                        <MorphingDialogTrigger className="w-full h-full group">
                            {/* Responsive Card Layout */}
                            <Card className="h-full md:h-36 flex flex-col justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-gray-900 border border-stone-200 dark:border-gray-700 cursor-pointer p-2 relative md:p-0">
                                {/* Use flex-col for mobile, flex-row for desktop */}
                                <CardHeader className="flex flex-col md:flex-row items-center justify-center md:justify-between w-full h-full md:h-auto gap-2 md:gap-4 p-0 md:p-4">
                                    {/* Icon and Title container */}
                                    <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-2 md:gap-4 flex-grow md:flex-grow-0">
                                        {category.isCustom ? (
                                            <category.icon className="h-8 w-8 md:h-16 md:w-16" />
                                        ) : (
                                            <div className="p-2 md:p-3 bg-orange-100 dark:bg-orange-900/50 rounded-full">
                                                <category.icon className="h-5 w-5 md:h-12 md:w-12 text-orange-600 dark:text-orange-400" />
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <MorphingDialogTitle className="text-[9px] leading-tight mt-1 md:text-lg font-semibold text-indigo-900 dark:text-indigo-200">{category.category}</MorphingDialogTitle>
                                            {category.category === "Community & Outreach" && (
                                                <div className="hidden md:flex items-center gap-2 mt-2">
                                                    <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">Temple Vision & Project</span>
                                                    <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Vedic School</span>
                                                    <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">Go Seva</span>
                                                    <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">Anna-dāna Catering</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Plus Icon & Text */}
                                     <div className='absolute top-1 right-1 md:relative md:top-auto md:right-auto flex items-center justify-center gap-1 md:gap-1.5 rounded-full bg-orange-500 text-white transition-all duration-300 group-hover:bg-orange-600 group-hover:scale-110 active:scale-[0.98] p-1 md:px-3 md:py-2'>
                                        <span className="hidden md:inline text-[10px] font-semibold">{t('eventActivities.discover')}</span>
                                        <PlusIcon className="h-2 w-2 md:h-4 md:w-4" />
                                    </div>
                                </CardHeader>
                            </Card>
                        </MorphingDialogTrigger>
                        <MorphingDialogContainer>
                            <MorphingDialogContent className="relative w-full max-w-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-stone-200 dark:border-gray-700 rounded-2xl">
                                <ScrollArea className="h-[80vh] max-h-[600px]">
                                    <div className="p-8">
                                        <div className="flex items-center gap-4 mb-6">
                                            {category.isCustom ? (
                                                <category.icon className="h-16 w-16 md:h-20 md:w-20" />
                                            ) : (
                                                <div className="p-4 bg-orange-100 dark:bg-orange-500/10 rounded-full">
                                                    <category.icon className="h-12 w-12 md:h-16 md:w-16 text-orange-600 dark:text-orange-400" />
                                                </div>
                                            )}
                                            <div>
                                                <MorphingDialogTitle className="text-2xl md:text-3xl font-bold text-indigo-900 dark:text-indigo-200">{category.category}</MorphingDialogTitle>
                                                <MorphingDialogSubtitle className="text-sm md:text-base text-stone-600 dark:text-stone-400">{category.description}</MorphingDialogSubtitle>
                                            </div>
                                        </div>
                                        <ul className="space-y-4">
                                            {category.activities.map(activity => (
                                                <li key={activity.title} className="flex items-start gap-4 p-3 bg-stone-50 dark:bg-gray-800/50 rounded-lg">
                                                    <Feather className="h-5 w-5 mt-1 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                                    <div>
                                                        <p className="font-bold text-base md:text-lg text-stone-800 dark:text-stone-200">{activity.title}</p>
                                                        <p className="text-sm md:text-base text-stone-600 dark:text-stone-400">{activity.description}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </ScrollArea>
                                <MorphingDialogClose className="absolute top-4 right-4" />
                            </MorphingDialogContent>
                        </MorphingDialogContainer>
                    </MorphingDialog>
                </motion.div>
            ))}
        </div>
    </ScrollSection>
    )
};

export const Route = createFileRoute('/fests/invite')({
  component: JanmashtamiPage,
});

function JanmashtamiContent() {
    const location = useLocation();
    const confettiRef = useRef<ConfettiRef>(null);
    const { setIsOpen } = useMorphingDialog();

    const handleSponsorConfetti = () => {
        confettiRef.current?.fire({
            particleCount: 400,
            spread: 100,
            origin: { y: 0.5 }
        });
    };

    const quotes = [
        { text: "One who knows the transcendental nature of My appearance and activities does not, upon leaving the body, take his birth again in this material world, but attains My eternal abode, O Arjuna.", source: "Bhagavad-gita As It Is 4.9" },
        { text: "My Lord, You are the well-wisher of the cows and the Brahmanas. You are the well-wisher of the entire human society and world.", source: "Vishnu Purana 1.19.65" },
        { text: "O Krsna, appearing on the eighth day of the dark moon... You spread auspiciousness over the earth's surface, and You pleased and pacified the minds and hearts of saintly devotees.", source: "Sri Krsna Lila Stava" }
    ];

    useEffect(() => {
        const handleTallySubmission = (event: MessageEvent) => {
            if (event.data?.event === "Tally.FormSubmitted" && event.origin === "https://tally.so") {
                console.log("Tally form submitted!", event.data);
                confettiRef.current?.fire({
                    particleCount: 200,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                setIsOpen(true);
            }
        };

        window.addEventListener("message", handleTallySubmission);

        const script = document.createElement("script");
        script.src = "https://tally.so/widgets/embed.js";
        script.async = true;
        document.body.appendChild(script);
        script.onload = () => {
            if (window.Tally) {
                window.Tally.loadEmbeds();
            }
        };

        return () => {
            window.removeEventListener("message", handleTallySubmission);
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [setIsOpen]);

    useEffect(() => {
        if (location.hash === '#register') {
            const element = document.getElementById('register');
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
    }, [location.hash]);

    return (
        <div className="min-h-screen bg-amber-50 dark:bg-gray-950 text-stone-800 font-sans overflow-hidden">
            <Confetti
                ref={confettiRef}
                manualstart
                className="fixed top-0 left-0 w-full h-full pointer-events-none z-[100]"
            />
            <InviteHero onSponsorClick={handleSponsorConfetti} />
            <main>
                <DetailsAndRegistrationSection />
                <OrnateDivider />
                <EventActivitiesSection />
                <OrnateDivider />
                <div id="sponsor-seva">
                    <SponsorshipSection />
                </div>
                <OrnateDivider />
                <Janmashtami2024Highlights />
                <OrnateDivider />
                <VideoHighlightsSection />
                <OrnateDivider />
                <QuoteSection quote={quotes[2]} index={2} />
            </main>
        </div>
    );
}

function JanmashtamiDialog() {
    const { t } = useTranslation();
    const { setIsOpen } = useMorphingDialog();

    const handleSponsorClick = () => {
        setIsOpen(false);
        setTimeout(() => {
            document.getElementById('sponsor-seva')?.scrollIntoView({ behavior: 'smooth' });
        }, 150); // Delay to allow dialog to close
    };

    return (
        <MorphingDialogContainer>
            <MorphingDialogContent className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full">
                <MorphingDialogTitle>
                    <h2 className="text-xl md:text-2xl font-bold text-center text-indigo-900 dark:text-indigo-200">
                        {t('dialog.title')}
                    </h2>
                </MorphingDialogTitle>
                <p className="text-center text-sm md:text-base text-stone-600 dark:text-stone-400 mt-2">
                    {t('dialog.subtitle')}
                </p>
                <div className="mt-6 flex flex-col gap-4">
                    <Button
                        onClick={handleSponsorClick}
                        size="lg"
                        className="w-full h-12 px-6 md:h-14 md:px-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-green-500 hover:to-emerald-600 text-sm md:text-base flex items-center justify-center gap-2"
                    >
                        <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Love%20Letter.png" alt="Love Letter" width="25" height="25" />
                        {t('dialog.sponsorButton')}
                    </Button>
                    <SocialShare />
                </div>
                <MorphingDialogClose />
            </MorphingDialogContent>
        </MorphingDialogContainer>
    );
}

function JanmashtamiPage() {
    return (
        <MorphingDialog>
            <JanmashtamiContent />
            <JanmashtamiDialog />
        </MorphingDialog>
    );
}

declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void; };
    __rzp__?: {
      init: () => void;
    };
  }
}
