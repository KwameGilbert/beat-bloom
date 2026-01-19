import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft,
  Lock, 
  CheckCircle,
  ShoppingBag,
  Trash2,
  Music,
  CreditCard,
  Loader2
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { usePurchasesStore } from "@/store/purchasesStore";
import { cn } from "@/lib/utils";
import marketplaceService from "@/lib/marketplace";

// Paystack public key - Replace with your actual key
const PAYSTACK_PUBLIC_KEY = "pk_test_ec6249c3ede8ab8493f94674dc2308bf6cc4fb49";

// Currency conversion rate (1 USD to GHS)
const USD_TO_GHS_RATE = 15.5; 

// Declare Paystack inline handler type
declare global {
  interface Window {
    PaystackPop: {
      setup: (options: PaystackOptions) => { openIframe: () => void };
    };
  }
}

interface PaystackOptions {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  ref?: string;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
  metadata?: Record<string, unknown>;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, processingFee, total, removeFromCart, clearCart, fetchCart, isLoading: isLoadingCart } = useCartStore();
  
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Fetch cart on mount to ensure fresh totals
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setPaystackLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const generateReference = () => {
    return `BEATBLOOM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handlePaystackPayment = async () => {
    if (!email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    if (!paystackLoaded || !window.PaystackPop) {
      alert("Payment system is loading, please try again");
      return;
    }

    setIsProcessing(true);
    setOrderError(null);

    try {
      // 1. Generate unique reference for this transaction
      const reference = generateReference();
      
      // 2. Create the pending order on our backend FIRST
      const orderResponse = await marketplaceService.createOrder({
        items: items.map(item => ({
          beatId: item.id,
          licenseTierId: item.licenseTierId
        })),
        paymentMethod: "paystack",
        paymentReference: reference,
        email: email
      });

      if (!orderResponse.success) {
        throw new Error("Failed to initialize order on server");
      }

      const amountInGHS = total * USD_TO_GHS_RATE;

      // 3. Open Paystack popup using the same reference
      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: email,
        amount: Math.round(amountInGHS * 100),
        currency: "GHS",
        ref: reference,
        metadata: {
          items: items.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price || 0,
          })),
        },
        callback: (response: { reference: string }) => {
          // Payment successful on Paystack side
          console.log("Payment successful on Paystack!", response.reference);
          
          // Handle async verification inside a regular function
          (async () => {
            try {
              // 4. Verify the payment on the backend (Server-to-Server check)
              // This will mark the order as 'completed' and trigger fulfillment
              await marketplaceService.verifyPayment(response.reference);

              // 5. Success UI update
              setIsComplete(true);
              clearCart();
            } catch (error) {
              console.error("Payment verification failed:", error);
              setOrderError("Payment was successful but verification failed. Please contact support with reference: " + response.reference);
            } finally {
              setIsProcessing(false);
            }
          })();
        },
        onClose: () => {
          setIsProcessing(false);
        },
      });

      handler.openIframe();
    } catch (error: any) {
      console.error("Order initialization failed:", error);
      setOrderError(error.message || "Could not initialize order. Please try again.");
      setIsProcessing(false);
    }
  };

  const isEmailValid = email.includes("@") && email.includes(".");

  // Loading state
  if (isLoadingCart && items.length === 0) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0 && !isComplete) {
    return (
      <div className="min-h-screen bg-background pt-4 pb-32">
        <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-foreground">Your cart is empty</h2>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              Add some beats to your cart to checkout
            </p>
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-600"
            >
              <Music className="h-5 w-5" />
              Browse Beats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isComplete) {
    return (
      <div className="min-h-screen bg-background pt-4 pb-32">
        <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 px-6">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">Payment Successful!</h2>
            <p className="mb-6 text-center text-muted-foreground">
              Thank you for your purchase. Your beats have been added to your library.
              A receipt has been sent to {email}.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/purchases"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-600"
              >
                View My Purchases
              </Link>
              <Link
                to="/browse"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-bold text-foreground transition-colors hover:bg-secondary"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-4 pb-32">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/cart")}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Checkout
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete your purchase securely with Paystack
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Payment Form */}
          <div className="lg:col-span-3">
            {orderError && (
              <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-500 text-sm">
                {orderError}
              </div>
            )}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 font-bold text-foreground">Contact Information</h2>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    required
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    We'll send your receipt and download links to this email
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-foreground">Payment</h2>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">Secured by Paystack</span>
                  </div>
                </div>

                <div className="rounded-lg bg-secondary/50 p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00C3F7]">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Pay with Paystack</p>
                      <p className="text-xs text-muted-foreground">
                        Card, Bank Transfer, USSD, Mobile Money
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  Total in GHS: <span className="font-bold text-foreground">GH₵ {(total * USD_TO_GHS_RATE).toFixed(2)}</span>
                  <br />
                  <span className="opacity-70">(Rate: $1 = GH₵ {USD_TO_GHS_RATE.toFixed(2)})</span>
                </p>

                <p className="text-xs text-muted-foreground mt-4">
                  You'll be redirected to Paystack's secure payment page to complete your purchase.
                  We accept Visa, Mastercard, Verve, and bank transfers.
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handlePaystackPayment}
                disabled={!isEmailValid || isProcessing || !paystackLoaded}
                className={cn(
                  "w-full rounded-full py-4 text-lg font-bold transition-all",
                  isEmailValid && !isProcessing && paystackLoaded
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-secondary text-muted-foreground cursor-not-allowed"
                )}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : !paystackLoaded ? (
                  "Loading..."
                ) : (
                  `Pay GH₵ ${(total * USD_TO_GHS_RATE).toFixed(2)}`
                )}
              </button>

              {/* Security Note */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>Your payment is protected by Paystack's bank-grade security</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-4 rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 font-bold text-foreground">Order Summary</h2>
              
              {/* Items */}
              <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-3"
                  >
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="h-12 w-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-foreground text-sm">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.producerName}
                        {item.tierName && (
                          <span className="ml-2 text-orange-500">• {item.tierName}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-orange-500">
                        ${Number(item.price || 0).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                  <span className="text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Processing Fee</span>
                  <span className="text-foreground">${processingFee.toFixed(2)}</span>
                </div>
                <div className="flex flex-col items-end border-t border-border pt-2">
                  <div className="flex w-full justify-between">
                    <span className="text-lg font-bold text-foreground">Total</span>
                    <span className="text-xl font-bold text-orange-500">${total.toFixed(2)}</span>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground mt-1">
                    ≈ GH₵ {(total * USD_TO_GHS_RATE).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* What's Included */}
              <div className="mt-6 rounded-lg bg-secondary/50 p-4">
                <h3 className="mb-2 text-sm font-bold text-foreground">What's Included</h3>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    High-quality WAV & MP3 files
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Unlimited streaming rights
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Instant download access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Lifetime license
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
