"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Printer, Download } from "lucide-react"
import type { Receipt } from "@/lib/customer-types"

interface ReceiptGeneratorProps {
  receipt: Receipt | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReceiptGenerator({ receipt, open, onOpenChange }: ReceiptGeneratorProps) {
  if (!receipt) return null

  const handlePrint = () => {
    const printContent = document.getElementById("receipt-content")
    if (printContent) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt #${receipt.id}</title>
              <style>
                body { font-family: monospace; font-size: 12px; margin: 20px; }
                .receipt { max-width: 300px; margin: 0 auto; }
                .center { text-align: center; }
                .right { text-align: right; }
                .bold { font-weight: bold; }
                .separator { border-top: 1px dashed #000; margin: 10px 0; }
                .item-row { display: flex; justify-content: space-between; margin: 2px 0; }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const handleDownloadPDF = () => {
    // In a real implementation, you would use a library like jsPDF
    alert("PDF download functionality would be implemented here")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Receipt #{receipt.id}</DialogTitle>
          <DialogDescription>Transaction receipt and details</DialogDescription>
        </DialogHeader>

        <div id="receipt-content" className="space-y-4 font-mono text-sm">
          <div className="text-center space-y-1">
            <h2 className="font-bold text-lg">{receipt.storeName}</h2>
            <p className="text-xs text-muted-foreground">{receipt.storeAddress}</p>
            <p className="text-xs text-muted-foreground">
              {receipt.createdAt.toLocaleDateString()} {receipt.createdAt.toLocaleTimeString()}
            </p>
          </div>

          <Separator />

          <div className="space-y-1">
            <p className="text-xs">
              <span className="font-medium">Receipt #:</span> {receipt.id}
            </p>
            <p className="text-xs">
              <span className="font-medium">Cashier:</span> {receipt.cashierName}
            </p>
            {receipt.customerName && (
              <p className="text-xs">
                <span className="font-medium">Customer:</span> {receipt.customerName}
              </p>
            )}
          </div>

          <Separator />

          <div className="space-y-1">
            {receipt.items.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs">{item.name}</span>
                  <span className="text-xs">${item.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground ml-2">
                  <span>
                    {item.quantity} x ${item.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Subtotal:</span>
              <span>${receipt.subtotal.toFixed(2)}</span>
            </div>
            {receipt.discount > 0 && (
              <div className="flex justify-between text-xs text-green-600">
                <span>Discount:</span>
                <span>-${receipt.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span>Tax:</span>
              <span>${receipt.tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${receipt.total.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          <div className="text-center space-y-1">
            <p className="text-xs">
              <span className="font-medium">Payment:</span> {receipt.paymentMethod}
            </p>
            <p className="text-xs text-muted-foreground">Thank you for your business!</p>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handlePrint} className="flex-1">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownloadPDF} variant="outline" className="flex-1 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
