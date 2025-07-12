import { type FC, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { SponsorshipCard } from '@/components/fests/sponsorship-card';

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

export const SponsorshipSection = () => {
    const services = [
        {
            title: "Kalasa Abhishekam Seva",
            image: "/services/1ka.jpg",
            description: "Participate in the sacred bathing ceremony of the Lord. Your contribution helps procure auspicious items for the abhishekam, bringing immense spiritual benefit.",
            quote: "One who performs the bathing ceremony of the Lord is glorified in Vaikuntha.",
            quoteAuthor: "Śrīla Prabhupāda"
        },
        {
            title: "Bhagavad Gita Seva",
            image: "/services/4bg.jpg",
            description: "Sponsor the distribution of Bhagavad-gita, the essence of all Vedic knowledge. This is the highest form of charity, giving spiritual enlightenment to others.",
            quote: "For one who explains this supreme secret to the devotees, pure devotional service is guaranteed, and in the end he will come back to Me.",
            quoteAuthor: "Lord Krishna, Bhagavad-gita 18.68"
        },
        {
            title: "Milk Abhishekam Seva",
            image: "/services/2milk.jpg",
            description: "Offer a loving milk bath to the deities. This seva is a beautiful expression of devotion and helps in the grand worship of the Lord on His appearance day.",
            quote: "By bathing the Lord with milk, one gets relief from all kinds of tribulations.",
            quoteAuthor: "Śrīla Prabhupāda"
        },
        {
            title: "Archana Seva",
            image: "/services/5pa.jpg",
            description: "Contribute towards the articles of worship, such as flowers, incense, lamps, and other paraphernalia required for the daily archana (worship) of the deities.",
            quote: "If one offers Me with love and devotion a leaf, a flower, a fruit or water, I will accept it.",
            quoteAuthor: "Lord Krishna, Bhagavad-gita 9.26"
        },
        {
            title: "Annadanam Seva",
            image: "/services/3anna.jpg",
            description: "Sponsor the distribution of delicious Krishna prasadam to all the devotees and visitors. There is no greater service than feeding the Lord's devotees.",
            quote: "By feeding the devotees, one gets the results of feeding the Supreme Lord Himself.",
            quoteAuthor: "Śrīla Prabhupāda"
        }
    ];

    return (
        <section id="sponsorship" className="bg-stone-100/70 dark:bg-gray-800/20 py-16 md:py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <ScrollSectionTitle
                    title="Sponsorship Opportunities"
                    subtitle="Seize this golden opportunity to render direct service to Lord Krishna on His divine appearance day and receive unlimited blessings."
                />
            </div>
            <div className="w-full overflow-x-auto">
                <div className="flex space-x-6 pb-4 px-4 sm:px-6 md:px-8 lg:px-12">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            className="w-96 flex-shrink-0"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <SponsorshipCard service={service} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
