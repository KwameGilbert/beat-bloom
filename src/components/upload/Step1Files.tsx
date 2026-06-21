import { useRef } from "react";
import { motion } from "framer-motion";
import { Music, Image as ImageIcon, FileAudio, Eye, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UploadFormData } from "./types";

interface Step1FilesProps {
  formData: UploadFormData;
  onAudioChange: (type: "preview" | "mp3" | "wav" | "stems" | "exclusive", e: React.ChangeEvent<HTMLInputElement>) => void;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Step1Files = ({ formData, onAudioChange, onCoverChange }: Step1FilesProps) => {
  const previewInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8 text-left"
    >
      {/* 1. Public Preview Audio Dropzone (Full Width, Compact Horizontal) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Public Preview Audio</label>
          <span className="flex items-center gap-1 rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-500">
            <Eye className="h-3 w-3" /> Public
          </span>
        </div>
        <div 
          onClick={() => previewInputRef.current?.click()}
          className={cn(
            "group relative flex h-24 cursor-pointer items-center justify-between rounded-2xl border-2 border-dashed border-border bg-secondary/30 p-6 transition-all hover:border-orange-500 hover:bg-secondary/50",
            formData.previewFile && "border-solid border-green-500 bg-green-500/5 hover:border-green-600"
          )}
        >
          <input type="file" ref={previewInputRef} className="hidden" accept="audio/*" onChange={(e) => onAudioChange("preview", e)} />
          {formData.previewFile ? (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white shadow-lg shadow-green-500/20">
                  <FileAudio className="h-6 w-6" />
                </div>
                <div className="text-left min-w-0">
                  <span className="block text-sm font-black text-foreground truncate max-w-[200px] sm:max-w-md">
                    {formData.previewFile.name}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5 block group-hover:text-foreground transition-colors">
                    Click to change file
                  </span>
                </div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                <Check className="h-4 w-4" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 transition-transform group-hover:scale-110">
                  <Music className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-foreground text-sm">Upload Public Preview Audio</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5 uppercase font-semibold">Tagged MP3 recommended</span>
                </div>
              </div>
              <div className="hidden sm:block rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                Choose File
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. Cover Art Upload (Centered or aligned below, compact size) */}
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 block text-left">Artwork</label>
        <div 
          onClick={() => coverInputRef.current?.click()}
          className={cn(
            "group relative flex aspect-square w-full cursor-pointer items-center justify-center overflow-hidden rounded-[24px] border-2 border-dashed border-border bg-secondary/30 transition-all hover:border-orange-500 hover:bg-secondary/50",
            formData.coverPreview && "border-solid border-border bg-background"
          )}
        >
          <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={onCoverChange} />
          {formData.coverPreview ? (
            <>
              <img src={formData.coverPreview} alt="Preview" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="font-bold text-white uppercase text-xs">Change Art</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-[20px] bg-orange-500/10 text-orange-500 transition-transform group-hover:scale-110">
                <ImageIcon className="h-7 w-7" />
              </div>
              <div className="mt-4 text-center">
                <span className="block font-bold text-foreground text-sm">Cover Art</span>
                <span className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold">1:1 Ratio (Min 1000px)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
