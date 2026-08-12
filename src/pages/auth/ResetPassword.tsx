import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight, Waves, CheckCircle2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/auth";

const passwordRequirements = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (p: string) => p.length >= 8,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    test: (p: string) => /[A-Z]/.test(p),
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    test: (p: string) => /[a-z]/.test(p),
  },
  { id: "number", label: "One number", test: (p: string) => /\d/.test(p) },
];

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const token = searchParams.get("token");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authApi.resetPassword(token, newPassword),
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("Password reset successfully!", {
        description: "You can now log in with your new password.",
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "Failed to reset password. The link may have expired.";
      toast.error("Reset failed", { description: message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid request", {
        description: "Missing password reset token.",
      });
      return;
    }

    const allRequirementsMet = passwordRequirements.every((req) =>
      req.test(password)
    );

    if (!allRequirementsMet) {
      toast.error("Please meet all password requirements");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    resetPasswordMutation.mutate({ token, newPassword: password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent rounded-full blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-xl relative z-10 space-y-8"
      >
        {/* Logo */}
        <div className="flex flex-col items-center text-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Waves className="w-6 h-6 text-accent" />
            </div>
            <span className="text-2xl font-bold">Acta</span>
          </Link>
        </div>

        {!token ? (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Invalid Reset Link</h2>
              <p className="text-sm text-muted-foreground leading-relaxed px-4">
                This reset link is missing a token. Please request a new password reset link.
              </p>
            </div>
            <Button
              onClick={() => navigate("/auth/forgot-password")}
              className="w-full h-12 text-base font-semibold"
            >
              Request new link
            </Button>
          </div>
        ) : !isSubmitted ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Set new password</h2>
              <p className="text-sm text-muted-foreground">
                Please enter a secure new password for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password requirements */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {passwordRequirements.map((req) => {
                  const isMet = req.test(password);
                  return (
                    <div
                      key={req.id}
                      className={`flex items-center gap-2 text-xs transition-colors ${
                        isMet ? "text-gray-600" : "text-red-600"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                          isMet
                            ? "bg-accent border-accent"
                            : "border-muted-foreground/30"
                        }`}
                      >
                        {isMet && (
                          <Check className="w-2.5 h-2.5 text-accent-foreground" />
                        )}
                      </div>
                      {req.label}
                    </div>
                  );
                })}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold group mt-4"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Saving password...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Save and Login
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Password reset success</h2>
              <p className="text-sm text-muted-foreground leading-relaxed px-4">
                Your password has been changed successfully. You can now log in using your new credentials.
              </p>
            </div>
            <Button
              className="w-full h-12 text-base font-semibold"
              onClick={() => navigate("/auth/signin")}
            >
              Sign In
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
