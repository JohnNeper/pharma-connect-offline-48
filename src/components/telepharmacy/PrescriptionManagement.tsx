import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  FileText, 
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Download,
  Send,
  Printer,
  User,
  Calendar
} from "lucide-react"
import { useTelepharmacy, DigitalPrescription } from "@/contexts/TelepharmacyContext"
import { useData } from "@/contexts/DataContext"

export function PrescriptionManagement() {
  const { 
    digitalPrescriptions, 
    createPrescription, 
    validatePrescription, 
    dispensePrescription,
    waitingPatients
  } = useTelepharmacy()
  
  const { medicines } = useData()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState<DigitalPrescription | null>(null)
  
  // État pour nouvelle prescription
  const [newPrescription, setNewPrescription] = useState({
    patientId: '',
    medicines: [{ medicineId: '', quantity: 1, instructions: '', duration: '' }],
    notes: ''
  })

  // Filtrage des prescriptions
  const filteredPrescriptions = digitalPrescriptions.filter(prescription => {
    const patient = waitingPatients.find(p => p.id === prescription.patientId)
    const matchesSearch = patient?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prescription.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Tri par date
  const sortedPrescriptions = filteredPrescriptions.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground'
      case 'validated': return 'bg-success text-success-foreground'
      case 'dispensed': return 'bg-info text-info-foreground'
      case 'cancelled': return 'bg-destructive text-destructive-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente'
      case 'validated': return 'Validée'
      case 'dispensed': return 'Délivrée'
      case 'cancelled': return 'Annulée'
      default: return status
    }
  }

  const addMedicineToNewPrescription = () => {
    setNewPrescription(prev => ({
      ...prev,
      medicines: [...prev.medicines, { medicineId: '', quantity: 1, instructions: '', duration: '' }]
    }))
  }

  const removeMedicineFromNewPrescription = (index: number) => {
    setNewPrescription(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }))
  }

  const updateMedicineInNewPrescription = (index: number, field: string, value: any) => {
    setNewPrescription(prev => ({
      ...prev,
      medicines: prev.medicines.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }))
  }

  const handleCreatePrescription = () => {
    if (newPrescription.patientId && newPrescription.medicines.some(m => m.medicineId)) {
      const prescriptionData = {
        ...newPrescription,
        pharmacistId: 'PHARM-001',
        date: new Date().toISOString().split('T')[0],
        status: 'pending' as const,
        medicines: newPrescription.medicines
          .filter(m => m.medicineId)
          .map(m => {
            const medicine = medicines.find(med => med.id === m.medicineId)
            return {
              ...m,
              name: medicine?.name || 'Médicament inconnu',
              dosage: medicine?.dosage || ''
            }
          })
      }
      
      createPrescription(prescriptionData)
      setNewPrescription({
        patientId: '',
        medicines: [{ medicineId: '', quantity: 1, instructions: '', duration: '' }],
        notes: ''
      })
      setIsCreateDialogOpen(false)
    }
  }

  const handleValidatePrescription = (prescriptionId: string) => {
    validatePrescription(prescriptionId, 'PHARM-001')
  }

  const handleDispensePrescription = (prescriptionId: string) => {
    dispensePrescription(prescriptionId)
  }

  // Statistiques
  const stats = {
    pending: digitalPrescriptions.filter(p => p.status === 'pending').length,
    validated: digitalPrescriptions.filter(p => p.status === 'validated').length,
    dispensed: digitalPrescriptions.filter(p => p.status === 'dispensed').length,
    total: digitalPrescriptions.length
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Gestion des ordonnances numériques
          </CardTitle>
          <CardDescription>
            Créez, validez et gérez les prescriptions digitales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{stats.pending}</div>
              <p className="text-sm text-muted-foreground">En attente</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{stats.validated}</div>
              <p className="text-sm text-muted-foreground">Validées</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-info">{stats.dispensed}</div>
              <p className="text-sm text-muted-foreground">Délivrées</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Barre d'actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par patient ou ID prescription..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="validated">Validées</SelectItem>
                  <SelectItem value="dispensed">Délivrées</SelectItem>
                  <SelectItem value="cancelled">Annulées</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle prescription
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle prescription</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations pour créer une prescription numérique
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Sélection du patient */}
                  <div>
                    <Label htmlFor="patient">Patient</Label>
                    <Select value={newPrescription.patientId} onValueChange={(value) => 
                      setNewPrescription(prev => ({ ...prev, patientId: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {waitingPatients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name} - {patient.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Médicaments */}
                  <div>
                    <Label>Médicaments prescrits</Label>
                    <div className="space-y-4 mt-2">
                      {newPrescription.medicines.map((medicine, index) => (
                        <Card key={index} className="p-4">
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                              <Label>Médicament</Label>
                              <Select 
                                value={medicine.medicineId} 
                                onValueChange={(value) => updateMedicineInNewPrescription(index, 'medicineId', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                  {medicines.map((med) => (
                                    <SelectItem key={med.id} value={med.id}>
                                      {med.name} {med.dosage}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label>Quantité</Label>
                              <Input
                                type="number"
                                min="1"
                                value={medicine.quantity}
                                onChange={(e) => updateMedicineInNewPrescription(index, 'quantity', parseInt(e.target.value))}
                              />
                            </div>
                            
                            <div>
                              <Label>Durée</Label>
                              <Input
                                placeholder="Ex: 7 jours"
                                value={medicine.duration}
                                onChange={(e) => updateMedicineInNewPrescription(index, 'duration', e.target.value)}
                              />
                            </div>
                            
                            <div className="flex items-end">
                              {newPrescription.medicines.length > 1 && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => removeMedicineFromNewPrescription(index)}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <Label>Instructions</Label>
                            <Textarea
                              placeholder="Instructions de prise (ex: 1 comprimé matin et soir avec les repas)"
                              value={medicine.instructions}
                              onChange={(e) => updateMedicineInNewPrescription(index, 'instructions', e.target.value)}
                            />
                          </div>
                        </Card>
                      ))}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={addMedicineToNewPrescription}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter un médicament
                      </Button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes">Notes du pharmacien</Label>
                    <Textarea
                      id="notes"
                      placeholder="Notes complémentaires..."
                      value={newPrescription.notes}
                      onChange={(e) => setNewPrescription(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleCreatePrescription}>
                      Créer la prescription
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Liste des prescriptions */}
      <div className="space-y-4">
        {sortedPrescriptions.length > 0 ? (
          sortedPrescriptions.map((prescription) => {
            const patient = waitingPatients.find(p => p.id === prescription.patientId)
            
            return (
              <Card key={prescription.id} className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Informations prescription */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg">{prescription.id}</h3>
                        <Badge className={getStatusColor(prescription.status)}>
                          {getStatusLabel(prescription.status)}
                        </Badge>
                        <Badge variant="outline">
                          {prescription.medicines.length} médicament{prescription.medicines.length > 1 ? 's' : ''}
                        </Badge>
                      </div>
                      
                      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {patient?.name || 'Patient inconnu'}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(prescription.date).toLocaleDateString('fr-FR')}
                        </div>
                        {prescription.validationDate && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Validée le {new Date(prescription.validationDate).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>

                      {/* Médicaments prescrits */}
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Médicaments prescrits:</h4>
                        <div className="space-y-2">
                          {prescription.medicines.map((medicine, index) => (
                            <div key={index} className="bg-muted p-3 rounded-lg">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div>
                                  <span className="font-medium">{medicine.name}</span>
                                  <span className="text-muted-foreground ml-2">× {medicine.quantity}</span>
                                </div>
                                <Badge variant="outline" className="text-xs self-start md:self-center">
                                  {medicine.duration}
                                </Badge>
                              </div>
                              {medicine.instructions && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {medicine.instructions}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {prescription.notes && (
                        <div className="mt-4 p-3 bg-info/10 rounded-lg border border-info/20">
                          <h4 className="font-medium text-sm text-info mb-1">Notes du pharmacien:</h4>
                          <p className="text-sm">{prescription.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:w-auto w-full">
                      <Button variant="outline" size="sm" onClick={() => setSelectedPrescription(prescription)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Voir détails
                      </Button>
                      
                      {prescription.status === 'pending' && (
                        <Button 
                          size="sm"
                          onClick={() => handleValidatePrescription(prescription.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Valider
                        </Button>
                      )}
                      
                      {prescription.status === 'validated' && (
                        <Button 
                          variant="success"
                          size="sm"
                          onClick={() => handleDispensePrescription(prescription.id)}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Délivrer
                        </Button>
                      )}

                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Printer className="w-4 h-4 mr-2" />
                        Imprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune prescription trouvée</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' 
                  ? "Aucune prescription ne correspond à vos critères"
                  : "Créez votre première prescription numérique"}
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle prescription
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}