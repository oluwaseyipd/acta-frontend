import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Home,
  Search,
  AlertCircle,
  Waves,
  Mail,
  DollarSign,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // You can implement search functionality here
      // For now, redirect to home with search query
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const popularPages = [
    { name: "Home", path: "/", icon: Home },
    { name: "Contact", path: "/contact", icon: Mail },
    { name: "Pricing", path: "/pricing", icon: DollarSign },
    { name: "About", path: "/about", icon: Info },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center px-6 py-20 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

          {/* Floating Elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-20 opacity-20"
          >
            <Search className="w-8 h-8 text-primary" />
          </motion.div>

          <motion.div
            animate={{
              y: [0, 15, 0],
              x: [0, -10, 0],
              rotate: [0, -3, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-40 right-16 opacity-15"
          >
            <Home className="w-10 h-10 text-accent" />
          </motion.div>

          <motion.div
            animate={{
              y: [0, -10, 0],
              x: [0, 8, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-32 left-16 opacity-25"
          >
            <AlertCircle className="w-6 h-6 text-primary" />
          </motion.div>

          <motion.div
            animate={{
              y: [0, 12, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute bottom-20 right-32 opacity-20"
          >
            <Waves className="w-7 h-7 text-accent" />
          </motion.div>
        </div>

        <div className="relative max-w-2xl mx-auto text-center">
          {/* 404 Animation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="relative">
              <h1 className="text-8xl md:text-9xl font-bold text-gradient mb-4">
                404
              </h1>
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4 text-primary/30"
              >
                <Waves className="w-12 h-12" />
              </motion.div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Oops! This Page Wandered Off
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              The page you're looking for seems to have taken a different route.
              Don't worry, we'll help you get back on track!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button onClick={() => navigate("/")} size="lg" className="group">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
            <Button
              onClick={handleGoBack}
              variant="outline"
              size="lg"
              className="group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
