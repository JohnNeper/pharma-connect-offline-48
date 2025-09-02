import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Plus, FileText, User, Calendar, Heart, Smartphone, Eye } from "lucide-react"
import { useTranslation } from 'react-i18next'
import { AddPrescriptionModal } from '@/components/modals/AddPrescriptionModal'
import { useState } from 'react'
import { useData } from '@/contexts/DataContext'

export default function Prescriptions() {
  const { t } = useTranslation()
  const { prescriptions, mobileReservations } = useData()
  const [showAddPrescription, setShowAddPrescription] = useState(false)

  // Combine prescriptions with mobile app origin info
  const enrichedPrescriptions = prescriptions.map(prescription => {
    const relatedReservation = mobileReservations.find(res => res.prescriptionId === prescription.id)
    return {
      ...prescription,
      fromMobileApp: !!relatedReservation,
      reservationId: relatedReservation?.id,
      patientAge: 35, // Mock age since not in data structure
      total: `₣ ${(prescription.medicines.length * 25).toFixed(2)}` // Mock calculation
    }
  })

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success' as const
      case 'pending':
        return 'warning' as const
      case 'completed':
        return 'default' as const
      default:
        return 'default' as const
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('prescriptionManagement')}</h1>
          <p className="text-muted-foreground">Gérez les ordonnances et profils patients</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddPrescription(true)}>
          <Plus className="w-4 h-4" />
          Nouvelle Ordonnance
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par patient, médecin ou n° ordonnance..."
                className="w-full pl-10"
              />
            </div>
            <Button variant="outline">Recherche avancée</Button>
          </div>
        </CardContent>
      </Card>

      {/* Digital Prescriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {t('digitalPrescriptions')}
            <Badge variant="outline" className="ml-auto">
              {enrichedPrescriptions.filter(p => p.fromMobileApp).length} de l'app mobile
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enrichedPrescriptions.map((prescription) => (
              <div key={prescription.id} className="border rounded-lg p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {prescription.patientName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{prescription.patientName}</h3>
                        {prescription.fromMobileApp && (
                          <div className="flex items-center gap-1 text-xs text-primary">
                            <Smartphone className="w-3 h-3" />
                            <span>App Mobile</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {prescription.patientAge} ans • {prescription.doctorName}
                      </p>
                      {prescription.patientPhone && (
                        <p className="text-xs text-muted-foreground">{prescription.patientPhone}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusVariant(prescription.status)}>
                      {prescription.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{prescription.id}</span>
                  </div>
                </div>

                {/* Mobile App Info */}
                {prescription.fromMobileApp && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">
                          Reçu via l'application mobile
                        </span>
                      </div>
                      {prescription.reservationId && (
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Voir réservation ({prescription.reservationId})
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Medicines */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <h4 className="font-medium mb-2">Médicaments prescrits:</h4>
                  <div className="space-y-2">
                    {prescription.medicines.map((medicine, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{medicine.name}</span>
                        <span className="text-muted-foreground">
                          {medicine.instructions} • Quantité: {medicine.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {prescription.date}
                    </span>
                    <span className="font-medium text-foreground">{prescription.total}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Voir détails</Button>
                    <Button variant="outline" size="sm">Imprimer</Button>
                    {prescription.status === 'pending' && (
                      <Button size="sm">Traiter</Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ordonnances actives</p>
                <p className="text-2xl font-bold">{enrichedPrescriptions.filter(p => p.status === 'pending').length}</p>
              </div>
              <Heart className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Via app mobile</p>
                <p className="text-2xl font-bold">{enrichedPrescriptions.filter(p => p.fromMobileApp).length}</p>
              </div>
              <Smartphone className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold">{enrichedPrescriptions.filter(p => p.status === 'pending').length}</p>
              </div>
              <FileText className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Patients uniques</p>
                <p className="text-2xl font-bold">{new Set(enrichedPrescriptions.map(p => p.patientName)).size}</p>
              </div>
              <User className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <AddPrescriptionModal 
        open={showAddPrescription} 
        onOpenChange={setShowAddPrescription} 
      />
    </div>
  )
}