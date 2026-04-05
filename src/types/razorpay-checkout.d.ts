export type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayConstructorOptions = {
  key: string;
  /** INR paise / subunits; string recommended with Orders API */
  amount: number | string;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color: string };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayConstructorOptions) => { open: () => void };
  }
}

export {};
