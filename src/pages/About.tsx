import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Waves,
  Target,
  Users,
  Heart,
  ArrowRight,
  Lightbulb,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";

const values = [
  {
    icon: Target,
    title: "Focus on Simplicity",
    description:
      "We believe the best tools get out of your way. Acta is designed to be intuitive and clutter-free.",
  },
  {
    icon: Users,
    title: "User-Centric Design",
    description:
      "Every feature we build starts with understanding our users. Your feedback shapes our roadmap.",
  },
  {
    icon: Lightbulb,
    title: "Continuous Innovation",
    description:
      "We constantly push the boundaries of what a task manager can be, embracing new technologies.",
  },
  {
    icon: Heart,
    title: "Passion for Quality",
    description:
      "We sweat the details. From animations to performance, everything is crafted with care.",
  },
];

const timeline = [
  {
    year: "2026",
    title: "The Beginning",
    description:
      "Acta started as a side project to scratch our own itch – a beautiful, fast task manager.",
  },
  {
    year: "2026",
    title: "First Users",
    description:
      "We launched our beta and welcomed our first 1,000 users who helped shape the product.",
  },
  {
    year: "2026",
    title: "Growth & Features",
    description:
      "Added team collaboration, themes, and analytics. Grew to 50,000+ active users.",
  },
  {
    year: "2026",
    title: "Today",
    description:
      "Continuing to build the future of task management with our amazing community.",
  },
];

const team = [
  { name: "Alex Chen", role: "Founder & CEO", avatar: "AC" },
  { name: "Sarah Kim", role: "Head of Product", avatar: "SK" },
  { name: "Marcus Johnson", role: "Lead Engineer", avatar: "MJ" },
  { name: "Emily Rivera", role: "Head of Design", avatar: "ER" },
];

const About = () => {
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
              About Us
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
              We're Building the Future of{" "}
              <span className="text-gradient">Productivity</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Acta was born from a simple belief: task management should be
              beautiful, fast, and actually enjoyable to use.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                Our Mission
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                Empowering People to Do Their Best Work
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                We started Acta because we were frustrated with existing task
                managers. They were either too simple or too complex, and almost
                all of them felt outdated.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Our mission is to create tools that help you focus on what
                matters most. We believe that when you remove friction from task
                management, you unlock new levels of productivity and
                creativity.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Today, Acta is used by tens of thousands of individuals and
                teams worldwide, from freelancers to Fortune 500 companies.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4">
                  <div className="text-4xl font-bold text-gradient mb-2">
                    50K+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active Users
                  </div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-bold text-gradient mb-2">
                    2M+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Tasks Completed
                  </div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-bold text-gradient mb-2">
                    99.9%
                  </div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-bold text-gradient mb-2">
                    4.9★
                  </div>
                  <div className="text-sm text-muted-foreground">
                    User Rating
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              What We Stand For
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="p-3 rounded-xl bg-primary/10 text-primary inline-block mb-4">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              The Acta Story
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 mb-8 last:mb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {item.year.slice(-2)}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <div className="text-sm text-muted-foreground mb-1">
                    {item.year}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
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
                Join Our Journey
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Be part of the Acta community. Start managing your tasks better
                today.
              </p>
              <Button size="lg" className="group" asChild>
                <Link to="/auth/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
