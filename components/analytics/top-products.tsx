"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const topProducts = [
  {
    id: 1,
    name: "Premium Coffee Beans",
    category: "Beverages",
    sales: 245,
    revenue: 2450.0,
    percentage: 100,
  },
  {
    id: 2,
    name: "Chocolate Croissant",
    category: "Pastries",
    sales: 189,
    revenue: 1890.0,
    percentage: 77,
  },
  {
    id: 3,
    name: "Organic Tea Blend",
    category: "Beverages",
    sales: 156,
    revenue: 1560.0,
    percentage: 64,
  },
  {
    id: 4,
    name: "Artisan Sandwich",
    category: "Food",
    sales: 134,
    revenue: 1340.0,
    percentage: 55,
  },
  {
    id: 5,
    name: "Fresh Fruit Salad",
    category: "Food",
    sales: 98,
    revenue: 980.0,
    percentage: 40,
  },
]

export function TopProducts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
        <CardDescription>Best performing products this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-accent-foreground">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{product.sales} sold</span>
                  </div>
                  <Progress value={product.percentage} className="h-2 mt-1" />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-foreground">${product.revenue.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
