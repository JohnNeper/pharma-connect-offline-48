import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, CheckCircle, XCircle, Edit, Bell, Package } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface Reservation {
  id: string
  customer: string
  phone: string
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
  status: "pending" | "ready" | "delivered" | "cancelled"
  orderDate: string
  pharmacy: string
  notes?: string
}

const mockReservations: Reservation[] = [
  {
    id: "RES-001",
    customer: "Sophie Durand",
    phone: "+33 6 12 34 56 78",
    items: [
      { name: "Paracetamol 500mg", quantity: 2, price: 300 },
      { name: "Vitamine C", quantity: 1, price: 200 }
    ],
    total: 500,
    status: "pending",
    orderDate: "2024-01-15 10:30",
    pharmacy: "Pharmacie Centrale",
    notes: "Livraison urgente demandée"
  },
  {
    id: "RES-002",
    customer: "Marc Leblanc",
    phone: "+33 6 98 76 54 32",
    items: [
      { name: "Amoxicilline 250mg", quantity: 1, price: 300 }
    ],
    total: 300,
    status: "ready",
    orderDate: "2024-01-14 16:45",
    pharmacy: "Pharmacie Nord"
  },
  {
    id: "RES-003",
    customer: "Claire Martin",
    phone: "+33 6 55 44 33 22",
    items: [
      { name: "Aspirin 100mg", quantity: 3, price: 360 },
      { name: "Ibuprofen 400mg", quantity: 2, price: 360 }
    ],
    total: 720,
    status: "delivered",
    orderDate: "2024-01-14 09:15",
    pharmacy: "Pharmacie Centrale"
  }
]

export default function ReservationsManagement() {
  const [reservations, setReservations] = useState(mockReservations)

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending": return "warning"
      case "ready": return "default"
      case "delivered": return "success"
      case "cancelled": return "destructive"
      default: return "default"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "En attente"
      case "ready": return "Prêt"
      case "delivered": return "Livré"
      case "cancelled": return "Annulé"
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />
      case "ready": return <Package className="w-4 h-4" />
      case "delivered": return <CheckCircle className="w-4 h-4" />
      case "cancelled": return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const updateReservationStatus = (id: string, newStatus: string) => {
    setReservations(reservations.map(res => 
      res.id === id ? { ...res, status: newStatus as any } : res
    ))
  }

  const notifyCustomer = (reservation: Reservation) => {
    // Simulate sending notification
    alert(`Notification envoyée à ${reservation.customer} (${reservation.phone})`)
  }

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Gestion des réservations
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {reservations.filter(r => r.status === "pending").length}
                </p>
                <p className="text-sm text-orange-600">En attente</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {reservations.filter(r => r.status === "ready").length}
                </p>
                <p className="text-sm text-blue-600">Prêtes</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950/20">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {reservations.filter(r => r.status === "delivered").length}
                </p>
                <p className="text-sm text-green-600">Livrées</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-950/20">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  ₣ {reservations.reduce((sum, r) => sum + r.total, 0).toLocaleString()}
                </p>
                <p className="text-sm text-purple-600">Total</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reservations Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Réservation</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Articles</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date commande</TableHead>
              <TableHead>Pharmacie</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">{reservation.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{reservation.customer}</p>
                    <p className="text-sm text-muted-foreground">{reservation.phone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {reservation.items.map((item, index) => (
                      <div key={index} className="text-sm">
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="font-medium">₣ {reservation.total.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(reservation.status) as any} className="gap-1">
                    {getStatusIcon(reservation.status)}
                    {getStatusLabel(reservation.status)}
                  </Badge>
                </TableCell>
                <TableCell>{reservation.orderDate}</TableCell>
                <TableCell className="text-sm">{reservation.pharmacy}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {reservation.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateReservationStatus(reservation.id, "ready")}
                      >
                        Prêt
                      </Button>
                    )}
                    
                    {reservation.status === "ready" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateReservationStatus(reservation.id, "delivered")}
                      >
                        Livré
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => notifyCustomer(reservation)}
                    >
                      <Bell className="w-4 h-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Annuler la réservation</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir annuler la réservation {reservation.id} ?
                            Cette action ne peut pas être annulée.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Retour</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => updateReservationStatus(reservation.id, "cancelled")}
                          >
                            Confirmer l'annulation
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}