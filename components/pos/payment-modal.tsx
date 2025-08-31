"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Banknote, Smartphone, CheckCircle } from "lucide-react"
import type { PaymentMethod, Transaction } from "@/lib/pos-types"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  total: number
  onPaymentComplete: (transaction: Partial<Transaction>) => void
}

const paymentMethods: PaymentMethod[] = [
  { id: "cash", name: "Cash", type: "cash", icon: "banknote" },
  { id: "card", name: "Credit/Debit Card", type: "card", icon: "credit-card" },
  { id: "wallet", name: "Digital Wallet", type: "wallet", icon: "smartphone" },
]

export function PaymentModal({ open, onOpenChange, total, onPaymentComplete }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [cashReceived, setCashReceived] = useState<number>(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const change = cashReceived - total

  const handlePayment = async () => {
    if (!selectedMethod) return

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const transaction: Partial<Transaction> = {
      id: Date.now().toString(),
      total,
      paymentMethod: selectedMethod,
      createdAt: new Date(),
    }

    setIsProcessing(false)
    setIsComplete(true)

    setTimeout(() => {
      onPaymentComplete(transaction)
      onOpenChange(false)
      setSelectedMethod(null)
      setCashReceived(0)
      setIsComplete(false)
    }, 2000)
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "banknote":
        return <Banknote className="h-6 w-6" />
      case "credit-card":
        return <CreditCard className="h-6 w-6" />
      case "smartphone":
        return <Smartphone className="h-6 w-6" />
      default:
        return <CreditCard className="h-6 w-6" />
    }
  }

  const canProceed = selectedMethod && (selectedMethod.type !== "cash" || cashReceived >= total)

  if (isComplete) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground">Transaction completed successfully</p>
            {selectedMethod?.type === "cash" && change > 0 && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-lg font-bold">Change: ${change.toFixed(2)}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
          <DialogDescription>Select payment method and complete the transaction</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-3xl font-bold text-primary">${total.toFixed(2)}</p>
          </div>

          <div className="space-y-3">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-1 gap-2">
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  className={`cursor-pointer transition-colors ${
                    selectedMethod?.id === method.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-accent/50"
                  }`}
                  onClick={() => setSelectedMethod(method)}
                >
                  <CardContent className="flex items-center gap-3 p-4">
                    {getIcon(method.icon)}
                    <span className="font-medium">{method.name}</span>
                    {selectedMethod?.id === method.id && <Badge className="ml-auto">Selected</Badge>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {selectedMethod?.type === "cash" && (
            <div className="space-y-3">
              <Label htmlFor="cashReceived">Cash Received</Label>
              <Input
                id="cashReceived"
                type="number"
                step="0.01"
                value={cashReceived || ""}
                onChange={(e) => setCashReceived(Number.parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="text-lg"
              />
              {cashReceived > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Change:</span>
                  <span className={change >= 0 ? "text-green-600" : "text-red-600"}>
                    ${Math.abs(change).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={!canProceed || isProcessing}>
            {isProcessing ? "Processing..." : "Complete Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
