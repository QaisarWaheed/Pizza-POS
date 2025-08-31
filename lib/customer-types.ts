export interface Customer {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  address?: string
  dateOfBirth?: Date
  loyaltyPoints: number
  totalSpent: number
  visitCount: number
  lastVisit?: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Receipt {
  id: string
  transactionId: string
  customerId?: string
  customerName?: string
  items: Array<{
    name: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: string
  cashierName: string
  storeName: string
  storeAddress: string
  createdAt: Date
}
