import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "success" | "warning" | "destructive"
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  variant = "default" 
}: StatsCardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "border-success/20 bg-success/5"
      case "warning":
        return "border-warning/20 bg-warning/5"
      case "destructive":
        return "border-destructive/20 bg-destructive/5"
      default:
        return "border-border bg-card"
    }
  }

  const getIconClasses = () => {
    switch (variant) {
      case "success":
        return "text-success bg-success/10"
      case "warning":
        return "text-warning bg-warning/10"
      case "destructive":
        return "text-destructive bg-destructive/10"
      default:
        return "text-primary bg-primary/10"
    }
  }

  return (
    <Card className={`${getVariantClasses()} shadow-soft hover:shadow-medium transition-all duration-200`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getIconClasses()}`}>
          <Icon className="w-4 h-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center justify-between mt-1">
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <Badge 
              variant={trend.isPositive ? "success" : "destructive"}
              className="text-xs"
            >
              {trend.isPositive ? "+" : ""}{trend.value}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}