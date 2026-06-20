import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Upload as UploadIcon, 
  X, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Info,
  DollarSign,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadService } from "@/lib/upload";
import { marketplaceService } from "@/lib/marketplace";
import { useBeatsStore } from "@/store/beatsStore";
import { toast } from "sonner";

// Components
import { UploadStepper } from "@/components/upload/UploadStepper";
import { Step1Files } from "@/components/upload/Step1Files";
import { Step2Details } from "@/components/upload/Step2Details";
import { Step3Pricing } from "@/components/upload/Step3Pricing";
import { Step4Success } from "@/components/upload/Step4Success";
import { INITIAL_FORM_DATA, type UploadFormData } from "@/components/upload/types";

const steps = [
  { id: 1, title: "Files", icon: UploadIcon },
  { id: 2, title: "Details", icon: Info },
  { id: 3, title: "Pricing", icon: DollarSign },
  { id: 4, title: "Ready", icon: Check },
];

const Upload = () => {
  const navigate = useNavigate();
  const { genres, fetchGenres } = useBeatsStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState<UploadFormData>(INITIAL_FORM_DATA);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const handleAudioChange = (type: "preview" | "mp3" | "wav" | "stems" | "exclusive", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "preview") {
        const audio = new Audio();
        audio.src = URL.createObjectURL(file);
        audio.onloadedmetadata = () => {
          const seconds = Math.floor(audio.duration);
          const minutes = Math.floor(seconds / 60);
          const remainingSeconds = seconds % 60;
          const durationStr = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
          
          setFormData(prev => ({ 
            ...prev, 
            previewFile: file,
            durationSeconds: seconds,
            duration: durationStr
          }));
          URL.revokeObjectURL(audio.src);
        };
      } else {
        setFormData(prev => ({
          ...prev,
          licenseTiers: {
            ...prev.licenseTiers,
            [type]: { ...prev.licenseTiers[type], file: file }
          }
        }));
      }
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          coverFile: file, 
          coverPreview: reader.result as string 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      if (!formData.coverFile) throw new Error("Cover art is required");
      const coverRes = await uploadService.uploadSingle(formData.coverFile, "cover");
      
      if (!formData.previewFile) throw new Error("Preview audio is required");
      const previewRes = await uploadService.uploadSingle(formData.previewFile, "beat");

      const filePromises = [];
      const files: any[] = [
        {
          fileType: 'preview',
          fileName: previewRes.data.filename,
          filePath: previewRes.data.url,
          mimeType: previewRes.data.mimetype,
          fileSize: previewRes.data.size,
          storageProvider: previewRes.data.storage
        }
      ];

      const tiers = Object.entries(formData.licenseTiers);
      for (const [type, tier] of tiers) {
        if (tier.enabled && tier.file) {
          const category = (type === 'mp3' || type === 'wav') ? 'beat' : 'archive';
          const fileType = type === 'mp3' ? 'masterMp3' : type === 'wav' ? 'masterWav' : type === 'stems' ? 'stems' : 'projectFiles';
          
          filePromises.push(uploadService.uploadSingle(tier.file, category).then(res => {
            files.push({
              fileType,
              fileName: res.data.filename,
              filePath: res.data.url,
              mimeType: res.data.mimetype,
              fileSize: res.data.size,
              storageProvider: res.data.storage
            });
          }));
        }
      }

      await Promise.all(filePromises);

      const selectedGenre = genres.find(g => g.name === formData.genre);
      const beatData = {
        title: formData.title,
        description: formData.description,
        genreId: selectedGenre?.id,
        bpm: parseInt(formData.bpm) || 0,
        musicalKey: formData.key,
        duration: formData.duration,
        durationSeconds: formData.durationSeconds,
        tags: formData.tags,
        coverImage: coverRes.data.url,
        previewAudioUrl: previewRes.data.url,
        files: files,
        licenseTiers: Object.entries(formData.licenseTiers)
          .filter(([_, tier]) => tier.enabled)
          .map(([type, tier]) => ({
            tierType: type,
            name: type === 'mp3' ? 'MP3 Lease' : type === 'wav' ? 'WAV Lease' : type === 'stems' ? 'Trackout' : 'Exclusive Rights',
            price: parseFloat(tier.price),
            description: type === 'mp3' ? 'Basic license for non-profit use.' : type === 'wav' ? 'Standard lease with untagged WAV.' : type === 'stems' ? 'Full trackout package.' : 'Full ownership transfer.',
            isExclusive: type === 'exclusive',
            includedFiles: type === 'mp3' ? ['MP3'] : type === 'wav' ? ['MP3', 'WAV'] : type === 'stems' ? ['MP3', 'WAV', 'Stems'] : ['MP3', 'WAV', 'Stems', 'Project Files']
          }))
      };

      await marketplaceService.createBeat(beatData);
      
      setIsPublishing(false);
      setCurrentStep(4);
      toast.success("Beat published successfully!");
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast.error(error.response?.data?.message || "Failed to publish beat. Please try again.");
      setIsPublishing(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const isStep1Complete = !!(formData.previewFile && formData.coverFile);

  return (
    <div className="min-h-screen bg-background pb-32 pt-6">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Upload Your Beat</h1>
            <p className="text-muted-foreground">Share your sound with the world.</p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <UploadStepper steps={steps} currentStep={currentStep} />

        {/* Main Card */}
        <div className="relative overflow-hidden rounded-[40px] border border-border bg-card shadow-2xl">
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <Step1Files 
                  formData={formData} 
                  onAudioChange={handleAudioChange} 
                  onCoverChange={handleCoverChange} 
                />
              )}

              {currentStep === 2 && (
                <Step2Details 
                  formData={formData}
                  genres={genres}
                  tagInput={tagInput}
                  setFormData={setFormData}
                  setTagInput={setTagInput}
                  onAddTag={addTag}
                  onRemoveTag={removeTag}
                />
              )}

              {currentStep === 3 && (
                <Step3Pricing 
                  formData={formData}
                  setFormData={setFormData}
                  onAudioChange={handleAudioChange}
                />
              )}

              {currentStep === 4 && (
                <Step4Success 
                  formData={formData}
                  onNavigateHome={() => navigate("/home")}
                  onReset={() => {
                    setFormData(INITIAL_FORM_DATA);
                    setCurrentStep(1);
                  }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          {currentStep < 4 && (
            <div className="border-t border-border bg-secondary/10 p-6 md:px-12 flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1 || isPublishing}
                className={cn(
                  "flex items-center gap-2 text-sm font-bold transition-all",
                  currentStep === 1 ? "opacity-0 invisible" : "text-muted-foreground hover:text-foreground active:translate-x-[-4px]"
                )}
              >
                <ChevronLeft className="h-5 w-5" />
                Back
              </button>

              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest hidden sm:inline">
                  Step {currentStep} of 3
                </span>
                
                {currentStep === 3 ? (
                  <button
                    onClick={handlePublish}
                    disabled={
                      isPublishing || 
                      !formData.previewFile || 
                      !formData.coverFile || 
                      !Object.values(formData.licenseTiers).some(t => t.enabled) ||
                      Object.values(formData.licenseTiers).some(t => t.enabled && !t.file)
                    }
                    className="flex items-center gap-2 rounded-2xl bg-orange-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-50"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        Publish Beat
                        <Check className="h-4 w-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    disabled={currentStep === 1 && !isStep1Complete}
                    className="flex items-center gap-2 rounded-2xl bg-zinc-950 px-8 py-3 dark:bg-zinc-100 dark:text-zinc-950 text-sm font-bold text-white transition-all hover:bg-zinc-900 dark:hover:bg-white active:scale-95 disabled:opacity-50"
                  >
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Requirements Note */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 flex gap-4 rounded-3xl border border-border bg-card/50 p-6"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
              <Info className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground">Upload Requirements</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You must provide a <span className="text-blue-500 font-bold">Preview</span> (publicly streamable) and at least one <span className="text-orange-500 font-bold">License</span> with its corresponding file. 
                We recommend tagged MP3s for previews.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Upload;
