import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Video, 
  MessageCircle, 
  Clock, 
  Users, 
  Calendar,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap
} from "lucide-react"
import { useTelepharmacy } from "@/contexts/TelepharmacyContext"

export function TelepharmacyDashboard() {
  const { 
    waitingPatients, 
    consultations, 
    digitalPrescriptions, 
    treatmentFollowUps,
    pharmacistAvailability,
    notifications
  } = useTelepharmacy()

  const today = new Date().toISOString().split('T')[0]
  const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  // Statistiques
  const stats = {
    waitingPatients: waitingPatients.filter(p => p.status === 'waiting').length,
    activeConsultations: consultations.filter(c => c.status === 'active').length,
    todayConsultations: consultations.filter(c => c.date === today).length,
    weekConsultations: consultations.filter(c => c.date >= thisWeek).length,
    pendingPrescriptions: digitalPrescriptions.filter(p => p.status === 'pending').length,
    activeTreatments: treatmentFollowUps.length,
    unreadNotifications: notifications.filter(n => !n.read).length
  }

  const currentPharmacist = pharmacistAvailability[0]
  const consultationCapacity = currentPharmacist ? 
    (currentPharmacist.currentConsultations / currentPharmacist.maxConsultations) * 100 : 0

  // Prochaines consultations programmées
  const upcomingConsultations = consultations
    .filter(c => c.status === 'scheduled')
    .slice(0, 3)

  // Patients prioritaires
  const priorityPatients = waitingPatients
    .filter(p => p.priority === 'high' && p.status === 'waiting')
    .slice(0, 3)

  // Prescriptions urgentes
  const urgentPrescriptions = digitalPrescriptions
    .filter(p => p.status === 'pending')
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients en attente</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.waitingPatients}</div>
            <p className="text-xs text-muted-foreground">
              {priorityPatients.length} prioritaires
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultations actives</CardTitle>
            <Video className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.activeConsultations}</div>
            <p className="text-xs text-muted-foreground">
              {stats.todayConsultations} aujourd'hui
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ordonnances</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.pendingPrescriptions}</div>
            <p className="text-xs text-muted-foreground">
              en attente de validation
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-info">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suivis actifs</CardTitle>
            <Activity className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{stats.activeTreatments}</div>
            <p className="text-xs text-muted-foreground">
              traitements en cours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statut du pharmacien */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Votre statut
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentPharmacist && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    currentPharmacist.status === 'available' ? 'bg-success' :
                    currentPharmacist.status === 'busy' ? 'bg-warning' :
                    currentPharmacist.status === 'break' ? 'bg-info' : 'bg-muted'
                  }`} />
                  <span className="font-medium">{currentPharmacist.name}</span>
                  <Badge variant={
                    currentPharmacist.status === 'available' ? 'default' :
                    currentPharmacist.status === 'busy' ? 'secondary' :
                    currentPharmacist.status === 'break' ? 'outline' : 'destructive'
                  }>
                    {currentPharmacist.status === 'available' ? 'Disponible' :
                     currentPharmacist.status === 'busy' ? 'Occupé' :
                     currentPharmacist.status === 'break' ? 'En pause' : 'Hors ligne'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentPharmacist.currentConsultations}/{currentPharmacist.maxConsultations} consultations
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Capacité</span>
                  <span>{Math.round(consultationCapacity)}%</span>
                </div>
                <Progress value={consultationCapacity} className="h-2" />
              </div>

              <div className="flex flex-wrap gap-2">
                {currentPharmacist.specialties.map((specialty) => (
                  <Badge key={specialty} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Actions rapides
            </CardTitle>
            <CardDescription>
              Accès direct aux fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Video className="w-4 h-4 mr-2" />
              Démarrer une consultation vidéo
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Ouvrir le chat patient
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Créer une ordonnance
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Planifier une consultation
            </Button>
          </CardContent>
        </Card>

        {/* Notifications prioritaires */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Notifications importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.unreadNotifications > 0 ? (
              <div className="space-y-3">
                {notifications.filter(n => !n.read && n.priority === 'high').slice(0, 3).map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.priority === 'high' ? 'bg-destructive' :
                      notification.priority === 'medium' ? 'bg-warning' : 'bg-info'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {notification.message}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {new Date(notification.timestamp).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  Voir toutes les notifications ({stats.unreadNotifications})
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 mx-auto text-success mb-3" />
                <p className="text-sm text-muted-foreground">
                  Aucune notification en attente
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Prochaines consultations et patients prioritaires */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Prochaines consultations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingConsultations.length > 0 ? (
              <div className="space-y-3">
                {upcomingConsultations.map((consultation) => {
                  const patient = waitingPatients.find(p => p.id === consultation.patientId)
                  return (
                    <div key={consultation.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{patient?.name || 'Patient inconnu'}</p>
                        <p className="text-sm text-muted-foreground">
                          {consultation.startTime} - {consultation.type}
                        </p>
                      </div>
                      <Badge variant="outline">{consultation.type}</Badge>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">
                Aucune consultation programmée
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Patients prioritaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            {priorityPatients.length > 0 ? (
              <div className="space-y-3">
                {priorityPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">{patient.reason}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">Urgent</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round((Date.now() - new Date(patient.waitingSince).getTime()) / (1000 * 60))} min
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">
                Aucun patient prioritaire
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}