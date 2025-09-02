import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, CheckCircle, XCircle, Edit, Bell, Package, FileText, Smartphone, Eye } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useData } from "@/contexts/DataContext"

export default function ReservationsManagement() {
  const { mobileReservations, updateMobileReservation, prescriptions } = useData()

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
    updateMobileReservation(id, { status: newStatus as any })
  }

  const notifyCustomer = (customer: string, phone: string) => {
    // Simulate sending notification to mobile app
    alert(`📱 Notification envoyée via l'app mobile à ${customer} (${phone})`)
  }

  const getPrescriptionDetails = (prescriptionId?: string) => {
    if (!prescriptionId) return null
    return prescriptions.find(p => p.id === prescriptionId)
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {mobileReservations.filter(r => r.status === "pending").length}
                </p>
                <p className="text-sm text-orange-600">En attente</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {mobileReservations.filter(r => r.status === "ready").length}
                </p>
                <p className="text-sm text-blue-600">Prêtes</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950/20">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {mobileReservations.filter(r => r.status === "delivered").length}
                </p>
                <p className="text-sm text-green-600">Livrées</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-cyan-50 dark:bg-cyan-950/20">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-cyan-600">
                  {mobileReservations.filter(r => r.prescriptionFromApp).length}
                </p>
                <p className="text-sm text-cyan-600">Avec ordonnance</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-950/20">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  ₣ {mobileReservations.reduce((sum, r) => sum + r.total, 0).toLocaleString()}
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
              <TableHead>Source</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date commande</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mobileReservations.map((reservation) => {
              const prescription = getPrescriptionDetails(reservation.prescriptionId)
              return (
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-primary" />
                      <span className="text-xs">App Mobile</span>
                      {reservation.prescriptionFromApp && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <FileText className="w-4 h-4 text-blue-600" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Ordonnance jointe - {reservation.customer}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {prescription && (
                                <div className="bg-muted/50 rounded-lg p-4">
                                  <h4 className="font-medium mb-2">Détails de l'ordonnance</h4>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">Médecin: </span>
                                      <span className="font-medium">{prescription.doctorName}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Date: </span>
                                      <span>{prescription.date}</span>
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <h5 className="font-medium mb-1">Médicaments prescrits:</h5>
                                    {prescription.medicines.map((med, idx) => (
                                      <div key={idx} className="text-sm text-muted-foreground">
                                        • {med.name} - {med.instructions}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium text-blue-600">Document joint</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {reservation.prescriptionAttachment}
                                </p>
                                <Button variant="outline" size="sm" className="mt-2">
                                  <Eye className="w-4 h-4 mr-2" />
                                  Voir l'ordonnance
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
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
                        onClick={() => notifyCustomer(reservation.customer, reservation.phone)}
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
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}