import { Link, useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  Trash2, 
  ArrowLeft, 
  Music2, 
  Clock, 
  CreditCard,
  ShoppingBag,
  Play,
  Pause,
  Loader2
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { usePlayerStore } from "@/store/playerStore";
import { cn } from "@/lib/utils";
import type { Beat } from "@/data/beats";

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, clearCart } = useCartStore();
  const { playBeat, currentBeat, isPlaying, togglePlay, isLoading } = usePlayerStore();

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handlePlayClick = (beat: Beat) => {
    if (currentBeat?.id === beat.id) {
      togglePlay();
    } else {
      playBeat(beat);
    }
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-4 pb-32">
        <div className="mx-auto max-w-6xl px-4 py-4 md:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <div className="flex flex-col items-center justify-center px-4 py-20">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="mb-2 font-display text-2xl font-bold text-foreground">Your cart is empty</h1>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Discover amazing beats and add them to your cart
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-600"
          >
            <ShoppingBag className="h-5 w-5" />
            Browse Beats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-4 pb-32">
      {/* Header */}
      <div className="border-b border-border px-4 py-4 md:px-8">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Shopping Cart
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-2 text-sm text-red-500 transition-colors hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
            Clear Cart
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((beat) => {
                const isCurrentBeat = currentBeat?.id === beat.id;
                const isPlayingCurrent = isCurrentBeat && isPlaying;
                const isLoadingCurrent = isCurrentBeat && isLoading;

                return (
                  <div
                    key={beat.id}
                    className="group rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex gap-4">
                      {/* Cover Image with Play Button */}
                      <div 
                        className="relative h-24 w-24 shrink-0 cursor-pointer overflow-hidden rounded-lg bg-secondary"
                        onClick={() => handlePlayClick(beat)}
                      >
                        <img
                          src={beat.cover}
                          alt={beat.title}
                          className="h-full w-full object-cover"
                        />
                        <div className={cn(
                          "absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity",
                          isPlayingCurrent || isLoadingCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        )}>
                          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
                            {isLoadingCurrent ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : isPlayingCurrent ? (
                              <Pause className="h-5 w-5 fill-current" />
                            ) : (
                              <Play className="ml-0.5 h-5 w-5 fill-current" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Beat Info */}
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div>
                          <Link 
                            to={`/beat/${beat.id}`}
                            className="block truncate font-bold text-foreground hover:text-orange-500"
                          >
                            {beat.title}
                          </Link>
                          <p className="text-sm text-muted-foreground">by {beat.producer}</p>
                          
                          {/* Tags & Specs */}
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="inline-block rounded bg-orange-500/20 px-2 py-0.5 text-xs font-medium text-orange-500">
                              {beat.tags[0]}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Music2 className="h-3 w-3" />
                              {beat.bpm} BPM
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {beat.duration}
                            </span>
                          </div>
                        </div>

                        {/* Included Files */}
                        <div className="mt-2 text-xs text-muted-foreground">
                          Includes: {beat.includedFiles.join(", ")}
                        </div>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex flex-col items-end justify-between">
                        <p className="text-xl font-bold text-orange-500">
                          GH₵{beat.price.toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(beat.id)}
                          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-display text-lg font-bold text-foreground">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                  <span className="text-foreground">GH₵{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sales Tax</span>
                  <span className="text-foreground">$0.00</span>
                </div>
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-orange-500">GH₵{total.toFixed(2)}</span>
                </div>
              </div>

              <Link 
                to="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 py-4 font-bold text-white transition-all hover:bg-orange-600 active:scale-95"
              >
                <CreditCard className="h-5 w-5" />
                Proceed to Checkout
              </Link>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                By completing your purchase you agree to our Terms of Service
              </p>

              {/* Trust Badges */}
              <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span>🔒 Secure Checkout</span>
                <span>💳 All Cards Accepted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
