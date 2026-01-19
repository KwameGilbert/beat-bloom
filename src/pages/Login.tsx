import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Music2, 
  Mail, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Lock, 
  ChevronRight,
  Apple,
  Chrome,
  AlertCircle
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { showNotification } from "@/components/ui/custom-notification";

const panelTransition = {
  type: "spring" as const,
  damping: 25,
  stiffness: 100,
  mass: 1.2,
};

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [authMethod, setAuthMethod] = useState<"social" | "email">("social");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    clearError();
    
    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      // Show success notification
      showNotification(
        "Welcome back!",
        "Successfully signed in. Redirecting...",
        "success",
        2000
      );

      // Brief delay
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch {
      // Error is handled in the store
    }
  };

  const handleSocialLogin = () => {
    // TODO: Implement OAuth social login
    // For now, switch to email login
    setAuthMethod("email");
  };

  return (
    <motion.div 
      key="login-panel"
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={panelTransition}
      className="relative z-20 flex min-h-[580px] w-full flex-col items-center rounded-t-[40px] bg-background px-8 pt-10 pb-8 shadow-[0_-20px_60px_-12px_rgba(0,0,0,0.2)] md:rounded-[40px] md:max-w-[450px] md:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.2)]"
    >
      <div className="absolute top-4 h-1.5 w-12 rounded-full bg-secondary md:hidden" />

      <div className="w-full h-full flex flex-col items-center">
          <AnimatePresence>
              {authMethod === "email" && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => {
                    setAuthMethod("social");
                    clearError();
                  }}
                  className="absolute left-6 top-8 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
                >
                  <ArrowLeft className="h-5 w-5" />
                </motion.button>
              )}
          </AnimatePresence>

          <div className="mb-6 flex flex-col items-center text-center">
              <motion.div 
                  layoutId="auth-logo"
                  transition={panelTransition}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-xl shadow-orange-500/30"
              >
                  <Music2 className="h-8 w-8 text-white" />
              </motion.div>
              <motion.h1 
                  layoutId="auth-title"
                  transition={panelTransition}
                  className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground"
              >
                  {authMethod === "social" ? "Welcome back" : "Login info"}
              </motion.h1>
              <motion.p 
                  layoutId="auth-subtitle"
                  transition={panelTransition}
                  className="mt-2 text-balance text-sm font-medium text-muted-foreground px-4"
              >
                  {authMethod === "social" ? "Almost any beat, delivered." : "Enter your credentials."}
              </motion.p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 flex w-full items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-500"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full relative flex-1">
            <AnimatePresence mode="wait">
              {authMethod === "social" ? (
                <motion.div 
                  key="social-auth-content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 w-full"
                >
                  <button
                    onClick={handleSocialLogin}
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-zinc-950 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-zinc-900 active:scale-95 disabled:opacity-50 shadow-lg dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                  >
                    <Apple className="h-5 w-5" />
                    Sign in with Apple
                  </button>
                  
                  <button
                    onClick={handleSocialLogin}
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 shadow-lg"
                  >
                    <Chrome className="h-5 w-5" />
                    Continue with Google
                  </button>

                  <button
                    onClick={() => setAuthMethod("email")}
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-4 text-sm font-bold text-foreground transition-all hover:bg-secondary active:scale-95 shadow-sm"
                  >
                    <Mail className="h-5 w-5" />
                    Continue with Email
                  </button>

                  <div className="flex items-center gap-2 pt-4">
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">or</span>
                      <div className="h-px flex-1 bg-border" />
                  </div>

                  <p className="pt-4 text-center text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <Link to="/signup" className="font-bold text-orange-500 hover:underline">
                          Join BeatBloom
                      </Link>
                  </p>
                </motion.div>
              ) : (
                <motion.form 
                  key="email-auth-content"
                  onSubmit={handleLogin}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 w-full"
                >
                  <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Email</label>
                      <div className="relative group">
                          <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
                          <input 
                              type="email" 
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              placeholder="alex@example.com"
                              className="w-full rounded-2xl border border-border bg-secondary/30 py-3.5 pl-12 pr-4 text-sm text-foreground focus:border-orange-500 focus:bg-background focus:outline-none transition-all"
                          />
                      </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Password</label>
                      <div className="relative group">
                          <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
                          <input 
                              type={showPassword ? "text" : "password"}
                              required
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              placeholder="••••••••"
                              className="w-full rounded-2xl border border-border bg-secondary/30 py-3.5 pl-12 pr-12 text-sm text-foreground focus:border-orange-500 focus:bg-background focus:outline-none transition-all"
                          />
                          <button 
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-3.5 text-muted-foreground hover:text-foreground"
                          >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                      </div>
                  </div>

                  <div className="flex justify-end">
                    <Link 
                      to="/forgot-password" 
                      className="text-xs font-medium text-muted-foreground hover:text-orange-500 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                      type="submit"
                      disabled={isLoading}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-50"
                  >
                      {isLoading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-8 text-[10px] text-center text-muted-foreground leading-relaxed opacity-60">
              By continuing you agree to BeatBloom's <span className="underline">Terms</span> and <span className="underline">Privacy Policy</span>.
          </p>
      </div>
    </motion.div>
  );
};

export default Login;
