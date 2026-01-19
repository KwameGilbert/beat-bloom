import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { 
  ArrowLeft, 
  Bell, 
  Lock, 
  Eye, 
  CreditCard, 
  ShieldCheck,
  ChevronRight,
  LogOut,
  Trash2,
  Mail,
  Moon,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { showNotification } from "@/components/ui/custom-notification";

interface SettingItem {
  icon: any;
  label: string;
  value?: string;
  path?: string;
  toggle?: () => Promise<void>;
  state?: boolean;
}

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout, deleteAccount, updateSettings, isLoading } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  
  const [modalState, setModalState] = useState<{
    show: boolean;
    type: "logout" | "delete" | null;
  }>({ show: false, type: null });

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleToggle = async (key: string, value: boolean) => {
    try {
      await updateSettings({ [key]: value });
      showNotification("Settings updated", "Your preferences have been saved.", "success", 2000);
    } catch (err: any) {
      showNotification("Error", err.message || "Failed to update settings", "error");
    }
  };

  const handleThemeToggle = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    try {
      // Update local theme first for instant feedback
      toggleTheme();
      // Then sync with backend
      await updateSettings({ theme: newTheme });
    } catch (err: any) {
       // If backend fails, we might want to revert local theme or just notify
       console.error("Failed to sync theme with backend", err);
    }
  };

  const handleItemClick = (label: string) => {
    showNotification("Coming Soon", `${label} settings are being implemented!`, "info");
  };

  const sections: { title: string; items: SettingItem[] }[] = [
    {
      title: "Account",
      items: [
        { icon: Mail, label: "Email Address", value: user.email },
        { icon: Lock, label: "Password", value: "••••••••", path: "/settings/password" },
        { icon: ShieldCheck, label: "Two-Factor Auth", value: user.mfaEnabled ? "On" : "Off", path: "/settings/2fa" },
      ]
    },
    {
      title: "Payments & Billing",
      items: [
        { icon: CreditCard, label: "Payout Methods", value: user.role === 'producer' ? "Manage" : "No methods added", path: "/settings/payouts" },
        { icon: TrendingUp, label: "Billing History", path: "/settings/billing" },
      ]
    },
    {
      title: "Preferences",
      items: [
        { 
          icon: Bell, 
          label: "Email Notifications", 
          state: user.emailNotifications, 
          toggle: () => handleToggle('emailNotifications', !user.emailNotifications) 
        },
        { 
          icon: Bell, 
          label: "Push Notifications", 
          state: user.pushNotifications, 
          toggle: () => handleToggle('pushNotifications', !user.pushNotifications) 
        },
        { 
          icon: Eye, 
          label: "Public Profile", 
          state: user.publicProfile, 
          toggle: () => handleToggle('publicProfile', !user.publicProfile) 
        },
        { 
          icon: Moon, 
          label: "Dark Mode", 
          state: theme === "dark", 
          toggle: handleThemeToggle 
        },
      ]
    }
  ];

  const handleLogout = () => {
    setModalState({ show: true, type: "logout" });
  };

  const handleDeleteAccount = () => {
    setModalState({ show: true, type: "delete" });
  };

  const confirmAction = async () => {
    if (modalState.type === "logout") {
      await logout();
      navigate("/login");
    } else if (modalState.type === "delete") {
      try {
        await deleteAccount();
        showNotification("Account Deleted", "Your account has been permanently removed.", "success");
        navigate("/login");
      } catch (err: any) {
        showNotification("Error", err.message || "Failed to delete account", "error");
      }
    }
    setModalState({ show: false, type: null });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4 sm:px-6">
          <button 
            onClick={() => navigate("/profile")}
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="space-y-8">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h2 className="px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {section.title}
              </h2>
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={itemIdx}
                      onClick={() => {
                        if (item.toggle) return;
                        if (item.path) navigate(item.path);
                        else handleItemClick(item.label);
                      }}
                      className={cn(
                        "flex items-center justify-between px-4 py-4 transition-colors hover:bg-secondary/30",
                        !item.toggle && "cursor-pointer",
                        itemIdx !== section.items.length - 1 && "border-b border-border"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          {item.value && <p className="text-xs text-muted-foreground">{item.value}</p>}
                        </div>
                      </div>

                      {item.toggle ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            item.toggle?.();
                          }}
                          disabled={isLoading}
                          className={cn(
                            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50",
                            item.state ? "bg-orange-500" : "bg-zinc-700"
                          )}
                        >
                          <span 
                            className={cn(
                              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                              item.state ? "translate-x-5" : "translate-x-0"
                            )}
                          />
                        </button>
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Danger Zone */}
          <div className="space-y-3 pt-4">
            <h2 className="px-4 text-xs font-bold uppercase tracking-widest text-red-500">
              Danger Zone
            </h2>
            <div className="overflow-hidden rounded-2xl border border-red-500/20 bg-card">
              <button 
                onClick={handleLogout}
                className="flex w-full items-center justify-between px-4 py-4 transition-colors hover:bg-red-500/5 text-foreground"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border">
                    <LogOut className="h-5 w-5 text-muted-foreground group-hover:text-red-500" />
                  </div>
                  <span className="text-sm font-medium">Log Out</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="flex w-full items-center justify-between border-t border-border px-4 py-4 transition-colors hover:bg-red-500/5 text-red-500"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border">
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </div>
                  <span className="text-sm font-medium">Delete Account</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Version Info */}
          <div className="text-center pt-8">
            <p className="text-xs text-muted-foreground">BeatBloom v1.0.4</p>
            <p className="text-xs text-muted-foreground mt-1">© 2026 BeatBloom Inc.</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={modalState.show && modalState.type === "logout"}
        onClose={() => setModalState({ show: false, type: null })}
        onConfirm={confirmAction}
        title="Log Out"
        description="Are you sure you want to log out of your account? You will need to sign in again to access your beats and playlists."
        confirmText="Log Out"
        variant="info"
      />

      <ConfirmationModal
        isOpen={modalState.show && modalState.type === "delete"}
        onClose={() => setModalState({ show: false, type: null })}
        onConfirm={confirmAction}
        title="Delete Account"
        description="This action is permanent and cannot be undone. All your beats, playlists, and purchase history will be permanently deleted."
        confirmText="Delete Permanently"
        variant="danger"
      />
    </div>
  );
};

export default Settings;
