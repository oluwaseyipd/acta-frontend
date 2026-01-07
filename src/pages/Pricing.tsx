import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Sparkles, Zap, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Beginner",
    description: "Perfect for individuals getting started",
    price: "$0",
    period: "forever",
    icon: Sparkles,
    popular: false,
    features: [
      "Up to 50 tasks",
      "Basic task management",
      "List & Kanban views",
      "3 theme options",
      "Mobile responsive",
      "Email support",
    ],
    cta: "Get Started",
    href: "/auth/register",
  },
  {
    name: "Pro",
    description: "Best for professionals and growing teams",
    price: "$5",
    period: "/month",
    icon: Zap,
    popular: true,
    features: [
      "Unlimited tasks",
      "Advanced task management",
      "All 6 premium themes",
      "Time tracking",
      "Advanced analytics",
      "Team collaboration (up to 10)",
      "Priority support",
      "API access",
      "Custom integrations",
    ],
    cta: "Start Free Trial",
    href: "/auth/register?plan=pro",
  },
  {
    name: "Enterprise",
    description: "For large organizations with custom needs",
    price: "Custom",
    period: "",
    icon: Building2,
    popular: false,
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "SSO / SAML authentication",
      "Advanced security controls",
      "Custom onboarding",
      "Dedicated account manager",
      "SLA guarantee",
      "24/7 phone support",
      "Custom development",
    ],
    cta: "Contact Sales",
    href: "/contact",
  },
];

const faqs = [
  {
    question: "Can I change plans later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
  },
  {
    question: "Is there a free trial for Pro?",
    answer: "Absolutely! Try Pro free for 14 days. No credit card required.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and wire transfers for Enterprise plans.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period.",
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Pricing
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
              Simple, Transparent <span className="text-gradient">Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose the plan that's right for you. All plans include a 14-day
              free trial.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className={cn(
                  "glass-card p-8 relative",
                  plan.popular && "ring-2 ring-primary shadow-glow",
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-sm font-medium px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div
                    className={cn(
                      "p-3 rounded-xl inline-block mb-4",
                      plan.popular
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    <plan.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  className={cn(
                    "w-full group",
                    !plan.popular &&
                      "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                  )}
                  variant={plan.popular ? "default" : "secondary"}
                  asChild
                >
                  <Link to={plan.href}>
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              FAQs
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center relative overflow-hidden max-w-4xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Still Have Questions?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Our team is here to help. Reach out and we'll get back to you
                within 24 hours.
              </p>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
