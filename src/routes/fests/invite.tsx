import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, useRef, type FC, type ReactNode, Fragment } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, BookOpen, MapPin, Clock, Play, Share2, Feather, Copy, Check } from "lucide-react";
import {
    IconBrandWhatsapp,
    IconBrandFacebook,
    IconBrandX,
    IconBrandTelegram,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { AuroraText } from '@/components/magicui/aurora-text';
import { MotionHighlight, MotionHighlightItem } from '@/components/animate-ui/effects/motion-highlight';
import NumberFlow, { NumberFlowGroup } from '@number-flow/react';
import { UpcomingEventBanner } from '@/components/homepage/UpcomingEventBanner';
import { SponsorshipSection } from '@/components/homepage/sponsorship-section';

// --- Reusable Components for the New Design ---

const OrnateDivider: FC = () => (
    <div className="flex items-center justify-center my-12 md:my-16">
        <div className="w-1/3 h-px bg-gradient-to-r from-transparent to-amber-700/50 dark:to-amber-500/50" />
        <Feather className="h-8 w-8 mx-4 text-amber-700/80 dark:text-amber-500/80" />
        <div className="w-1/3 h-px bg-gradient-to-l from-transparent to-amber-700/50 dark:to-amber-500/50" />
    </div>
);

const ScrollSection: FC<{ children: ReactNode; className?: string; id?: string }> = ({ children, className, id }) => (
    <section id={id} className={cn("py-16 px-4 sm:px-6 md:py-20", className)}>
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
        className="text-center mb-12"
    >
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-indigo-900 dark:text-indigo-200 mb-4">
            {title}
        </h2>
        <div className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-3xl mx-auto">{subtitle}</div>
    </motion.div>
);

const CountdownTimer = () => {
    const eventDate = new Date("2025-08-16T15:00:00");
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = eventDate.getTime() - now.getTime();

            if (difference <= 0) {
                setIsExpired(true);
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
    }, []);

    if (isExpired) {
        return (
            <div className="mt-8 text-center md:text-left">
                <p className="text-2xl font-bold text-green-500 animate-pulse">The auspicious day has arrived!</p>
            </div>
        );
    }

    const timeUnits = Object.entries(timeLeft);

    return (
        <div className="mt-8 inline-block">
            <div className="inline-flex justify-center md:justify-start items-center gap-1.5 sm:gap-2 md:gap-4 p-3 sm:p-4 bg-black/5 dark:bg-white/5 rounded-xl backdrop-blur-sm">
                <NumberFlowGroup>
                    {timeUnits.map(([unit, value], index) => (
                        <Fragment key={unit}>
                            <div className="flex flex-col items-center">
                                <p style={{ fontVariantNumeric: 'tabular-nums' }} className="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-900 dark:text-white">
                                    <NumberFlow value={value} format={{ minimumIntegerDigits: 2 }} />
                                </p>
                                <p className="text-[0.6rem] sm:text-xs text-stone-600 dark:text-stone-400 uppercase tracking-wider">{unit}</p>
                            </div>
                            {index < timeUnits.length - 1 && <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-900/50 dark:text-white/50">:</p>}
                        </Fragment>
                    ))}
                </NumberFlowGroup>
            </div>
        </div>
    );
};


// --- Page Sections (Redesigned) ---

import { useInView } from 'motion/react';

const InviteHero = () => {
    const [isInteracted, setIsInteracted] = useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const videoId = "AuZtQraCBd4";
    const silentUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`;
    const interactiveUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`;

    const handleInteraction = () => {
        if (!isInteracted) {
            setIsInteracted(true);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center text-stone-800 dark:text-stone-200 bg-amber-50/50 dark:bg-gray-900 px-4 overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-teal-500/10 rounded-full filter blur-3xl opacity-50 dark:opacity-30" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full filter blur-3xl opacity-50 dark:opacity-30" />

            <div className="relative z-10 container mx-auto grid md:grid-cols-2 lg:grid-cols-5 gap-12 items-center pt-24 md:pt-0">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-center md:text-left lg:col-span-2"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold font-serif text-indigo-900 dark:text-white leading-tight">
                        <AuroraText colors={["#be185d", "#fb923c", "#fde047"]}>
                            Śrī Kṛṣṇa <br className="hidden sm:block" />Janmāṣṭamī
                        </AuroraText>
                    </h1>
                    <p className="mt-4 text-xl sm:text-2xl md:text-3xl text-orange-600 dark:text-orange-400 font-semibold">A Divine Invitation</p>
                    <p className="mt-6 text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-lg mx-auto md:mx-0">
                        You are joyfully invited to celebrate the divine appearance of Lord Sri Krishna. Immerse yourself in a day of ecstatic kirtan, enlightening discourse, and transcendental festivities.
                    </p>
                    <CountdownTimer />
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                        <Button
                            onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
                            size="lg"
                            className="w-full sm:w-auto h-14 px-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-base"
                        >
                            <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Ticket.png" alt="Ticket" width="24" height="24" />
                            RESERVE YOUR FREE SPOT
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            className="w-full sm:w-auto h-14 px-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-green-500 hover:to-emerald-600 text-base"
                        >
                            <a href="https://pages.razorpay.com/pl_QrNlMduF5wojLm/view" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Wrapped%20Gift.png" alt="Wrapped Gift" width="24" height="24" />
                                Sponsor Bhagavad Gītā Seva
                            </a>
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 100 }}
                    className="flex justify-center lg:col-span-3"
                >
                    <div className="w-full rounded-2xl shadow-2xl border-8 border-white dark:border-gray-800 ring-4 ring-amber-300 dark:ring-amber-500 overflow-hidden">
                        <div className="aspect-video bg-black relative group" onClick={handleInteraction}>
                            {isInView && (
                                <iframe
                                    key={isInteracted ? 'interactive' : 'silent'}
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
            </div>
        </div>
    );
};

const DetailsAndRegistrationSection = () => {
    const handleAddToCalendar = () => {
        const event = {
            title: "Śrī Kṛṣṇa Janmāṣṭamī Grand Festival",
            start: "20250816T150000",
            end: "20250817T000000",
            description: `Join us for the divine appearance day of Lord Sri Krishna. Event details: http://pudhuvai.vrindavanam.org.in`,
            location: "Jayaramna Thirumana Nilayam, Puducherry"
        };
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
        window.open(googleCalendarUrl, '_blank');
    };

    const handleViewLocation = () => {
        window.open('https://maps.app.goo.gl/k5wX9LMEtFX7UraEA', '_blank');
    };

    const detailItems = [
        { icon: Calendar, title: "16 AUG 2025", subtitle: "Mark your calendar", buttonText: "Add to Calendar", action: handleAddToCalendar },
        { icon: Clock, title: "3 PM - 12 MIDNIGHT", subtitle: "Festival hours" },
        { icon: MapPin, title: "Jayaramna Thirumana Nilayam", subtitle: "Sacred venue", buttonText: "View on Maps", action: handleViewLocation }
    ];

    return (
        <ScrollSection id="register" className="bg-stone-100/70 dark:bg-gray-800/20">
            <ScrollSectionTitle
                title="Join the Celebration"
                subtitle={<></>}
            />
            <div className="grid lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-1 flex flex-col gap-8">
                    {detailItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-6 rounded-xl bg-white dark:bg-gray-800/50 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-between text-center h-full"
                        >
                            <div>
                                <div className="p-4 bg-orange-100 dark:bg-orange-500/10 rounded-full mb-4 inline-block">
                                    <item.icon className="h-10 w-10 text-orange-600 dark:text-orange-400" />
                                </div>
                                <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-200">{item.title}</p>
                                <p className="text-md text-stone-500 dark:text-stone-400">{item.subtitle}</p>
                            </div>
                            {item.action && (
                                <Button
                                    onClick={item.action}
                                    className="mt-6 w-full rounded-full py-3 px-6 text-lg font-semibold transition-all duration-300 bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:hover:bg-orange-900/80 dark:hover:shadow-[0_0_15px_rgba(251,146,60,0.5)]"
                                >
                                    {item.buttonText}
                                </Button>
                            )}
                        </motion.div>
                    ))}
                </div>

                <div className="lg:col-span-2">
                    <Card className="max-w-4xl mx-auto shadow-2xl border-amber-200 dark:border-amber-800 border-2 overflow-hidden bg-white dark:bg-gray-900">
                        <CardContent className="p-2 bg-white">
                            <iframe
                                data-tally-src="https://tally.so/embed/mDoRD5?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                                loading="lazy"
                                width="100%"
                                height="685"
                                frameBorder="0"
                                marginHeight={0}
                                marginWidth={0}
                                title="Join Us for Śrī Kṛṣṇa Janmāṣṭamī !"
                                className="rounded-lg"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-3xl mx-auto text-center mt-12">
                <span>
                    Register online to get a{' '}
                    <MotionHighlight
                        hover
                        mode="children"
                        className="bg-amber-200/50 dark:bg-amber-500/20 rounded-md px-1 py-0.5"
                    >
                        <MotionHighlightItem asChild>
                            <span className="font-bold text-amber-700 dark:text-amber-400">
                                Special Entry Pass
                            </span>
                        </MotionHighlightItem>
                    </MotionHighlight>{' '}
                    and confirm your presence at this auspicious event. We look forward to welcoming you.
                </span>
            </div>
            <SocialShare />
        </ScrollSection>
    );
};


const QuoteSection: FC<{ quote: { text: string; source: string }, index: number }> = ({ quote, index }) => {
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
                    <CardContent className="p-8">
                        <blockquote className="text-center">
                            <p className="text-xl md:text-2xl font-serif text-stone-700 dark:text-stone-300 leading-relaxed mb-4 italic">
                                “{quote.text}”
                            </p>
                            <footer className="text-md font-semibold text-amber-700 dark:text-amber-500">
                                — {quote.source}
                            </footer>
                        </blockquote>
                        <div className="flex justify-center gap-4 mt-6">
                            <Button variant="outline" onClick={handleCopy}>
                                {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                            <Button variant="outline" onClick={handleShare}>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </ScrollSection>
    );
};

const SocialShare = () => {
    const shareText = `🙌 Hare Kṛṣṇa! You are joyfully invited to the Grand Janmāṣṭamī Festival! 🙏\n\nJoin us to celebrate the divine appearance of Lord Krishna with ecstatic kirtan, enlightening discourses, and delicious prasadam.\n\n📅 Date: 16 AUG 2025\n⏰ Time: 3 PM - 12 MIDNIGHT\n📍 Venue: Jayaramna Thirumana Nilayam, Puducherry\n\n"One who knows the transcendental nature of My appearance and activities...attains My eternal abode." - Gita 4.9`;
    const eventUrl = "https://pondi.vercel.app/fests/invite";
    const shareActions = [
        { name: "WhatsApp", icon: IconBrandWhatsapp, color: "bg-[#25D366] hover:bg-[#25D366]/90", action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + eventUrl)}`, '_blank') },
        { name: "Facebook", icon: IconBrandFacebook, color: "bg-[#1877F2] hover:bg-[#1877F2]/90", action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`, '_blank') },
        { name: "Twitter", icon: IconBrandX, color: "bg-black hover:bg-black/90", action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("Join us for the Grand Śrī Kṛṣṇa Janmāṣṭamī Festival! 🙏 #Janmashtami #Krishna #ISKM")}&url=${encodeURIComponent(eventUrl)}`, '_blank') },
        { name: "Telegram", icon: IconBrandTelegram, color: "bg-[#229ED9] hover:bg-[#229ED9]/90", action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(shareText)}`, '_blank') }
    ];

    return (
        <div className="mt-12 text-center">
            <p className="text-lg font-semibold text-indigo-900 dark:text-indigo-200 mb-4">Share the Divine Invitation!</p>
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
    const [isInteracted, setIsInteracted] = useState(false);
    const [copied, setCopied] = useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    const videoId = "DuZm2EPOPkI";
    const silentUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`;
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
        <ScrollSection id="janmashtami-2024-highlights" className="bg-stone-100/70 dark:bg-gray-800/20">
            <div className="grid md:grid-cols-3 gap-12 items-center">
                <div className="md:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6 }}
                        className="text-center md:text-left mb-8"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-indigo-900 dark:text-indigo-200">
                            Sri Krishna Janmashtami Celebration Highlights
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
                                                <p className="text-md font-serif text-stone-700 dark:text-stone-300 leading-relaxed italic">
                                                    “{quote.text}”
                                                </p>
                                                <footer className="mt-2 text-sm font-semibold text-amber-700 dark:text-amber-500">
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
                                        {copied ? 'Copied!' : 'Copy'}
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleShare}>
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </ScrollSection>
    );
};

const VideoHighlightsSection = () => {
    const videos = [
        { icon: Play, title: "Sri Krishna Janmashtami Celebration Highlights", subtitle: "Divine lecture on Sri Krishna's appearance", videoId: "rQNBQ3NXZ90?t=1988" },
        { icon: BookOpen, title: "Bhagavad-gita Distribution Seva", subtitle: "5,108 Gitas in a single day!", videoId: "8RePAEXjiDg" }
    ];

    return (
        <ScrollSection id="inspiration">
            <ScrollSectionTitle title="Divine Inspiration" subtitle="Watch and immerse yourself in the glories of Lord Krishna and His devotees." />
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
                            <CardHeader className="p-6">
                                <video.icon className="h-10 w-10 text-orange-600 dark:text-orange-400 mb-2" />
                                <CardTitle className="text-xl font-bold text-indigo-900 dark:text-indigo-200">{video.title}</CardTitle>
                                <CardDescription className="text-md text-stone-500 dark:text-stone-400 mt-1">{video.subtitle}</CardDescription>
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

export const Route = createFileRoute('/fests/invite')({
  component: JanmashtamiPage,
});

function JanmashtamiPage() {
    const [isBannerOpen, setIsBannerOpen] = useState(true);
    const [isBannerVisible, setIsBannerVisible] = useState(false);
    const lastScrollY = useRef(0);
    const quotes = [
        { text: "One who knows the transcendental nature of My appearance and activities does not, upon leaving the body, take his birth again in this material world, but attains My eternal abode, O Arjuna.", source: "Bhagavad-gita As It Is 4.9" },
        { text: "My Lord, You are the well-wisher of the cows and the Brahmanas. You are the well-wisher of the entire human society and world.", source: "Vishnu Purana 1.19.65" },
        { text: "O Krsna, appearing on the eighth day of the dark moon... You spread auspiciousness over the earth's surface, and You pleased and pacified the minds and hearts of saintly devotees.", source: "Sri Krsna Lila Stava" }
    ];

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    document.head.appendChild(script);
    script.onload = () => { if (window.Tally) window.Tally.loadEmbeds(); };
    
    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        const heroHeight = window.innerHeight * 0.8;

        if (currentScrollY < heroHeight) {
            setIsBannerVisible(false);
        } else {
            // Hide on scroll down, show on scroll up
            if (currentScrollY > lastScrollY.current) {
                setIsBannerVisible(false);
            } else {
                setIsBannerVisible(true);
            }
        }
        lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => { 
        if (document.head.contains(script)) document.head.removeChild(script); 
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-gray-950 text-stone-800 font-sans">
        <InviteHero />
        <UpcomingEventBanner isOpen={isBannerOpen && isBannerVisible} onClose={() => setIsBannerOpen(false)} />
        <main>
            <DetailsAndRegistrationSection />
            <OrnateDivider />
            <SponsorshipSection />
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

declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void; };
    __rzp__?: {
      init: () => void;
    };
  }
}
