import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Users,
  BarChart3,
  Settings,
  Pill,
  Wifi,
  WifiOff,
  Heart,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from 'react-i18next'
import pharmaLogo from "@/assets/pharma-logo.png"

// Mock user role - in real app this would come from auth context
const userRole = "Administrator"

const useMenuItems = (t: any) => ({
  Administrator: [
    { title: t('dashboard'), url: "/", icon: LayoutDashboard },
    { title: t('stock'), url: "/stock", icon: Package },
    { title: t('sales'), url: "/sales", icon: ShoppingCart },
    { title: t('prescriptions'), url: "/prescriptions", icon: Heart },
    { title: t('orders'), url: "/orders", icon: Pill },
    { title: "Réservations", url: "/reservations", icon: Wifi },
    { title: t('patients'), url: "/patients", icon: Users },
    { title: t('billing'), url: "/billing", icon: FileText },
    { title: "Promotions", url: "/promotions", icon: Pill },
    { title: t('reports'), url: "/reports", icon: BarChart3 },
    { title: t('settings'), url: "/settings", icon: Settings },
  ],
  Pharmacist: [
    { title: t('dashboard'), url: "/", icon: LayoutDashboard },
    { title: t('stock'), url: "/stock", icon: Package },
    { title: t('sales'), url: "/sales", icon: ShoppingCart },
    { title: t('prescriptions'), url: "/prescriptions", icon: Heart },
    { title: t('orders'), url: "/orders", icon: Pill },
    { title: "Réservations", url: "/reservations", icon: Wifi },
    { title: t('patients'), url: "/patients", icon: Users },
    { title: t('billing'), url: "/billing", icon: FileText },
    { title: "Promotions", url: "/promotions", icon: Pill },
    { title: t('reports'), url: "/reports", icon: BarChart3 },
  ],
  Cashier: [
    { title: t('dashboard'), url: "/", icon: LayoutDashboard },
    { title: t('sales'), url: "/sales", icon: ShoppingCart },
    { title: t('stock'), url: "/stock", icon: Package },
    { title: "Réservations", url: "/reservations", icon: Wifi },
    { title: t('billing'), url: "/billing", icon: FileText },
  ],
  "Stock Manager": [
    { title: t('dashboard'), url: "/", icon: LayoutDashboard },
    { title: t('stock'), url: "/stock", icon: Package },
    { title: t('orders'), url: "/orders", icon: Pill },
    { title: t('reports'), url: "/reports", icon: BarChart3 },
  ],
})

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const { t } = useTranslation()
  
  const collapsed = state === "collapsed"

  // Mock connection status toggle for demo
  const toggleConnection = () => setIsOnline(!isOnline)

  const menuItems = useMenuItems(t)
  const items = menuItems[userRole as keyof typeof menuItems] || menuItems.Administrator

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-soft" 
      : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-primary">
        {/* Logo and Brand */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden shadow-medium bg-white flex items-center justify-center">
              <img src={pharmaLogo} alt="PharmaLink" className="w-8 h-8 object-contain" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">PharmaLink</h1>
                <p className="text-xs text-sidebar-foreground/70">Healthcare Management</p>
              </div>
            )}
          </div>
        </div>

        {/* Connection Status */}
        <div className="p-4">
          <div 
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
              isOnline ? 'bg-success/20' : 'bg-warning/20'
            }`}
            onClick={toggleConnection}
          >
            {isOnline ? (
              <Wifi className="w-4 h-4 text-success" />
            ) : (
              <WifiOff className="w-4 h-4 text-warning" />
            )}
            {!collapsed && (
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${isOnline ? 'text-success' : 'text-warning'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                  {!isOnline && (
                    <Badge variant="outline" className="text-xs">
                      Sync Pending
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-sidebar-foreground/60">
                  {isOnline ? 'All features available' : 'Limited features'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">
            {collapsed ? userRole.charAt(0) : userRole}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Info at Bottom */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-sidebar-accent-foreground">
                  DR
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-sidebar-foreground">Dr. Amina</p>
                <p className="text-xs text-sidebar-foreground/60">{userRole}</p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}