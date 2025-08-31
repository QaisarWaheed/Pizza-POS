export interface Product {
  id: string
  name: string
  description?: string
  sku: string
  barcode?: string
  category: string
  price: number
  cost: number
  stock: number
  minStock: number
  maxStock: number
  unit: string
  isActive: boolean
  supplierId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  description?: string
  isActive: boolean
  createdAt: Date
}

export interface Supplier {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  isActive: boolean
  createdAt: Date
}

export interface StockMovement {
  id: string
  productId: string
  type: "in" | "out" | "adjustment"
  quantity: number
  reason: string
  reference?: string
  userId: string
  createdAt: Date
}

export interface InventoryAlert {
  id: string
  productId: string
  type: "low_stock" | "out_of_stock" | "overstock"
  message: string
  isRead: boolean
  createdAt: Date
}

export interface PizzaSize {
  id: string
  name: string
  diameter: number
  basePrice: number
}

export interface PizzaTopping {
  id: string
  name: string
  price: number
  category: "meat" | "vegetable" | "cheese" | "sauce"
  isActive: boolean
}

export interface PizzaCustomization {
  size: string
  crust: string
  toppings: string[]
  specialInstructions?: string
}

export interface CustomizableProduct extends Product {
  isCustomizable: boolean
  baseProduct?: boolean
  customization?: PizzaCustomization
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  customization?: PizzaCustomization
  specialInstructions?: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId?: string
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  orderType: "dine-in" | "takeout" | "delivery"
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled"
  paymentStatus: "pending" | "paid" | "refunded"
  createdAt: Date
  estimatedReadyTime?: Date
  deliveryAddress?: string
  customerPhone?: string
}
