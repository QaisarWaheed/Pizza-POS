"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, User, Plus, Star } from "lucide-react"
import { mockCustomers } from "@/lib/customer-data"
import type { Customer } from "@/lib/customer-types"

interface CustomerSelectorProps {
  selectedCustomer?: Customer
  onSelectCustomer: (customer: Customer | undefined) => void
}

export function CustomerSelector({ selectedCustomer, onSelectCustomer }: CustomerSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = mockCustomers.filter(
        (customer) =>
          customer.isActive &&
          (customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone?.includes(searchTerm)),
      )
      setFilteredCustomers(filtered.slice(0, 10))
    } else {
      setFilteredCustomers(mockCustomers.slice(0, 10))
    }
  }, [searchTerm])

  const handleSelectCustomer = (customer: Customer) => {
    onSelectCustomer(customer)
    setIsOpen(false)
    setSearchTerm("")
  }

  return (
    <div className="flex items-center gap-2">
      {selectedCustomer ? (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <User className="h-3 w-3" />
            {selectedCustomer.firstName} {selectedCustomer.lastName}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Star className="h-3 w-3" />
            {selectedCustomer.loyaltyPoints} pts
          </Badge>
          <Button variant="ghost" size="sm" onClick={() => onSelectCustomer(undefined)}>
            Remove
          </Button>
        </div>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Select Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Select Customer</DialogTitle>
              <DialogDescription>Choose a customer for this transaction</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredCustomers.map((customer) => (
                  <Card
                    key={customer.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">
                            {customer.firstName} {customer.lastName}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            {customer.email && <span className="text-sm text-muted-foreground">{customer.email}</span>}
                            {customer.phone && <span className="text-sm text-muted-foreground">{customer.phone}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="gap-1">
                            <Star className="h-3 w-3" />
                            {customer.loyaltyPoints}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            ${customer.totalSpent.toFixed(2)} spent
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsOpen(false)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Customer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
