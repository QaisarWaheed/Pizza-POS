export interface StoreSettings {
  storeName: string
  storeAddress: string
  storePhone: string
  storeEmail: string
  currency: string
  taxRate: number
  receiptFooter: string
  logoUrl?: string
}

export interface SystemSettings {
  theme: "light" | "dark" | "system"
  language: string
  timezone: string
  dateFormat: string
  numberFormat: string
  autoBackup: boolean
  backupFrequency: "daily" | "weekly" | "monthly"
}

export interface UserPermissions {
  canManageUsers: boolean
  canManageProducts: boolean
  canManageInventory: boolean
  canViewAnalytics: boolean
  canManageSettings: boolean
  canProcessRefunds: boolean
  canApplyDiscounts: boolean
  canManageCustomers: boolean
}

export const defaultPermissions: Record<string, UserPermissions> = {
  admin: {
    canManageUsers: true,
    canManageProducts: true,
    canManageInventory: true,
    canViewAnalytics: true,
    canManageSettings: true,
    canProcessRefunds: true,
    canApplyDiscounts: true,
    canManageCustomers: true,
  },
  manager: {
    canManageUsers: false,
    canManageProducts: true,
    canManageInventory: true,
    canViewAnalytics: true,
    canManageSettings: false,
    canProcessRefunds: true,
    canApplyDiscounts: true,
    canManageCustomers: true,
  },
  cashier: {
    canManageUsers: false,
    canManageProducts: false,
    canManageInventory: false,
    canViewAnalytics: false,
    canManageSettings: false,
    canProcessRefunds: false,
    canApplyDiscounts: true,
    canManageCustomers: true,
  },
}
