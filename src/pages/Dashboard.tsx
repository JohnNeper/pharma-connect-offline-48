import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { RecentActivities } from "@/components/dashboard/RecentActivities"
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  Users,
  DollarSign,
  Clock,
  Heart
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from 'react-i18next'

// Mock data
const dashboardStats = [
  {
    title: "Total Sales Today",
    value: "₣ 45,280",
    subtitle: "from 23 transactions",
    icon: DollarSign,
    trend: { value: 12, isPositive: true },
    variant: "success" as const
  },
  {
    title: "Stock Items",
    value: "1,247",
    subtitle: "medicines in inventory",
    icon: Package,
    trend: { value: 8, isPositive: true },
    variant: "default" as const
  },
  {
    title: "Low Stock Alerts",
    value: "12",
    subtitle: "items need restocking",
    icon: AlertTriangle,
    variant: "warning" as const
  },
  {
    title: "Active Prescriptions",
    value: "89",
    subtitle: "pending fulfillment",
    icon: Heart,
    trend: { value: 5, isPositive: false },
    variant: "default" as const
  }
]

const lowStockItems = [
  { name: "Paracetamol 500mg", current: 15, minimum: 50, supplier: "MediCorp" },
  { name: "Amoxicillin 250mg", current: 8, minimum: 30, supplier: "PharmaDist" },
  { name: "Insulin 100UI", current: 3, minimum: 20, supplier: "DiabetCare" },
  { name: "Aspirin 100mg", current: 22, minimum: 100, supplier: "MediCorp" }
]

export default function Dashboard() {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('welcome')}</h1>
          <p className="text-muted-foreground">{t('todayActivity')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="animate-pulse-soft">
            {t('systemHealthy')}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <RecentActivities />
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Low Stock Alerts
            </CardTitle>
            <Badge variant="warning">{lowStockItems.length} items</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-warning/5 rounded-lg border border-warning/20">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    Current: {item.current} | Minimum: {item.minimum} | Supplier: {item.supplier}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-warning">
                    {item.current} left
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round((item.current / item.minimum) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sales Target (Monthly)</span>
              <div className="text-right">
                <div className="text-sm font-medium">₣ 284K / ₣ 350K</div>
                <div className="text-xs text-success">81% achieved</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
              <div className="text-right">
                <div className="text-sm font-medium">4.8/5.0</div>
                <div className="text-xs text-success">+0.2 this month</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Prescription Accuracy</span>
              <div className="text-right">
                <div className="text-sm font-medium">99.2%</div>
                <div className="text-xs text-success">Excellent</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg. Service Time</span>
              <div className="text-right">
                <div className="text-sm font-medium">2.3 min</div>
                <div className="text-xs text-success">-0.5 min improved</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}