"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { Order } from "@/lib/types"
import { Clock, AlertTriangle, CheckCircle, Package } from "lucide-react"

interface OrderSummaryProps {
  orders: Order[]
}

export function OrderSummary({ orders }: OrderSummaryProps) {
  const stats = {
    pending: orders.filter((o) => o.status === "pending").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    overdue: orders.filter((o) => {
      const now = new Date()
      const created = new Date(o.createdAt)
      const diffMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60))
      return diffMinutes > 20 && o.status !== "completed"
    }).length,
  }

  const summaryCards = [
    {
      title: "Pending Orders",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Preparing",
      value: stats.preparing,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Ready",
      value: stats.ready,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Overdue",
      value: stats.overdue,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {summaryCards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
