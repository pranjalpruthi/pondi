import { createFileRoute, Link } from '@tanstack/react-router';
import { InView } from '@/components/motion-primitives/in-view';
import { motion } from 'motion/react';
import { CopyButton } from '@/components/animate-ui/buttons/copy';
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogTitle,
  MorphingDialogDescription,
} from '@/components/motion-primitives/morphing-dialog';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/terms-and-conditions/')({
  component: TermsAndConditions,
});

const Section = ({ title, emoji, children }: { title: string; emoji?: string; children: React.ReactNode }) => (
  <InView as="section" className="mb-8" once viewOptions={{ amount: 0.2 }}>
    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
      {emoji && <span className="mr-2">{emoji}</span>}{title}
    </h2>
    <div className="prose prose-lg lg:prose-xl max-w-none dark:prose-invert">{children}</div>
  </InView>
);

function TermsAndConditions() {
  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <header className="text-center mb-12">
        <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100"
        >
          Terms and Conditions
        </motion.h1>
        <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-2 text-lg text-muted-foreground"
        >
          Welcome to ISKM Pondicherry
        </motion.p>
      </header>

      <main className="max-w-4xl mx-auto">
        <Section title="Introduction" emoji="👋">
          <p>
            These terms and conditions outline the rules and regulations for the use of ISKM Pondicherry’s
            Website, located at{' '}
            <a href="http://pudhuvai.vrindavanam.org.in" className="text-blue-600 hover:underline">
              http://pudhuvai.vrindavanam.org.in
            </a>
            .
          </p>
          <p>
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use
            ISKM Pondicherry if you do not agree to take all of the terms and conditions stated on this page.
          </p>
          <p>
            The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer
            Notice and all Agreements: “Client”, “You”, and “Your” refers to you, the person logging on this
            website and compliant with the Company’s terms and conditions. “The Company”, “Ourselves”, “We”,
            “Our”, and “Us” refers to our Company, ISKM Pondicherry. “Party”, “Parties”, or “Us” refers to both
            the Client and ourselves. All terms refer to the offer, acceptance, and consideration of payment
            necessary to undertake the process of our assistance to the Client in the most appropriate manner
            for the express purpose of meeting the Client’s needs in respect of the provision of the Company’s
            stated services, in accordance with and subject to, the prevailing laws of India. Any use of the
            above terminology or other words in the singular, plural, capitalization, and/or he/she or they, are
            taken as interchangeable and therefore as referring to the same.
          </p>
        </Section>

        <Section title="Cookies" emoji="🍪">
          <p>
            We employ the use of cookies. By accessing ISKM Pondicherry, you agreed to use cookies in agreement
            with ISKM Pondicherry’s Privacy Policy.
          </p>
          <p>
            Most interactive websites use cookies to let us retrieve the user’s details for each visit. Cookies
            are used by our website to enable the functionality of certain areas to make it easier for people
            visiting our website. Some of our affiliate/advertising partners may also use cookies.
          </p>
        </Section>

        <Section title="License" emoji="📜">
          <p>
            Unless otherwise stated, ISKM Pondicherry and/or its licensors own the intellectual property rights
            for all material on ISKM Pondicherry. All intellectual property rights are reserved. You may access
            this from ISKM Pondicherry for your own personal use subjected to restrictions set in these Terms
            and Conditions.
          </p>
          <p>You must not:</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li>Republish material from ISKM Pondicherry</li>
            <li>Sell, rent, or sub-license material from ISKM Pondicherry</li>
            <li>Reproduce, duplicate or copy material from ISKM Pondicherry</li>
            <li>Redistribute content from ISKM Pondicherry</li>
          </ul>
        </Section>

        <Section title="Hyperlinking to our Content" emoji="🔗">
          <p>The following organizations may link to our Website without prior written approval:</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li>Government agencies;</li>
            <li>Search engines;</li>
            <li>News organizations;</li>
            <li>
              Online directory distributors may link to our Website in the same manner as they hyperlink to the
              Websites of other listed businesses; and
            </li>
            <li>
              System-wide Accredited Businesses except soliciting non-profit organizations, charity shopping
              malls, and charity fundraising groups which may not hyperlink to our Website.
            </li>
          </ul>
          <p className="mt-4">
            These organizations may link to our home page, to publications, or to other Website information so
            long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship,
            endorsement, or approval of the linking party and its products and/or services; and (c) fits within
            the context of the linking party’s site.
          </p>
          <p className="mt-4">
            We may consider and approve other link requests from the following types of organizations:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li>commonly-known consumer and/or business information sources;</li>
            <li>dot.com community sites;</li>
            <li>associations or other groups representing charities;</li>
            <li>online directory distributors;</li>
            <li>internet portals;</li>
            <li>accounting, law, and consulting firms; and</li>
            <li>educational institutions and trade associations.</li>
          </ul>
          <p className="mt-4">
            We will approve link requests from these organizations if we decide that: (a) the link would not
            make us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not
            have any negative records with us; (c) the benefit to us from the visibility of the hyperlink
            compensates the absence of ISKM Pondicherry; and (d) the link is in the context of general resource
            information.
          </p>
          <p className="mt-4">
            These organizations may link to our home page so long as the link: (a) is not in any way deceptive;
            (b) does not falsely imply sponsorship, endorsement, or approval of the linking party and its
            products or services; and (c) fits within the context of the linking party’s site.
          </p>
          <p className="mt-4">
            If you are one of the organizations listed in paragraph 2 above and are interested in linking to our
            website, you must inform us by sending an e-mail. Please include your name, your organization name, contact information as well as the URL of your
            site, a list of any URLs from which you intend to link to our Website, and a list of the URLs on our
            site to which you would like to link. Wait 2-3 weeks for a response.
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
          <p className="mt-4">Approved organizations may hyperlink to our Website as follows:</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li>By use of our corporate name; or</li>
            <li>By use of the uniform resource locator being linked to; or</li>
            <li>
              By use of any other description of our Website being linked to that makes sense within the context
              and format of content on the linking party’s site.
            </li>
          </ul>
          <p className="mt-4">
            No use of ISKM Pondicherry’s logo or other artwork will be allowed for linking absent a trademark
            license agreement.
          </p>
        </Section>

        <Section title="iFrames" emoji="🖼️">
          <p>
            Without prior approval and written permission, you may not create frames around our Webpages that
            alter in any way the visual presentation or appearance of our Website.
          </p>
        </Section>

        <Section title="Content Liability" emoji="⚖️">
          <p>
            We shall not be held responsible for any content that appears on your Website. You agree to protect
            and defend us against all claims that are arising on your Website. No link(s) should appear on any
            Website that may be interpreted as libelous, obscene, or criminal, or which infringes, otherwise
            violates, or advocates the infringement or other violation of, any third party rights.
          </p>
        </Section>

        <Section title="Your Privacy" emoji="🔒">
          <p>
            Please read our <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </p>
        </Section>

        <Section title="Reservation of Rights" emoji=" réserve">
          <p>
            We reserve the right to request that you remove all links or any particular link to our Website. You
            approve to immediately remove all links to our Website upon request. We also reserve the right to
            amend these Terms and Conditions and its linking policy at any time. By continuously linking to our
            Website, you agree to be bound to and follow these linking Terms and Conditions.
          </p>
        </Section>

        <Section title="Removal of links from our website" emoji="🗑️">
          <p>
            If you find any link on our Website that is offensive for any reason, you are free to contact and
            inform us any moment. We will consider requests to remove links but we are not obligated to do so or
            to respond to you directly.
          </p>
          <p>
            We do not ensure that the information on this website is correct; we do not warrant its completeness
            or accuracy; nor do we promise to ensure that the website remains available or that the material on
            the website is kept up to date.
          </p>
        </Section>

        <Section title="Disclaimer" emoji="📢">
          <p>
            To the maximum extent permitted by applicable law, we exclude all representations, warranties, and
            conditions relating to our website and the use of this website. For full details, please review our
            complete disclaimer.
          </p>
          <div className="mt-6">
            <MorphingDialog>
              <MorphingDialogTrigger>
                <Button variant="outline">Read Full Disclaimer</Button>
              </MorphingDialogTrigger>
              <MorphingDialogContainer>
                <MorphingDialogContent className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-2xl w-full">
                  <MorphingDialogClose />
                  <MorphingDialogTitle>
                    <h2 className="text-2xl font-bold">Disclaimer</h2>
                  </MorphingDialogTitle>
                  <MorphingDialogDescription>
                    <div className="prose prose-lg max-w-none dark:prose-invert mt-4">
                      <p>
                        To the maximum extent permitted by applicable law, we exclude all representations, warranties, and
                        conditions relating to our website and the use of this website. Nothing in this disclaimer will:
                      </p>
                      <ul className="list-disc list-inside space-y-2 mt-4">
                        <li>limit or exclude our or your liability for death or personal injury;</li>
                        <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                        <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
                        <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
                      </ul>
                      <p className="mt-4">
                        The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer:
                        (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the
                        disclaimer, including liabilities arising in contract, in tort, and for breach of statutory duty.
                      </p>
                      <p className="mt-4">
                        As long as the website and the information and services on the website are provided free of charge,
                        we will not be liable for any loss or damage of any nature.
                      </p>
                    </div>
                  </MorphingDialogDescription>
                </MorphingDialogContent>
              </MorphingDialogContainer>
            </MorphingDialog>
          </div>
        </Section>
      </main>
    </div>
  );
}
