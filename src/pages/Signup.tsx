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
  User,
  Apple,
  Chrome,
  AlertCircle
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const panelTransition = {
  type: "spring" as const,
  damping: 25,
  stiffness: 100,
  mass: 1.2,
};

const Signup = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [authMethod, setAuthMethod] = useState<"social" | "email">("social");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [roleType, setRoleType] = useState<"artist" | "producer">("artist");

  const handleSignup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    clearError();
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: roleType,
      });
      navigate("/home");
    } catch {
      // Error is handled in the store
    }
  };

  const handleSocialSignup = () => {
    // TODO: Implement OAuth social signup
    // For now, switch to email signup
    setAuthMethod("email");
  };

  return (
    <motion.div 
      key="signup-panel"
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={panelTransition}
      className="relative z-20 flex min-h-[680px] w-full flex-col items-center rounded-t-[40px] bg-background px-8 pt-10 pb-8 shadow-[0_-20px_60px_-12px_rgba(0,0,0,0.2)] md:rounded-[40px] md:max-w-[450px] md:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.2)]"
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
                  {authMethod === "social" ? "Join BeatBloom" : "Create account"}
              </motion.h1>
              <motion.p 
                  layoutId="auth-subtitle"
                  transition={panelTransition}
                  className="mt-2 text-balance text-sm font-medium text-muted-foreground px-4"
              >
                  {authMethod === "social" ? "Join the premium producer community." : "Tell us a bit about yourself."}
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
                  key="social-signup-content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 w-full"
                >
                  <button
                    onClick={handleSocialSignup}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-zinc-950 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-zinc-900 active:scale-95 shadow-lg dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                  >
                    <Apple className="h-5 w-5" />
                    Sign up with Apple
                  </button>
                  
                  <button
                    onClick={handleSocialSignup}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-600/10"
                  >
                    <Chrome className="h-5 w-5" />
                    Continue with Google
                  </button>

                  <button
                    onClick={() => setAuthMethod("email")}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-4 text-sm font-bold text-foreground transition-all hover:bg-secondary active:scale-95 shadow-sm"
                  >
                    <Mail className="h-5 w-5" />
                    Sign up with Email
                  </button>

                  <div className="flex items-center gap-2 pt-4">
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">or</span>
                      <div className="h-px flex-1 bg-border" />
                  </div>

                  <p className="pt-4 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="font-bold text-orange-500 hover:underline">
                      Log in
                    </Link>
                  </p>
                </motion.div>
              ) : (
                <motion.form 
                  key="email-signup-content"
                  onSubmit={handleSignup}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 w-full"
                >
                  <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Name</label>
                      <div className="relative group">
                          <User className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
                          <input 
                              type="text" 
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              placeholder="Alex Peterson"
                              className="w-full rounded-2xl border border-border bg-secondary/30 py-3.5 pl-12 pr-4 text-sm text-foreground focus:border-orange-500 focus:bg-background focus:outline-none transition-all"
                          />
                      </div>
                  </div>

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
                              minLength={8}
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              placeholder="Minimum 8 characters"
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

                  {/* Role Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">I am a</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setRoleType("artist")}
                        className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${
                          roleType === "artist"
                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Artist
                      </button>
                      <button
                        type="button"
                        onClick={() => setRoleType("producer")}
                        className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${
                          roleType === "producer"
                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Producer
                      </button>
                    </div>
                  </div>

                  <button
                      type="submit"
                      disabled={isLoading}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-50 mt-2"
                  >
                      {isLoading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-8 text-[10px] text-center text-muted-foreground leading-relaxed opacity-60">
              By joining you agree to BeatBloom's <span className="underline">Terms</span> and <span className="underline">Privacy Policy</span>.
          </p>
      </div>
    </motion.div>
  );
};

export default Signup;
