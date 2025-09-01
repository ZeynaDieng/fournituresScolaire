// types/api.ts
// Types pour les APIs de diagnostic

export interface PaymentDiagnostics {
  timestamp: string;
  config: {
    paytechConfigured: boolean;
    sandbox: boolean;
    baseUrl: string;
    databaseUrl: boolean;
  };
  database: {
    connected: boolean;
    orders: number;
    payments: number;
    lastOrders: Array<{
      ref: string;
      status: string;
      total: number;
      createdAt: string;
      hasPayment: boolean;
      paymentStatus: string | null;
    }>;
    error?: string;
  };
  recommendations: string[];
}

export interface PaymentDiagnosticsResponse {
  success: true;
  data: PaymentDiagnostics;
}

export interface PaymentDiagnosticsError {
  success: false;
  error: string;
  recommendations: string[];
}

export type PaymentDiagnosticsResult =
  | PaymentDiagnosticsResponse
  | PaymentDiagnosticsError;
