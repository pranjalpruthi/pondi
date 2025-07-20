import { type FC, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { SponsorshipCard } from '@/components/fests/sponsorship-card';
import { HighlightText } from '@/components/animate-ui/text/highlight';

const ScrollSectionTitle: FC<{ title: string; subtitle: ReactNode }> = ({ title, subtitle }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
    >
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-indigo-900 dark:text-indigo-200 mb-4 flex items-center justify-center gap-4">
            <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Love%20Letter.png" alt="Love Letter" className="w-12 h-12 md:w-[60px] md:h-[60px]" />
            {title}
        </h2>
        <div className="text-base md:text-xl text-stone-600 dark:text-stone-400 max-w-3xl mx-auto">{subtitle}</div>
    </motion.div>
);

export const SponsorshipSection = () => {
    const { t } = useTranslation();
    const services = [
        {
            title: t('sponsorship.services.kalasa.title'),
            image: "/services/1.webp",
            description: t('sponsorship.services.kalasa.description'),
            quote: t('sponsorship.services.kalasa.quote'),
            quoteAuthor: t('sponsorship.services.kalasa.quoteAuthor'),
            url: "https://rzp.io/rzp/ISKMKAS"
        },
        {
            title: t('sponsorship.services.gita.title'),
            image: "/services/4.webp",
            description: t('sponsorship.services.gita.description'),
            quote: t('sponsorship.services.gita.quote'),
            quoteAuthor: t('sponsorship.services.gita.quoteAuthor'),
            url: "https://rzp.io/rzp/ISKMBGS"
        },
        {
            title: t('sponsorship.services.milk.title'),
            image: "/services/2.webp",
            description: t('sponsorship.services.milk.description'),
            quote: t('sponsorship.services.milk.quote'),
            quoteAuthor: t('sponsorship.services.milk.quoteAuthor'),
            url: "https://rzp.io/rzp/ISKMMAS"
        },
        {
            title: t('sponsorship.services.archana.title'),
            image: "/services/5.webp",
            description: t('sponsorship.services.archana.description'),
            quote: t('sponsorship.services.archana.quote'),
            quoteAuthor: t('sponsorship.services.archana.quoteAuthor'),
            url: "https://rzp.io/rzp/ISKMArchanaseva"
        },
        {
            title: t('sponsorship.services.annadanam.title'),
            image: "/services/3.webp",
            description: t('sponsorship.services.annadanam.description'),
            quote: t('sponsorship.services.annadanam.quote'),
            quoteAuthor: t('sponsorship.services.annadanam.quoteAuthor'),
            url: "https://rzp.io/rzp/ISKMAnnadanam"
        }
    ];

    return (
        <section id="sponsorship" className="bg-stone-100/70 dark:bg-gray-800/20 py-16 md:py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <ScrollSectionTitle
                    title={t('sponsorship.title')}
                    subtitle={t('sponsorship.subtitle')}
                />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="max-w-4xl mx-auto px-4 sm:px-6 mb-12"
                >
                    <div className="bg-gradient-to-br from-indigo-900 to-gray-900 dark:from-amber-50 dark:to-stone-100 rounded-2xl p-6 shadow-lg border border-indigo-700 dark:border-amber-200 text-center">
                        <h3 className="text-xl md:text-2xl font-bold font-serif text-white dark:text-indigo-900 mb-3">
                            {t('sponsorship.cantAttendTitle')}
                        </h3>
                        <p className="text-sm md:text-base text-stone-200 dark:text-stone-700 mb-4">
                            {t('sponsorship.cantAttendBody')}
                            <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Tear.png" alt="Smiling Face with Tear" width="25" height="25" className="inline-block mx-1" />
                        </p>
                        <p className="mt-4 font-semibold text-sm md:text-base">
                            <HighlightText 
                                text={t('sponsorship.sincereHeart')}
                                className="bg-gradient-to-r from-amber-400/20 to-orange-400/20 dark:from-amber-100 dark:to-orange-100 text-amber-300 dark:text-orange-800"
                            />
                        </p>
                    </div>
                </motion.div>
            </div>
            {/* Mobile: Vertical Grid */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 gap-8 md:hidden">
                {services.map((service, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex justify-center"
                    >
                        <SponsorshipCard service={service} />
                    </motion.div>
                ))}
            </div>

            {/* Desktop: Horizontal Scroll */}
            <div className="hidden md:block overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
                <div className="flex gap-8 px-4 sm:px-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="w-96 flex-shrink-0"
                        >
                            <SponsorshipCard service={service} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
