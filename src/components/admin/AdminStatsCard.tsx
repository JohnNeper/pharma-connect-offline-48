import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface AdminStatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  gradient: string
  textColor: string
  iconColor?: string
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function AdminStatsCard({ 
  title, 
  value, 
  icon: Icon, 
  gradient, 
  textColor, 
  iconColor,
  subtitle,
  trend 
}: AdminStatsCardProps) {
  return (
    <Card className={`${gradient} border-${textColor.split('-')[1]}/20 transition-all duration-300 hover:shadow-medium hover:scale-105`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
              {trend && (
                <span className={`text-sm font-medium ${
                  trend.isPositive ? 'text-success' : 'text-destructive'
                }`}>
                  {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-background/10 backdrop-blur-sm`}>
            <Icon className={`h-8 w-8 ${iconColor || textColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}