// types/cart.ts
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type: "pack" | "product";
  category?: string;
  description?: string;
}

export interface ShippingInfo {
  address: string;
  city: string;
  phone: string;
  deliveryType: "home" | "store";
  deliveryFee: number;
}

export interface OrderSummary {
  subtotal: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface OrderData {
  ref: string;
  amount: number;
  currency: string;
  customer: CustomerInfo;
  items: CartItem[];
  shipping: ShippingInfo;
  promoCode?: string;
  promoDiscount?: number;
  timestamp: number;
  status: "pending" | "paid" | "failed" | "cancelled";
  paidAt?: number;
}

export interface PaymentResult {
  success: boolean;
  orderId?: string;
  message: string;
  paymentUrl?: string;
}
export interface CartState {
  items: CartItem[];
  shippingInfo: ShippingInfo | null;
  orderSummary: OrderSummary;
  customerInfo: CustomerInfo | null;
}
export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface ShippingInfo {
  address: string;
  city: string;
  phone: string;
  deliveryType: "home" | "store";
  deliveryFee: number;
}
