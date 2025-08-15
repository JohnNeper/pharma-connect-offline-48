import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ShoppingCart, FileText, Package, Scan } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { AddMedicineModal } from "@/components/modals/AddMedicineModal"
import { AddPrescriptionModal } from "@/components/modals/AddPrescriptionModal"

export function QuickActions() {
  const navigate = useNavigate()
  const [showAddMedicine, setShowAddMedicine] = useState(false)
  const [showAddPrescription, setShowAddPrescription] = useState(false)

  const quickActions = [
    {
      title: "New Sale",
      description: "Process a new transaction",
      icon: ShoppingCart,
      variant: "gradient" as const,
      action: () => navigate("/sales")
    },
    {
      title: "Add Medicine",
      description: "Add new inventory item",
      icon: Plus,
      variant: "success" as const,
      action: () => setShowAddMedicine(true)
    },
    {
      title: "Scan Barcode",
      description: "Quick product lookup",
      icon: Scan,
      variant: "medical" as const,
      action: () => navigate("/stock")
    },
    {
      title: "New Prescription",
      description: "Create prescription record",
      icon: FileText,
      variant: "secondary" as const,
      action: () => setShowAddPrescription(true)
    },
    {
      title: "Stock Alert",
      description: "Check low stock items",
      icon: Package,
      variant: "warning" as const,
      action: () => navigate("/stock")
    }
  ]
  return (
    <>
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className="w-full justify-start h-auto p-4"
              onClick={action.action}
            >
              <action.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-sm opacity-70">{action.description}</div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      <AddMedicineModal 
        open={showAddMedicine} 
        onOpenChange={setShowAddMedicine} 
      />
      
      <AddPrescriptionModal 
        open={showAddPrescription} 
        onOpenChange={setShowAddPrescription} 
      />
    </>
  )
}