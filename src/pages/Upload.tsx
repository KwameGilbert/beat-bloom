import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload as UploadIcon, 
  Music, 
  Image as ImageIcon, 
  X, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Info,
  DollarSign,
  Tag,
  Type,
  FileAudio,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Files", icon: UploadIcon },
  { id: 2, title: "Details", icon: Info },
  { id: 3, title: "Pricing", icon: DollarSign },
  { id: 4, title: "Ready", icon: Check },
];

const genres = ["Hip Hop", "Trap", "RnB", "Pop", "Lo-Fi", "Electronic", "Drill", "Afrobeats"];

const Upload = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    bpm: "",
    key: "",
    description: "",
    tags: [] as string[],
    price: "29.99",
    audioFile: null as File | null,
    coverFile: null as File | null,
    coverPreview: "",
  });

  const [tagInput, setTagInput] = useState("");

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData(prev => ({ ...prev, audioFile: file }));
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

  const handlePublish = () => {
    setIsPublishing(true);
    // Simulate upload
    setTimeout(() => {
      setIsPublishing(false);
      setCurrentStep(4);
    }, 2000);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-background pb-32 pt-6">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
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

        {/* Stepper */}
        <div className="mb-12 relative">
          <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-secondary" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-orange-500 transition-all duration-500 -translate-y-1/2" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
          <div className="relative flex justify-between">
            {steps.map((step) => {
              const Icon = step.icon;
              const active = currentStep >= step.id;
              const current = currentStep === step.id;

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                    active ? "border-orange-500 bg-orange-500 text-white" : "border-secondary bg-background text-muted-foreground",
                    current && "ring-4 ring-orange-500/20"
                  )}>
                    {active && step.id < currentStep ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span className={cn(
                    "mt-2 text-xs font-bold uppercase tracking-widest transition-colors",
                    active ? "text-orange-500" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Card */}
        <div className="relative overflow-hidden rounded-[32px] border border-border bg-card shadow-2xl">
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid gap-8 md:grid-cols-2">
                    {/* Audio Upload */}
                    <div className="space-y-4">
                      <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Audio File</label>
                      <div 
                        onClick={() => audioInputRef.current?.click()}
                        className={cn(
                          "group relative flex aspect-video cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-secondary/30 transition-all hover:border-orange-500 hover:bg-secondary/50",
                          formData.audioFile && "border-solid border-green-500 bg-green-500/5 hover:border-green-600"
                        )}
                      >
                        <input type="file" ref={audioInputRef} className="hidden" accept="audio/*" onChange={handleAudioChange} />
                        {formData.audioFile ? (
                          <div className="flex flex-col items-center gap-2 text-center px-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 text-white">
                              <FileAudio className="h-6 w-6" />
                            </div>
                            <span className="text-sm font-bold text-foreground truncate max-w-[200px]">{formData.audioFile.name}</span>
                            <span className="text-xs text-muted-foreground">Click to change file</span>
                          </div>
                        ) : (
                          <>
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 transition-transform group-hover:scale-110">
                              <Music className="h-8 w-8" />
                            </div>
                            <span className="mt-4 font-bold text-foreground">Drag & drop high-quality audio</span>
                            <span className="text-xs text-muted-foreground mt-1">WAV or MP3 (max 50MB)</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Cover Upload */}
                    <div className="space-y-4">
                      <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Cover Art</label>
                      <div 
                        onClick={() => coverInputRef.current?.click()}
                        className={cn(
                          "group relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-border bg-secondary/30 transition-all hover:border-orange-500 hover:bg-secondary/50",
                          formData.coverPreview && "border-solid border-border bg-background"
                        )}
                      >
                        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverChange} />
                        {formData.coverPreview ? (
                          <>
                            <img src={formData.coverPreview} alt="Preview" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                              <span className="font-bold text-white">Change Image</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 transition-transform group-hover:scale-110">
                              <ImageIcon className="h-8 w-8" />
                            </div>
                            <span className="mt-4 font-bold text-foreground">Upload cover art</span>
                            <span className="text-xs text-muted-foreground mt-1">PNG or JPG (1:1 aspect ratio)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Title */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <Type className="h-4 w-4 text-orange-500" />
                        Beat Title
                      </label>
                      <input 
                        type="text" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g. Midnight Melodies"
                        className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3.5 text-foreground focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                      />
                    </div>

                    {/* Genre */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <Music className="h-4 w-4 text-orange-500" />
                        Genre
                      </label>
                      <select 
                        value={formData.genre}
                        onChange={(e) => setFormData({...formData, genre: e.target.value})}
                        className="w-full appearance-none rounded-2xl border border-border bg-secondary/30 px-4 py-3.5 text-foreground focus:border-orange-500 focus:outline-none transition-all"
                      >
                        <option value="">Select Genre</option>
                        {genres.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>

                    {/* BPM */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">BPM</label>
                      <input 
                        type="number" 
                        value={formData.bpm}
                        onChange={(e) => setFormData({...formData, bpm: e.target.value})}
                        placeholder="e.g. 140"
                        className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3.5 text-foreground focus:border-orange-500 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Key */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Musical Key</label>
                      <input 
                        type="text" 
                        value={formData.key}
                        onChange={(e) => setFormData({...formData, key: e.target.value})}
                        placeholder="e.g. Am"
                        className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3.5 text-foreground focus:border-orange-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <Tag className="h-4 w-4 text-orange-500" />
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-secondary/30 p-2 min-h-[56px] focus-within:border-orange-500 transition-all">
                      {formData.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 rounded-lg bg-orange-500/20 px-3 py-1.5 text-sm font-bold text-orange-500">
                          {tag}
                          <button onClick={() => removeTag(tag)}><X className="h-3 w-3" /></button>
                        </span>
                      ))}
                      <input 
                        type="text" 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={addTag}
                        placeholder={formData.tags.length === 0 ? "Add tags (e.g. Dark, Melodic)" : ""}
                        className="flex-1 min-w-[120px] bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground px-1">Press enter to add tags.</p>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-orange-500/10 text-orange-500">
                      <DollarSign className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold">Set Your Pricing</h2>
                    <p className="text-muted-foreground max-w-sm">Determine the value of your masterpiece. Producers keep 100% of sales.</p>
                  </div>

                  <div className="mx-auto max-w-sm space-y-6">
                    <div className="space-y-2">
                      <label className="text-center block text-sm font-bold text-foreground">Standard License Price</label>
                      <div className="relative group">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground transition-colors group-focus-within:text-orange-500">GH₵</span>
                        <input 
                          type="number" 
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          className="w-full rounded-[24px] border-2 border-border bg-secondary/30 py-6 pl-20 pr-6 text-3xl font-bold text-foreground focus:border-orange-500 focus:outline-none transition-all text-center"
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4 flex gap-4">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
                        <Info className="h-3 w-3 text-orange-500" />
                      </span>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Prices are displayed in GHS for local markets. Global pricing will be automatically converted based on current exchange rates.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
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
                      onClick={() => navigate("/home")}
                      className="rounded-2xl border border-border bg-secondary px-6 py-4 font-bold text-foreground hover:bg-secondary/80 transition-all"
                    >
                      Go to Home
                    </button>
                    <button
                      onClick={() => {
                        setFormData({
                          title: "", genre: "", bpm: "", key: "", description: "",
                          tags: [], price: "29.99", audioFile: null, coverFile: null, coverPreview: ""
                        });
                        setCurrentStep(1);
                      }}
                      className="rounded-2xl bg-orange-500 px-6 py-4 font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all"
                    >
                      Upload Another
                    </button>
                  </div>
                </motion.div>
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
                    disabled={isPublishing || !formData.audioFile}
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
                    disabled={currentStep === 1 && !formData.audioFile}
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
              <h4 className="text-sm font-bold text-foreground">Upload Guidelines</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ensure your audio is high quality and you have full rights to the content. We recommend uploading WAV files for the best audio experience. Cover art should be at least 1000x1000px.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Upload;
