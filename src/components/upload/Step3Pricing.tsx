import { motion } from "framer-motion";
import { DollarSign, FileAudio, Sparkles, Crown, Info } from "lucide-react";
import type { UploadFormData } from "./types";
import { LicenseTierCard } from "./LicenseTierCard";

interface Step3PricingProps {
  formData: UploadFormData;
  setFormData: (data: any) => void;
  onAudioChange: (type: "preview" | "mp3" | "wav" | "stems" | "exclusive", e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Step3Pricing = ({ formData, setFormData, onAudioChange }: Step3PricingProps) => {
  const updateTier = (type: keyof typeof formData.licenseTiers, updates: any) => {
    setFormData({
      ...formData,
      licenseTiers: {
        ...formData.licenseTiers,
        [type]: { ...formData.licenseTiers[type], ...updates }
      }
    });
  };

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-orange-500/10 text-orange-500">
          <DollarSign className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold">Set Your Pricing</h2>
        <p className="text-muted-foreground max-w-md">Configure license tiers and upload corresponding files. Enable the ones you want to offer.</p>
      </div>

      <div className="mx-auto max-w-2xl space-y-4">
        <LicenseTierCard
          type="mp3"
          title="MP3 Lease"
          subtitle="Tagged MP3 file • Non-profit use"
          icon={FileAudio}
          tier={formData.licenseTiers.mp3}
          onToggle={() => updateTier("mp3", { enabled: !formData.licenseTiers.mp3.enabled })}
          onPriceChange={(price) => updateTier("mp3", { price })}
          onFileChange={(e) => onAudioChange("mp3", e)}
          accept="audio/mpeg"
          uploadPlaceholder="Upload Tagged MP3"
        />

        <LicenseTierCard
          type="wav"
          title="WAV Lease"
          subtitle="Untagged MP3 + High-quality WAV"
          icon={FileAudio}
          tier={formData.licenseTiers.wav}
          onToggle={() => updateTier("wav", { enabled: !formData.licenseTiers.wav.enabled })}
          onPriceChange={(price) => updateTier("wav", { price })}
          onFileChange={(e) => onAudioChange("wav", e)}
          accept="audio/wav,audio/x-wav"
          uploadPlaceholder="Upload Untagged WAV"
        />

        <LicenseTierCard
          type="stems"
          title="Trackout (Stems)"
          subtitle="MP3 + WAV + Individual stem files"
          icon={Sparkles}
          tier={formData.licenseTiers.stems}
          onToggle={() => updateTier("stems", { enabled: !formData.licenseTiers.stems.enabled })}
          onPriceChange={(price) => updateTier("stems", { price })}
          onFileChange={(e) => onAudioChange("stems", e)}
          accept=".zip,.rar"
          uploadPlaceholder="Upload Stems (ZIP/RAR)"
        />

        <LicenseTierCard
          type="exclusive"
          title="Exclusive Rights"
          subtitle="Full ownership • Beat removed after sale"
          icon={Crown}
          tier={formData.licenseTiers.exclusive}
          onToggle={() => updateTier("exclusive", { enabled: !formData.licenseTiers.exclusive.enabled })}
          onPriceChange={(price) => updateTier("exclusive", { price })}
          onFileChange={(e) => onAudioChange("exclusive", e)}
          accept=".zip,.rar"
          colorScheme="purple"
          uploadPlaceholder="Upload Exclusive Package (ZIP/RAR)"
        />

        <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4 flex gap-4">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
            <Info className="h-3 w-3 text-orange-500" />
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Enable at least one license tier and upload the corresponding file. Prices are in USD.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
