export type UserRole = "admin" | "manager" | "cashier"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  lastLogin?: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Mock authentication - replace with real auth service
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@pos.com",
    name: "Admin User",
    role: "admin",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
  {
    id: "2",
    email: "manager@pos.com",
    name: "Store Manager",
    role: "manager",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
  {
    id: "3",
    email: "cashier@pos.com",
    name: "Cashier User",
    role: "cashier",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
]

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Mock authentication - replace with real API call
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

  const user = mockUsers.find((u) => u.email === email && u.isActive)
  if (user && password === "password123") {
    return { ...user, lastLogin: new Date() }
  }
  return null
}

export const hasPermission = (userRole: UserRole, requiredRole: UserRole): boolean => {
  const roleHierarchy = { admin: 3, manager: 2, cashier: 1 }
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}
