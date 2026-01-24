import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  ArrowLeft, 
  ChevronRight,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  Mail
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { showNotification } from "@/components/ui/custom-notification";

const panelTransition = {
  type: "spring" as const,
  damping: 25,
  stiffness: 100,
  mass: 1.2,
};

interface LocationState {
  email?: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const { resetPassword, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: state?.email || "",
    otp: "",
    password: "",
    confirmPassword: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    // If we land here without an email, we really need one
    if (!formData.email && !location.state) {
        // We might want to redirect back to forgot-password
    }
  }, [formData.email, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (formData.otp.length !== 6) {
      setLocalError("Verification code must be 6 digits");
      return;
    }

    try {
      await resetPassword(formData.email, formData.otp, formData.password);
      showNotification(
        "Success!",
        "Your password has been reset. You can now log in.",
        "success"
      );
      navigate("/login");
    } catch {
      // Error is handled in store
    }
  };

  return (
    <motion.div 
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={panelTransition}
      className="relative z-20 flex min-h-[550px] w-full flex-col items-center rounded-t-[40px] bg-background px-8 pt-10 pb-8 shadow-[0_-20px_60px_-12px_rgba(0,0,0,0.2)] md:rounded-[40px] md:max-w-[450px]"
    >
      <div className="absolute top-4 h-1.5 w-12 rounded-full bg-secondary md:hidden" />

      <button 
        onClick={() => navigate("/forgot-password")}
        className="absolute left-6 top-8 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="mb-6 flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-xl shadow-orange-500/30">
          <ShieldCheck className="h-8 w-8 text-white" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold text-foreground">Set New Password</h1>
        <p className="mt-2 text-sm text-balance text-muted-foreground">
          Enter the code sent to your email and your new password.
        </p>
      </div>

      <AnimatePresence>
        {(error || localError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 flex w-full items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-500"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{localError || error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="w-full space-y-4 flex-1">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Email</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
            <input 
              type="email" 
              required
              readOnly={!!state?.email}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="alex@example.com"
              className="w-full rounded-xl border border-border bg-secondary/30 py-2.5 pl-10 pr-4 text-sm text-foreground focus:border-orange-500 focus:bg-background focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Verification Code</label>
          <div className="relative group text-center">
            <input 
              type="text" 
              required
              maxLength={6}
              value={formData.otp}
              onChange={(e) => setFormData({...formData, otp: e.target.value.replace(/\D/g, '')})}
              placeholder="000000"
              className="w-full rounded-xl border border-border bg-secondary/30 py-3 text-center text-2xl font-bold tracking-[10px] text-foreground focus:border-orange-500 focus:bg-background focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">New Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
            <input 
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Min. 8 characters"
              className="w-full rounded-xl border border-border bg-secondary/30 py-2.5 pl-10 pr-10 text-sm text-foreground focus:border-orange-500 focus:bg-background focus:outline-none transition-all"
            />
            <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-2.5 text-muted-foreground hover:text-foreground"
            >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Confirm Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
            <input 
              type={showPassword ? "text" : "password"}
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              placeholder="Re-type password"
              className="w-full rounded-xl border border-border bg-secondary/30 py-2.5 pl-10 pr-10 text-sm text-foreground focus:border-orange-500 focus:bg-background focus:outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || formData.otp.length !== 6 || !formData.password}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          ) : (
            <>
              Update Password
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-sm text-center text-muted-foreground opacity-60">
        Changed your mind?{" "}
        <Link to="/login" className="font-bold text-orange-500 hover:underline">
          Back to Login
        </Link>
      </p>
    </motion.div>
  );
};

export default ResetPassword;
