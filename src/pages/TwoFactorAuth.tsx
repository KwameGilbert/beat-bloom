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
  const [step, setStep] = useState(1); // 1: Info/Disable, 2: Setup, 3: Success
  const [setupData, setSetupData] = useState<{ secret: string; qrCode: string } | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  // If user already has 2FA enabled, step 1 should show "Disable" option instead of "Setup"
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

      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={cn(
                "h-20 w-20 flex items-center justify-center rounded-3xl shadow-inner",
                user.mfaEnabled ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"
              )}>
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {user.mfaEnabled ? "2FA is enabled" : "Secure your account"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {user.mfaEnabled 
                  ? "Your account is protected with an extra layer of security. We'll ask for a code whenever you log in from a new device."
                  : "Two-factor authentication adds an extra layer of security to your account. In addition to your password, you'll need to enter a code from an authenticator app."
                }
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Status</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Currently: <span className={user.mfaEnabled ? "text-green-500 font-bold" : "text-muted-foreground"}>
                      {user.mfaEnabled ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {user.mfaEnabled ? (
              <button
                onClick={handleDisable}
                disabled={isLoading}
                className="w-full rounded-full border border-red-500 py-4 font-bold text-red-500 transition-all hover:bg-red-500/5 active:scale-95 disabled:opacity-50"
              >
                Disable 2FA
              </button>
            ) : (
              <button
                onClick={handleStartSetup}
                disabled={isLoading}
                className="w-full rounded-full bg-orange-500 py-4 font-bold text-white transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? "Preparing..." : "Enable 2FA"}
              </button>
            )}
          </div>
        )}

        {step === 2 && setupData && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Scan QR Code</h2>
              <p className="text-sm text-muted-foreground">
                Scan this QR code with your authenticator app (like Google Authenticator or Authy).
              </p>
            </div>

            <div className="flex justify-center p-8 rounded-3xl border border-border bg-white transition-transform hover:scale-[1.02]">
              <div className="h-48 w-48 flex items-center justify-center rounded-2xl overflow-hidden bg-white">
                <img src={setupData.qrCode} alt="Setup QR Code" className="h-full w-full object-contain p-2" />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Or enter manual key</p>
              <div className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3 font-mono text-sm text-foreground">
                <span className="truncate mr-2">{setupData.secret}</span>
                <button 
                  onClick={() => copyToClipboard(setupData.secret)}
                  className="flex items-center gap-1 text-xs font-bold text-orange-500 hover:underline shrink-0"
                >
                  <Copy className="h-3 w-3" />
                  COPY
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <label className="text-sm font-bold text-foreground">Enter 6-digit confirmation code</label>
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full tracking-[1em] text-center rounded-xl border border-border bg-card py-4 font-mono text-2xl text-foreground focus:border-orange-500 focus:outline-none"
                placeholder="000000"
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={isLoading || verificationCode.length !== 6}
              className="w-full rounded-full bg-orange-500 py-4 font-bold text-white transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Confirm & Enable"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center text-center space-y-8 py-12 animate-in zoom-in-95 duration-500">
            <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-green-500 opacity-20" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Success!</h2>
              <p className="text-muted-foreground">Two-factor authentication is now enabled on your account.</p>
            </div>

            <div className="w-full rounded-2xl bg-secondary/50 p-6 border border-border">
                <h4 className="text-sm font-bold text-foreground inline-flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Save your backup codes
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm font-mono text-muted-foreground bg-background/50 p-4 rounded-xl border border-border">
                    {backupCodes.map((code, idx) => (
                      <div key={idx} className="flex justify-between items-center px-1">
                        <span>{code}</span>
                      </div>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                  These codes can be used to access your account if you lose your authenticator device. Each code can only be used once.
                </p>
                <button 
                  onClick={() => copyToClipboard(backupCodes.join("\n"))}
                  className="mt-4 flex items-center justify-center gap-2 w-full rounded-xl bg-background border border-border py-2 text-xs font-bold hover:bg-secondary transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy all backup codes
                </button>
            </div>

            <button
              onClick={() => navigate("/settings")}
              className="w-full rounded-full bg-foreground py-4 font-bold text-background transition-all hover:opacity-90 active:scale-95"
            >
              Back to Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper for conditional classes
const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export default TwoFactorAuth;
