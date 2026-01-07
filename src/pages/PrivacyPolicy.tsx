import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const PrivacyPolicy = () => {
  const lastUpdated = "January 07, 2026";
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = useMemo(
    () => [
      {
        id: "introduction",
        title: "1. Introduction",
        content: `Welcome to Acta ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our task management platform and related services (collectively, the "Service").

Please read this Privacy Policy carefully. By accessing or using our Service, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access or use our Service.`,
      },
      {
        id: "information-we-collect",
        title: "2. Information We Collect",
        subsections: [
          {
            title: "2.1 Personal Information You Provide",
            content: `We collect personal information that you voluntarily provide to us when you register for an account, use our Service, or contact us. This includes:

• Account Information: Name, email address, username, and password
• Profile Information: Profile picture, job title, and organization name
• Payment Information: Billing address and payment method details (processed securely by our payment processor)
• Communication Data: Messages, feedback, and support requests you send to us
• Task Data: Tasks, projects, notes, and other content you create within the Service`,
          },
          {
            title: "2.2 Information Collected Automatically",
            content: `When you access our Service, we automatically collect certain information, including:

• Device Information: Browser type, operating system, device identifiers, and IP address
• Usage Data: Pages visited, features used, time spent on the Service, and interaction patterns
• Cookies and Tracking Technologies: We use cookies, web beacons, and similar technologies to enhance your experience and collect analytics data
• Log Data: Server logs that record your interactions with our Service`,
          },
          {
            title: "2.3 Information from Third Parties",
            content: `We may receive information about you from third parties, including:

• Social login providers (Google, GitHub) if you choose to authenticate using these services
• Analytics providers that help us understand Service usage
• Business partners for integration purposes`,
          },
        ],
      },
      {
        id: "how-we-use",
        title: "3. How We Use Your Information",
        content: `We use the information we collect for various purposes, including:

• Providing and Maintaining the Service: To create and manage your account, process transactions, and deliver the features you request
• Improving the Service: To analyze usage patterns, troubleshoot issues, and develop new features
• Communication: To send you updates, security alerts, and support messages
• Personalization: To customize your experience and provide relevant content
• Marketing: To send promotional materials (with your consent where required)
• Legal Compliance: To comply with applicable laws, regulations, and legal processes
• Security: To detect, prevent, and respond to fraud, abuse, or security incidents`,
      },
      {
        id: "data-sharing",
        title: "4. How We Share Your Information",
        content: `We do not sell your personal information. We may share your information in the following circumstances:

• Service Providers: We share data with third-party vendors who perform services on our behalf (hosting, analytics, payment processing, customer support)
• Business Transfers: In connection with a merger, acquisition, or sale of assets, your information may be transferred
• Legal Requirements: We may disclose information if required by law or in response to valid legal requests
• With Your Consent: We may share information for other purposes with your explicit consent
• Aggregated Data: We may share anonymized, aggregated data that cannot identify you`,
      },
      {
        id: "data-retention",
        title: "5. Data Retention",
        content: `We retain your personal information for as long as your account is active or as needed to provide you with the Service. We may also retain and use your information to:

• Comply with legal obligations
• Resolve disputes
• Enforce our agreements
• Maintain business records

When you delete your account, we will delete or anonymize your personal information within 30 days, except where retention is required by law or for legitimate business purposes.`,
      },
      {
        id: "data-security",
        title: "6. Data Security",
        content: `We implement appropriate technical and organizational measures to protect your personal information, including:

• Encryption of data in transit (TLS/SSL) and at rest
• Regular security assessments and penetration testing
• Access controls and authentication mechanisms
• Employee training on data protection practices
• Incident response procedures

However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.`,
      },
      {
        id: "your-rights",
        title: "7. Your Privacy Rights",
        subsections: [
          {
            title: "7.1 General Rights",
            content: `Depending on your location, you may have certain rights regarding your personal information:

• Access: Request a copy of the personal information we hold about you
• Correction: Request correction of inaccurate or incomplete information
• Deletion: Request deletion of your personal information
• Portability: Request a copy of your data in a portable format
• Opt-out: Opt out of marketing communications at any time
• Restriction: Request restriction of processing in certain circumstances
• Objection: Object to processing based on legitimate interests`,
          },
          {
            title: "7.2 How to Exercise Your Rights",
            content: `To exercise these rights, please contact us at privacy@Acta.com. We will respond to your request within 30 days. You may also manage certain preferences through your account settings.

Please note that some rights may be subject to limitations based on applicable law or our legitimate business interests.`,
          },
          {
            title: "7.3 California Residents",
            content: `If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), including the right to request information about the categories of personal information we collect and how we use it.`,
          },
          {
            title: "7.4 European Union Residents",
            content: `If you are located in the European Union, you have rights under the General Data Protection Regulation (GDPR), including the right to lodge a complaint with a supervisory authority.`,
          },
        ],
      },
      {
        id: "cookies",
        title: "8. Cookies and Tracking Technologies",
        content: `We use cookies and similar technologies to enhance your experience and collect analytics data. The types of cookies we use include:

• Essential Cookies: Enable core functionality and security features
• Performance Cookies: Help us understand how visitors interact with our Service
• Functional Cookies: Remember your settings and preferences
• Marketing Cookies: Deliver relevant advertisements (with consent where required)

You can manage cookie preferences through your browser settings. However, please note that disabling certain cookies may affect the functionality of our Service. For more detailed information about our use of cookies, please see our Cookie Policy.`,
      },
      {
        id: "international-transfers",
        title: "9. International Data Transfers",
        content: `Your information may be transferred to and processed in countries other than your own, including the United States. We ensure appropriate safeguards are in place for international data transfers, including:

• Standard Contractual Clauses approved by relevant authorities
• Adequacy decisions where applicable
• Certification mechanisms and binding corporate rules

By using our Service, you understand and consent to the transfer of your information to countries that may have different data protection laws than your jurisdiction. We will always ensure that your personal information receives adequate protection regardless of where it is processed.`,
      },
      {
        id: "children",
        title: "10. Children's Privacy",
        content: `Our Service is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal information from a child under 16 without verification of parental consent, we will take steps to delete such information promptly.

If you are a parent or guardian and believe your child has provided us with personal information, please contact us at privacy@Acta.com. We encourage parents and guardians to monitor their children's Internet usage and to help enforce this Privacy Policy by instructing their children never to provide personal information without permission.`,
      },
      {
        id: "third-party-links",
        title: "11. Third-Party Services and Links",
        content: `Our Service may contain links to third-party websites, applications, or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party services.

When you use third-party integrations or click on third-party links, you may be directed to those third parties' websites or services. We strongly advise you to read the privacy policies of every website and service you visit.

This Privacy Policy applies only to information collected by our Service and does not apply to these third-party services.`,
      },
      {
        id: "changes",
        title: "12. Changes to This Privacy Policy",
        content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by:

• Posting the updated policy on our website with a new "Last Updated" date
• Sending an email notification to registered users
• Displaying a prominent notice within the Service
• Other appropriate means depending on the nature of the changes

We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information. Your continued use of the Service after such modifications constitutes your acceptance of the updated Privacy Policy.`,
      },
      {
        id: "contact",
        title: "13. Contact Us",
        content: `If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

Acta, Inc.
Privacy Team
Email: privacy@Acta.com
Address: 100 Innovation Drive, Suite 400, San Francisco, CA 94105, USA

For EU/EEA residents, you may also contact our Data Protection Officer at dpo@Acta.com.

We are committed to resolving any privacy-related concerns you may have. If you believe your rights have been violated, you have the right to lodge a complaint with the appropriate supervisory authority in your jurisdiction.`,
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
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>
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
                    Questions about our Privacy Policy?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you have any questions about how we handle your personal
                    information, please don't hesitate to contact us:
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Email: privacy@Acta.com</p>
                    <p>Data Protection Officer: dpo@Acta.com</p>
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

export default PrivacyPolicy;
