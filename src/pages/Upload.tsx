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
  Loader2,
  Lock,
  Eye,
  Crown,
  Sparkles,
  ToggleLeft,
  ToggleRight
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
  const previewInputRef = useRef<HTMLInputElement>(null);
  const masterInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    bpm: "",
    key: "",
    description: "",
    tags: [] as string[],
    price: "29.99",
    previewFile: null as File | null,
    masterFile: null as File | null,
    coverFile: null as File | null,
    coverPreview: "",
    // License tier pricing
    licenseTiers: {
      mp3: { enabled: true, price: "29.99" },
      wav: { enabled: true, price: "49.99" },
      stems: { enabled: false, price: "99.99" },
      exclusive: { enabled: false, price: "499.99" }
    }
  });

  const [tagInput, setTagInput] = useState("");

  const handleAudioChange = (type: "preview" | "master", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ 
        ...prev, 
        [type === "preview" ? "previewFile" : "masterFile"]: file 
      }));
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

  const isStep1Complete = formData.previewFile && formData.masterFile && formData.coverFile;

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
        <div className="relative overflow-hidden rounded-[40px] border border-border bg-card shadow-2xl">
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <div className="grid gap-10 lg:grid-cols-3">
                    {/* Preview Audio Upload */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Public Preview</label>
                        <span className="flex items-center gap-1 rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-500">
                          <Eye className="h-3 w-3" /> Public
                        </span>
                      </div>
                      <div 
                        onClick={() => previewInputRef.current?.click()}
                        className={cn(
                          "group relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-border bg-secondary/30 transition-all hover:border-orange-500 hover:bg-secondary/50",
                          formData.previewFile && "border-solid border-green-500 bg-green-500/5 hover:border-green-600"
                        )}
                      >
                        <input type="file" ref={previewInputRef} className="hidden" accept="audio/*" onChange={(e) => handleAudioChange("preview", e)} />
                        {formData.previewFile ? (
                          <div className="flex flex-col items-center gap-3 text-center px-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-green-500 text-white shadow-lg shadow-green-500/20">
                              <FileAudio className="h-8 w-8" />
                            </div>
                            <div className="space-y-1">
                              <span className="block text-sm font-black text-foreground truncate max-w-[140px]">{formData.previewFile.name}</span>
                              <span className="text-[10px] font-bold text-muted-foreground uppercase">Click to change</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-orange-500/10 text-orange-500 transition-transform group-hover:scale-110">
                              <Music className="h-8 w-8" />
                            </div>
                            <div className="mt-6 text-center">
                              <span className="block font-bold text-foreground">Preview Audio</span>
                              <span className="text-[10px] text-muted-foreground mt-1 uppercase font-bold">MP3 tagged recommended</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Master Audio Upload */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Unlockable Master</label>
                        <span className="flex items-center gap-1 rounded bg-orange-500/10 px-1.5 py-0.5 text-[10px] font-bold text-orange-500">
                          <Lock className="h-3 w-3" /> Private
                        </span>
                      </div>
                      <div 
                        onClick={() => masterInputRef.current?.click()}
                        className={cn(
                          "group relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-border bg-secondary/30 transition-all hover:border-orange-500 hover:bg-secondary/50",
                          formData.masterFile && "border-solid border-green-500 bg-green-500/5 hover:border-green-600"
                        )}
                      >
                        <input type="file" ref={masterInputRef} className="hidden" accept="audio/*" onChange={(e) => handleAudioChange("master", e)} />
                        {formData.masterFile ? (
                          <div className="flex flex-col items-center gap-3 text-center px-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-green-500 text-white shadow-lg shadow-green-500/20">
                              <FileAudio className="h-8 w-8" />
                            </div>
                            <div className="space-y-1">
                              <span className="block text-sm font-black text-foreground truncate max-w-[140px]">{formData.masterFile.name}</span>
                              <span className="text-[10px] font-bold text-muted-foreground uppercase">Click to change</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-zinc-950/10 dark:bg-zinc-100/10 text-foreground transition-transform group-hover:scale-110">
                              <Lock className="h-8 w-8" />
                            </div>
                            <div className="mt-6 text-center">
                              <span className="block font-bold text-foreground">High-Quality Master</span>
                              <span className="text-[10px] text-muted-foreground mt-1 uppercase font-bold">WAV / ZIP for buyer only</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Cover Upload */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Artwork</label>
                      <div 
                        onClick={() => coverInputRef.current?.click()}
                        className={cn(
                          "group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-[32px] border-2 border-dashed border-border bg-secondary/30 transition-all hover:border-orange-500 hover:bg-secondary/50",
                          formData.coverPreview && "border-solid border-border bg-background"
                        )}
                      >
                        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverChange} />
                        {formData.coverPreview ? (
                          <>
                            <img src={formData.coverPreview} alt="Preview" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                              <span className="font-bold text-white uppercase text-xs">Change Art</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-orange-500/10 text-orange-500 transition-transform group-hover:scale-110">
                              <ImageIcon className="h-8 w-8" />
                            </div>
                            <div className="mt-6 text-center">
                              <span className="block font-bold text-foreground">Cover Art</span>
                              <span className="text-[10px] text-muted-foreground mt-1 uppercase font-bold">1:1 Ratio (Min 1000px)</span>
                            </div>
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
                  className="space-y-6"
                >
                  <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-orange-500/10 text-orange-500">
                      <DollarSign className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold">Set Your Pricing</h2>
                    <p className="text-muted-foreground max-w-md">Configure license tiers for your beat. Enable the ones you want to offer and set your prices.</p>
                  </div>

                  <div className="mx-auto max-w-2xl space-y-4">
                    {/* MP3 Lease */}
                    <div className={cn(
                      "rounded-2xl border-2 p-4 transition-all",
                      formData.licenseTiers.mp3.enabled ? "border-orange-500/50 bg-orange-500/5" : "border-border bg-secondary/20"
                    )}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20 text-orange-500">
                            <FileAudio className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">MP3 Lease</h3>
                            <p className="text-xs text-muted-foreground">Tagged MP3 file • Non-profit use</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="relative flex items-center gap-2">
                            <span className="text-lg font-bold text-muted-foreground">$</span>
                            <input
                              type="number"
                              value={formData.licenseTiers.mp3.price}
                              onChange={(e) => setFormData({
                                ...formData,
                                licenseTiers: { ...formData.licenseTiers, mp3: { ...formData.licenseTiers.mp3, price: e.target.value } }
                              })}
                              disabled={!formData.licenseTiers.mp3.enabled}
                              className="w-24 rounded-xl border border-border bg-secondary/50 px-3 py-2 text-lg font-bold text-center disabled:opacity-50"
                            />
                          </div>
                          <button
                            onClick={() => setFormData({
                              ...formData,
                              licenseTiers: { ...formData.licenseTiers, mp3: { ...formData.licenseTiers.mp3, enabled: !formData.licenseTiers.mp3.enabled } }
                            })}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {formData.licenseTiers.mp3.enabled ? <ToggleRight className="h-8 w-8 text-orange-500" /> : <ToggleLeft className="h-8 w-8" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* WAV Lease */}
                    <div className={cn(
                      "rounded-2xl border-2 p-4 transition-all",
                      formData.licenseTiers.wav.enabled ? "border-orange-500/50 bg-orange-500/5" : "border-border bg-secondary/20"
                    )}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20 text-orange-500">
                            <FileAudio className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">WAV Lease</h3>
                            <p className="text-xs text-muted-foreground">Untagged MP3 + High-quality WAV</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="relative flex items-center gap-2">
                            <span className="text-lg font-bold text-muted-foreground">$</span>
                            <input
                              type="number"
                              value={formData.licenseTiers.wav.price}
                              onChange={(e) => setFormData({
                                ...formData,
                                licenseTiers: { ...formData.licenseTiers, wav: { ...formData.licenseTiers.wav, price: e.target.value } }
                              })}
                              disabled={!formData.licenseTiers.wav.enabled}
                              className="w-24 rounded-xl border border-border bg-secondary/50 px-3 py-2 text-lg font-bold text-center disabled:opacity-50"
                            />
                          </div>
                          <button
                            onClick={() => setFormData({
                              ...formData,
                              licenseTiers: { ...formData.licenseTiers, wav: { ...formData.licenseTiers.wav, enabled: !formData.licenseTiers.wav.enabled } }
                            })}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {formData.licenseTiers.wav.enabled ? <ToggleRight className="h-8 w-8 text-orange-500" /> : <ToggleLeft className="h-8 w-8" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Stems/Trackout */}
                    <div className={cn(
                      "rounded-2xl border-2 p-4 transition-all",
                      formData.licenseTiers.stems.enabled ? "border-orange-500/50 bg-orange-500/5" : "border-border bg-secondary/20"
                    )}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-lg",
                            formData.licenseTiers.stems.enabled ? "bg-orange-500/20 text-orange-500" : "bg-muted text-muted-foreground"
                          )}>
                            <Sparkles className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">Trackout (Stems)</h3>
                            <p className="text-xs text-muted-foreground">MP3 + WAV + Individual stem files</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="relative flex items-center gap-2">
                            <span className="text-lg font-bold text-muted-foreground">$</span>
                            <input
                              type="number"
                              value={formData.licenseTiers.stems.price}
                              onChange={(e) => setFormData({
                                ...formData,
                                licenseTiers: { ...formData.licenseTiers, stems: { ...formData.licenseTiers.stems, price: e.target.value } }
                              })}
                              disabled={!formData.licenseTiers.stems.enabled}
                              className="w-24 rounded-xl border border-border bg-secondary/50 px-3 py-2 text-lg font-bold text-center disabled:opacity-50"
                            />
                          </div>
                          <button
                            onClick={() => setFormData({
                              ...formData,
                              licenseTiers: { ...formData.licenseTiers, stems: { ...formData.licenseTiers.stems, enabled: !formData.licenseTiers.stems.enabled } }
                            })}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {formData.licenseTiers.stems.enabled ? <ToggleRight className="h-8 w-8 text-orange-500" /> : <ToggleLeft className="h-8 w-8" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Exclusive Rights */}
                    <div className={cn(
                      "rounded-2xl border-2 p-4 transition-all",
                      formData.licenseTiers.exclusive.enabled ? "border-purple-500/50 bg-purple-500/5" : "border-border bg-secondary/20"
                    )}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-lg",
                            formData.licenseTiers.exclusive.enabled ? "bg-purple-500/20 text-purple-500" : "bg-muted text-muted-foreground"
                          )}>
                            <Crown className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-foreground">Exclusive Rights</h3>
                              <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-500">Premium</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Full ownership • Beat removed after sale</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="relative flex items-center gap-2">
                            <span className="text-lg font-bold text-muted-foreground">$</span>
                            <input
                              type="number"
                              value={formData.licenseTiers.exclusive.price}
                              onChange={(e) => setFormData({
                                ...formData,
                                licenseTiers: { ...formData.licenseTiers, exclusive: { ...formData.licenseTiers.exclusive, price: e.target.value } }
                              })}
                              disabled={!formData.licenseTiers.exclusive.enabled}
                              className="w-24 rounded-xl border border-border bg-secondary/50 px-3 py-2 text-lg font-bold text-center disabled:opacity-50"
                            />
                          </div>
                          <button
                            onClick={() => setFormData({
                              ...formData,
                              licenseTiers: { ...formData.licenseTiers, exclusive: { ...formData.licenseTiers.exclusive, enabled: !formData.licenseTiers.exclusive.enabled } }
                            })}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {formData.licenseTiers.exclusive.enabled ? <ToggleRight className="h-8 w-8 text-purple-500" /> : <ToggleLeft className="h-8 w-8" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4 flex gap-4">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
                        <Info className="h-3 w-3 text-orange-500" />
                      </span>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Enable at least one license tier. Prices are in USD. You keep 100% of all sales. Toggle tiers on/off based on the files you want to offer.
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
                          tags: [], price: "29.99", previewFile: null, masterFile: null, coverFile: null, coverPreview: "",
                          licenseTiers: {
                            mp3: { enabled: true, price: "29.99" },
                            wav: { enabled: true, price: "49.99" },
                            stems: { enabled: false, price: "99.99" },
                            exclusive: { enabled: false, price: "499.99" }
                          }
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
                    disabled={isPublishing || !formData.previewFile || !formData.masterFile || !formData.coverFile}
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
                You must provide both a <span className="text-blue-500 font-bold">Preview</span> (publicly streamable) and a <span className="text-orange-500 font-bold">Master</span> (delivered to buyer upon payment). 
                We recommend tagged MP3s for previews and high-quality WAVs or ZIP stems for masters.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Upload;
