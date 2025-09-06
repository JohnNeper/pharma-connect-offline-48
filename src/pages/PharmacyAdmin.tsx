import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Building2, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Activity,
  DollarSign,
  Package,
  Bell,
  Settings2,
  BarChart3,
  PieChart,
  Globe,
  Shield,
  Zap,
  Database,
  Server,
  Clock,
  UserCheck,
  CreditCard,
  FileText,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AddPharmacyModal } from '@/components/admin/AddPharmacyModal'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// Enhanced pharmacy interface
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

// Enhanced mock data
const mockPharmacies: any[] = [
  {
    id: '1',
    name: 'Pharmacie Centrale',
    owner: 'Dr. Marie Dubois',
    email: 'marie.dubois@centrale.fr',
    phone: '+33 1 23 45 67 89',
    address: '123 Rue de la Santé',
    city: 'Paris',
    country: 'France',
    subscriptionType: 'premium',
    status: 'active',
    joinDate: '2023-01-15',
    lastActivity: '2024-01-20',
    revenue: 45000,
    medications: 1250,
    sales: 3420,
    users: 8,
    version: '2.1.0',
    cpu: 45,
    memory: 68,
    storage: 72,
    uptime: 99.8,
    apiCalls: 15420,
    lastBackup: '2024-01-20'
  },
  {
    id: '2',
    name: 'Pharmacie du Quartier',
    owner: 'Dr. Jean Martin',
    email: 'j.martin@quartier.fr',
    phone: '+33 2 34 56 78 90',
    address: '456 Avenue des Médicaments',
    city: 'Lyon',
    country: 'France',
    subscriptionType: 'basic',
    status: 'active',
    joinDate: '2023-03-20',
    lastActivity: '2024-01-19',
    revenue: 28000,
    medications: 850,
    sales: 2150,
    users: 4,
    version: '2.0.5',
    cpu: 32,
    memory: 54,
    storage: 45,
    uptime: 98.5,
    apiCalls: 8940,
    lastBackup: '2024-01-19'
  },
  {
    id: '3',
    name: 'MediCare Plus',
    owner: 'Dr. Sarah Johnson',
    email: 'sarah@medicareplus.com',
    phone: '+1 555 123 4567',
    address: '789 Health Street',
    city: 'New York',
    country: 'USA',
    subscriptionType: 'enterprise',
    status: 'active',
    joinDate: '2022-11-10',
    lastActivity: '2024-01-20',
    revenue: 120000,
    medications: 2800,
    sales: 8950,
    users: 25,
    version: '2.1.0',
    cpu: 78,
    memory: 85,
    storage: 89,
    uptime: 99.9,
    apiCalls: 45230,
    lastBackup: '2024-01-20'
  },
  {
    id: '4',
    name: 'Farmacia Verde',
    owner: 'Dr. Carlos Rodriguez',
    email: 'carlos@verde.es',
    phone: '+34 91 234 5678',
    address: 'Calle de la Salud 321',
    city: 'Madrid',
    country: 'Spain',
    subscriptionType: 'basic',
    status: 'trial',
    joinDate: '2024-01-01',
    lastActivity: '2024-01-18',
    revenue: 5000,
    medications: 320,
    sales: 156,
    users: 2,
    version: '2.1.0',
    cpu: 15,
    memory: 32,
    storage: 18,
    uptime: 97.2,
    apiCalls: 1250,
    lastBackup: '2024-01-18'
  },
  {
    id: '5',
    name: 'Pharma Express',
    owner: 'Dr. Ahmed Hassan',
    email: 'ahmed@express.ma',
    phone: '+212 5 22 34 56 78',
    address: 'Boulevard Mohammed V',
    city: 'Casablanca',
    country: 'Morocco',
    subscriptionType: 'premium',
    status: 'suspended',
    joinDate: '2023-06-15',
    lastActivity: '2024-01-10',
    revenue: 35000,
    medications: 980,
    sales: 2800,
    users: 6,
    version: '2.0.8',
    cpu: 12,
    memory: 25,
    storage: 34,
    uptime: 85.4,
    apiCalls: 2340,
    lastBackup: '2024-01-10'
  }
]

const PharmacyAdmin = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(mockPharmacies)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null)

  // Enhanced statistics
  const totalPharmacies = pharmacies.length
  const activePharmacies = pharmacies.filter(p => p.status === 'active').length
  const totalRevenue = pharmacies.reduce((sum, p) => sum + p.revenue, 0)
  const totalUsers = pharmacies.reduce((sum, p) => sum + p.users, 0)
  const avgUptime = pharmacies.reduce((sum, p) => sum + p.uptime, 0) / pharmacies.length
  const criticalAlerts = pharmacies.filter(p => p.uptime < 95 || p.status === 'suspended').length

  // Filter pharmacies
  const filteredPharmacies = pharmacies.filter(pharmacy => {
    const matchesSearch = pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pharmacy.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pharmacy.city.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || pharmacy.status === statusFilter
    const matchesSubscription = subscriptionFilter === 'all' || pharmacy.subscriptionType === subscriptionFilter
    
    return matchesSearch && matchesStatus && matchesSubscription
  })

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
      basic: { label: 'Basic', variant: 'outline' as const, color: 'text-muted-foreground' },
      premium: { label: 'Premium', variant: 'default' as const, color: 'text-primary' },
      enterprise: { label: 'Enterprise', variant: 'secondary' as const, color: 'text-warning' }
    }
    const config = subscriptionConfig[type as keyof typeof subscriptionConfig]
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getPerformanceColor = (value: number) => {
    if (value >= 95) return 'text-success'
    if (value >= 85) return 'text-warning'
    return 'text-destructive'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background">
      <div className="p-6 space-y-6">
        {/* Enhanced Header */}
        <div className="bg-card/95 backdrop-blur-sm rounded-xl border shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Centre d'Administration
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Gestion complète des pharmacies et du système global
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse-soft" />
                  <span className="text-sm text-muted-foreground">Système opérationnel</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Dernière synchronisation: {new Date().toLocaleTimeString('fr-FR')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
                <Download className="h-4 w-4 mr-2" />
                Rapport Global
              </Button>
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Pharmacie
              </Button>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        {criticalAlerts > 0 && (
          <Alert className="border-warning bg-warning/10">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertTitle className="text-warning">Alertes Critiques</AlertTitle>
            <AlertDescription>
              {criticalAlerts} pharmacie(s) nécessitent une attention immédiate
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card className="bg-gradient-to-br from-primary/15 to-primary/5 border-primary/20 lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Pharmacies</p>
                  <p className="text-3xl font-bold text-primary">{totalPharmacies}</p>
                </div>
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/15 to-success/5 border-success/20 lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Actives</p>
                  <p className="text-3xl font-bold text-success">{activePharmacies}</p>
                </div>
                <Activity className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning/15 to-warning/5 border-warning/20 lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenus</p>
                  <p className="text-2xl font-bold text-warning">€{(totalRevenue/1000).toFixed(0)}K</p>
                </div>
                <DollarSign className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/15 to-accent/5 border-primary/20 lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Utilisateurs</p>
                  <p className="text-3xl font-bold text-primary">{totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/15 to-success/5 border-success/20 lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Uptime Moy.</p>
                  <p className={`text-2xl font-bold ${getPerformanceColor(avgUptime)}`}>
                    {avgUptime.toFixed(1)}%
                  </p>
                </div>
                <Server className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-destructive/15 to-destructive/5 border-destructive/20 lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alertes</p>
                  <p className="text-3xl font-bold text-destructive">{criticalAlerts}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs System */}
        <Tabs defaultValue="pharmacies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-card/50 backdrop-blur-sm p-1 h-12">
            <TabsTrigger value="pharmacies" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Building2 className="h-4 w-4 mr-2" />
              Pharmacies
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Activity className="h-4 w-4 mr-2" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Shield className="h-4 w-4 mr-2" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings2 className="h-4 w-4 mr-2" />
              Système
            </TabsTrigger>
          </TabsList>

          {/* Pharmacies Management Tab */}
          <TabsContent value="pharmacies" className="space-y-6">
            {/* Enhanced Filters */}
            <Card className="bg-card/95 backdrop-blur-sm border shadow-soft">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher pharmacies, propriétaires, villes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background/50"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full lg:w-48 bg-background/50">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="suspended">Suspendu</SelectItem>
                      <SelectItem value="trial">Essai</SelectItem>
                      <SelectItem value="expired">Expiré</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
                    <SelectTrigger className="w-full lg:w-48 bg-background/50">
                      <SelectValue placeholder="Abonnement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les plans</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres Avancés
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Pharmacies Table */}
            <Card className="bg-card/95 backdrop-blur-sm border shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Pharmacies Enregistrées ({filteredPharmacies.length})
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50 bg-muted/30">
                        <TableHead className="font-semibold">Pharmacie</TableHead>
                        <TableHead className="font-semibold">Propriétaire</TableHead>
                        <TableHead className="font-semibold">Localisation</TableHead>
                        <TableHead className="font-semibold">Plan</TableHead>
                        <TableHead className="font-semibold">Statut</TableHead>
                        <TableHead className="font-semibold">Performance</TableHead>
                        <TableHead className="font-semibold">Revenus</TableHead>
                        <TableHead className="font-semibold">Dernière Activité</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPharmacies.map((pharmacy) => (
                        <TableRow key={pharmacy.id} className="border-border/50 hover:bg-accent/20 transition-colors">
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium text-foreground">{pharmacy.name}</p>
                              <p className="text-sm text-muted-foreground">{pharmacy.email}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  v{pharmacy.version}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {pharmacy.users} utilisateurs
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium">{pharmacy.owner}</p>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {pharmacy.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{pharmacy.city}</p>
                                <p className="text-sm text-muted-foreground">{pharmacy.country}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getSubscriptionBadge(pharmacy.subscriptionType)}</TableCell>
                          <TableCell>{getStatusBadge(pharmacy.status)}</TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${getPerformanceColor(pharmacy.uptime)}`}>
                                  {pharmacy.uptime}%
                                </span>
                                <span className="text-xs text-muted-foreground">uptime</span>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>CPU</span>
                                  <span>{pharmacy.cpu}%</span>
                                </div>
                                <Progress value={pharmacy.cpu} className="h-1" />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium text-success">€{pharmacy.revenue.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">{pharmacy.sales} ventes</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-sm">{new Date(pharmacy.lastActivity).toLocaleDateString('fr-FR')}</p>
                              <p className="text-xs text-muted-foreground">
                                {Math.floor((Date.now() - new Date(pharmacy.lastActivity).getTime()) / (1000 * 60 * 60 * 24))} jours
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedPharmacy(pharmacy)}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Real-time Performance */}
              <Card className="bg-card/95 backdrop-blur-sm border shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-warning" />
                    Performance Temps Réel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">CPU Global</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mémoire</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Stockage</span>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Bande Passante</span>
                      <span className="text-sm font-medium">34%</span>
                    </div>
                    <Progress value={34} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Database Status */}
              <Card className="bg-card/95 backdrop-blur-sm border shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    État Base de Données
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium">Connexions Actives</span>
                    </div>
                    <span className="text-sm font-bold text-success">847</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-warning" />
                      <span className="text-sm font-medium">Requêtes/sec</span>
                    </div>
                    <span className="text-sm font-bold text-warning">1,234</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Taille DB</span>
                    </div>
                    <span className="text-sm font-bold text-primary">2.4 GB</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Dernière Sauvegarde</span>
                    </div>
                    <span className="text-sm font-bold">15:30</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alert Monitoring */}
            <Card className="bg-card/95 backdrop-blur-sm border shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-destructive" />
                  Alertes Système
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert className="border-destructive bg-destructive/10">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <AlertTitle className="text-destructive">Pharmacie Suspendue</AlertTitle>
                    <AlertDescription>
                      Pharma Express (Casablanca) - Uptime critique: 85.4%
                    </AlertDescription>
                  </Alert>
                  <Alert className="border-warning bg-warning/10">
                    <Clock className="h-4 w-4 text-warning" />
                    <AlertTitle className="text-warning">Maintenance Programmée</AlertTitle>
                    <AlertDescription>
                      Mise à jour système prévue demain 02:00 - 04:00
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-card/95 backdrop-blur-sm border shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Répartition Abonnements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Enterprise</span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Premium</span>
                      <span className="text-sm font-medium">40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Basic</span>
                      <span className="text-sm font-medium">40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/95 backdrop-blur-sm border shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Distribution Géographique
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">France</span>
                      <span className="text-sm font-medium">40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">USA</span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Autres</span>
                      <span className="text-sm font-medium">40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/95 backdrop-blur-sm border shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    Croissance Mensuelle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-success">+12.5%</p>
                    <p className="text-sm text-muted-foreground">Nouvelles inscriptions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">€45.2K</p>
                    <p className="text-sm text-muted-foreground">Revenus ce mois</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/95 backdrop-blur-sm border shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Sécurité Système
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <span className="text-sm font-medium">Firewall</span>
                    <Badge variant="default" className="bg-success text-success-foreground">Actif</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <span className="text-sm font-medium">SSL Certificates</span>
                    <Badge variant="default" className="bg-success text-success-foreground">Valides</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                    <span className="text-sm font-medium">Dernière Intrusion</span>
                    <span className="text-sm font-medium">Aucune (30j)</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/95 backdrop-blur-sm border shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    Authentification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <span className="text-sm font-medium">Sessions Actives</span>
                    <span className="text-sm font-bold text-primary">847</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <span className="text-sm font-medium">2FA Activé</span>
                    <span className="text-sm font-bold text-success">78%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                    <span className="text-sm font-medium">Tentatives Échouées</span>
                    <span className="text-sm font-bold text-warning">12</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/95 backdrop-blur-sm border shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-primary" />
                    Configuration Globale
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Version Système</label>
                    <Input value="PharmaLink v2.1.0" disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Maintenance Mode</label>
                    <Select defaultValue="disabled">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disabled">Désactivé</SelectItem>
                        <SelectItem value="enabled">Activé</SelectItem>
                        <SelectItem value="scheduled">Programmé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Backup Automatique</label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Toutes les heures</SelectItem>
                        <SelectItem value="daily">Quotidien</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/95 backdrop-blur-sm border shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Facturation Globale
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <span className="text-sm font-medium">Revenus ce mois</span>
                    <span className="text-sm font-bold text-success">€{totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <span className="text-sm font-medium">Factures impayées</span>
                    <span className="text-sm font-bold text-primary">3</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                    <span className="text-sm font-medium">Essais expirant</span>
                    <span className="text-sm font-bold text-warning">2</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/95 backdrop-blur-sm border shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Actions Système
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-12 border-primary/20 hover:bg-primary/10">
                    <Server className="h-4 w-4 mr-2" />
                    Redémarrer Services
                  </Button>
                  <Button variant="outline" className="h-12 border-warning/20 hover:bg-warning/10">
                    <Download className="h-4 w-4 mr-2" />
                    Backup Manuel
                  </Button>
                  <Button variant="outline" className="h-12 border-success/20 hover:bg-success/10">
                    <Upload className="h-4 w-4 mr-2" />
                    Mise à Jour
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Pharmacy Modal */}
      <AddPharmacyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(newPharmacy) => {
          setPharmacies([...pharmacies, { 
            ...newPharmacy, 
            id: Date.now().toString(),
            cpu: 0,
            memory: 0,
            storage: 0,
            uptime: 100,
            apiCalls: 0,
            lastBackup: new Date().toISOString().split('T')[0]
          }])
          setIsAddModalOpen(false)
        }}
      />
    </div>
  )
}

export default PharmacyAdmin