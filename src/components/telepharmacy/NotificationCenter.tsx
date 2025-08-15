import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bell,
  BellRing,
  Check,
  CheckCheck,
  AlertTriangle,
  Clock,
  User,
  FileText,
  Video,
  Search,
  Filter,
  Settings,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react"
import { useTelepharmacy, Notification } from "@/contexts/TelepharmacyContext"

export function NotificationCenter() {
  const { 
    notifications, 
    markNotificationAsRead, 
    getUnreadNotifications,
    waitingPatients,
    digitalPrescriptions
  } = useTelepharmacy()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Filtrage des notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter
    const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'read' && notification.read) ||
      (statusFilter === 'unread' && !notification.read)
    
    return matchesSearch && matchesType && matchesPriority && matchesStatus
  })

  // Tri par timestamp
  const sortedNotifications = filteredNotifications.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  const unreadNotifications = getUnreadNotifications()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new-consultation': return <Video className="w-4 h-4" />
      case 'prescription-validation': return <FileText className="w-4 h-4" />
      case 'medication-reminder': return <Clock className="w-4 h-4" />
      case 'followup-due': return <User className="w-4 h-4" />
      case 'system': return <Settings className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive text-destructive-foreground'
      case 'high': return 'bg-warning text-warning-foreground'
      case 'medium': return 'bg-info text-info-foreground'
      case 'low': return 'bg-muted text-muted-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgent'
      case 'high': return 'Élevée'
      case 'medium': return 'Moyenne'
      case 'low': return 'Faible'
      default: return priority
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'new-consultation': return 'Nouvelle consultation'
      case 'prescription-validation': return 'Validation ordonnance'
      case 'medication-reminder': return 'Rappel médicament'
      case 'followup-due': return 'Suivi requis'
      case 'system': return 'Système'
      default: return type
    }
  }

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId)
  }

  const handleMarkAllAsRead = () => {
    unreadNotifications.forEach(notification => {
      markNotificationAsRead(notification.id)
    })
  }

  const getRelatedInfo = (notification: Notification) => {
    if (notification.relatedType === 'patient' && notification.relatedId) {
      const patient = waitingPatients.find(p => p.id === notification.relatedId)
      return patient ? `Patient: ${patient.name}` : null
    }
    
    if (notification.relatedType === 'prescription' && notification.relatedId) {
      const prescription = digitalPrescriptions.find(p => p.id === notification.relatedId)
      if (prescription) {
        const patient = waitingPatients.find(p => p.id === prescription.patientId)
        return patient ? `Ordonnance: ${patient.name}` : `Ordonnance: ${prescription.id}`
      }
    }
    
    return null
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'À l\'instant'
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `Il y a ${diffInHours}h`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`
  }

  // Statistiques
  const stats = {
    total: notifications.length,
    unread: unreadNotifications.length,
    urgent: notifications.filter(n => n.priority === 'urgent' && !n.read).length,
    actionRequired: notifications.filter(n => n.actionRequired && !n.read).length
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Centre de notifications
              </CardTitle>
              <CardDescription>
                Gérez toutes vos notifications et alertes
              </CardDescription>
            </div>
            
            {unreadNotifications.length > 0 && (
              <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
                <CheckCheck className="w-4 h-4 mr-2" />
                Tout marquer comme lu
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{stats.unread}</div>
              <p className="text-sm text-muted-foreground">Non lues</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{stats.urgent}</div>
              <p className="text-sm text-muted-foreground">Urgentes</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-info">{stats.actionRequired}</div>
              <p className="text-sm text-muted-foreground">Action requise</p>
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
                placeholder="Rechercher dans les notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="unread">Non lues</SelectItem>
                <SelectItem value="read">Lues</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="new-consultation">Nouvelles consultations</SelectItem>
                <SelectItem value="prescription-validation">Validation ordonnances</SelectItem>
                <SelectItem value="medication-reminder">Rappels médicaments</SelectItem>
                <SelectItem value="followup-due">Suivis requis</SelectItem>
                <SelectItem value="system">Système</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes priorités</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">Élevée</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="low">Faible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des notifications */}
      <div className="space-y-3">
        {sortedNotifications.length > 0 ? (
          sortedNotifications.map((notification) => {
            const relatedInfo = getRelatedInfo(notification)
            
            return (
              <Card 
                key={notification.id} 
                className={`transition-all hover:shadow-md cursor-pointer ${
                  !notification.read ? 'border-l-4 border-l-primary bg-primary/5' : ''
                }`}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icône de notification */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      !notification.read ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Contenu de la notification */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </h4>
                          <Badge className={getPriorityColor(notification.priority)} variant="secondary">
                            {getPriorityLabel(notification.priority)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(notification.type)}
                          </Badge>
                          {notification.actionRequired && (
                            <Badge variant="destructive" className="text-xs">
                              Action requise
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {!notification.read ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                          <span>{getTimeAgo(notification.timestamp)}</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>

                      {relatedInfo && (
                        <p className="text-xs text-info font-medium">
                          {relatedInfo}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1">
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMarkAsRead(notification.id)
                          }}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {notification.actionRequired && (
                        <Button variant="outline" size="sm">
                          Agir
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune notification</h3>
              <p className="text-muted-foreground">
                {searchQuery || typeFilter !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all'
                  ? "Aucune notification ne correspond à vos critères"
                  : "Vous êtes à jour ! Aucune nouvelle notification."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Notifications non lues importantes */}
      {unreadNotifications.some(n => n.priority === 'urgent' || n.actionRequired) && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Notifications urgentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {unreadNotifications
                .filter(n => n.priority === 'urgent' || n.actionRequired)
                .slice(0, 3)
                .map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-2 bg-destructive/10 rounded">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(notification.type)}
                      <span className="text-sm font-medium">{notification.title}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      Traiter
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}