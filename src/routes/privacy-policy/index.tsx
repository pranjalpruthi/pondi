import { createFileRoute } from '@tanstack/react-router';
import { InView } from '@/components/motion-primitives/in-view';
import { motion } from 'motion/react';
import { CopyButton } from '@/components/animate-ui/buttons/copy';

export const Route = createFileRoute('/privacy-policy/')({
  component: PrivacyPolicy,
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

function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <header className="text-center mb-12">
        <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100"
        >
          Privacy Policy for ISKM Pondicherry
        </motion.h1>
        <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-2 text-lg text-muted-foreground"
        >
          Last updated: June 11, 2025
        </motion.p>
      </header>

      <main className="max-w-4xl mx-auto">
        <Section title="Introduction" emoji="👋">
          <p>
            At ISKM Pondicherry, accessible from{' '}
            <a href="http://pudhuvai.vrindavanam.org.in" className="text-blue-600 hover:underline">
              http://pudhuvai.vrindavanam.org.in
            </a>
            , one of our main priorities is the privacy of our visitors. This Privacy Policy document contains
            types of information that is collected and recorded by ISKM Pondicherry and how we use it.
          </p>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate
            to contact us.
          </p>
          <div className="space-y-2 mt-4">
            <div className="flex items-center gap-2">
              <a href="mailto:ajaygauranga.dasa@vrindavanam.org.in" className="text-blue-600 hover:underline">ajaygauranga.dasa@vrindavanam.org.in</a>
              <CopyButton variant="ghost" size="sm" content="ajaygauranga.dasa@vrindavanam.org.in" />
            </div>
            <div className="flex items-center gap-2">
              <a href="mailto:prahladbhakta.dasa@vrindavanam.org.in" className="text-blue-600 hover:underline">prahladbhakta.dasa@vrindavanam.org.in</a>
              <CopyButton variant="ghost" size="sm" content="prahladbhakta.dasa@vrindavanam.org.in" />
            </div>
          </div>
          <p>
            This Privacy Policy applies only to our online activities and is valid for visitors to our website
            with regards to the information that they shared and/or collect in ISKM Pondicherry. This policy is
            not applicable to any information collected offline or via channels other than this website.
          </p>
        </Section>

        <Section title="Consent" emoji="👍">
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>
        </Section>

        <Section title="Information We Collect" emoji="📝">
          <p>
            The personal information that you are asked to provide, and the reasons why you are asked to provide
            it, will be made clear to you at the point we ask you to provide your personal information.
          </p>
          <p>
            If you contact us directly, we may receive additional information about you such as your name, email
            address, phone number, the contents of the message and/or attachments you may send us, and any other
            information you may choose to provide.
          </p>
          <p>We collect personal information through various forms on our website, including:</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li>
              <strong>Donation Forms:</strong> We may collect your name, email address, phone number, and other
              contact details necessary to process your donation and provide you with a receipt.
            </li>
            <li>
              <strong>Event Registration:</strong> When you register for events, we collect information such as
              your name, email address, and phone number to manage your registration and communicate event
              details.
            </li>
            <li>
              <strong>Newsletter Sign-ups:</strong> We collect your email address to send you our newsletters and
              updates.
            </li>
            <li>
              <strong>Location Data:</strong> We may collect or request your location data to provide you with
              specific fasting timings relevant to your geographical location.
            </li>
          </ul>
        </Section>

        <Section title="How We Use Your Information" emoji="💡">
          <p>We use the information we collect in various ways, including to:</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new services, features, and functionality</li>
            <li>
              Communicate with you, either directly or through one of our partners, including for customer
              service, to provide you with updates and other information relating to the website, and for
              promotional purposes related to our spiritual activities and events.
            </li>
            <li>Send you emails related to your inquiries, donations, registrations, or newsletters.</li>
            <li>Process your donations and registrations.</li>
            <li>Find and prevent fraud.</li>
          </ul>
        </Section>

        <Section title="Log Files" emoji="📄">
          <p>
            ISKM Pondicherry follows a standard procedure of using log files. These files log visitors when they
            visit websites. All hosting companies do this and are a part of hosting services’ analytics. The
            information collected by log files include internet protocol (IP) addresses, browser type, Internet
            Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.
            These are not linked to any information that is personally identifiable. The purpose of the
            information is for analyzing trends, administering the site, tracking users’ movement on the website,
            and gathering demographic information.
          </p>
        </Section>

        <Section title="Cookies and Web Beacons" emoji="🍪">
          <p>
            Like any other website, ISKM Pondicherry uses ‘cookies’. These cookies are used to store information
            including visitors’ preferences, and the pages on the website that the visitor accessed or visited.
            The information is used to optimize the users’ experience by customizing our web page content based
            on visitors’ browser type and/or other information.
          </p>
        </Section>

        <Section title="Third-Party Services" emoji="🤝">
            <p>
                ISKM Pondicherry utilizes various third-party services for website functionality and analytics. Our Privacy Policy does not apply to these third-party services, and we advise you to consult their respective Privacy Policies for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
            </p>
            <SubSection title="Payment Gateways">
                <p>For processing donations, we use third-party payment gateways such as Cashfree and WhatsApp UPI. Your payment information is processed directly by these providers, and we do not store sensitive payment card details on our servers.</p>
            </SubSection>
            <SubSection title="Embedded Content">
                <p>Our website may include embedded content such as YouTube videos, social media feeds, and Google Maps. These services may collect data about your interaction with their content if you are logged into their respective platforms.</p>
            </SubSection>
            <SubSection title="Analytics Services">
                <p>We use self-hosted analytics platforms like Plausible or Umami to understand website usage and improve our services. These platforms are typically privacy-friendly and designed to collect minimal data without identifying individual users.</p>
            </SubSection>
            <p className="mt-4">
                You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers’ respective websites.
            </p>
        </Section>

        <Section title="CCPA Privacy Rights (Do Not Sell My Personal Information)" emoji="🛡️">
          <p>Under the CCPA, among other rights, consumers have the right to:</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li>
              Request that a business that collects a consumer’s personal data disclose the categories and
              specific pieces of personal data that a business has collected about consumers.
            </li>
            <li>
              Request that a business deletes any personal data about the consumer that a business has
              collected.
            </li>
            <li>
              Request that a business that sells a consumer’s personal data, not sell the consumer’s personal
              data.
            </li>
          </ul>
          <p className="mt-4">
            If you make a request, we have one month to respond to you. If you would like to exercise any of
            these rights, please contact us.
          </p>
        </Section>

        <Section title="GDPR Data Protection Rights" emoji="🇪🇺">
          <p>
            We would like to make sure you are fully aware of all of your data protection rights. Every user is
            entitled to the following:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li>
              <strong>The right to access</strong> – You have the right to request copies of your personal data.
            </li>
            <li>
              <strong>The right to rectification</strong> – You have the right to request that we correct any
              information you believe is inaccurate. You also have the right to request that we complete the
              information you believe is incomplete.
            </li>
            <li>
              <strong>The right to erasure</strong> – You have the right to request that we erase your personal
              data, under certain conditions.
            </li>
            <li>
              <strong>The right to restrict processing</strong> – You have the right to request that we restrict
              the processing of your personal data, under certain conditions.
            </li>
            <li>
              <strong>The right to object to processing</strong> – You have the right to object to our
              processing of your personal data, under certain conditions.
            </li>
            <li>
              <strong>The right to data portability</strong> – You have the right to request that we transfer the
              data that we have collected to another organization, or directly to you, under certain conditions.
            </li>
          </ul>
          <p className="mt-4">
            If you make a request, we have one month to respond to you. If you would like to exercise any of
            these rights, please contact us.
          </p>
        </Section>

        <Section title="Children’s Information" emoji="👶">
          <p>
            Another part of our priority is adding protection for children while using the internet. We encourage
            parents and guardians to observe, participate in, and/or monitor and guide their online activity.
          </p>
          <p>
            ISKM Pondicherry does not knowingly collect any Personal Identifiable Information from children under
            the age of 13. If you think that your child provided this kind of information on our website, we
            strongly encourage you to contact us immediately, and we will do our best efforts to promptly remove
            such information from our records.
          </p>
        </Section>
      </main>
    </div>
  );
}
