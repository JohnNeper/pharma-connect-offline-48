import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Heart, Search, Plus, User, Calendar, Pill, AlertTriangle,
  Phone, Clock, FileText, Activity, Edit, Trash2
} from "lucide-react"
import { useData, type Patient, type ChronicTreatment } from "@/contexts/DataContext"
import { toast } from "@/hooks/use-toast"

export default function ChronicPatients() {
  const { patients, updatePatient, addPatient, medicines } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showTreatmentModal, setShowTreatmentModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [activeTab, setActiveTab] = useState<'list' | 'calendar'>('list')

  // Form state
  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', allergies: '', dob: '', notes: '',
    chronicConditions: '',
  })
  const [treatmentForm, setTreatmentForm] = useState({
    condition: '', medicineId: '', dosage: '', frequency: '', doctorName: '',
    startDate: '', renewalDate: '', notes: ''
  })

  const chronicPatients = useMemo(() => {
    return patients
      .filter(p => p.isChronic)
      .filter(p => {
        if (!searchTerm) return true
        const q = searchTerm.toLowerCase()
        return p.name.toLowerCase().includes(q) ||
          p.chronicConditions?.some(c => c.toLowerCase().includes(q)) ||
          p.phone?.includes(q)
      })
  }, [patients, searchTerm])

  // Stats
  const stats = useMemo(() => {
    const chronic = patients.filter(p => p.isChronic)
    const renewalsDue = chronic.filter(p =>
      p.treatments?.some(t => {
        if (!t.renewalDate || t.status !== 'active') return false
        const rd = new Date(t.renewalDate)
        const now = new Date()
        const diff = (rd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        return diff <= 7
      })
    )
    const conditions = new Set<string>()
    chronic.forEach(p => p.chronicConditions?.forEach(c => conditions.add(c)))
    return {
      totalChronic: chronic.length,
      loyalPatients: chronic.filter(p => p.loyaltyPharmacy).length,
      renewalsDue: renewalsDue.length,
      conditionsCount: conditions.size
    }
  }, [patients])

  const handleAddPatient = () => {
    if (!formData.name) {
      toast({ title: 'Erreur', description: 'Le nom est requis', variant: 'destructive' })
      return
    }
    addPatient({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      allergies: formData.allergies,
      dob: formData.dob,
      notes: formData.notes,
      isChronic: true,
      chronicConditions: formData.chronicConditions.split(',').map(s => s.trim()).filter(Boolean),
      treatments: [],
      loyaltyPharmacy: true,
      lastVisit: new Date().toISOString().split('T')[0]
    })
    setFormData({ name: '', phone: '', address: '', allergies: '', dob: '', notes: '', chronicConditions: '' })
    setShowAddModal(false)
    toast({ title: 'Patient ajouté', description: `${formData.name} a été enregistré comme patient chronique` })
  }

  const handleAddTreatment = () => {
    if (!selectedPatient || !treatmentForm.condition || !treatmentForm.medicineId) {
      toast({ title: 'Erreur', description: 'Champs requis manquants', variant: 'destructive' })
      return
    }
    const med = medicines.find(m => m.id === treatmentForm.medicineId)
    const newTreatment: ChronicTreatment = {
      id: `TRT-${Date.now()}`,
      condition: treatmentForm.condition,
      medicines: [{
        medicineId: treatmentForm.medicineId,
        name: med?.name || '',
        dosage: treatmentForm.dosage || med?.dosage || '',
        frequency: treatmentForm.frequency
      }],
      startDate: treatmentForm.startDate || new Date().toISOString().split('T')[0],
      doctorName: treatmentForm.doctorName,
      renewalDate: treatmentForm.renewalDate,
      notes: treatmentForm.notes,
      status: 'active'
    }
    const updatedTreatments = [...(selectedPatient.treatments || []), newTreatment]
    const updatedConditions = new Set([...(selectedPatient.chronicConditions || []), treatmentForm.condition])
    updatePatient(selectedPatient.id, {
      treatments: updatedTreatments,
      chronicConditions: Array.from(updatedConditions),
      isChronic: true
    })
    setTreatmentForm({ condition: '', medicineId: '', dosage: '', frequency: '', doctorName: '', startDate: '', renewalDate: '', notes: '' })
    setShowTreatmentModal(false)
    toast({ title: 'Traitement ajouté', description: `Traitement pour ${treatmentForm.condition} ajouté` })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Heart className="w-6 h-6 text-destructive" /> Patients Chroniques
          </h1>
          <p className="text-sm text-muted-foreground">Suivi et gestion des patients avec maladies chroniques</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Nouveau patient chronique
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10"><Heart className="w-5 h-5 text-destructive" /></div>
            <div>
              <p className="text-2xl font-bold">{stats.totalChronic}</p>
              <p className="text-xs text-muted-foreground">Patients chroniques</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><User className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold">{stats.loyalPatients}</p>
              <p className="text-xs text-muted-foreground">Patients fidèles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10"><AlertTriangle className="w-5 h-5 text-warning" /></div>
            <div>
              <p className="text-2xl font-bold">{stats.renewalsDue}</p>
              <p className="text-xs text-muted-foreground">Renouvellements à venir</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent"><Activity className="w-5 h-5" /></div>
            <div>
              <p className="text-2xl font-bold">{stats.conditionsCount}</p>
              <p className="text-xs text-muted-foreground">Pathologies suivies</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, pathologie ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <div className="space-y-4">
        {chronicPatients.map(patient => (
          <Card key={patient.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{patient.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {patient.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{patient.phone}</span>}
                      {patient.lastVisit && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Dernière visite: {patient.lastVisit}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {patient.loyaltyPharmacy && <Badge variant="default" className="text-xs">Fidèle</Badge>}
                  <Button variant="outline" size="sm" onClick={() => { setSelectedPatient(patient); setShowTreatmentModal(true) }}>
                    <Plus className="w-3 h-3 mr-1" /> Traitement
                  </Button>
                </div>
              </div>

              {/* Conditions */}
              <div className="flex gap-2 mb-3 flex-wrap">
                {patient.chronicConditions?.map(condition => (
                  <Badge key={condition} variant="destructive" className="text-xs">{condition}</Badge>
                ))}
                {patient.allergies && <Badge variant="outline" className="text-xs">⚠️ Allergies: {patient.allergies}</Badge>}
              </div>

              {/* Treatments */}
              {patient.treatments && patient.treatments.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Pathologie</TableHead>
                        <TableHead className="text-xs">Médicaments</TableHead>
                        <TableHead className="text-xs">Posologie</TableHead>
                        <TableHead className="text-xs">Médecin</TableHead>
                        <TableHead className="text-xs">Renouvellement</TableHead>
                        <TableHead className="text-xs">Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patient.treatments.filter(t => t.status === 'active').map(treatment => (
                        <TableRow key={treatment.id}>
                          <TableCell className="text-sm font-medium">{treatment.condition}</TableCell>
                          <TableCell className="text-sm">
                            {treatment.medicines.map(m => (
                              <div key={m.medicineId}>{m.name} {m.dosage}</div>
                            ))}
                          </TableCell>
                          <TableCell className="text-sm">
                            {treatment.medicines.map(m => (
                              <div key={m.medicineId}>{m.frequency}</div>
                            ))}
                          </TableCell>
                          <TableCell className="text-sm">{treatment.doctorName}</TableCell>
                          <TableCell className="text-sm">
                            {treatment.renewalDate ? (
                              <span className={
                                new Date(treatment.renewalDate) <= new Date() 
                                  ? 'text-destructive font-medium' 
                                  : ''
                              }>
                                {treatment.renewalDate}
                              </span>
                            ) : '—'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={treatment.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                              {treatment.status === 'active' ? 'Actif' : treatment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {patient.nextAppointment && (
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  Prochain RDV: <span className="font-medium text-foreground">{patient.nextAppointment}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {chronicPatients.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aucun patient chronique trouvé</p>
            <Button variant="outline" className="mt-4" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" /> Ajouter un patient
            </Button>
          </div>
        )}
      </div>

      {/* Add Patient Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau patient chronique</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Nom complet *</Label><Input value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} /></div>
              <div><Label>Téléphone</Label><Input value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} /></div>
            </div>
            <div><Label>Adresse</Label><Input value={formData.address} onChange={e => setFormData(f => ({ ...f, address: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Date de naissance</Label><Input type="date" value={formData.dob} onChange={e => setFormData(f => ({ ...f, dob: e.target.value }))} /></div>
              <div><Label>Allergies</Label><Input value={formData.allergies} onChange={e => setFormData(f => ({ ...f, allergies: e.target.value }))} placeholder="Ex: Pénicilline" /></div>
            </div>
            <div>
              <Label>Pathologies chroniques *</Label>
              <Input value={formData.chronicConditions} onChange={e => setFormData(f => ({ ...f, chronicConditions: e.target.value }))} placeholder="Diabète, Hypertension (séparés par des virgules)" />
            </div>
            <div><Label>Notes</Label><Textarea value={formData.notes} onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Annuler</Button>
            <Button onClick={handleAddPatient}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Treatment Modal */}
      <Dialog open={showTreatmentModal} onOpenChange={setShowTreatmentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un traitement - {selectedPatient?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Pathologie *</Label><Input value={treatmentForm.condition} onChange={e => setTreatmentForm(f => ({ ...f, condition: e.target.value }))} placeholder="Ex: Diabète Type 2" /></div>
            <div>
              <Label>Médicament *</Label>
              <select className="w-full h-10 rounded-md border bg-background px-3"
                value={treatmentForm.medicineId} onChange={e => setTreatmentForm(f => ({ ...f, medicineId: e.target.value }))}>
                <option value="">Sélectionner un médicament</option>
                {medicines.map(m => <option key={m.id} value={m.id}>{m.name} {m.dosage}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Posologie</Label><Input value={treatmentForm.dosage} onChange={e => setTreatmentForm(f => ({ ...f, dosage: e.target.value }))} placeholder="Ex: 850mg" /></div>
              <div><Label>Fréquence *</Label><Input value={treatmentForm.frequency} onChange={e => setTreatmentForm(f => ({ ...f, frequency: e.target.value }))} placeholder="Ex: 2x/jour" /></div>
            </div>
            <div><Label>Médecin prescripteur</Label><Input value={treatmentForm.doctorName} onChange={e => setTreatmentForm(f => ({ ...f, doctorName: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Date début</Label><Input type="date" value={treatmentForm.startDate} onChange={e => setTreatmentForm(f => ({ ...f, startDate: e.target.value }))} /></div>
              <div><Label>Date renouvellement</Label><Input type="date" value={treatmentForm.renewalDate} onChange={e => setTreatmentForm(f => ({ ...f, renewalDate: e.target.value }))} /></div>
            </div>
            <div><Label>Notes</Label><Textarea value={treatmentForm.notes} onChange={e => setTreatmentForm(f => ({ ...f, notes: e.target.value }))} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTreatmentModal(false)}>Annuler</Button>
            <Button onClick={handleAddTreatment}>Ajouter le traitement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
