import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  id: string
  type: "sale" | "stock" | "prescription" | "order"
  title: string
  description: string
  user: string
  timestamp: Date
  amount?: number
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "sale",
    title: "Sale Transaction",
    description: "Paracetamol 500mg - 20 tablets",
    user: "Dr. Amina",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    amount: 150
  },
  {
    id: "2",
    type: "stock",
    title: "Stock Updated",
    description: "Amoxicillin 250mg - Added 100 units",
    user: "Stock Manager",
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
  },
  {
    id: "3",
    type: "prescription",
    title: "New Prescription",
    description: "Patient: Marie Dubois - Hypertension medication",
    user: "Dr. Amina",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "4",
    type: "order",
    title: "Order Placed",
    description: "Supplier: MediCorp - 50 items",
    user: "Pharmacist",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    amount: 5200
  }
]

const getActivityColor = (type: Activity["type"]) => {
  switch (type) {
    case "sale":
      return "success"
    case "stock":
      return "default"
    case "prescription":
      return "secondary"
    case "order":
      return "outline"
    default:
      return "default"
  }
}

export function RecentActivities() {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {activity.user.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-medium truncate">{activity.title}</h4>
                <Badge variant={getActivityColor(activity.type)} className="text-xs">
                  {activity.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  by {activity.user} • {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </span>
                {activity.amount && (
                  <span className="text-sm font-medium text-success">
                    {activity.amount} FCFA
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}