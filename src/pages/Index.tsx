import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Shield,
  BarChart3,
  Waves,
  Clock,
  Users,
  Palette,
  Star,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import heroImage from "@/assets/hero-image.png";
import step1Img from "@/assets/step-1.png";
import step2aImg from "@/assets/step-2(a).png";
import step2bImg from "@/assets/step-2(b).png";
import step3Img from "@/assets/step-3.png";

const features = [
  {
    icon: CheckCircle2,
    title: "Smart Task Management",
    description:
      "Organize tasks with priorities, due dates, and custom statuses",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Track your productivity with beautiful charts and insights",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimistic updates for instant feedback on every action",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and protected at all times",
  },
];

const steps = [
  {
    number: "01",
    title: "Create Your Tasks",
    description:
      "Add tasks in seconds with our intuitive interface. Set priorities, deadlines, and categories.",
    icon: CheckCircle2,
    image: step1Img,
  },
  {
    number: "02",
    title: "Organize & Track",
    description:
      "Use Kanban boards, lists, and filters to organize your workflow exactly how you want it.",
    icon: BarChart3,
    images: {
      board: step2aImg,
      list: step2bImg,
    },
  },
  {
    number: "03",
    title: "Achieve Your Goals",
    description:
      "Watch your productivity soar with insights, analytics, and celebration of completed tasks.",
    icon: Star,
    image: step3Img,
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager at TechCorp",
    avatar: "SC",
    content:
      "Acta transformed how our team collaborates. The intuitive interface and powerful features helped us ship 40% faster.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Freelance Designer",
    avatar: "MJ",
    content:
      "As a freelancer juggling multiple clients, Acta keeps me organized and on top of every deadline. Absolutely essential!",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Startup Founder",
    avatar: "ER",
    content:
      "The theme customization is beautiful, and the analytics give me real insights into our team productivity. Love it!",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Engineering Lead",
    avatar: "DK",
    content:
      "Finally a task manager that developers actually want to use. The keyboard shortcuts and API are fantastic.",
    rating: 5,
  },
  {
    name: "Lisa Thompson",
    role: "Marketing Director",
    avatar: "LT",
    content:
      "Our marketing campaigns are so much more organized now. Acta pays for itself in time saved.",
    rating: 5,
  },
  {
    name: "Alex Rivera",
    role: "Student",
    avatar: "AR",
    content:
      "Perfect for managing my coursework and projects. The free tier has everything I need!",
    rating: 5,
  },
];

const TestimonialCard = ({
  testimonial,
}: {
  testimonial: (typeof testimonials)[0];
}) => (
  <div className="flex-shrink-0 w-80 glass-card p-6 mx-4">
    <div className="flex items-center gap-1 mb-4">
      {[...Array(testimonial.rating)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
      ))}
    </div>
    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
      "{testimonial.content}"
    </p>
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
        {testimonial.avatar}
      </div>
      <div>
        <p className="font-medium text-foreground text-sm">
          {testimonial.name}
        </p>
        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
      </div>
    </div>
  </div>
);

const Index = () => {
  const [step2View, setStep2View] = useState<"board" | "list">("board");

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="container mx-auto relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="text-gradient">Manage Tasks</span>
              <br />
              <span className="text-foreground">Like Never Before</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Acta brings simplicity and power together. Organize your workflow,
              track progress, and achieve more with our beautifully designed
              task manager.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button size="lg" className="group" asChild>
                <Link to="/auth/register">
                  Start for Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/features">Learn More</Link>
              </Button>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 relative"
          >
            <div className="glass-card p-4 md:p-8 max-w-5xl mx-auto animate-float">
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={heroImage}
                  alt="Acta Dashboard Preview"
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Stay Productive
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built with modern technologies for the best possible experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 group hover:shadow-glow transition-shadow duration-300"
              >
                <div className="p-3 rounded-xl bg-primary/10 text-primary inline-block mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-secondary/20 relative overflow-hidden">
        {/* Subtle section background decorative blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
              Workflow Guide
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6 tracking-tight">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From signup to productivity in minutes. Experience a workspace that fits your natural thought flow.
            </p>
          </motion.div>

          <div className="space-y-32 max-w-6xl mx-auto">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              const isStep2 = step.number === "02";
              const currentImg = isStep2
                ? (step2View === "board" ? step.images?.board : step.images?.list)
                : step.image;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className={`flex flex-col items-center gap-12 lg:gap-20 ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Content Column */}
                  <div className="w-full lg:w-[42%] space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
                      <step.icon className="w-3.5 h-3.5" />
                      Step {step.number}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                      {step.description}
                    </p>

                    {isStep2 && (
                      <div className="flex flex-wrap gap-2.5 pt-2">
                        <button
                          onClick={() => setStep2View("board")}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                            step2View === "board"
                              ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                              : "bg-background/40 hover:bg-background/80 text-muted-foreground hover:text-foreground border-border/50"
                          }`}
                        >
                          <Zap className="w-4 h-4" />
                          Kanban Board
                        </button>
                        <button
                          onClick={() => setStep2View("list")}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                            step2View === "list"
                              ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                              : "bg-background/40 hover:bg-background/80 text-muted-foreground hover:text-foreground border-border/50"
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Task List
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Browser Mockup Image Column */}
                  <div className="w-full lg:w-[58%]">
                    <div className="relative group">
                      {/* Decorative gradient glow behind mockup */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000 pointer-events-none" />

                      {/* Mockup Frame */}
                      <div className="relative glass-card border border-white/10 dark:border-white/5 shadow-2xl rounded-2xl overflow-hidden bg-card/30 backdrop-blur-md">
                        {/* Browser Bar */}
                        <div className="flex items-center justify-between px-4 py-3 bg-muted/40 border-b border-border/40 select-none">
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-inner" />
                            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-inner" />
                            <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-inner" />
                          </div>
                          <div className="flex-1 max-w-[240px] sm:max-w-[320px] mx-4 py-1 px-3 bg-background/40 rounded-md border border-border/30 text-[10px] sm:text-xs text-muted-foreground font-mono truncate text-center">
                            acta.app/dashboard{step.number === "01" ? "/new" : step.number === "02" ? `/${step2View}` : "/analytics"}
                          </div>
                          <div className="w-12" /> {/* alignment spacer */}
                        </div>

                        {/* Screenshot Wrapper */}
                        <div className="relative overflow-hidden aspect-[16/10] bg-muted/10">
                          <motion.img
                            key={currentImg}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            src={currentImg}
                            alt={step.title}
                            className="w-full h-full object-cover object-top hover:scale-[1.01] transition-transform duration-700 ease-out"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 overflow-hidden">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              Loved by Thousands of Users
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              See what our community has to say about Acta
            </p>
          </motion.div>
        </div>

        {/* Scrolling Testimonials - Row 1 (Left to Right) */}
        <div className="relative mb-6">
          <div className="flex animate-marquee-left">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <TestimonialCard
                key={`row1-${index}`}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>

        {/* Scrolling Testimonials - Row 2 (Right to Left) */}
        <div className="relative">
          <div className="flex animate-marquee-right">
            {[
              ...testimonials.slice().reverse(),
              ...testimonials.slice().reverse(),
            ].map((testimonial, index) => (
              <TestimonialCard
                key={`row2-${index}`}
                testimonial={testimonial}
              />
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
            className="glass-card p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/30 via-secondary/10 to-secondary/30" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Workflow?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Join thousands of productive users and start managing your tasks
                the right way.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="group" asChild>
                  <Link to="/auth/register">
                    Get Started for Free
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

export default Index;
