export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  discount?: number
  discountType?: "percentage" | "fixed"
}

export interface PaymentMethod {
  id: string
  name: string
  type: "cash" | "card" | "wallet"
  icon: string
}

export interface Transaction {
  id: string
  items: CartItem[]
  subtotal: number
  discount: number
  tax: number
  total: number
  paymentMethod: PaymentMethod
  customerId?: string
  cashierId: string
  createdAt: Date
}

export interface PosSettings {
  taxRate: number
  currency: string
  receiptFooter: string
}
