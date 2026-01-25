import { Link } from "react-router-dom";
import { Check, Crown, FileAudio, ShoppingCart, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Beat, LicenseTier } from "./types";

interface LicenseTiersProps {
  beat: Beat;
  selectedTierIndex: number;
  setSelectedTierIndex: (index: number) => void;
  isPurchased: (tierId: string | number) => boolean;
  isInCart: (id: string) => boolean;
  onAddToCart: (beat: Beat, tierId?: string) => void;
  onRemoveFromCart: (id: string) => void;
  onCheckout: () => void;
}

export const LicenseTiers = ({
  beat,
  selectedTierIndex,
  setSelectedTierIndex,
  isPurchased,
  isInCart,
  onAddToCart,
  onRemoveFromCart,
  onCheckout
}: LicenseTiersProps) => {
  const normalizedId = beat.id.toString();

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Choose Your License
      </h3>
      
      {beat.licenseTiers && beat.licenseTiers.length > 0 ? (
        <>
          <div className="grid gap-3 mb-4">
            {beat.licenseTiers.map((tier: LicenseTier, index: number) => {
              const isSelected = selectedTierIndex === index;
              const isExclusive = tier.tierType === 'exclusive';
              const owned = isPurchased(tier.id);
              
              const includedFiles = Array.isArray(tier.includedFiles) 
                ? tier.includedFiles 
                : (typeof tier.includedFiles === 'string' ? JSON.parse(tier.includedFiles) : []);

              return (
                <button
                  key={tier.id}
                  onClick={() => !owned && setSelectedTierIndex(index)}
                  disabled={owned}
                  className={cn(
                    "relative w-full rounded-xl border-2 p-4 text-left transition-all",
                    owned
                      ? "border-green-500/50 bg-green-500/10 cursor-default"
                      : isSelected
                        ? isExclusive
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-orange-500 bg-orange-500/10"
                        : "border-border bg-secondary/30 hover:border-muted-foreground/50"
                  )}
                >
                  <div className={cn(
                    "absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                    owned
                      ? "border-green-500 bg-green-500 text-white"
                      : isSelected
                        ? isExclusive
                          ? "border-purple-500 bg-purple-500 text-white"
                          : "border-orange-500 bg-orange-500 text-white"
                        : "border-muted-foreground/30"
                  )}>
                    {(isSelected || owned) && <Check className="h-4 w-4" />}
                  </div>
                  
                  <div className="flex items-start gap-3 pr-10">
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      owned 
                        ? "bg-green-500/20 text-green-500"
                        : isExclusive ? "bg-purple-500/20 text-purple-500" : "bg-orange-500/20 text-orange-500"
                    )}>
                      {tier.tierType === 'exclusive' ? <Crown className="h-5 w-5" /> : <FileAudio className="h-5 w-5" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-foreground">{tier.name}</span>
                        {owned && (
                          <span className="rounded bg-green-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-green-500">
                            Owned
                          </span>
                        )}
                        {isExclusive && !owned && (
                          <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-500">
                            Exclusive
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{tier.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {includedFiles.map((file: string, idx: number) => (
                          <span 
                            key={idx} 
                            className="rounded bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                          >
                            {file}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0">
                      {owned ? (
                        <span className="text-sm font-medium text-green-500">Purchased</span>
                      ) : (
                        <span className={cn(
                          "text-xl font-bold",
                          isExclusive ? "text-purple-500" : "text-orange-500"
                        )}>
                          ${Number(tier.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          {(() => {
            const selectedTier = beat.licenseTiers[selectedTierIndex];
            const isSelectedPurchased = isPurchased(selectedTier.id);
            
            if (isSelectedPurchased) {
              return (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link
                    to="/purchases"
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-bold text-white shadow-lg"
                  >
                    <Download className="h-4 w-4" />
                    Download from Purchases
                  </Link>
                </div>
              );
            }
            
            return (
              <div className="flex flex-col gap-2 sm:flex-row">
                <AddToCartButton
                  beat={beat}
                  selectedTier={selectedTier}
                  isInCart={isInCart(normalizedId)}
                  onAddToCart={onAddToCart}
                  onRemoveFromCart={onRemoveFromCart}
                />
                <button 
                  onClick={() => {
                    if (!isInCart(normalizedId)) {
                      onAddToCart(beat, selectedTier.id.toString());
                    }
                    onCheckout();
                  }}
                  className={cn(
                    "flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-bold transition-all",
                    selectedTier.tierType === 'exclusive'
                      ? "border-purple-500 bg-purple-500 text-white hover:bg-purple-600"
                      : "border-border bg-secondary text-foreground hover:bg-secondary/80"
                  )}
                >
                  <Download className="h-4 w-4" />
                  Buy Now - ${Number(selectedTier.price).toFixed(2)}
                </button>
              </div>
            );
          })()}
        </>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <AddToCartButton
            beat={beat}
            isInCart={isInCart(normalizedId)}
            onAddToCart={onAddToCart}
            onRemoveFromCart={onRemoveFromCart}
          />
          <button 
            onClick={() => {
              if (!isInCart(normalizedId)) {
              onAddToCart(beat);
              }
              onCheckout();
            }}
            className="flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-full border border-border bg-secondary px-4 py-3 text-sm font-bold text-foreground transition-all hover:bg-secondary/80"
          >
            <Download className="h-4 w-4" />
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
};

const AddToCartButton = ({ 
  beat, 
  selectedTier, 
  isInCart, 
  onAddToCart, 
  onRemoveFromCart 
}: { 
  beat: Beat; 
  selectedTier?: LicenseTier; 
  isInCart: boolean;
  onAddToCart: (beat: Beat, tierId?: string) => void;
  onRemoveFromCart: (id: string) => void;
}) => {
  const handleClick = () => {
    if (isInCart) {
      onRemoveFromCart(beat.id.toString());
    } else {
      onAddToCart(beat, selectedTier?.id?.toString());
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold shadow-lg transition-all active:scale-95",
        isInCart
          ? "bg-green-600 text-white hover:bg-red-500"
          : selectedTier?.tierType === 'exclusive'
            ? "bg-purple-500 text-white hover:bg-purple-600"
            : "bg-orange-500 text-white hover:bg-orange-600"
      )}
    >
      <ShoppingCart className="h-4 w-4" />
      {isInCart ? "Remove from Cart" : selectedTier ? `Add to Cart - $${Number(selectedTier.price).toFixed(2)}` : "Add to Cart"}
    </button>
  );
};
