import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  ArrowLeft, 
  ChevronRight,
  AlertCircle,
  KeyRound,
  CheckCircle2
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { showNotification } from "@/components/ui/custom-notification";

const panelTransition = {
  type: "spring" as const,
  damping: 25,
  stiffness: 100,
  mass: 1.2,
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      showNotification(
        "Code Sent",
        "Please check your email for the verification code.",
        "success"
      );
    } catch {
      // Error is handled in the store
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={panelTransition}
        className="relative z-20 flex min-h-[400px] w-full flex-col items-center rounded-t-[40px] bg-background px-8 pt-12 pb-8 shadow-[0_-20px_60px_-12px_rgba(0,0,0,0.2)] md:rounded-[40px] md:max-w-[450px]"
      >
        <div className="absolute top-4 h-1.5 w-12 rounded-full bg-secondary md:hidden" />
        
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-green-500 shadow-xl shadow-green-500/5">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold text-foreground">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground px-4">
            We've sent a 6-digit verification code to <span className="font-bold text-foreground">{email}</span>.
          </p>
        </div>

        <button
          onClick={() => navigate("/reset-password", { state: { email } })}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-95"
        >
          Enter verification code
          <ChevronRight className="h-4 w-4" />
        </button>

        <button
          onClick={() => setIsSubmitted(false)}
          className="mt-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Didn't get the code? Try again
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={panelTransition}
      className="relative z-20 flex min-h-[450px] w-full flex-col items-center rounded-t-[40px] bg-background px-8 pt-10 pb-8 shadow-[0_-20px_60px_-12px_rgba(0,0,0,0.2)] md:rounded-[40px] md:max-w-[450px]"
    >
      <div className="absolute top-4 h-1.5 w-12 rounded-full bg-secondary md:hidden" />

      <button 
        onClick={() => navigate("/login")}
        className="absolute left-6 top-8 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="mb-8 flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl shadow-blue-500/30">
          <KeyRound className="h-8 w-8 text-white" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold text-foreground">Forgot Password?</h1>
        <p className="mt-2 text-sm text-muted-foreground px-4">
          No worries! Enter your email and we'll send you a code to reset it.
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 flex w-full items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-500"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-blue-500" />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full rounded-2xl border border-border bg-secondary/30 py-4 pl-12 pr-4 text-sm text-foreground focus:border-blue-500 focus:bg-background focus:outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !email}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          ) : (
            <>
              Send Code
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-sm text-center text-muted-foreground">
        Remember your password?{" "}
        <Link to="/login" className="font-bold text-blue-500 hover:underline">
          Back to Login
        </Link>
      </p>
    </motion.div>
  );
};

export default ForgotPassword;
