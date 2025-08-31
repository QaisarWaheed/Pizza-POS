"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, Percent } from "lucide-react"
import type { CartItem } from "@/lib/pos-types"

interface CartProps {
  items: CartItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onApplyDiscount: (itemId: string, discount: number, type: "percentage" | "fixed") => void
  taxRate: number
}

export function Cart({ items, onUpdateQuantity, onRemoveItem, onApplyDiscount, taxRate }: CartProps) {
  const subtotal = items.reduce((sum, item) => {
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

  if (items.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Cart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <p>Cart is empty</p>
              <p className="text-sm">Search and add products to start a sale</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Cart
          <Badge variant="secondary">{items.length} items</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto max-h-96">
          {items.map((item) => {
            const itemTotal = item.price * item.quantity
            const discountAmount = item.discount
              ? item.discountType === "percentage"
                ? (itemTotal * item.discount) / 100
                : item.discount
              : 0
            const finalPrice = itemTotal - discountAmount

            return (
              <div key={item.id} className="border rounded-lg p-3 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => onUpdateQuantity(item.id, Math.max(1, Number.parseInt(e.target.value) || 1))}
                      className="w-16 text-center"
                      min="1"
                    />
                    <Button variant="outline" size="sm" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-right">
                    {item.discount && (
                      <div className="text-sm text-muted-foreground line-through">${itemTotal.toFixed(2)}</div>
                    )}
                    <div className="font-medium">${finalPrice.toFixed(2)}</div>
                  </div>
                </div>

                {item.discount && (
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <Percent className="h-3 w-3" />
                    Discount: {item.discountType === "percentage" ? `${item.discount}%` : `$${item.discount}`}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onApplyDiscount(item.id, 10, "percentage")}
                    className="text-xs"
                  >
                    10% Off
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onApplyDiscount(item.id, 5, "fixed")}
                    className="text-xs"
                  >
                    $5 Off
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 space-y-2">
          <Separator />
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax ({taxRate}%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
