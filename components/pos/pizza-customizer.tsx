"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { pizzaSizes, pizzaToppings } from "@/lib/mock-data"
import type { Product, PizzaCustomization } from "@/lib/types"
import { X, Plus } from "lucide-react"

interface PizzaCustomizerProps {
  product: Product
  open: boolean
  onClose: () => void
  onAddToCart: (product: Product, customization: PizzaCustomization, finalPrice: number) => void
}

const crustOptions = [
  { id: "thin", name: "Thin Crust", price: 0 },
  { id: "thick", name: "Thick Crust", price: 1.5 },
  { id: "stuffed", name: "Stuffed Crust", price: 3.0 },
  { id: "gluten-free", name: "Gluten-Free", price: 2.5 },
]

export function PizzaCustomizer({ product, open, onClose, onAddToCart }: PizzaCustomizerProps) {
  const [selectedSize, setSelectedSize] = useState(pizzaSizes[1].id) // Default to medium
  const [selectedCrust, setSelectedCrust] = useState("thin")
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [specialInstructions, setSpecialInstructions] = useState("")

  if (!open) return null

  const selectedSizeData = pizzaSizes.find((s) => s.id === selectedSize)!
  const selectedCrustData = crustOptions.find((c) => c.id === selectedCrust)!

  const toppingsPrice = selectedToppings.reduce((sum, toppingId) => {
    const topping = pizzaToppings.find((t) => t.id === toppingId)
    return sum + (topping?.price || 0)
  }, 0)

  const finalPrice = selectedSizeData.basePrice + selectedCrustData.price + toppingsPrice

  const handleToppingToggle = (toppingId: string) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingId) ? prev.filter((id) => id !== toppingId) : [...prev, toppingId],
    )
  }

  const handleAddToCart = () => {
    const customization: PizzaCustomization = {
      size: selectedSize,
      crust: selectedCrust,
      toppings: selectedToppings,
      specialInstructions: specialInstructions || undefined,
    }

    onAddToCart(product, customization, finalPrice)
    onClose()

    // Reset form
    setSelectedSize(pizzaSizes[1].id)
    setSelectedCrust("thin")
    setSelectedToppings([])
    setSpecialInstructions("")
  }

  const toppingsByCategory = pizzaToppings.reduce(
    (acc, topping) => {
      if (!acc[topping.category]) acc[topping.category] = []
      acc[topping.category].push(topping)
      return acc
    },
    {} as Record<string, typeof pizzaToppings>,
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Customize {product.name}</CardTitle>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Size Selection */}
          <div>
            <Label className="text-lg font-semibold">Size</Label>
            <RadioGroup
              value={selectedSize}
              onValueChange={setSelectedSize}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3"
            >
              {pizzaSizes.map((size) => (
                <div key={size.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={size.id} id={size.id} />
                  <Label htmlFor={size.id} className="flex flex-col cursor-pointer">
                    <span className="font-medium">{size.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {size.diameter}" - ${size.basePrice.toFixed(2)}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Crust Selection */}
          <div>
            <Label className="text-lg font-semibold">Crust</Label>
            <RadioGroup value={selectedCrust} onValueChange={setSelectedCrust} className="grid grid-cols-2 gap-4 mt-3">
              {crustOptions.map((crust) => (
                <div key={crust.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={crust.id} id={crust.id} />
                  <Label htmlFor={crust.id} className="flex flex-col cursor-pointer">
                    <span className="font-medium">{crust.name}</span>
                    {crust.price > 0 && (
                      <span className="text-sm text-muted-foreground">+${crust.price.toFixed(2)}</span>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Toppings Selection */}
          <div>
            <Label className="text-lg font-semibold">Toppings</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
              {Object.entries(toppingsByCategory).map(([category, toppings]) => (
                <div key={category}>
                  <h4 className="font-medium capitalize mb-3 text-primary">{category}s</h4>
                  <div className="space-y-2">
                    {toppings.map((topping) => (
                      <div key={topping.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={topping.id}
                          checked={selectedToppings.includes(topping.id)}
                          onCheckedChange={() => handleToppingToggle(topping.id)}
                        />
                        <Label htmlFor={topping.id} className="flex justify-between w-full cursor-pointer">
                          <span>{topping.name}</span>
                          <span className="text-sm text-muted-foreground">+${topping.price.toFixed(2)}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <Label htmlFor="instructions" className="text-lg font-semibold">
              Special Instructions
            </Label>
            <Textarea
              id="instructions"
              placeholder="Any special requests or modifications..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Selected Toppings Summary */}
          {selectedToppings.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Selected Toppings:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedToppings.map((toppingId) => {
                  const topping = pizzaToppings.find((t) => t.id === toppingId)!
                  return (
                    <Badge key={toppingId} variant="secondary" className="text-xs">
                      {topping.name} (+${topping.price.toFixed(2)})
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}

          {/* Price Summary and Add Button */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span>Base Price ({selectedSizeData.name}):</span>
              <span>${selectedSizeData.basePrice.toFixed(2)}</span>
            </div>
            {selectedCrustData.price > 0 && (
              <div className="flex justify-between text-sm">
                <span>Crust ({selectedCrustData.name}):</span>
                <span>+${selectedCrustData.price.toFixed(2)}</span>
              </div>
            )}
            {toppingsPrice > 0 && (
              <div className="flex justify-between text-sm">
                <span>Toppings ({selectedToppings.length}):</span>
                <span>+${toppingsPrice.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>${finalPrice.toFixed(2)}</span>
            </div>

            <Button onClick={handleAddToCart} className="w-full h-12 text-lg">
              <Plus className="h-5 w-5 mr-2" />
              Add to Cart - ${finalPrice.toFixed(2)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
