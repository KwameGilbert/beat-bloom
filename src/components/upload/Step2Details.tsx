import { motion } from "framer-motion";
import { Type, Music, Tag, X } from "lucide-react";
import type { UploadFormData } from "./types";

interface Step2DetailsProps {
  formData: UploadFormData;
  genres: any[];
  tagInput: string;
  setFormData: (data: any) => void;
  setTagInput: (val: string) => void;
  onAddTag: (e: React.KeyboardEvent) => void;
  onRemoveTag: (tag: string) => void;
}

export const Step2Details = ({ 
  formData, 
  genres, 
  tagInput, 
  setFormData, 
  setTagInput, 
  onAddTag, 
  onRemoveTag 
}: Step2DetailsProps) => {
  return (
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
            {genres.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
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
              <button onClick={() => onRemoveTag(tag)}><X className="h-3 w-3" /></button>
            </span>
          ))}
          <input 
            type="text" 
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={onAddTag}
            placeholder={formData.tags.length === 0 ? "Add tags (e.g. Dark, Melodic)" : ""}
            className="flex-1 min-w-[120px] bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <p className="text-[10px] text-muted-foreground px-1">Press enter to add tags.</p>
      </div>
    </motion.div>
  );
};
