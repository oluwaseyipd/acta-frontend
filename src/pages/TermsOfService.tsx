import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const TermsOfService = () => {
  const effectiveDate = "January 07, 2026";
  const [activeSection, setActiveSection] = useState("acceptance");

  const sections = useMemo(
    () => [
      {
        id: "acceptance",
        title: "1. Acceptance of Terms",
        content: `By accessing or using Acta (the "Service"), you agree to be bound by these Terms of Service ("Terms"), our Privacy Policy, and any additional terms and conditions that may apply to specific features of the Service. If you do not agree to these Terms, you may not access or use the Service.

These Terms constitute a legally binding agreement between you and Acta, Inc. ("Acta," "we," "us," or "our"). If you are using the Service on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.`,
      },
      {
        id: "eligibility",
        title: "2. Eligibility",
        content: `To use our Service, you must:

• Be at least 16 years of age (or the age of legal majority in your jurisdiction)
• Have the legal capacity to enter into a binding agreement
• Not be prohibited from using the Service under applicable laws
• Provide accurate and complete registration information

If you are using the Service on behalf of an organization, you must have the authority to bind that organization and agree to these Terms on its behalf.`,
      },
      {
        id: "account",
        title: "3. Your Account",
        subsections: [
          {
            title: "3.1 Account Registration",
            content: `To access certain features of the Service, you must create an account. When registering, you agree to:

• Provide accurate, current, and complete information
• Maintain and promptly update your account information
• Keep your password secure and confidential
• Notify us immediately of any unauthorized access to your account`,
          },
          {
            title: "3.2 Account Security",
            content: `You are responsible for all activities that occur under your account. You agree not to share your account credentials with others. We reserve the right to suspend or terminate accounts that we reasonably believe have been compromised.`,
          },
          {
            title: "3.3 Account Termination",
            content: `You may delete your account at any time through your account settings. Upon termination, your right to use the Service will cease immediately. We may retain certain information as required by law or for legitimate business purposes.`,
          },
        ],
      },
      {
        id: "acceptable-use",
        title: "4. Acceptable Use",
        content: `You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:

• Violate any applicable laws, regulations, or third-party rights
• Use the Service in any way that could damage, disable, overburden, or impair our servers or networks
• Attempt to gain unauthorized access to any part of the Service
• Upload, post, or transmit any harmful, illegal, or infringing content
• Use the Service to spam, harass, or abuse other users
• Interfere with other users' use and enjoyment of the Service
• Reverse engineer, decompile, or attempt to extract source code from the Service`,
      },
      {
        id: "content",
        title: "5. User Content",
        content: `The Service allows you to create, upload, and share content such as tasks, projects, notes, and files ("User Content"). You retain ownership of your User Content, but you grant us certain rights to provide and improve the Service.

By submitting User Content, you represent and warrant that:
• You own or have the necessary rights to the content
• Your content does not violate these Terms or applicable laws
• Your content does not infringe on third-party rights
• Your content is not harmful, offensive, or inappropriate

We reserve the right to remove User Content that violates these Terms or our policies. We may also preserve and disclose User Content if required by law or to protect our rights and interests.`,
      },
      {
        id: "privacy",
        title: "6. Privacy and Data Protection",
        subsections: [
          {
            title: "6.1 Data Collection",
            content: `We collect and process personal information as described in our Privacy Policy. By using the Service, you consent to such collection and processing.`,
          },
          {
            title: "6.2 Data Security",
            content: `We implement appropriate security measures to protect your data. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.`,
          },
          {
            title: "6.3 Data Retention",
            content: `We retain your personal information for as long as necessary to provide the Service and comply with legal obligations. You may request deletion of your data subject to certain exceptions.`,
          },
          {
            title: "6.4 International Transfers",
            content: `Your data may be processed in countries other than your own. We ensure appropriate safeguards are in place for international data transfers.`,
          },
        ],
      },
      {
        id: "payments",
        title: "7. Payments and Billing",
        content: `Certain features of the Service may require payment of fees. By subscribing to a paid plan, you agree to:

• Pay all applicable fees as described on our pricing page
• Provide accurate billing information
• Authorize us to charge your chosen payment method
• Pay fees when due, even if you do not use the Service

We may change our fees at any time with reasonable notice. If you disagree with a fee change, you may cancel your subscription. All fees are non-refundable except as required by law or as specifically stated in these Terms.`,
      },
      {
        id: "intellectual-property",
        title: "8. Intellectual Property",
        subsections: [
          {
            title: "8.1 Our Rights",
            content: `The Service, including its design, functionality, and content (excluding User Content), is owned by Acta and protected by intellectual property laws. We retain all rights not expressly granted to you.`,
          },
          {
            title: "8.2 Limited License",
            content: `We grant you a limited, non-exclusive, non-transferable license to access and use the Service for your personal or internal business purposes, subject to these Terms.`,
          },
          {
            title: "8.3 Restrictions",
            content: `You may not:
• Copy, modify, or create derivative works of the Service
• Sell, license, or distribute the Service
• Use the Service to develop competing products
• Remove or alter any proprietary notices`,
          },
          {
            title: "8.4 Feedback",
            content: `If you provide feedback about the Service, you grant us the right to use such feedback without restriction or compensation.`,
          },
        ],
      },
      {
        id: "availability",
        title: "9. Service Availability",
        content: `We strive to maintain high service availability but cannot guarantee uninterrupted access. The Service may be unavailable due to:

• Scheduled maintenance
• System updates and improvements
• Technical difficulties or outages
• Circumstances beyond our control

We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice.`,
      },
      {
        id: "third-party",
        title: "10. Third-Party Services and Integrations",
        content: `The Service may integrate with third-party services, applications, or websites. These integrations are provided for your convenience, and we are not responsible for:

• The availability or functionality of third-party services
• Third-party terms of service or privacy policies
• Any data shared with third-party services
• Any damages arising from third-party services

Your use of third-party services is subject to their respective terms and conditions.`,
      },
      {
        id: "disclaimers",
        title: "11. Disclaimers and Warranties",
        content: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING:

• IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
• WARRANTIES OF NON-INFRINGEMENT
• WARRANTIES ARISING FROM COURSE OF DEALING OR USAGE OF TRADE

We do not warrant that:
• The Service will meet your specific requirements
• The Service will be uninterrupted, secure, or error-free
• Any errors will be corrected
• The Service will be compatible with your systems`,
      },
      {
        id: "limitation",
        title: "12. Limitation of Liability",
        content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, Acta SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING:

• Loss of profits, data, or business opportunities
• Service interruptions or delays
• Unauthorized access to your account or data
• Errors or omissions in the Service

OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM OR RELATING TO THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM.

Some jurisdictions do not allow the limitation of certain damages, so these limitations may not apply to you.`,
      },
      {
        id: "indemnification",
        title: "13. Indemnification",
        subsections: [
          {
            title: "13.1 Your Indemnification",
            content: `You agree to indemnify, defend, and hold harmless Acta from any claims, damages, losses, and expenses arising from your use of the Service or violation of these Terms.`,
          },
          {
            title: "13.2 Our Rights",
            content: `We reserve the right to assume the exclusive defense of any matter subject to indemnification, in which case you will cooperate with our defense efforts.`,
          },
          {
            title: "13.3 Notice",
            content: `We will promptly notify you of any claims for which we seek indemnification and give you control over the defense and settlement of such claims.`,
          },
          {
            title: "13.4 Limitations",
            content: `This indemnification obligation will survive the termination of these Terms and your use of the Service.`,
          },
        ],
      },
      {
        id: "termination",
        title: "14. Termination",
        content: `Either party may terminate these Terms at any time. You may stop using the Service and delete your account. We may suspend or terminate your access if you violate these Terms or for any other reason with reasonable notice.

Upon termination:
• Your right to use the Service ends immediately
• You remain liable for any outstanding fees
• Provisions that should survive termination will continue to apply
• We may delete your account and User Content after a reasonable period`,
      },
      {
        id: "governing-law",
        title: "15. Governing Law and Dispute Resolution",
        content: `These Terms are governed by the laws of the State of California, without regard to conflict of law principles. Any disputes arising from these Terms or the Service will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.

You waive any right to participate in class actions or representative proceedings. If any part of this arbitration provision is found unenforceable, disputes will be resolved in the state or federal courts located in San Francisco, California.`,
      },
      {
        id: "general",
        title: "16. General Provisions",
        content: `These Terms constitute the entire agreement between you and Acta regarding the Service. If any provision is found unenforceable, the remaining provisions will remain in effect.

Our failure to enforce any right or provision does not constitute a waiver. You may not assign these Terms without our consent. We may assign these Terms without restriction.

We may update these Terms from time to time. Material changes will be communicated through the Service or by email. Your continued use constitutes acceptance of the updated Terms.`,
      },
    ],
    [],
  );

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -100; // Account for header height
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <PublicLayout>
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms of Service
            </h1>
            <div className="text-muted-foreground space-y-1">
              <p>Effective Date: {effectiveDate}</p>
            </div>
          </motion.div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents - Left Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="lg:sticky lg:top-24">
                <div className="bg-muted/30 rounded-xl p-6 border">
                  <h2 className="font-semibold mb-4 text-lg">
                    Table of Contents
                  </h2>
                  <nav className="space-y-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => handleSectionClick(section.id)}
                        className={cn(
                          "block text-left text-sm hover:text-primary transition-colors w-full p-2 rounded-md",
                          activeSection === section.id
                            ? "text-primary bg-primary/10 font-medium"
                            : "text-muted-foreground hover:bg-muted/50",
                        )}
                      >
                        {section.title}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </motion.div>

            {/* Main Content - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="bg-card rounded-xl p-8">
                <div className="space-y-12">
                  {sections.map((section, index) => (
                    <div
                      key={section.id}
                      id={section.id}
                      className="scroll-mt-24"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5 }}
                      >
                        <h2 className="text-2xl font-bold mb-6 text-foreground">
                          {section.title}
                        </h2>

                        {section.content && (
                          <div className="prose prose-gray dark:prose-invert max-w-none">
                            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                              {section.content}
                            </p>
                          </div>
                        )}

                        {section.subsections && (
                          <div className="space-y-8 mt-6">
                            {section.subsections.map((sub, subIndex) => (
                              <div
                                key={subIndex}
                                className="pl-4 border-l-2 border-muted"
                              >
                                <h3 className="text-lg font-semibold mb-3 text-foreground">
                                  {sub.title}
                                </h3>
                                <div className="prose prose-gray dark:prose-invert max-w-none">
                                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                                    {sub.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {index < sections.length - 1 && (
                          <Separator className="mt-12" />
                        )}
                      </motion.div>
                    </div>
                  ))}
                </div>

                {/* Contact Footer */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="mt-16 p-6 bg-muted/50 rounded-xl border"
                >
                  <h3 className="font-semibold mb-2">
                    Questions about these Terms?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you have any questions about these Terms of Service,
                    please contact us:
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Email: legal@Acta.com</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default TermsOfService;
