import { createFileRoute } from '@tanstack/react-router';
import { InView } from '@/components/motion-primitives/in-view';
import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/animate-ui/buttons/copy';
import { HighlightText } from '@/components/animate-ui/text/highlight';

export const Route = createFileRoute('/refund-and-cancellation-policy/')({
  component: RefundAndCancellationPolicy,
});

const Section = ({ title, emoji, children }: { title: string; emoji?: string; children: React.ReactNode }) => (
  <InView as="section" className="mb-8" once viewOptions={{ amount: 0.2 }}>
    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
      {emoji && <span className="mr-2">{emoji}</span>}{title}
    </h2>
    <div className="prose prose-lg lg:prose-xl max-w-none dark:prose-invert">{children}</div>
  </InView>
);

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <InView as="div" className="mt-6" once viewOptions={{ amount: 0.5 }}>
        <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">{title}</h3>
        {children}
    </InView>
);

function RefundAndCancellationPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <header className="text-center mb-12">
        <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100"
        >
          Return and Refund Policy
        </motion.h1>
        <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-2 text-lg text-muted-foreground"
        >
          Last updated: June 07, 2025
        </motion.p>
      </header>

      <main className="max-w-4xl mx-auto">
        <Section title="Thank You for Your Support" emoji="🙏">
          <p>
            Thank you for shopping at ISKM Pondicherry. If, for any reason, You are not completely satisfied
            with a purchase, We invite You to review our policy on refunds and returns. The following terms are
            applicable for any products or services that You purchased with Us.
          </p>
        </Section>

        <Section title="Interpretation and Definitions" emoji="📖">
          <SubSection title="Interpretation">
            <p>
              The words of which the initial letter is capitalized have meanings defined under the following
              conditions. The following definitions shall have the same meaning regardless of whether they
              appear in singular or in plural.
            </p>
          </SubSection>
          <SubSection title="Definitions">
            <p>For the purposes of this Return and Refund Policy:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>
                <Badge variant="secondary">Company</Badge> (referred to as either “the Company”, “We”, “Us” or
                “Our” in this Agreement) refers to ISKM Pondicherry, managed by HG Prahlada Bhakta Dasa, with
                legal rights vested in the Temple President.
              </li>
              <li>
                <Badge variant="secondary">Goods</Badge> refer to the items offered for sale on the Service,
                which may include physical products (e.g., books, spiritual items) and digital products (e.g.,
                online course access, digital downloads).
              </li>
              <li>
                <Badge variant="secondary">Orders</Badge> mean a request by You to purchase Goods from Us.
              </li>
              <li>
                <Badge variant="secondary">Service</Badge> refers to the Website.
              </li>
              <li>
                <Badge variant="secondary">Website</Badge> refers to ISKM Pondicherry, accessible from{' '}
                <a href="http://pudhuvai.vrindavanam.org.in" className="text-blue-600 hover:underline">
                  http://pudhuvai.vrindavanam.org.in
                </a>
                .
              </li>
              <li>
                <Badge variant="secondary">You</Badge> mean the individual accessing or using the Service, or
                the company, or other legal entity on behalf of which such individual is accessing or using the
                Service, as applicable.
              </li>
            </ul>
          </SubSection>
        </Section>

        <Section title="Your Order Cancellation Rights" emoji="❌">
          <p>
            You are entitled to cancel Your Order within <HighlightText text="7 days" /> without giving any reason for
            doing so. For bulk orders, the cancellation period may extend up to a maximum of{' '}
            <HighlightText text="15 days" />.
          </p>
          <p>
            The deadline for canceling an Order is 7 days (or up to 15 days for bulk orders) from the date on
            which You have made a purchase of the Goods or, for physical goods, on which a third party you have
            appointed, who is not the carrier, takes possession of the product delivered.
          </p>
          <p>
            In order to exercise Your right of cancellation, You must inform Us of your decision by means of a
            clear statement. You can inform us of your decision by:
          </p>
          <div className="space-y-4 mt-4">
            <div>
              <strong className="block mb-2">By email:</strong>
              <div className="flex items-center gap-2">
                <a href="mailto:ajaygauranga.dasa@vrindavanam.org.in" className="text-blue-600 hover:underline">ajaygauranga.dasa@vrindavanam.org.in</a>
                <CopyButton variant="ghost" size="sm" content="ajaygauranga.dasa@vrindavanam.org.in" />
              </div>
              <div className="flex items-center gap-2">
                <a href="mailto:prahladbhakta.dasa@vrindavanam.org.in" className="text-blue-600 hover:underline">prahladbhakta.dasa@vrindavanam.org.in</a>
                <CopyButton variant="ghost" size="sm" content="prahladbhakta.dasa@vrindavanam.org.in" />
              </div>
            </div>
            <div>
              <strong className="block mb-2">By phone number:</strong>
              <div className="flex items-center gap-2">
                <span>Ajay Gauranga Prabhu: +91 93803 95156</span>
                <CopyButton variant="ghost" size="sm" content="+919380395156" />
              </div>
              <div className="flex items-center gap-2">
                <span>HG Prahlada Bhakta Dasa Prabhu: +91 80565 13859</span>
                <CopyButton variant="ghost" size="sm" content="+918056513859" />
              </div>
            </div>
          </div>
          <p className="mt-4">
            We will reimburse You no later than <HighlightText text="14 days" /> from the day on which We receive the
            returned physical Goods, or from the day of cancellation for digital goods or services. We will use
            the same means of payment as You used for the Order. On cancellation of the order, the transaction
            fee (if any) will be charged and the remaining amount will be refunded.
          </p>
        </Section>

        <Section title="Conditions for Returns" emoji="✅">
          <p>In order for the physical Goods to be eligible for a return, please make sure that:</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li>
              The Goods were purchased within the last <HighlightText text="7 days" /> (or within the agreed extended
              period for bulk orders).
            </li>
            <li>The Goods are in their <Badge variant="outline">original packaging</Badge>.</li>
          </ul>
          <p className="mt-4">The following Goods cannot be returned or refunded:</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li>The supply of Goods made to Your specifications or clearly personalized.</li>
            <li>
              The supply of Goods which according to their nature are not suitable to be returned, deteriorate
              rapidly, or where the date of expiry is over.
            </li>
            <li>
              The supply of Goods that are not suitable for return due to health protection or hygiene reasons
              and were unsealed after delivery.
            </li>
            <li>
              The supply of Goods which are, after delivery, according to their nature, inseparably mixed with
              other items.
            </li>
            <li>
              Any item which is damaged even while returning the goods (damage occurred during return shipment
              due to improper packaging by You).
            </li>
            <li>
              Digital Goods (e.g., online course access, digital downloads) once they have been accessed,
              downloaded, or used. Refunds for digital goods will generally only be considered if there was a
              technical issue preventing access or use, and the issue could not be resolved.
            </li>
          </ul>
          <p className="mt-4">
            We reserve the right to refuse returns of any merchandise that does not meet the above return
            conditions at our sole discretion.
          </p>
          <p className="mt-4">
            Only regular-priced Goods may be refunded. Unfortunately, Goods on sale or promotional offers cannot
            be refunded, unless otherwise stipulated by applicable law.
          </p>
        </Section>

        <Section title="Returning Physical Goods" emoji="🚚">
          <p>
            You are responsible for the cost and risk of returning the physical Goods to Us. You should send the
            Goods to the following address:
          </p>
          <div className="mt-4 flex items-center gap-4 not-italic p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <address className="flex-grow">
              Pudhuvai Vrindavanam, <br />
              RS No-54/3, Koodappakkam Main Rd, <br />
              Pathukannu, Puducherry 605502
            </address>
            <CopyButton variant="secondary" size="sm" content="Pudhuvai Vrindavanam, RS No-54/3, Koodappakkam Main Rd, Pathukannu, Puducherry 605502" />
          </div>
          <p className="mt-4">
            We cannot be held responsible for Goods damaged or lost in return shipment. Therefore, We recommend
            an <HighlightText text="insured and trackable" /> mail service. We are unable to issue a refund without actual receipt of the
            Goods or proof of received return delivery.
          </p>
        </Section>

        <Section title="Contact Us" emoji="✉️">
          <p>If you have any questions about our Returns and Refunds Policy, please contact us:</p>
          <div className="space-y-4 mt-4">
            <div>
              <strong className="block mb-2">By email:</strong>
              <div className="flex items-center gap-2">
                <a href="mailto:ajaygauranga.dasa@vrindavanam.org.in" className="text-blue-600 hover:underline">ajaygauranga.dasa@vrindavanam.org.in</a>
                <CopyButton variant="ghost" size="sm" content="ajaygauranga.dasa@vrindavanam.org.in" />
              </div>
              <div className="flex items-center gap-2">
                <a href="mailto:prahladbhakta.dasa@vrindavanam.org.in" className="text-blue-600 hover:underline">prahladbhakta.dasa@vrindavanam.org.in</a>
                <CopyButton variant="ghost" size="sm" content="prahladbhakta.dasa@vrindavanam.org.in" />
              </div>
            </div>
            <div>
              <strong className="block mb-2">By phone number:</strong>
              <div className="flex items-center gap-2">
                <span>Ajay Gauranga Prabhu: +91 93803 95156</span>
                <CopyButton variant="ghost" size="sm" content="+919380395156" />
              </div>
              <div className="flex items-center gap-2">
                <span>HG Prahlada Bhakta Dasa Prabhu: +91 80565 13859</span>
                <CopyButton variant="ghost" size="sm" content="+918056513859" />
              </div>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
