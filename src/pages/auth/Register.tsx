import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/auth';

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

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password_confirm: "",
    // agreeToTerms: false,
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      // Typically, Django returns tokens upon registration too
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      toast.success("Account created!", {
        description: "Welcome to Acta. Please signin to get started!",
      });
      navigate("/auth/signin");
    },
    onError: (error: any) => {
      // Handle Django validation errors (e.g., "Email already exists")
      const backendErrors = error.response?.data;
      const message = backendErrors ? Object.values(backendErrors).flat()[0] : "Registration failed";
      toast.error("Error", { description: String(message) });
    }
  });

  // Google OAuth mutation
  const googleLoginMutation = useMutation({
    mutationFn: authApi.getGoogleUrl,
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to sign up with Google", {
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

    // 1. Client-side checks
    // if (!formData.agreeToTerms) {
    //   toast.error("Please agree to the terms and conditions");
    //   return;
    // }

    const allRequirementsMet = passwordRequirements.every((req) =>
      req.test(formData.password)
    );

    if (!allRequirementsMet) {
      toast.error("Please meet all password requirements");
      return;
    }

    // 2. Fire the mutation
    registerMutation.mutate({
      first_name: formData.firstName,
      last_name: formData.lastName,// Adjust keys to match Django's expected field names
      email: formData.email,
      password: formData.password,
      password_confirm: formData.password_confirm,
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
        className="w-full max-w-md bg-card border border-border p-8 relative z-10 space-y-6"
      >
        {/* Logo */}
        <div className="flex flex-col items-center text-center">
          <Link to="/" className="">
            <img src="/logo.png" className="w-32 h-32 object-contain" alt="Acta" />
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">
            Create an account
          </h2>
          <p className="mt-2 text-muted-foreground">
            Start your productivity journey today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10 h-12"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Last name"
                  className="pl-10 h-12"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

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

            <div className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password_confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12"
                    value={formData.password_confirm}
                    onChange={(e) =>
                      setFormData({ ...formData, password_confirm: e.target.value })
                    }
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
                  const isMet = req.test(formData.password);
                  return (
                    <div
                      key={req.id}
                      className={`flex items-center gap-2 text-xs transition-colors ${isMet ? "text-gray-600" : "text-red-600"
                        }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${isMet
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
            </div>
          </div>

          {/* <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, agreeToTerms: checked as boolean })
                }
                className="mt-0.5"
              />
              <Label
                htmlFor="terms"
                className="text-sm font-normal cursor-pointer leading-relaxed"
              >
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div> */}

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold group"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Creating account...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Create account
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

        {/* Sign in link */}
        <p className="text-center text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/auth/signin"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
