import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, type FC, type ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, BookOpen, MapPin, Clock, Play, Share2, Heart, Feather, Copy, Check } from "lucide-react";
import {
    IconBrandWhatsapp,
    IconBrandFacebook,
    IconBrandX,
    IconBrandTelegram,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { motion } from 'motion/react';
import { AuroraText } from '@/components/magicui/aurora-text';
import { MotionHighlight, MotionHighlightItem } from '@/components/animate-ui/effects/motion-highlight';
import NumberFlow, { NumberFlowGroup } from '@number-flow/react';

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
        <div className="mt-8">
            <div className="flex justify-center md:justify-start items-center gap-2 md:gap-4 p-4 bg-black/5 dark:bg-white/5 rounded-xl backdrop-blur-sm">
                <NumberFlowGroup>
                    {timeUnits.map(([unit, value], index) => (
                        <div key={unit} className="flex items-center gap-2 md:gap-4">
                            <div className="flex flex-col items-center">
                                <p style={{ fontVariantNumeric: 'tabular-nums' }} className="text-4xl md:text-5xl font-bold text-indigo-900 dark:text-white">
                                    <NumberFlow value={value} format={{ minimumIntegerDigits: 2 }} />
                                </p>
                                <p className="text-xs text-stone-600 dark:text-stone-400 uppercase tracking-wider">{unit}</p>
                            </div>
                            {index < timeUnits.length - 1 && <p className="text-4xl md:text-5xl font-bold text-indigo-900/50 dark:text-white/50">:</p>}
                        </div>
                    ))}
                </NumberFlowGroup>
            </div>
        </div>
    );
};


// --- Page Sections (Redesigned) ---

const InviteHero = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center text-stone-800 dark:text-stone-200 bg-amber-50/50 dark:bg-gray-900 px-4 overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-teal-500/10 rounded-full filter blur-3xl opacity-50 dark:opacity-30" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full filter blur-3xl opacity-50 dark:opacity-30" />

            <div className="relative z-10 container mx-auto grid md:grid-cols-2 gap-12 items-center pt-24 md:pt-0">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-center md:text-left"
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold font-serif text-indigo-900 dark:text-white leading-tight">
                        <AuroraText colors={["#be185d", "#fb923c", "#fde047"]}>
                            Śrī Kṛṣṇa <br/>Janmāṣṭamī
                        </AuroraText>
                    </h1>
                    <p className="mt-4 text-2xl md:text-3xl text-orange-600 dark:text-orange-400 font-semibold">A Divine Invitation</p>
                    <p className="mt-6 text-lg text-stone-700 dark:text-stone-300 max-w-lg mx-auto md:mx-0">
                        You are joyfully invited to celebrate the divine appearance of Lord Sri Krishna. Immerse yourself in a day of ecstatic kirtan, enlightening discourse, and transcendental festivities.
                    </p>
                    <CountdownTimer />
                    <Button
                        onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
                        className="mt-8 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        Reserve your spot
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 100 }}
                    className="flex justify-center"
                >
                    <Dialog>
                        <DialogTrigger asChild>
                            <img 
                                src='/extra/bdayposter.jpeg'
                                alt="Janmashtami Festival Poster" 
                                className="w-full max-w-md rounded-2xl shadow-2xl cursor-pointer transition-transform hover:scale-105 border-8 border-white dark:border-gray-800 ring-4 ring-amber-300 dark:ring-amber-500"
                            />
                        </DialogTrigger>
                        <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-4xl w-auto">
                            <img 
                                src='/extra/bdayposter.jpeg'
                                alt="Janmashtami Festival Poster" 
                                className="max-h-[90vh] w-auto rounded-lg shadow-2xl"
                            />
                            <DialogClose className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-2" />
                        </DialogContent>
                    </Dialog>
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
            location: "Jayamana Thirumana Nilayam, Puducherry"
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
        { icon: MapPin, title: "Jayamana Thirumana Nilayam", subtitle: "Sacred venue", buttonText: "View on Maps", action: handleViewLocation }
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
        </ScrollSection>
    );
};

const SevaSection = () => {
  const GITA_COST = 250;
  const [sponsorName, setSponsorName] = useState('');
  const [gitaCount, setGitaCount] = useState(1);

  const handleSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorName.trim() || gitaCount < 1) return;
    
    const totalAmount = gitaCount * GITA_COST;
    const sponsorshipId = `JANMA-${Date.now().toString().slice(-6)}`;
    const message = `Hare Kṛṣṇa! Dandwat pranam, please accept my humble obeisances. All Glories to Śrīla Prabhupāda! My name is ${sponsorName} and I would like to sponsor ${gitaCount} Bhagavad Gita(s) for ₹${totalAmount} for the Janmashtami festival. My sponsorship ID is ${sponsorshipId}.`;
    const whatsappUrl = `https://wa.me/918056513859?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <ScrollSection id="seva" className="bg-teal-500/5 dark:bg-teal-500/10">
      <ScrollSectionTitle 
        title="A Glorious Janmashtami Seva"
        subtitle="An unparalleled opportunity to serve Śrīla Prabhupāda and Lord Kṛṣṇa by distributing the eternal wisdom of Bhagavad-gita."
      />
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
        >
            <Card className="bg-white dark:bg-gray-800/30 shadow-xl border-t-4 border-teal-500 h-full">
                <CardContent className="p-8 text-center flex flex-col justify-center h-full">
                    <BookOpen className="h-12 w-12 mx-auto text-teal-600 dark:text-teal-400 mb-4" />
                    <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-200 mb-2">
                        Sponsor Bhagavad-gitas
                    </h3>
                    <p className="text-lg text-stone-600 dark:text-stone-300 mb-6">
                        Sponsor one for just <span className="font-bold text-teal-700 dark:text-teal-400">₹250</span> and share the light of knowledge.
                    </p>
                    <form onSubmit={handleSponsorSubmit} className="space-y-4 text-left">
                        <div>
                            <label htmlFor="sponsorName" className="font-semibold text-stone-700 dark:text-stone-200">Your Name</label>
                            <Input id="sponsorName" type="text" value={sponsorName} onChange={(e) => setSponsorName(e.target.value)} placeholder="Enter your respected name" required className="mt-1" />
                        </div>
                        <div>
                            <label htmlFor="gitaCount" className="font-semibold text-stone-700 dark:text-stone-200">Number of Gitas</label>
                            <Input id="gitaCount" type="number" value={gitaCount} onChange={(e) => setGitaCount(Math.max(1, parseInt(e.target.value) || 1))} min="1" required className="mt-1" />
                        </div>
                        <div className="text-center font-bold text-xl text-indigo-900 dark:text-indigo-200 py-2">
                            Total Seva: ₹{gitaCount * GITA_COST}
                        </div>
                        <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white text-lg py-3">
                            <Heart className="mr-2 h-5 w-5" /> Proceed on WhatsApp
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[300px] aspect-[9/16] bg-black dark:bg-gray-800 rounded-2xl overflow-hidden mx-auto shadow-2xl border-4 border-white dark:border-gray-700"
        >
            <iframe src="https://www.youtube.com/embed/8RePAEXjiDg" title="Bhagavad-gita Distribution Seva" className="w-full h-full" allowFullScreen />
        </motion.div>
      </div>
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
  const shareText = `🙌 Hare Kṛṣṇa! You are joyfully invited to the Grand Janmāṣṭamī Festival! 🙏\n\nJoin us to celebrate the divine appearance of Lord Krishna with ecstatic kirtan, enlightening discourses, and delicious prasadam.\n\n📅 Date: 16 AUG 2025\n⏰ Time: 3 PM - 12 MIDNIGHT\n📍 Venue: Jayamana Thirumana Nilayam, Puducherry\n\n"One who knows the transcendental nature of My appearance and activities...attains My eternal abode." - Gita 4.9`;
  const eventUrl = "https://pondi.vercel.app/fests/invite";
  const shareActions = [
    { name: "WhatsApp", icon: IconBrandWhatsapp, color: "bg-[#25D366] hover:bg-[#25D366]/90", action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + eventUrl)}`, '_blank') },
    { name: "Facebook", icon: IconBrandFacebook, color: "bg-[#1877F2] hover:bg-[#1877F2]/90", action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`, '_blank') },
    { name: "Twitter", icon: IconBrandX, color: "bg-black hover:bg-black/90", action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("Join us for the Grand Śrī Kṛṣṇa Janmāṣṭamī Festival! 🙏 #Janmashtami #Krishna #ISKCON")}&url=${encodeURIComponent(eventUrl)}`, '_blank') },
    { name: "Telegram", icon: IconBrandTelegram, color: "bg-[#229ED9] hover:bg-[#229ED9]/90", action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(shareText)}`, '_blank') }
  ];

  return (
    <ScrollSection id="share" className="bg-stone-100/70 dark:bg-gray-800/20">
      <ScrollSectionTitle title="Share the Divine Invitation" subtitle="Invite your friends and family to partake in this ocean of transcendental bliss." />
      <Card className="max-w-3xl mx-auto shadow-xl bg-white dark:bg-gray-800/50"><CardHeader className="text-center"><CardTitle className="text-2xl font-bold text-indigo-900 dark:text-indigo-200 flex items-center justify-center gap-3"><Share2 /> Spread the Joy</CardTitle></CardHeader><CardContent className="p-6"><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{shareActions.map(action => (<Button key={action.name} onClick={action.action} className={cn("w-full h-24 p-2 flex flex-col items-center justify-center gap-2 text-white text-md shadow-lg", action.color)}><action.icon className="h-8 w-8" /><span>{action.name}</span></Button>))}</div></CardContent></Card>
    </ScrollSection>
  );
};

const VideoHighlightsSection = () => {
    const videos = [
        { icon: Play, title: "Srila Prabhupada on Janmashtami", subtitle: "Divine lecture on Sri Krishna's appearance", videoId: "rQNBQ3NXZ90?t=1988" },
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
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-gray-950 text-stone-800 font-sans">
        <InviteHero />
        <main>
            <DetailsAndRegistrationSection />
            <OrnateDivider />
            <QuoteSection quote={quotes[0]} index={0} />
            <OrnateDivider />
            <SevaSection />
            <OrnateDivider />
            <QuoteSection quote={quotes[1]} index={1} />
            <OrnateDivider />
            <VideoHighlightsSection />
            <OrnateDivider />
            <QuoteSection quote={quotes[2]} index={2} />
            <OrnateDivider />
            <SocialShare />
        </main>
        <footer className="text-center p-8 text-stone-500 dark:text-stone-400">
            <p>&copy; {new Date().getFullYear()} ISKCON Puducherry. All Glories to Śrīla Prabhupāda!</p>
        </footer>
    </div>
  );
}

declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void; };
  }
}
