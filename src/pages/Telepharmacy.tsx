import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Video, 
  MessageCircle, 
  Clock, 
  Users, 
  Calendar,
  FileText,
  TrendingUp,
  Phone,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { useTelepharmacy } from "@/contexts/TelepharmacyContext"
import { TelepharmacyDashboard } from "@/components/telepharmacy/TelepharmacyDashboard"
import { PatientQueue } from "@/components/telepharmacy/PatientQueue"
import { ConsultationRoom } from "@/components/telepharmacy/ConsultationRoom"
import { PrescriptionManagement } from "@/components/telepharmacy/PrescriptionManagement"
import { TreatmentFollowUp } from "@/components/telepharmacy/TreatmentFollowUp"
import { NotificationCenter } from "@/components/telepharmacy/NotificationCenter"

export default function Telepharmacy() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { waitingPatients, consultations, notifications, getUnreadNotifications } = useTelepharmacy()

  const unreadNotifications = getUnreadNotifications()
  const waitingCount = waitingPatients.filter(p => p.status === 'waiting').length
  const activeConsultations = consultations.filter(c => c.status === 'active').length
  const todayConsultations = consultations.filter(c => 
    c.date === new Date().toISOString().split('T')[0]
  ).length

  return (
    <div className="flex flex-col h-full">
      {/* Header avec statistiques rapides */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Télépharmacie</h1>
            <p className="text-primary-foreground/80">
              Gérez vos consultations à distance et accompagnez vos patients
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5" />
                  <Badge variant="secondary" className="bg-warning text-warning-foreground">
                    {waitingCount}
                  </Badge>
                </div>
                <p className="text-sm font-medium">En attente</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Video className="w-5 h-5" />
                  <Badge variant="secondary" className="bg-success text-success-foreground">
                    {activeConsultations}
                  </Badge>
                </div>
                <p className="text-sm font-medium">En cours</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-lg font-bold">{todayConsultations}</span>
                </div>
                <p className="text-sm font-medium">Aujourd'hui</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5" />
                  <Badge variant="secondary" className="bg-destructive text-destructive-foreground">
                    {unreadNotifications.length}
                  </Badge>
                </div>
                <p className="text-sm font-medium">Notifications</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Tableau de bord</span>
          </TabsTrigger>
          <TabsTrigger value="queue" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">File d'attente</span>
            {waitingCount > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {waitingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="consultation" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline">Consultation</span>
          </TabsTrigger>
          <TabsTrigger value="prescriptions" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Ordonnances</span>
          </TabsTrigger>
          <TabsTrigger value="followup" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Suivi</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
            {unreadNotifications.length > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {unreadNotifications.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto">
          <TabsContent value="dashboard" className="space-y-6 mt-0">
            <TelepharmacyDashboard />
          </TabsContent>

          <TabsContent value="queue" className="space-y-6 mt-0">
            <PatientQueue />
          </TabsContent>

          <TabsContent value="consultation" className="space-y-6 mt-0">
            <ConsultationRoom />
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-6 mt-0">
            <PrescriptionManagement />
          </TabsContent>

          <TabsContent value="followup" className="space-y-6 mt-0">
            <TreatmentFollowUp />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 mt-0">
            <NotificationCenter />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}