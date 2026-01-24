import { useState, useEffect, useCallback } from "react";
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
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const { verifyOTP, resendOTP } = useAuthStore();

  useEffect(() => {
    // If we land here without an email, we really need one
    if (!formData.email && !location.state) {
        // We might want to redirect back to forgot-password
    }
  }, [formData.email, location.state]);

  const handleVerifyOtp = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    clearError();
    setLocalError(null);

    if (formData.otp.length !== 6) {
      setLocalError("Verification code must be 6 digits");
      return;
    }

    try {
      await verifyOTP(formData.email, formData.otp);
      setIsOtpVerified(true);
      showNotification(
        "Code Verified",
        "Please enter your new password now.",
        "success"
      );
    } catch {
      // Error is handled in store
    }
  }, [formData.email, formData.otp, verifyOTP, clearError]);

  useEffect(() => {
    if (formData.otp.length === 6 && !isOtpVerified && !isLoading) {
      handleVerifyOtp();
    }
  }, [formData.otp.length, isOtpVerified, isLoading, handleVerifyOtp]);

  const handleResendOtp = async () => {
    clearError();
    setLocalError(null);
    try {
      await resendOTP(formData.email);
      showNotification(
        "Code Resent",
        "A new verification code has been sent to your email.",
        "success"
      );
    } catch {
      // Error is handled in store
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
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

  const renderVerifyStep = () => (
    <motion.div
      key="verify"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="flex w-full flex-col items-center"
    >
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-xl shadow-orange-500/30">
          <ShieldCheck className="h-8 w-8 text-white" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold text-foreground">Verify OTP</h1>
        <p className="mt-2 text-sm text-balance text-muted-foreground px-4">
          Enter the 6-digit code sent to your email to continue.
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

      <form onSubmit={handleVerifyOtp} className="w-full space-y-6">
        <div className="space-y-4">
          <div className="relative group text-center">
            <input 
              type="text" 
              required
              autoFocus
              maxLength={6}
              value={formData.otp}
              onChange={(e) => setFormData({...formData, otp: e.target.value.replace(/\D/g, '')})}
              placeholder="000000"
              className="w-full rounded-2xl border border-border bg-secondary/30 py-6 text-center text-4xl font-bold tracking-[15px] text-foreground focus:border-orange-500 focus:bg-background focus:outline-none transition-all"
            />
          </div>
          
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading}
              className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors uppercase tracking-wider disabled:opacity-50"
            >
              {isLoading ? "Resending..." : "Resend Code"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || formData.otp.length !== 6}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          ) : (
            <>
              Verify Code
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );

  const renderResetStep = () => (
    <motion.div
      key="reset"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="flex w-full flex-col items-center"
    >
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-xl shadow-orange-500/30">
          <Lock className="h-8 w-8 text-white" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold text-foreground">New Password</h1>
        <p className="mt-2 text-sm text-balance text-muted-foreground px-4">
          Choose a strong password to secure your account.
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

      <form onSubmit={handleSubmit} className="w-full space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">New Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
            <input 
              type={showPassword ? "text" : "password"}
              required
              autoFocus
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Min. 8 characters"
              className="w-full rounded-xl border border-border bg-secondary/30 py-3.5 pl-10 pr-10 text-sm text-foreground focus:border-orange-500 focus:bg-background focus:outline-none transition-all"
            />
            <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-muted-foreground hover:text-foreground"
            >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Confirm Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
            <input 
              type={showPassword ? "text" : "password"}
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              placeholder="Re-type password"
              className="w-full rounded-xl border border-border bg-secondary/30 py-3.5 pl-10 pr-10 text-sm text-foreground focus:border-orange-500 focus:bg-background focus:outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !formData.password || !formData.confirmPassword}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-700 active:scale-95 disabled:opacity-50"
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
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={panelTransition}
      className="relative z-20 flex min-h-[500px] w-full flex-col items-center rounded-t-[40px] bg-background px-8 pt-10 pb-8 shadow-[0_-20px_60px_-12px_rgba(0,0,0,0.2)] md:rounded-[40px] md:max-w-[450px]"
    >
      <div className="absolute top-4 h-1.5 w-12 rounded-full bg-secondary md:hidden" />

      <button 
        onClick={() => navigate("/forgot-password")}
        className="absolute left-6 top-8 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <AnimatePresence mode="wait">
        {!isOtpVerified ? renderVerifyStep() : renderResetStep()}
      </AnimatePresence>

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
