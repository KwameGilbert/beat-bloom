import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { UploadFormData } from "./types";

interface Step4SuccessProps {
  formData: UploadFormData;
  onNavigateHome: () => void;
  onReset: () => void;
}

export const Step4Success = ({ formData, onNavigateHome, onReset }: Step4SuccessProps) => {
  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center text-center space-y-8 py-12"
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200 }}
          className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-green-500 text-white shadow-xl shadow-green-500/40"
        >
          <Check className="h-12 w-12" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-green-500"
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Beat Uploaded!</h2>
        <p className="text-muted-foreground text-balance px-6">
          Your beat <span className="text-foreground font-bold">"{formData.title || "Untitled"}"</span> is now live and ready for discovery.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md pt-4">
        <button
          onClick={onNavigateHome}
          className="rounded-2xl border border-border bg-secondary px-6 py-4 font-bold text-foreground hover:bg-secondary/80 transition-all"
        >
          Go to Home
        </button>
        <button
          onClick={onReset}
          className="rounded-2xl bg-orange-500 px-6 py-4 font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all"
        >
          Upload Another
        </button>
      </div>
    </motion.div>
  );
};
