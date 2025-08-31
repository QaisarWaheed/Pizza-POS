"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, Package, Users, TrendingUp, BarChart3, Pizza, ChefHat } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    {
      title: "Today's Sales",
      value: "$1,847.50",
      change: "+15.2%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Pizzas Sold",
      value: "87",
      change: "+12.8%",
      icon: Pizza,
      color: "text-red-600",
    },
    {
      title: "Customers",
      value: "64",
      change: "+8.1%",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Avg Order Value",
      value: "$28.85",
      change: "+3.4%",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Pizza className="h-8 w-8 text-primary" />
            Tony's Pizza Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}! Here's your pizza shop overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm">
            {user?.role.toUpperCase()}
          </Badge>
          {(user?.role === "manager" || user?.role === "admin") && (
            <Button asChild variant="outline" size="sm">
              <Link href="/analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-green-600 font-medium">{stat.change} from yesterday</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest orders and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order #ORD-1247</p>
                  <p className="text-sm text-muted-foreground">Large Pepperoni Pizza - $18.99</p>
                </div>
                <Badge variant="outline">Ready</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Inventory Alert</p>
                  <p className="text-sm text-muted-foreground">Mozzarella cheese running low</p>
                </div>
                <Badge variant="destructive">Low Stock</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Customer</p>
                  <p className="text-sm text-muted-foreground">Sarah Johnson - Delivery order</p>
                </div>
                <Badge variant="outline">New</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order #ORD-1246</p>
                  <p className="text-sm text-muted-foreground">Medium Margherita + Wings - $24.50</p>
                </div>
                <Badge variant="secondary">Preparing</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent" asChild>
                <Link href="/pos">
                  <Pizza className="h-6 w-6" />
                  <span className="text-sm font-medium">New Order</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent" asChild>
                <Link href="/kitchen">
                  <ChefHat className="h-6 w-6" />
                  <span className="text-sm font-medium">Kitchen Display</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent" asChild>
                <Link href="/customers">
                  <Users className="h-6 w-6" />
                  <span className="text-sm font-medium">New Customer</span>
                </Link>
              </Button>
              {(user?.role === "manager" || user?.role === "admin") && (
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent"
                  asChild
                >
                  <Link href="/inventory">
                    <Package className="h-6 w-6" />
                    <span className="text-sm font-medium">Check Inventory</span>
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
