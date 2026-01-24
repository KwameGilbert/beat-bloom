import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { authService, ApiError } from "@/lib/auth";
import { Loader2, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from "lucide-react";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link. Please check your email and try again.");
        return;
      }

      try {
        await authService.verifyEmail(token);
        setStatus("success");
      } catch (err) {
        console.error("Email verification error:", err);
        setStatus("error");
        if (err instanceof ApiError) {
          setMessage(err.message || "Failed to verify email. The link may have expired.");
        } else {
          setMessage("An unexpected error occurred. Please try again later.");
        }
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md overflow-hidden rounded-3xl bg-secondary/30 p-8 shadow-2xl backdrop-blur-xl border border-white/5"
      >
        <div className="flex flex-col items-center text-center space-y-6">
          {status === "loading" && (
            <>
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-orange-500/20 blur-2xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500/10">
                  <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Verifying Email</h1>
                <p className="text-muted-foreground">Please wait while we confirm your email address...</p>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
              >
                <div className="absolute inset-0 animate-pulse rounded-full bg-green-500/20 blur-2xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500/10">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
              </motion.div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Perfect!</h1>
                <p className="text-muted-foreground">
                  Your email has been verified successfully. You can now access all features of BeatBloom.
                </p>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="group flex w-full items-center justify-center h-12 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all active:scale-[0.98]"
              >
                Continue to Login
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </>
          )}

          {status === "error" && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
              >
                <div className="absolute inset-0 animate-pulse rounded-full bg-red-500/20 blur-2xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10">
                  <XCircle className="h-10 w-10 text-red-500" />
                </div>
              </motion.div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Verification Failed</h1>
                <p className="text-red-400 font-medium">{message}</p>
                <p className="text-sm text-muted-foreground">
                  If you think this is a mistake, you can request a new verification link from your profile settings.
                </p>
              </div>
              <div className="grid w-full grid-cols-2 gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center justify-center h-12 rounded-xl border border-white/10 bg-transparent text-foreground font-bold hover:bg-white/5 transition-all"
                >
                  Back to Login
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center justify-center h-12 rounded-xl bg-foreground text-background font-bold hover:opacity-90 transition-all"
                >
                  Go Home
                </button>
              </div>
            </>
          )}

          <div className="pt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3 w-3" />
            <span>Secure Verification System</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
