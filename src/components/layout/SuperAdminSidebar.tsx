import { NavLink, useLocation } from "react-router-dom";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Settings, 
  Shield, 
  Database,
  BarChart3,
  Globe,
  CreditCard,
  Bell,
  FileText,
  Activity
} from "lucide-react";
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
} from "@/components/ui/sidebar";

const superAdminMenuItems = [
  {
    title: "Vue d'ensemble",
    items: [
      { title: "Tableau de bord", url: "/super-admin", icon: BarChart3 },
      { title: "Activité système", url: "/super-admin/activity", icon: Activity },
    ]
  },
  {
    title: "Gestion des pharmacies",
    items: [
      { title: "Toutes les pharmacies", url: "/super-admin/pharmacies", icon: Building2 },
      { title: "Demandes d'inscription", url: "/super-admin/pharmacy-requests", icon: FileText },
      { title: "Abonnements", url: "/super-admin/subscriptions", icon: CreditCard },
    ]
  },
  {
    title: "Utilisateurs & Sécurité",
    items: [
      { title: "Utilisateurs système", url: "/super-admin/users", icon: Users },
      { title: "Sécurité & Audit", url: "/super-admin/security", icon: Shield },
      { title: "Notifications", url: "/super-admin/notifications", icon: Bell },
    ]
  },
  {
    title: "Analytics & Rapports",
    items: [
      { title: "Analytics globales", url: "/super-admin/analytics", icon: TrendingUp },
      { title: "Rapports financiers", url: "/super-admin/financial-reports", icon: BarChart3 },
      { title: "Performance système", url: "/super-admin/performance", icon: Database },
    ]
  },
  {
    title: "Configuration",
    items: [
      { title: "Configuration globale", url: "/super-admin/global-settings", icon: Settings },
      { title: "Gestion régionale", url: "/super-admin/regions", icon: Globe },
    ]
  }
];

export function SuperAdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const collapsed = state === "collapsed";
  
  const isActive = (path: string) => currentPath === path || (path === "/super-admin" && currentPath === "/");
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-72"} collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent className="bg-card border-r">
        <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary to-primary-glow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-background/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-glow">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-bold text-base text-primary-foreground">PharmaLink Admin</h2>
                <p className="text-xs text-primary-foreground/80">Système de Gestion Globale</p>
              </div>
            )}
          </div>
        </div>

        {superAdminMenuItems.map((section, index) => (
          <SidebarGroup key={index}>
            {!collapsed && <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">{section.title}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavCls}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}