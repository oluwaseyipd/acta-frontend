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
import Inbox from "./pages/dashboard/Inbox";
import Tasks from "./pages/dashboard/Tasks";
import Today from "./pages/dashboard/Today";
import Completed from "./pages/dashboard/Completed";
import Analytics from "./pages/dashboard/Analytics"
import Profile from "./pages/dashboard/Profile";

// Authentication Pages
import SignIn from "./pages/auth/SignIn";
import Register from "./pages/auth/Register";
import GoogleCallback from "./pages/auth/GoogleCallback";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
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
              <Route path="/auth/google/callback" element={<GoogleCallback />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              // Dashboard Routes
              <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<DashboardOverview />} />
                    <Route path="inbox" element={<Inbox />} />
                    <Route path="today" element={<Today />} />
                    <Route path="tasks" element={<Tasks />} />
                    <Route path="completed" element={<Completed />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="profile" element={<Profile />} />
                  </Route>
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
