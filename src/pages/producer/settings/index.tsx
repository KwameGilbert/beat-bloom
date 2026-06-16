import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function ProducerSettings() {
  const [mp3Price, setMp3Price] = useState("29.99");
  const [wavPrice, setWavPrice] = useState("49.99");
  const [stemsPrice, setStemsPrice] = useState("99.99");
  const [exclusivePrice, setExclusivePrice] = useState("499.99");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Licensing templates updated successfully!");
  };

  return (
    <div className="space-y-8 p-6 md:p-8 pb-20">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          Licensing & Contract Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Define your default license pricing templates and adjust business parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid gap-6 md:grid-cols-3 max-w-5xl">
        {/* Price settings */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <h2 className="font-bold text-foreground text-lg border-b border-border pb-3">
              Default License Pricing ($)
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="MP3 Lease Price"
                type="number"
                step="0.01"
                value={mp3Price}
                onChange={(e) => setMp3Price(e.target.value)}
                helperText="MP3 file lease (non-profit)"
              />
              <Input
                label="WAV Lease Price"
                type="number"
                step="0.01"
                value={wavPrice}
                onChange={(e) => setWavPrice(e.target.value)}
                helperText="WAV + MP3 lease (commercial light)"
              />
              <Input
                label="Unlimited Stems Price"
                type="number"
                step="0.01"
                value={stemsPrice}
                onChange={(e) => setStemsPrice(e.target.value)}
                helperText="Full multi-track stems lease (unlimited)"
              />
              <Input
                label="Exclusive Buyout Price"
                type="number"
                step="0.01"
                value={exclusivePrice}
                onChange={(e) => setExclusivePrice(e.target.value)}
                helperText="Sole ownership buyout (full transfer)"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-2.5 font-bold text-white transition-colors hover:bg-orange-600"
            >
              <Save className="h-4 w-4" /> Save Pricing Templates
            </button>
          </div>
        </div>

        {/* Contract Info / Tips */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">Standard Contracts</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All pricing templates automatically generate standardized, legally-binding contract agreements for buyers.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When a buyer checkouts, they must agree to these pricing constraints which enforce royalty cuts, streaming rights, and usage boundaries.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
