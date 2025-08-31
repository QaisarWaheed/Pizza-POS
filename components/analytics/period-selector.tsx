"use client"

import { Button } from "@/components/ui/button"
import { Calendar, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"

type Period = "today" | "week" | "month" | "quarter" | "year"

interface PeriodSelectorProps {
  onPeriodChange?: (period: Period) => void
}

export function PeriodSelector({ onPeriodChange }: PeriodSelectorProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("month")

  const periods = [
    { value: "today" as const, label: "Today" },
    { value: "week" as const, label: "This Week" },
    { value: "month" as const, label: "This Month" },
    { value: "quarter" as const, label: "This Quarter" },
    { value: "year" as const, label: "This Year" },
  ]

  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period)
    onPeriodChange?.(period)
  }

  const selectedLabel = periods.find((p) => p.value === selectedPeriod)?.label

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Calendar className="h-4 w-4" />
          {selectedLabel}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {periods.map((period) => (
          <DropdownMenuItem key={period.value} onClick={() => handlePeriodChange(period.value)}>
            {period.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
