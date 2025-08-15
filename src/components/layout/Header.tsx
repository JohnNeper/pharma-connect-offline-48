import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Wifi, WifiOff, LogOut, User, Search } from "lucide-react"
import { useState } from "react"
import { useTranslation } from 'react-i18next'
import { useAuth } from "@/contexts/AuthContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import GlobalSearch from "@/components/GlobalSearch"

export function Header() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  
  // Mock notification count
  const notificationCount = 3

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-foreground hover:bg-accent" />
        
        {/* Global Search */}
        <GlobalSearch />
        
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {isOnline ? (
            <div className="flex items-center gap-1 text-success">
              <Wifi className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">{t('online')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-warning">
              <WifiOff className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">{t('offline')}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
          {notificationCount > 0 && (
            <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
              {notificationCount}
            </Badge>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.role}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}