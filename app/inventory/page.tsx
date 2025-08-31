"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { StockMovementForm } from "@/components/inventory/stock-movement-form"
import { mockProducts, mockInventoryAlerts } from "@/lib/mock-data"
import type { Product, StockMovement, InventoryAlert } from "@/lib/types"
import { Plus, Search, AlertTriangle, TrendingUp, TrendingDown, Package, ArrowUpDown } from "lucide-react"

export default function InventoryPage() {
  const [products] = useState<Product[]>(mockProducts)
  const [alerts] = useState<InventoryAlert[]>(mockInventoryAlerts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false)
  const [movements, setMovements] = useState<StockMovement[]>([])

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSaveMovement = (movementData: Partial<StockMovement>) => {
    const newMovement: StockMovement = {
      id: Date.now().toString(),
      userId: "current-user",
      createdAt: new Date(),
      ...movementData,
    } as StockMovement
    setMovements((prev) => [newMovement, ...prev])
  }

  const lowStockProducts = products.filter((p) => p.stock <= p.minStock)
  const outOfStockProducts = products.filter((p) => p.stock === 0)
  const totalValue = products.reduce((sum, p) => sum + p.stock * p.cost, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">Monitor stock levels and manage inventory movements</p>
        </div>
        <Button onClick={() => setIsMovementFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Record Movement
        </Button>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <Alert key={alert.id} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Levels</CardTitle>
          <CardDescription>Current inventory status and stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Max Stock</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const stockStatus =
                  product.stock === 0
                    ? "out"
                    : product.stock <= product.minStock
                      ? "low"
                      : product.stock >= product.maxStock
                        ? "high"
                        : "normal"

                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.category}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{product.sku}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            stockStatus === "out"
                              ? "text-red-600 font-medium"
                              : stockStatus === "low"
                                ? "text-orange-600 font-medium"
                                : ""
                          }
                        >
                          {product.stock}
                        </span>
                        <span className="text-muted-foreground">{product.unit}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.minStock}</TableCell>
                    <TableCell>{product.maxStock}</TableCell>
                    <TableCell>${(product.stock * product.cost).toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {stockStatus === "out" && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Out of Stock
                          </Badge>
                        )}
                        {stockStatus === "low" && (
                          <Badge variant="secondary" className="gap-1 bg-orange-100 text-orange-800">
                            <TrendingDown className="h-3 w-3" />
                            Low Stock
                          </Badge>
                        )}
                        {stockStatus === "high" && (
                          <Badge variant="secondary" className="gap-1 bg-blue-100 text-blue-800">
                            <TrendingUp className="h-3 w-3" />
                            High Stock
                          </Badge>
                        )}
                        {stockStatus === "normal" && (
                          <Badge variant="outline" className="gap-1">
                            <ArrowUpDown className="h-3 w-3" />
                            Normal
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <StockMovementForm open={isMovementFormOpen} onOpenChange={setIsMovementFormOpen} onSave={handleSaveMovement} />
    </div>
  )
}
