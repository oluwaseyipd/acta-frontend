import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/auth';

const SignIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    // rememberMe: false,
  });

  // Define the mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // 1. Save tokens from your Django response
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      toast.success("Welcome back!", {
        description: "You have been signed in successfully.",
      });

      // 2. Redirect
      navigate("/dashboard");
    },
    onError: (error: any) => {
      // Axios error handling
      const message = error.response?.data?.detail || "Invalid credentials";
      toast.error("Sign in failed", { description: message });
    }
  });

  // Google OAuth mutation
  const googleLoginMutation = useMutation({
    mutationFn: authApi.getGoogleUrl,
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to login with Google", {
          description: "No redirect URL was returned.",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Failed to load Google Auth URL", {
        description: error.response?.data?.detail || error.message || "Please try again later.",
      });
    }
  });

  const handleGoogleLogin = () => {
    googleLoginMutation.mutate();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger the mutation with form data
    loginMutation.mutate({
      email: formData.email, // Django usually expects 'username' or 'email'
      password: formData.password
    });
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
        className="w-full max-w-md bg-card border border-border p-8  relative z-10 space-y-8"
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

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
          <p className="mt-2 text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="pl-10 h-12"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
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
          </div>

          <div className="flex items-center justify-between">
            {/* <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, rememberMe: checked as boolean })
                  }
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer"
                >
                  Remember me
                </Label>
              </div> */}
            <Link
              to="/auth/forgot-password"
              className="text-sm text-primary hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold group"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Signing in...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Sign in
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-card text-muted-foreground">
              or continue with
            </span>
          </div>
        </div>

        {/* Social Login */}
        <div>
          <Button
            variant="outline"
            className="w-full h-12"
            onClick={handleGoogleLogin}
            disabled={googleLoginMutation.isPending}
          >
            {googleLoginMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Continue with Google
          </Button>
        </div>

        {/* Sign up link */}
        <p className="text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            className="text-primary hover:underline font-medium"
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignIn;
