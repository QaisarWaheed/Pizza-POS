"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const salesData = [
  { date: "Jan 1", sales: 2400, orders: 24 },
  { date: "Jan 2", sales: 1398, orders: 18 },
  { date: "Jan 3", sales: 9800, orders: 42 },
  { date: "Jan 4", sales: 3908, orders: 28 },
  { date: "Jan 5", sales: 4800, orders: 35 },
  { date: "Jan 6", sales: 3800, orders: 31 },
  { date: "Jan 7", sales: 4300, orders: 38 },
  { date: "Jan 8", sales: 5200, orders: 45 },
  { date: "Jan 9", sales: 3100, orders: 22 },
  { date: "Jan 10", sales: 6800, orders: 52 },
  { date: "Jan 11", sales: 4900, orders: 41 },
  { date: "Jan 12", sales: 7200, orders: 58 },
  { date: "Jan 13", sales: 5800, orders: 47 },
  { date: "Jan 14", sales: 8100, orders: 63 },
]

const chartConfig = {
  sales: {
    label: "Sales ($)",
    color: "hsl(var(--chart-1))",
  },
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-2))",
  },
}

export function SalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Daily sales and order trends for the last 14 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis axisLine={false} tickLine={false} className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#salesGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
