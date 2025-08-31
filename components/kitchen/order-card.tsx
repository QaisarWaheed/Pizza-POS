"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Order } from "@/lib/types"
import { Clock, User, MapPin, Phone, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrderCardProps {
  order: Order
  onStatusChange: (orderId: string, status: Order["status"]) => void
}

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "preparing":
        return "bg-blue-500"
      case "ready":
        return "bg-green-500"
      case "completed":
        return "bg-gray-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getOrderTypeColor = (type: Order["orderType"]) => {
    switch (type) {
      case "dine-in":
        return "bg-purple-100 text-purple-800"
      case "takeout":
        return "bg-blue-100 text-blue-800"
      case "delivery":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusChange = async (newStatus: Order["status"]) => {
    setIsUpdating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    onStatusChange(order.id, newStatus)
    setIsUpdating(false)
  }

  const getElapsedTime = () => {
    const now = new Date()
    const created = new Date(order.createdAt)
    const diffMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60))
    return diffMinutes
  }

  const elapsedTime = getElapsedTime()
  const isOverdue = elapsedTime > 20 && order.status !== "completed"

  const nextStatusActions = {
    pending: { status: "preparing" as const, label: "Start Preparing", icon: AlertCircle },
    preparing: { status: "ready" as const, label: "Mark Ready", icon: CheckCircle },
    ready: { status: "completed" as const, label: "Complete Order", icon: CheckCircle },
  }

  const nextAction = nextStatusActions[order.status as keyof typeof nextStatusActions]

  return (
    <Card className={cn("w-full", isOverdue && "border-red-500 border-2")}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">#{order.orderNumber}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getOrderTypeColor(order.orderType)}>{order.orderType.replace("-", " ")}</Badge>
            <div className={cn("w-3 h-3 rounded-full", getStatusColor(order.status))} />
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className={cn(isOverdue && "text-red-600 font-semibold")}>{elapsedTime}m ago</span>
          </div>
          {order.estimatedReadyTime && (
            <div className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              <span>
                ETA: {new Date(order.estimatedReadyTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Customer Info */}
        {(order.customerId || order.customerPhone) && (
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4" />
            <span>{order.customerId ? "Customer #" + order.customerId : "Walk-in"}</span>
            {order.customerPhone && (
              <>
                <Phone className="h-4 w-4 ml-2" />
                <span>{order.customerPhone}</span>
              </>
            )}
          </div>
        )}

        {/* Delivery Address */}
        {order.orderType === "delivery" && order.deliveryAddress && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 mt-0.5" />
            <span>{order.deliveryAddress}</span>
          </div>
        )}

        <Separator />

        {/* Order Items */}
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="font-medium">
                    {item.quantity}x {item.productName}
                  </span>
                  {item.customization && (
                    <div className="text-sm text-muted-foreground mt-1">
                      <div>Size: {item.customization.size}</div>
                      <div>Crust: {item.customization.crust}</div>
                      {item.customization.toppings.length > 0 && (
                        <div>Toppings: {item.customization.toppings.join(", ")}</div>
                      )}
                    </div>
                  )}
                  {item.specialInstructions && (
                    <div className="text-sm text-orange-600 font-medium mt-1">Note: {item.specialInstructions}</div>
                  )}
                </div>
                <span className="text-sm font-medium">${item.unitPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Order Total */}
        <div className="flex justify-between items-center font-bold">
          <span>Total:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>

        {/* Action Button */}
        {nextAction && order.status !== "completed" && order.status !== "cancelled" && (
          <Button
            onClick={() => handleStatusChange(nextAction.status)}
            disabled={isUpdating}
            className="w-full"
            variant={order.status === "ready" ? "default" : "outline"}
          >
            <nextAction.icon className="h-4 w-4 mr-2" />
            {isUpdating ? "Updating..." : nextAction.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
