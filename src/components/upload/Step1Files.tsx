import { useRef } from "react";
import { motion } from "framer-motion";
import { Music, Image as ImageIcon, FileAudio, Eye } from "lucide-react";
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
      className="space-y-10"
    >
      <div className="grid gap-10 lg:grid-cols-2">
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
            <input type="file" ref={previewInputRef} className="hidden" accept="audio/*" onChange={(e) => onAudioChange("preview", e)} />
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
  );
};
