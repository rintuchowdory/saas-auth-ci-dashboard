/**
 * Login Page — JWT Auth entry point
 * Design: Slate Precision — dark glassmorphism, indigo accents
 * Background: hero-auth-bg.webp with circuit board pattern
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, GitBranch, Shield, Zap } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663687681945/MhmaVsPXwYDcapbnxEwuLj/hero-auth-bg-4X6XWTQniZQX2id8Krethn.webp";

export default function Login() {
  const [, navigate] = useLocation();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("dev.demo@example.com");
  const [password, setPassword] = useState("demo1234");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
        toast.success("Welcome back!", { description: "Redirecting to dashboard..." });
      } else {
        await register(name, email, password);
        toast.success("Account created!", { description: "Welcome to the dashboard." });
      }
      navigate("/dashboard");
    } catch (err) {
      toast.error("Authentication failed", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${HERO_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[oklch(0.12_0.015_264/0.85)]" />

      {/* Floating decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4 animate-fade-in">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-xl font-semibold text-white tracking-tight">SaaS CI/CD</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {mode === "login" ? "Sign in to your account" : "Create your account"}
          </h1>
          <p className="text-sm text-slate-400">
            {mode === "login"
              ? "Enter your credentials to access the dashboard"
              : "Start managing your CI/CD pipelines"}
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-xl p-6 shadow-2xl">
          {/* Demo hint */}
          {mode === "login" && (
            <div className="mb-5 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <p className="text-xs text-indigo-300 font-medium mb-1">Demo credentials</p>
              <p className="text-xs text-slate-400 font-mono">dev.demo@example.com / any password</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm text-slate-300">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Alex Developer"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-slate-300">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm text-slate-300">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium h-10 transition-all duration-200"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {mode === "login" ? "Signing in..." : "Creating account..."}</>
              ) : (
                mode === "login" ? "Sign in" : "Create account"
              )}
            </Button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-slate-400">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>

        {/* Feature badges */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> JWT Auth</span>
          <span className="w-px h-3 bg-slate-700" />
          <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" /> OAuth2</span>
          <span className="w-px h-3 bg-slate-700" />
          <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> FastAPI</span>
        </div>
      </div>
    </div>
  );
}
