"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OrderCard } from "@/components/kitchen/order-card"
import { OrderSummary } from "@/components/kitchen/order-summary"
import { mockOrders } from "@/lib/mock-data"
import type { Order } from "@/lib/types"
import { RefreshCw, ChefHat } from "lucide-react"

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLastRefresh(new Date())
    setIsRefreshing(false)
  }

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              estimatedReadyTime:
                newStatus === "preparing"
                  ? new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now
                  : order.estimatedReadyTime,
            }
          : order,
      ),
    )
  }

  const activeOrders = orders.filter((order) => order.status !== "completed" && order.status !== "cancelled")
  const ordersByStatus = {
    pending: activeOrders.filter((o) => o.status === "pending"),
    preparing: activeOrders.filter((o) => o.status === "preparing"),
    ready: activeOrders.filter((o) => o.status === "ready"),
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-primary" />
            Kitchen Display
          </h1>
          <p className="text-muted-foreground">Manage and track pizza orders</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Last updated: {lastRefresh.toLocaleTimeString()}</span>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <OrderSummary orders={activeOrders} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Orders */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Pending Orders</h2>
            <Badge variant="secondary">{ordersByStatus.pending.length}</Badge>
          </div>
          {ordersByStatus.pending.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">No pending orders</CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {ordersByStatus.pending.map((order) => (
                <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
              ))}
            </div>
          )}
        </div>

        {/* Preparing Orders */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Preparing</h2>
            <Badge variant="secondary">{ordersByStatus.preparing.length}</Badge>
          </div>
          {ordersByStatus.preparing.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">No orders in preparation</CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {ordersByStatus.preparing.map((order) => (
                <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
              ))}
            </div>
          )}
        </div>

        {/* Ready Orders */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Ready for Pickup</h2>
            <Badge variant="secondary">{ordersByStatus.ready.length}</Badge>
          </div>
          {ordersByStatus.ready.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">No orders ready</CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {ordersByStatus.ready.map((order) => (
                <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
