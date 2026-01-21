import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

/**
 * OAuth Callback Page
 * Handles the redirect from OAuth providers (Google, Discord, etc.)
 * Extracts tokens from URL and stores them in auth state
 */
const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchProfile } = useAuthStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");
      const error = searchParams.get("error");

      if (error) {
        setStatus("error");
        setErrorMessage(
          error === "oauth_denied"
            ? "You cancelled the sign-in process."
            : error === "oauth_failed"
            ? "Authentication failed. Please try again."
            : "An unexpected error occurred."
        );
        return;
      }

      if (!accessToken || !refreshToken) {
        setStatus("error");
        setErrorMessage("Missing authentication tokens.");
        return;
      }

      try {
        // Store tokens in localStorage (same as regular login)
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Fetch user profile to populate the auth store
        await fetchProfile();

        setStatus("success");

        // Redirect to home after brief success message
        setTimeout(() => {
          navigate("/home", { replace: true });
        }, 1500);
      } catch (err) {
        console.error("OAuth callback error:", err);
        setStatus("error");
        setErrorMessage("Failed to complete sign-in. Please try again.");
      }
    };

    handleCallback();
  }, [searchParams, fetchProfile, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        {status === "loading" && (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-orange-500 mx-auto" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">Signing you in...</h2>
              <p className="text-muted-foreground mt-2">Please wait while we complete your sign-in.</p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="relative mx-auto w-fit">
              <div className="absolute inset-0 animate-ping rounded-full bg-green-500 opacity-20" />
              <CheckCircle2 className="h-16 w-16 text-green-500 relative" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Welcome back!</h2>
              <p className="text-muted-foreground mt-2">Redirecting you to the app...</p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">Sign-in Failed</h2>
              <p className="text-muted-foreground mt-2">{errorMessage}</p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 rounded-full bg-foreground px-8 py-3 font-bold text-background hover:opacity-90 transition-all"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
