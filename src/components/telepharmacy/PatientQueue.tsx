import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { 
  Video, 
  MessageCircle, 
  Phone,
  Clock, 
  Search,
  Filter,
  AlertTriangle,
  User,
  Calendar,
  FileText
} from "lucide-react"
import { useTelepharmacy, TeleconsultationPatient } from "@/contexts/TelepharmacyContext"

export function PatientQueue() {
  const { waitingPatients, startConsultation, updatePatientStatus } = useTelepharmacy()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  // Filtrage des patients
  const filteredPatients = waitingPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.phone.includes(searchQuery) ||
                         patient.reason.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || patient.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  // Tri par priorité et temps d'attente
  const sortedPatients = filteredPatients.sort((a, b) => {
    // D'abord par priorité
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    
    // Puis par temps d'attente
    return new Date(a.waitingSince).getTime() - new Date(b.waitingSince).getTime()
  })

  const handleStartConsultation = (patient: TeleconsultationPatient) => {
    startConsultation(patient.id, patient.consultationType)
  }

  const getWaitingTime = (waitingSince: string) => {
    const waitingMinutes = Math.round((Date.now() - new Date(waitingSince).getTime()) / (1000 * 60))
    
    if (waitingMinutes < 60) {
      return `${waitingMinutes} min`
    } else {
      const hours = Math.floor(waitingMinutes / 60)
      const minutes = waitingMinutes % 60
      return `${hours}h ${minutes}m`
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground'
      case 'medium': return 'bg-warning text-warning-foreground'
      case 'low': return 'bg-success text-success-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-warning text-warning-foreground'
      case 'in-consultation': return 'bg-success text-success-foreground'
      case 'completed': return 'bg-muted text-muted-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            File d'attente des patients
          </CardTitle>
          <CardDescription>
            Gérez les demandes de consultation en temps réel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                {waitingPatients.filter(p => p.status === 'waiting').length}
              </div>
              <p className="text-sm text-muted-foreground">En attente</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {waitingPatients.filter(p => p.status === 'in-consultation').length}
              </div>
              <p className="text-sm text-muted-foreground">En consultation</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">
                {waitingPatients.filter(p => p.priority === 'high' && p.status === 'waiting').length}
              </div>
              <p className="text-sm text-muted-foreground">Urgents</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un patient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="waiting">En attente</SelectItem>
                <SelectItem value="in-consultation">En consultation</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes priorités</SelectItem>
                <SelectItem value="high">Urgent</SelectItem>
                <SelectItem value="medium">Moyen</SelectItem>
                <SelectItem value="low">Faible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des patients */}
      <div className="space-y-4">
        {sortedPatients.length > 0 ? (
          sortedPatients.map((patient) => (
            <Card key={patient.id} className={`transition-all hover:shadow-md ${
              patient.priority === 'high' ? 'border-l-4 border-l-destructive' :
              patient.priority === 'medium' ? 'border-l-4 border-l-warning' :
              'border-l-4 border-l-success'
            }`}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Informations patient */}
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={patient.avatar} />
                      <AvatarFallback>
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{patient.name}</h3>
                        <Badge className={getPriorityColor(patient.priority)}>
                          {patient.priority === 'high' ? 'Urgent' :
                           patient.priority === 'medium' ? 'Moyen' : 'Faible'}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(patient.status)}>
                          {patient.status === 'waiting' ? 'En attente' :
                           patient.status === 'in-consultation' ? 'En consultation' : 'Terminé'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {patient.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {patient.reason}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          En attente depuis {getWaitingTime(patient.waitingSince)}
                        </div>
                      </div>

                      {/* Historique médical */}
                      {(patient.medicalHistory || patient.allergies) && (
                        <div className="mt-3 pt-3 border-t">
                          {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                            <div className="mb-2">
                              <span className="text-xs font-medium text-muted-foreground">Antécédents: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {patient.medicalHistory.map((history, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {history}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {patient.allergies && patient.allergies.length > 0 && (
                            <div>
                              <span className="text-xs font-medium text-destructive">Allergies: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {patient.allergies.map((allergy, index) => (
                                  <Badge key={index} variant="destructive" className="text-xs">
                                    {allergy}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:w-auto w-full">
                    {patient.status === 'waiting' && (
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleStartConsultation(patient)}
                          className="flex-1 lg:flex-none"
                          variant={patient.consultationType === 'video' ? 'default' : 'outline'}
                        >
                          {patient.consultationType === 'video' ? (
                            <><Video className="w-4 h-4 mr-2" />Vidéo</>
                          ) : patient.consultationType === 'chat' ? (
                            <><MessageCircle className="w-4 h-4 mr-2" />Chat</>
                          ) : (
                            <><FileText className="w-4 h-4 mr-2" />Async</>
                          )}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updatePatientStatus(patient.id, 'completed')}
                        >
                          Reporter
                        </Button>
                      </div>
                    )}
                    
                    {patient.status === 'in-consultation' && (
                      <Button variant="success" disabled>
                        <Video className="w-4 h-4 mr-2" />
                        En cours...
                      </Button>
                    )}

                    {patient.status === 'completed' && (
                      <Button variant="outline" disabled>
                        Terminé
                      </Button>
                    )}
                    
                    {/* Type de consultation demandé */}
                    <div className="text-center">
                      <Badge variant="outline" className="text-xs">
                        {patient.consultationType === 'video' ? 'Visioconférence' :
                         patient.consultationType === 'chat' ? 'Chat en direct' :
                         'Messagerie asynchrone'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun patient en attente</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' 
                  ? "Aucun patient ne correspond à vos critères de recherche"
                  : "Tous les patients ont été pris en charge"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}