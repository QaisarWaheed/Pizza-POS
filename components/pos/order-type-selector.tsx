"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UtensilsCrossed, ShoppingBag, Truck } from "lucide-react"

interface OrderTypeSelectorProps {
  selectedType: "dine-in" | "takeout" | "delivery"
  onTypeChange: (type: "dine-in" | "takeout" | "delivery") => void
}

export function OrderTypeSelector({ selectedType, onTypeChange }: OrderTypeSelectorProps) {
  const orderTypes = [
    {
      id: "dine-in" as const,
      name: "Dine In",
      icon: UtensilsCrossed,
      description: "Customer dining in restaurant",
    },
    {
      id: "takeout" as const,
      name: "Takeout",
      icon: ShoppingBag,
      description: "Customer pickup order",
    },
    {
      id: "delivery" as const,
      name: "Delivery",
      icon: Truck,
      description: "Deliver to customer address",
    },
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Order Type</h3>
          <Badge variant={selectedType === "delivery" ? "default" : "secondary"}>
            {orderTypes.find((t) => t.id === selectedType)?.name}
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {orderTypes.map((type) => {
            const Icon = type.icon
            return (
              <Button
                key={type.id}
                variant={selectedType === type.id ? "default" : "outline"}
                size="sm"
                className="h-auto p-3 flex flex-col items-center gap-1"
                onClick={() => onTypeChange(type.id)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{type.name}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
