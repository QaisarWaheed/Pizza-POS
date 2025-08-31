"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { StoreSettingsComponent } from "@/components/settings/store-settings"
import { UserManagement } from "@/components/settings/user-management"
import { SystemSettingsComponent } from "@/components/settings/system-settings"
import type { StoreSettings, SystemSettings } from "@/lib/settings-types"
import { useAuth } from "@/hooks/use-auth"
import { Store, Users, Settings, Shield, Pizza } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()

  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: "Tony's Pizza Palace",
    storeAddress: "123 Pizza Street, Little Italy, NY 10013",
    storePhone: "+1-555-PIZZA-1",
    storeEmail: "orders@tonyspizza.com",
    currency: "USD",
    taxRate: 8.5,
    receiptFooter: "Thank you for choosing Tony's Pizza!\nFresh ingredients, authentic taste!\nCall us: +1-555-PIZZA-1",
  })

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    theme: "light",
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    numberFormat: "1,234.56",
    autoBackup: true,
    backupFrequency: "daily",
  })

  const handleSaveStoreSettings = (settings: StoreSettings) => {
    setStoreSettings(settings)
    // In a real app, this would save to a backend
    console.log("Store settings saved:", settings)
  }

  const handleSaveSystemSettings = (settings: SystemSettings) => {
    setSystemSettings(settings)
    // In a real app, this would save to a backend
    console.log("System settings saved:", settings)
  }

  const isAdmin = user?.role === "admin"

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Pizza className="h-8 w-8 text-primary" />
            Pizza Shop Settings
          </h1>
          <p className="text-muted-foreground">Configure your pizza shop system and manage preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm">
            {user?.role.toUpperCase()}
          </Badge>
          {isAdmin && (
            <Badge variant="outline" className="gap-1">
              <Shield className="h-3 w-3" />
              Admin Access
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="store" className="gap-2">
            <Store className="h-4 w-4" />
            Store
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          )}
          <TabsTrigger value="system" className="gap-2">
            <Settings className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6">
          <StoreSettingsComponent settings={storeSettings} onSave={handleSaveStoreSettings} />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>
        )}

        <TabsContent value="system" className="space-y-6">
          <SystemSettingsComponent settings={systemSettings} onSave={handleSaveSystemSettings} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
