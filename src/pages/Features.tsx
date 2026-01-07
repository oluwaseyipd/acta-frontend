import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  BarChart3,
  Palette,
  Clock,
  Shield,
  Zap,
  Users,
  Smartphone,
  ArrowRight,
  Kanban,
  ListTodo,
  Bell,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";

const coreFeatures = [
  {
    icon: ListTodo,
    title: "Complete Task CRUD",
    description:
      "Create, read, update, and delete tasks with ease. Full control over your task lifecycle with intuitive interfaces.",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Kanban,
    title: "Kanban & List Views",
    description:
      "Switch between Kanban boards and list views instantly. Organize your workflow the way that suits you best.",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: Palette,
    title: "6 Beautiful Themes",
    description:
      "Choose from Midnight, Forest, Sunset, Lavender, Nordic, or Cyberpunk. Light and dark modes for each.",
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description:
      "Track time spent on tasks with built-in timers. Generate reports and analyze your productivity patterns.",
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Beautiful charts and insights. Track completion rates, daily progress, and identify productivity trends.",
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Never miss a deadline. Get reminders for upcoming tasks and celebrate when you complete your goals.",
    color: "bg-red-500/10 text-red-500",
  },
];

const additionalFeatures = [
  {
    icon: Search,
    title: "Command Palette",
    description:
      "Navigate anywhere with CMD+K. Quick actions at your fingertips.",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "Works beautifully on desktop, tablet, and mobile devices.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data is encrypted and stored securely. We never share your information.",
  },
  {
    icon: Zap,
    title: "Optimistic Updates",
    description:
      "Instant feedback on every action. No waiting for server responses.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share tasks and projects with your team. Real-time updates.",
  },
  {
    icon: CheckCircle2,
    title: "Task Dependencies",
    description:
      "Link related tasks and set dependencies for complex projects.",
  },
];

const Features = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Features
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
              Powerful Features for{" "}
              <span className="text-gradient">Modern Teams</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Everything you need to manage tasks effectively, wrapped in a
              beautiful interface with the flexibility to work your way.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Core Features
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The essential tools you need to stay productive
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-8 group transition-all duration-300"
              >
                <div
                  className={`p-4 rounded-2xl bg-primary/10 inline-block mb-6`}
                >
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              And Much More
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Additional features that make Acta stand out
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="flex items-start gap-4 p-4"
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
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
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Try Acta free for 14 days. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="group" asChild>
                  <Link to="/auth/register">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
