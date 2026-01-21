/**
 * TwoFactorAuth.tsx
 * 
 * TODO: This component is temporarily disabled until 2FA backend is fully implemented.
 * When ready, uncomment the full implementation below.
 */

import { useNavigate } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";

const TwoFactorAuth = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-xl items-center gap-3 px-4 py-4 sm:px-6">
          <button 
            onClick={() => navigate("/settings")}
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Two-Factor Authentication</h1>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="h-20 w-20 flex items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500 shadow-inner">
            <Construction className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Coming Soon</h2>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Two-factor authentication is currently under development. This feature will add an extra layer of security to your account.
            </p>
          </div>
          <button
            onClick={() => navigate("/settings")}
            className="mt-4 rounded-full bg-foreground px-8 py-3 font-bold text-background transition-all hover:opacity-90 active:scale-95"
          >
            Back to Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;

/*
 * FULL IMPLEMENTATION - Uncomment when 2FA backend is ready
 * 
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { 
  ArrowLeft, 
  Smartphone, 
  ShieldCheck, 
  AlertTriangle,
  CheckCircle2,
  Copy
} from "lucide-react";
import { showNotification } from "@/components/ui/custom-notification";

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const { user, setup2FA, verify2FA, disable2FA, isLoading } = useAuthStore();
  const [step, setStep] = useState(1);
  const [setupData, setSetupData] = useState<{ secret: string; qrCode: string } | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleStartSetup = async () => {
    try {
      const data = await setup2FA();
      setSetupData(data);
      setStep(2);
    } catch (err: any) {
      showNotification("Error", err.message || "Failed to initiate 2FA setup", "error");
    }
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      showNotification("Error", "Please enter a 6-digit code", "error");
      return;
    }

    try {
      const codes = await verify2FA(verificationCode);
      setBackupCodes(codes);
      setStep(3);
    } catch (err: any) {
      showNotification("Verification Failed", err.message || "Invalid code", "error");
    }
  };

  const handleDisable = async () => {
    if (!window.confirm("Are you sure you want to disable 2FA? This will make your account less secure.")) return;
    try {
      await disable2FA();
      showNotification("2FA Disabled", "Two-factor authentication has been turned off.", "success");
      navigate("/settings");
    } catch (err: any) {
      showNotification("Error", err.message || "Failed to disable 2FA", "error");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification("Copied", "Secret key copied to clipboard", "info", 2000);
  };

  if (!user) return null;

  // ... rest of the component JSX
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export default TwoFactorAuth;
*/
