export {};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }

  interface RazorpayPaymentResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }

  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    order_id: string;
    handler?: (response: RazorpayPaymentResponse) => void;
    modal?: {
      ondismiss?: () => void;
    };
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    theme?: {
      color?: string;
    };
    notes?: Record<string, string>;
    retry?: {
      enabled?: boolean;
    };
    readonly image?: string;
  }

  interface RazorpayInstance {
    open: () => void;
    on: (eventName: 'payment.failed', callback: (response: { error?: { description?: string; reason?: string } }) => void) => void;
    close: () => void;
  }
}
