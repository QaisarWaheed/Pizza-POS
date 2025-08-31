"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

const revenueData = [
  { name: "Beverages", value: 4500, color: "hsl(var(--chart-1))" },
  { name: "Food", value: 3200, color: "hsl(var(--chart-2))" },
  { name: "Pastries", value: 2800, color: "hsl(var(--chart-3))" },
  { name: "Snacks", value: 1900, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 1200, color: "hsl(var(--chart-5))" },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
  },
}

export function RevenueBreakdown() {
  const total = revenueData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Category</CardTitle>
        <CardDescription>Breakdown of sales by product category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <ChartContainer config={chartConfig} className="h-[200px] w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex-1 ml-6">
            <div className="space-y-3">
              {revenueData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">${item.value.toLocaleString()}</span>
                    <div className="text-xs text-muted-foreground">{((item.value / total) * 100).toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
