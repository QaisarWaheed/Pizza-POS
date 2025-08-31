"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductSearch } from "@/components/pos/product-search"
import { Cart } from "@/components/pos/cart"
import { PaymentModal } from "@/components/pos/payment-modal"
import { CustomerSelector } from "@/components/customers/customer-selector"
import { ReceiptGenerator } from "@/components/receipts/receipt-generator"
import { PizzaCustomizer } from "@/components/pos/pizza-customizer"
import { OrderTypeSelector } from "@/components/pos/order-type-selector"
import { mockProducts } from "@/lib/mock-data"
import type { Product, PizzaCustomization } from "@/lib/types"
import type { CartItem, Transaction } from "@/lib/pos-types"
import type { Customer, Receipt } from "@/lib/customer-types"
import { CreditCard, Trash2, Pizza } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface ExtendedCartItem extends CartItem {
  customization?: PizzaCustomization
  specialInstructions?: string
}

export default function PosPage() {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<ExtendedCartItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>()
  const [orderType, setOrderType] = useState<"dine-in" | "takeout" | "delivery">("dine-in")
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null)
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)

  const [customizerProduct, setCustomizerProduct] = useState<Product | null>(null)
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false)

  const taxRate = 8.5 // 8.5% tax rate

  const addToCart = (product: Product) => {
    // Check if product is a pizza that needs customization
    if (product.category === "Pizzas") {
      setCustomizerProduct(product)
      setIsCustomizerOpen(true)
      return
    }

    const existingItem = cartItems.find((item) => item.productId === product.id)

    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + 1)
    } else {
      const newItem: ExtendedCartItem = {
        id: Date.now().toString(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      }
      setCartItems((prev) => [...prev, newItem])
    }
  }

  const addCustomizedPizzaToCart = (product: Product, customization: PizzaCustomization, finalPrice: number) => {
    const sizeData = customization.size
    const toppingsText = customization.toppings.length > 0 ? ` (${customization.toppings.join(", ")})` : ""

    const newItem: ExtendedCartItem = {
      id: Date.now().toString(),
      productId: product.id,
      name: `${product.name} - ${sizeData}${toppingsText}`,
      price: finalPrice,
      quantity: 1,
      customization,
      specialInstructions: customization.specialInstructions,
    }
    setCartItems((prev) => [...prev, newItem])
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
  }

  const removeItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const applyDiscount = (itemId: string, discount: number, type: "percentage" | "fixed") => {
    setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, discount, discountType: type } : item)))
  }

  const clearCart = () => {
    setCartItems([])
    setSelectedCustomer(undefined)
  }

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity
      const discountAmount = item.discount
        ? item.discountType === "percentage"
          ? (itemTotal * item.discount) / 100
          : item.discount
        : 0
      return sum + (itemTotal - discountAmount)
    }, 0)

    const tax = subtotal * (taxRate / 100)
    const total = subtotal + tax
    return { subtotal, tax, total }
  }

  const handlePaymentComplete = (transactionData: Partial<Transaction>) => {
    const { subtotal, tax, total } = calculateTotals()

    const newTransaction: Transaction = {
      ...transactionData,
      items: cartItems,
      subtotal,
      discount: 0,
      tax,
      total,
      customerId: selectedCustomer?.id,
      cashierId: user?.id || "unknown",
    } as Transaction

    const receipt: Receipt = {
      id: newTransaction.id,
      transactionId: newTransaction.id,
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer
        ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}`
        : "Walk-in Customer",
      items: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      subtotal,
      tax,
      discount: 0,
      total,
      paymentMethod: newTransaction.paymentMethod.name,
      cashierName: user?.name || "Unknown",
      storeName: "Tony's Pizza Palace",
      storeAddress: "123 Pizza Street, Little Italy, NY 10013",
      createdAt: new Date(),
    }

    setTransactions((prev) => [newTransaction, ...prev])
    setCurrentReceipt(receipt)
    setIsReceiptOpen(true)
    clearCart()
  }

  const { total } = calculateTotals()

  const pizzaProducts = mockProducts.filter((p) => p.category === "Pizzas")
  const otherProducts = mockProducts.filter((p) => p.category !== "Pizzas" && p.category !== "Ingredients")

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Pizza className="h-8 w-8 text-primary" />
            Tony's Pizza POS
          </h1>
          <p className="text-muted-foreground">Fresh pizzas made to order</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Cashier: {user?.name}</span>
          <CustomerSelector selectedCustomer={selectedCustomer} onSelectCustomer={setSelectedCustomer} />
          {cartItems.length > 0 && (
            <Button variant="outline" onClick={clearCart} size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Product Search */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Search</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductSearch onAddToCart={addToCart} />
            </CardContent>
          </Card>

          {/* Pizza Menu */}
          <Card>
            <CardHeader>
              <CardTitle>Pizza Menu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pizzaProducts.map((product) => (
                  <Button
                    key={product.id}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent text-left"
                    onClick={() => addToCart(product)}
                  >
                    <span className="font-medium">{product.name}</span>
                    <span className="text-sm text-muted-foreground">{product.description}</span>
                    <span className="text-lg font-bold text-primary">From ${product.price.toFixed(2)}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Other Items */}
          <Card>
            <CardHeader>
              <CardTitle>Appetizers & Beverages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {otherProducts.slice(0, 8).map((product) => (
                  <Button
                    key={product.id}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <span className="font-medium text-sm text-center">{product.name}</span>
                    <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart and Order Type */}
        <div className="space-y-4">
          <OrderTypeSelector selectedType={orderType} onTypeChange={setOrderType} />

          <Cart
            items={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onApplyDiscount={applyDiscount}
            taxRate={taxRate}
          />

          {cartItems.length > 0 && (
            <Button size="lg" className="w-full h-14 text-lg" onClick={() => setIsPaymentModalOpen(true)}>
              <CreditCard className="h-5 w-5 mr-2" />
              Checkout - ${total.toFixed(2)}
            </Button>
          )}
        </div>
      </div>

      <PaymentModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        total={total}
        onPaymentComplete={handlePaymentComplete}
      />

      <ReceiptGenerator receipt={currentReceipt} open={isReceiptOpen} onOpenChange={setIsReceiptOpen} />

      {customizerProduct && (
        <PizzaCustomizer
          product={customizerProduct}
          open={isCustomizerOpen}
          onClose={() => {
            setIsCustomizerOpen(false)
            setCustomizerProduct(null)
          }}
          onAddToCart={addCustomizedPizzaToCart}
        />
      )}
    </div>
  )
}
