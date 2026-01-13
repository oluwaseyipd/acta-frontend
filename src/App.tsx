import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import ScrollToTop from "@/components/utils/ScrollToTop";
import BackToTopButton from "@/components/utils/BackToTopButton";
import { initEmailJS } from "@/services/emailjs";

// Public Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";

// Dashboard Pages
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import DashboardOverview from "./pages/dashboard/Overview";
import Tasks from "./pages/dashboard/Tasks";

// Authentication Pages
import SignIn from "./pages/auth/SignIn";
import Register from "./pages/auth/Register";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize EmailJS when app starts
    initEmailJS();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              // Public Routes
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              // Authentication Routes
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/signin" element={<SignIn />} />
              // Dashboard Routes
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="tasks" element={<Tasks />} />
              </Route>
              ;
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BackToTopButton />
          </TooltipProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
