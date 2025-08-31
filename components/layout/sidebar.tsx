"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Receipt,
  Settings,
  LogOut,
  Store,
  BarChart3,
  Indent as Inventory,
  ChefHat,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { hasPermission } from "@/lib/auth"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const navigationItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      requiredRole: "cashier" as const,
    },
    {
      title: "POS",
      icon: ShoppingCart,
      href: "/pos",
      requiredRole: "cashier" as const,
    },
    {
      title: "Kitchen Display",
      icon: ChefHat,
      href: "/kitchen",
      requiredRole: "cashier" as const,
    },
    {
      title: "Products",
      icon: Package,
      href: "/products",
      requiredRole: "cashier" as const,
    },
    {
      title: "Inventory",
      icon: Inventory,
      href: "/inventory",
      requiredRole: "manager" as const,
    },
    {
      title: "Customers",
      icon: Users,
      href: "/customers",
      requiredRole: "cashier" as const,
    },
    {
      title: "Sales",
      icon: Receipt,
      href: "/sales",
      requiredRole: "cashier" as const,
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/analytics",
      requiredRole: "manager" as const,
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
      requiredRole: "cashier" as const,
    },
  ]

  const filteredItems = navigationItems.filter((item) => user && hasPermission(user.role, item.requiredRole))

  return (
    <div className={cn("flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border", className)}>
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-sidebar-accent rounded-lg">
            <Store className="h-6 w-6 text-sidebar-accent-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">Tony's Pizza</h1>
            <p className="text-xs text-sidebar-foreground/60">{user?.role.toUpperCase()}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Button
                key={item.href}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              </Button>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 bg-sidebar-accent rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-sidebar-accent-foreground">{user?.name.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
