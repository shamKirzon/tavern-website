interface OrderItem {
  note: string;
  image: number;
  price: number;
  total: number;
  quantity: number;
  orderName: string;
  description: string[];
  serving?: {
    servingSize: string;
    servingPrice: number;
  };
}

export interface DefaultOrderFormat {
  assignedCashierId: string;
  createdAt: string;
  orderId: string;
  orderStatus: OrderStatus;
  qrCodeUrl: string;
  reservationId: string;
  sessionExpiry: string;
  total: number;
  orderItems: OrderItem[];
}

export interface AdditionalOrdersFormat {
  assignedCashierId: string;
  createdAt: string;
  orderId: string;
  orderStatus: OrderStatus;
  qrCodeUrl: string;
  reservationId: string;
  sessionExpiry: string;
  total: number;
  orderItems: {
    newOrders: {
      items: OrderItem[];
      total: number;
    };
    originalOrders: {
      items: OrderItem[];
      total: number;
    };
  };
}

export interface NormalizedOrder {
  assignedCashierId: string;
  createdAt: string;
  orderId: string;
  orderStatus: OrderStatus;
  qrCodeUrl: string;
  reservationId: string;
  sessionExpiry: string;
  total: number;
  orderItems: OrderItem[];
  sourceFormat?: "default" | "additional";
}

export type OrderFormatResponse = DefaultOrderFormat | AdditionalOrdersFormat;

export type OrderStatus = "pending" | "cancelled" | "done";
