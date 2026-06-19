import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Waves, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const code = searchParams.get("code");
  const displayError = !code ? "No authorization code was returned from Google." : errorMessage;

  const googleAuthMutation = useMutation({
    mutationFn: authApi.googleCallback,
    onSuccess: (data: any) => {
      // Save tokens
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      toast.success("Welcome to Acta!", {
        description: "Successfully authenticated with Google.",
      });

      // Redirect to dashboard
      navigate("/dashboard");
    },
    onError: (error: any) => {
      console.error("Google authentication callback failed:", error);
      const detail = error.response?.data?.detail || "Failed to authenticate with Google.";
      setErrorMessage(detail);
      toast.error("Authentication failed", { description: detail });
    },
  });

  useEffect(() => {
    if (code) {
      googleAuthMutation.mutate(code);
    }
  }, [code, googleAuthMutation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative background grid/circles */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent rounded-full blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-xl relative z-10 flex flex-col items-center text-center gap-6"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-md">
            <Waves className="w-7 h-7 text-accent" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight">Acta</span>
        </Link>

        {displayError ? (
          <div className="space-y-6 w-full">
            <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Authentication Error</h2>
              <p className="text-sm text-muted-foreground leading-relaxed px-4">
                {displayError}
              </p>
            </div>
            <Button
              onClick={() => navigate("/auth/signin")}
              className="w-full h-12 text-base font-semibold group"
            >
              Back to Sign In
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        ) : (
          <div className="space-y-6 w-full">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto relative">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Signing you in...</h2>
              <p className="text-sm text-muted-foreground">
                Connecting to Google and setting up your productive space.
              </p>
            </div>
            <div className="text-xs text-muted-foreground/60 animate-pulse">
              Securing your connection
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GoogleCallback;
