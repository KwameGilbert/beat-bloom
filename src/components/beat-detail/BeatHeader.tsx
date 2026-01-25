import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BeatHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="relative z-10 border-b border-border px-3 sm:px-4 py-3 sm:py-4 md:px-8">
      <button
        onClick={() => navigate("/browse")}
        className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Browse
      </button>
    </div>
  );
};
