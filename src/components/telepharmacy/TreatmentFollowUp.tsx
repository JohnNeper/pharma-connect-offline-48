import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Activity, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Pill,
  TrendingUp,
  User,
  Search,
  Filter,
  Plus,
  Bell,
  Heart
} from "lucide-react"
import { useTelepharmacy, TreatmentFollowUp as TreatmentFollowUpType } from "@/contexts/TelepharmacyContext"

export function TreatmentFollowUp() {
  const { 
    treatmentFollowUps, 
    updateAdherence, 
    addSideEffect,
    waitingPatients,
    digitalPrescriptions
  } = useTelepharmacy()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [adherenceFilter, setAdherenceFilter] = useState('all')
  const [selectedFollowUp, setSelectedFollowUp] = useState<TreatmentFollowUpType | null>(null)
  const [newSideEffect, setNewSideEffect] = useState<{ effect: string; severity: 'mild' | 'moderate' | 'severe' }>({ effect: '', severity: 'mild' })
  const [isAddSideEffectOpen, setIsAddSideEffectOpen] = useState(false)

  // Filtrage des suivis
  const filteredFollowUps = treatmentFollowUps.filter(followUp => {
    const patient = waitingPatients.find(p => p.id === followUp.patientId)
    const matchesSearch = patient?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         followUp.medicineName.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Calcul de l'adhérence
    const totalDoses = followUp.adherence.length
    const takenDoses = followUp.adherence.filter(a => a.taken).length
    const adherenceRate = totalDoses > 0 ? (takenDoses / totalDoses) * 100 : 0
    
    const matchesAdherence = adherenceFilter === 'all' || 
      (adherenceFilter === 'good' && adherenceRate >= 80) ||
      (adherenceFilter === 'moderate' && adherenceRate >= 50 && adherenceRate < 80) ||
      (adherenceFilter === 'poor' && adherenceRate < 50)
    
    return matchesSearch && matchesAdherence
  })

  const calculateAdherence = (followUp: TreatmentFollowUpType) => {
    const totalDoses = followUp.adherence.length
    const takenDoses = followUp.adherence.filter(a => a.taken).length
    return totalDoses > 0 ? (takenDoses / totalDoses) * 100 : 0
  }

  const getAdherenceColor = (rate: number) => {
    if (rate >= 80) return 'text-success'
    if (rate >= 50) return 'text-warning'
    return 'text-destructive'
  }

  const getAdherenceLabel = (rate: number) => {
    if (rate >= 80) return 'Bonne'
    if (rate >= 50) return 'Modérée'
    return 'Faible'
  }

  const handleAddSideEffect = () => {
    if (selectedFollowUp && newSideEffect.effect.trim()) {
      addSideEffect(selectedFollowUp.id, newSideEffect.effect, newSideEffect.severity)
      setNewSideEffect({ effect: '', severity: 'mild' })
      setIsAddSideEffectOpen(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-success text-success-foreground'
      case 'moderate': return 'bg-warning text-warning-foreground'
      case 'severe': return 'bg-destructive text-destructive-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'mild': return 'Léger'
      case 'moderate': return 'Modéré'
      case 'severe': return 'Sévère'
      default: return severity
    }
  }

  // Statistiques globales
  const stats = {
    totalPatients: new Set(treatmentFollowUps.map(f => f.patientId)).size,
    goodAdherence: treatmentFollowUps.filter(f => calculateAdherence(f) >= 80).length,
    withSideEffects: treatmentFollowUps.filter(f => f.sideEffects && f.sideEffects.length > 0).length,
    pendingReminders: treatmentFollowUps.reduce((acc, f) => 
      acc + f.reminders.filter(r => !r.sent).length, 0
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Suivi des traitements
          </CardTitle>
          <CardDescription>
            Surveillez l'adhérence et les effets des traitements prescrits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalPatients}</div>
              <p className="text-sm text-muted-foreground">Patients suivis</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{stats.goodAdherence}</div>
              <p className="text-sm text-muted-foreground">Bonne adhérence</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{stats.withSideEffects}</div>
              <p className="text-sm text-muted-foreground">Effets secondaires</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-info">{stats.pendingReminders}</div>
              <p className="text-sm text-muted-foreground">Rappels en attente</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par patient ou médicament..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={adherenceFilter} onValueChange={setAdherenceFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Adhérence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes adhérences</SelectItem>
                <SelectItem value="good">Bonne (≥80%)</SelectItem>
                <SelectItem value="moderate">Modérée (50-79%)</SelectItem>
                <SelectItem value="poor">Faible (&lt;50%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des suivis */}
      <div className="space-y-4">
        {filteredFollowUps.length > 0 ? (
          filteredFollowUps.map((followUp) => {
            const patient = waitingPatients.find(p => p.id === followUp.patientId)
            const adherenceRate = calculateAdherence(followUp)
            const recentDoses = followUp.adherence.slice(-7) // 7 dernières prises
            const prescription = digitalPrescriptions.find(p => p.id === followUp.prescriptionId)
            
            return (
              <Card key={followUp.id} className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* En-tête du suivi */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Pill className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{followUp.medicineName}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            {patient?.name || 'Patient inconnu'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getAdherenceColor(adherenceRate)}`}>
                            {Math.round(adherenceRate)}%
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {getAdherenceLabel(adherenceRate)} adhérence
                          </p>
                        </div>
                        <Progress value={adherenceRate} className="w-24" />
                      </div>
                    </div>

                    <Tabs defaultValue="adherence" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="adherence">Adhérence</TabsTrigger>
                        <TabsTrigger value="schedule">Planning</TabsTrigger>
                        <TabsTrigger value="side-effects">Effets secondaires</TabsTrigger>
                        <TabsTrigger value="reminders">Rappels</TabsTrigger>
                      </TabsList>

                      <TabsContent value="adherence" className="space-y-4 mt-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          {/* Historique récent */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">7 derniers jours</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {recentDoses.map((dose, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                                    <div className="flex items-center gap-2">
                                      {dose.taken ? (
                                        <CheckCircle className="w-4 h-4 text-success" />
                                      ) : (
                                        <XCircle className="w-4 h-4 text-destructive" />
                                      )}
                                      <span className="text-sm">
                                        {new Date(dose.date).toLocaleDateString('fr-FR')}
                                      </span>
                                    </div>
                                    <Badge variant={dose.taken ? 'success' : 'destructive'} className="text-xs">
                                      {dose.time}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Actions rapides */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full justify-start"
                                onClick={() => updateAdherence(followUp.id, followUp.medicineId, true)}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Marquer comme pris
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full justify-start"
                                onClick={() => {
                                  setSelectedFollowUp(followUp)
                                  setIsAddSideEffectOpen(true)
                                }}
                              >
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Signaler un effet
                              </Button>
                              <Button variant="outline" size="sm" className="w-full justify-start">
                                <Bell className="w-4 h-4 mr-2" />
                                Programmer rappel
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="schedule" className="mt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Planning de prise</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="grid gap-2 md:grid-cols-3">
                                <div>
                                  <Label className="text-sm font-medium">Fréquence</Label>
                                  <p className="text-sm text-muted-foreground">{followUp.schedule.frequency}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Horaires</Label>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {followUp.schedule.times.map((time, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {time}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Durée</Label>
                                  <p className="text-sm text-muted-foreground">{followUp.schedule.duration}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="side-effects" className="mt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center justify-between">
                              Effets secondaires signalés
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedFollowUp(followUp)
                                  setIsAddSideEffectOpen(true)
                                }}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Ajouter
                              </Button>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {followUp.sideEffects && followUp.sideEffects.length > 0 ? (
                              <div className="space-y-2">
                                {followUp.sideEffects.map((effect, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                                    <div>
                                      <p className="text-sm font-medium">{effect.effect}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(effect.date).toLocaleDateString('fr-FR')}
                                      </p>
                                    </div>
                                    <Badge className={getSeverityColor(effect.severity)} variant="secondary">
                                      {getSeverityLabel(effect.severity)}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                Aucun effet secondaire signalé
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="reminders" className="mt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Rappels programmés</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {followUp.reminders.length > 0 ? (
                              <div className="space-y-2">
                                {followUp.reminders.map((reminder) => (
                                  <div key={reminder.id} className="flex items-center justify-between p-2 bg-muted rounded">
                                    <div className="flex items-center gap-2">
                                      <Bell className="w-4 h-4" />
                                      <div>
                                        <p className="text-sm">{reminder.message}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {new Date(reminder.scheduledTime).toLocaleString('fr-FR')}
                                        </p>
                                      </div>
                                    </div>
                                    <Badge variant={reminder.sent ? 'success' : 'warning'}>
                                      {reminder.sent ? 'Envoyé' : 'En attente'}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                Aucun rappel programmé
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun suivi de traitement</h3>
              <p className="text-muted-foreground">
                {searchQuery || adherenceFilter !== 'all' 
                  ? "Aucun suivi ne correspond à vos critères"
                  : "Les suivis de traitement apparaîtront ici"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog pour ajouter un effet secondaire */}
      <Dialog open={isAddSideEffectOpen} onOpenChange={setIsAddSideEffectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Signaler un effet secondaire</DialogTitle>
            <DialogDescription>
              Enregistrez un nouvel effet secondaire pour ce traitement
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="effect">Description de l'effet</Label>
              <Textarea
                id="effect"
                placeholder="Décrivez l'effet secondaire observé..."
                value={newSideEffect.effect}
                onChange={(e) => setNewSideEffect(prev => ({ ...prev, effect: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="severity">Sévérité</Label>
              <Select 
                value={newSideEffect.severity} 
                onValueChange={(value: 'mild' | 'moderate' | 'severe') => 
                  setNewSideEffect(prev => ({ ...prev, severity: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild">Léger</SelectItem>
                  <SelectItem value="moderate">Modéré</SelectItem>
                  <SelectItem value="severe">Sévère</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddSideEffectOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddSideEffect} disabled={!newSideEffect.effect.trim()}>
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}