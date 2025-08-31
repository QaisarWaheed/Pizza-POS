"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Scan, Plus } from "lucide-react"
import { mockProducts } from "@/lib/mock-data"
import type { Product } from "@/lib/types"

interface ProductSearchProps {
  onAddToCart: (product: Product) => void
}

export function ProductSearch({ onAddToCart }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = mockProducts.filter(
        (product) =>
          product.isActive &&
          (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.barcode?.includes(searchTerm)),
      )
      setFilteredProducts(filtered.slice(0, 8)) // Limit to 8 results
    } else {
      setFilteredProducts([])
    }
  }, [searchTerm])

  const handleBarcodeSearch = () => {
    setIsScanning(true)
    // Simulate barcode scanning
    setTimeout(() => {
      const barcodeProduct = mockProducts.find((p) => p.barcode === "1234567890123")
      if (barcodeProduct) {
        onAddToCart(barcodeProduct)
        setSearchTerm("")
      }
      setIsScanning(false)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name, SKU, or barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={handleBarcodeSearch}
          disabled={isScanning}
          className="px-4 bg-transparent"
        >
          <Scan className="h-5 w-5" />
          {isScanning ? "Scanning..." : "Scan"}
        </Button>
      </div>

      {filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                    </div>
                    <p className="text-lg font-bold text-primary mt-2">${product.price.toFixed(2)}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      onAddToCart(product)
                      setSearchTerm("")
                    }}
                    disabled={product.stock === 0}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
