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
/**
 SINCE MERON KANG UNION OF TYPES THEN ALIN MAN SA DALAWANG FORMAT AY PWEDE MONG ILAGAY SA LOOB
 NG USE STATE MO SINCE NAKA OrderFormat siya.
 */

/**
  PINAKA MADALING GAWIN IS IMERGE MO NALANG AS ONE OBJECT PARA GAGAMIT KA LANG NG SPREAD OPERATOR.
  */

export type OrderStatus = "pending" | "cancelled" | "done";
