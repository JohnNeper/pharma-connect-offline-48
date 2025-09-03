import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Activity,
  DollarSign,
  Users,
  Package,
  BarChart3,
  Server,
  Database,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  Edit,
  Ban,
  Download
} from 'lucide-react'

interface Pharmacy {
  id: string
  name: string
  owner: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  subscriptionType: 'basic' | 'premium' | 'enterprise'
  status: 'active' | 'suspended' | 'trial' | 'expired'
  joinDate: string
  lastActivity: string
  revenue: number
  medications: number
  sales: number
  users: number
  version: string
  cpu: number
  memory: number
  storage: number
  uptime: number
  apiCalls: number
  lastBackup: string
}

interface PharmacyDetailsModalProps {
  pharmacy: Pharmacy | null
  isOpen: boolean
  onClose: () => void
}

export function PharmacyDetailsModal({ pharmacy, isOpen, onClose }: PharmacyDetailsModalProps) {
  if (!pharmacy) return null

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Actif', variant: 'default' as const, icon: CheckCircle },
      suspended: { label: 'Suspendu', variant: 'destructive' as const, icon: Ban },
      trial: { label: 'Essai', variant: 'secondary' as const, icon: Clock },
      expired: { label: 'Expiré', variant: 'outline' as const, icon: AlertTriangle }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getSubscriptionBadge = (type: string) => {
    const subscriptionConfig = {
      basic: { label: 'Basic', variant: 'outline' as const },
      premium: { label: 'Premium', variant: 'default' as const },
      enterprise: { label: 'Enterprise', variant: 'secondary' as const }
    }
    const config = subscriptionConfig[type as keyof typeof subscriptionConfig]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getPerformanceColor = (value: number) => {
    if (value >= 95) return 'text-success'
    if (value >= 85) return 'text-warning'
    return 'text-destructive'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Building2 className="h-6 w-6 text-primary" />
            {pharmacy.name}
            <div className="flex items-center gap-2">
              {getStatusBadge(pharmacy.status)}
              {getSubscriptionBadge(pharmacy.subscriptionType)}
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="billing">Facturation</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Informations Générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{pharmacy.owner}</p>
                      <p className="text-sm text-muted-foreground">Propriétaire</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{pharmacy.email}</p>
                      <p className="text-sm text-muted-foreground">Email</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{pharmacy.phone}</p>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{pharmacy.address}</p>
                      <p className="text-sm text-muted-foreground">{pharmacy.city}, {pharmacy.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{new Date(pharmacy.joinDate).toLocaleDateString('fr-FR')}</p>
                      <p className="text-sm text-muted-foreground">Date d'inscription</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Statistiques d'Activité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{pharmacy.users}</p>
                      <p className="text-sm text-muted-foreground">Utilisateurs</p>
                    </div>
                    <div className="text-center p-3 bg-success/10 rounded-lg">
                      <p className="text-2xl font-bold text-success">{pharmacy.sales}</p>
                      <p className="text-sm text-muted-foreground">Ventes</p>
                    </div>
                    <div className="text-center p-3 bg-warning/10 rounded-lg">
                      <p className="text-2xl font-bold text-warning">{pharmacy.medications}</p>
                      <p className="text-sm text-muted-foreground">Médicaments</p>
                    </div>
                    <div className="text-center p-3 bg-accent/20 rounded-lg">
                      <p className="text-2xl font-bold text-foreground">v{pharmacy.version}</p>
                      <p className="text-sm text-muted-foreground">Version</p>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-success/20 to-success/10 rounded-lg">
                    <p className="text-3xl font-bold text-success">€{pharmacy.revenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Revenus générés</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* System Performance */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    Performance Système
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Uptime</span>
                      <span className={`text-sm font-bold ${getPerformanceColor(pharmacy.uptime)}`}>
                        {pharmacy.uptime}%
                      </span>
                    </div>
                    <Progress value={pharmacy.uptime} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">CPU</span>
                      <span className="text-sm font-bold">{pharmacy.cpu}%</span>
                    </div>
                    <Progress value={pharmacy.cpu} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Mémoire</span>
                      <span className="text-sm font-bold">{pharmacy.memory}%</span>
                    </div>
                    <Progress value={pharmacy.memory} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Stockage</span>
                      <span className="text-sm font-bold">{pharmacy.storage}%</span>
                    </div>
                    <Progress value={pharmacy.storage} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* API Usage */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Utilisation API
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <p className="text-3xl font-bold text-primary">{pharmacy.apiCalls.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Appels API ce mois</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Limite mensuelle</span>
                      <span>50,000</span>
                    </div>
                    <Progress value={(pharmacy.apiCalls / 50000) * 100} className="h-2" />
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Dernière activité</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(pharmacy.lastActivity).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subscription Details */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Détails de l'Abonnement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <span className="text-sm font-medium">Plan actuel</span>
                    {getSubscriptionBadge(pharmacy.subscriptionType)}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <span className="text-sm font-medium">Revenus générés</span>
                    <span className="text-lg font-bold text-success">€{pharmacy.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                    <span className="text-sm font-medium">Statut facturation</span>
                    <Badge variant="default">À jour</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <span className="text-sm font-medium">Prochaine facturation</span>
                    <span className="text-sm font-medium">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment History */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Historique des Paiements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-success/10 rounded">
                    <span className="text-sm">Janvier 2024</span>
                    <span className="text-sm font-medium text-success">€79.00</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-success/10 rounded">
                    <span className="text-sm">Décembre 2023</span>
                    <span className="text-sm font-medium text-success">€79.00</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-success/10 rounded">
                    <span className="text-sm">Novembre 2023</span>
                    <span className="text-sm font-medium text-success">€79.00</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger l'historique
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Security Status */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    État de la Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <span className="text-sm font-medium">SSL Certificate</span>
                    <Badge variant="default" className="bg-success text-success-foreground">Valide</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <span className="text-sm font-medium">2FA Activé</span>
                    <Badge variant="default" className="bg-success text-success-foreground">Oui</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                    <span className="text-sm font-medium">Tentatives de connexion</span>
                    <span className="text-sm font-medium">2 échecs récents</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <span className="text-sm font-medium">Dernière sauvegarde</span>
                    <span className="text-sm font-medium">{new Date(pharmacy.lastBackup).toLocaleDateString('fr-FR')}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Access Logs */}
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Logs d'Accès Récents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-success/10 rounded text-sm">
                    <span>Connexion réussie</span>
                    <span className="text-muted-foreground">il y a 2h</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-primary/10 rounded text-sm">
                    <span>Accès API</span>
                    <span className="text-muted-foreground">il y a 3h</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-warning/10 rounded text-sm">
                    <span>Échec connexion</span>
                    <span className="text-muted-foreground">il y a 1j</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-success/10 rounded text-sm">
                    <span>Sauvegarde complète</span>
                    <span className="text-muted-foreground">il y a 1j</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-border/50">
          <div className="flex gap-2">
            <Button variant="outline" className="border-warning/20 hover:bg-warning/10 text-warning">
              <Ban className="h-4 w-4 mr-2" />
              Suspendre
            </Button>
            <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </div>
          <Button 
            onClick={onClose}
            className="bg-gradient-primary hover:opacity-90"
          >
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}