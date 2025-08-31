"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReceiptGenerator } from "@/components/receipts/receipt-generator"
import type { Receipt } from "@/lib/customer-types"
import { Search, ReceiptIcon, DollarSign, ShoppingCart, TrendingUp, Eye } from "lucide-react"

export default function SalesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)

  // Mock sales data
  const mockSales: Receipt[] = [
    {
      id: "TXN-001",
      transactionId: "TXN-001",
      customerId: "1",
      customerName: "John Doe",
      items: [
        { name: "Premium Coffee Beans", quantity: 2, price: 12.99, total: 25.98 },
        { name: "Chocolate Croissant", quantity: 1, price: 4.5, total: 4.5 },
      ],
      subtotal: 30.48,
      tax: 2.59,
      discount: 0,
      total: 33.07,
      paymentMethod: "Credit Card",
      cashierName: "Admin User",
      storeName: "POS System Store",
      storeAddress: "123 Business St, City, State 12345",
      createdAt: new Date("2024-01-15T10:30:00"),
    },
    {
      id: "TXN-002",
      transactionId: "TXN-002",
      customerName: "Walk-in Customer",
      items: [
        { name: "Organic Tea Blend", quantity: 1, price: 8.99, total: 8.99 },
        { name: "Artisan Sandwich", quantity: 1, price: 9.99, total: 9.99 },
      ],
      subtotal: 18.98,
      tax: 1.61,
      discount: 0,
      total: 20.59,
      paymentMethod: "Cash",
      cashierName: "Admin User",
      storeName: "POS System Store",
      storeAddress: "123 Business St, City, State 12345",
      createdAt: new Date("2024-01-15T11:45:00"),
    },
  ]

  const filteredSales = mockSales.filter(
    (sale) =>
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewReceipt = (receipt: Receipt) => {
    setSelectedReceipt(receipt)
    setIsReceiptOpen(true)
  }

  const totalSales = mockSales.reduce((sum, sale) => sum + sale.total, 0)
  const totalTransactions = mockSales.length
  const averageTransaction = totalSales / totalTransactions

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales & Receipts</h1>
          <p className="text-muted-foreground">View transaction history and manage receipts</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageTransaction.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receipts</CardTitle>
            <ReceiptIcon className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSales.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Recent sales and transaction records</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-mono">{sale.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{sale.customerName || "Walk-in Customer"}</div>
                      {sale.customerId && <div className="text-sm text-muted-foreground">ID: {sale.customerId}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {sale.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="text-sm">
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                      {sale.items.length > 2 && (
                        <div className="text-sm text-muted-foreground">+{sale.items.length - 2} more</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{sale.paymentMethod}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">${sale.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{sale.createdAt.toLocaleDateString()}</div>
                      <div className="text-muted-foreground">{sale.createdAt.toLocaleTimeString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleViewReceipt(sale)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ReceiptGenerator receipt={selectedReceipt} open={isReceiptOpen} onOpenChange={setIsReceiptOpen} />
    </div>
  )
}
