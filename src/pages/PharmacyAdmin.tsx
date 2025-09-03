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
  Database
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

// Mock data for pharmacies
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
}

const mockPharmacies: Pharmacy[] = [
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
    version: '2.1.0'
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
    version: '2.0.5'
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
    version: '2.1.0'
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
    version: '2.1.0'
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
    version: '2.0.8'
  }
]

const PharmacyAdmin = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(mockPharmacies)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Statistics
  const totalPharmacies = pharmacies.length
  const activePharmacies = pharmacies.filter(p => p.status === 'active').length
  const totalRevenue = pharmacies.reduce((sum, p) => sum + p.revenue, 0)
  const totalUsers = pharmacies.reduce((sum, p) => sum + p.users, 0)

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
      active: { label: 'Actif', variant: 'default' as const },
      suspended: { label: 'Suspendu', variant: 'destructive' as const },
      trial: { label: 'Essai', variant: 'secondary' as const },
      expired: { label: 'Expiré', variant: 'outline' as const }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge variant={config.variant}>{config.label}</Badge>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background p-6 space-y-6">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm rounded-xl border shadow-soft p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Administration des Pharmacies
            </h1>
            <p className="text-muted-foreground mt-2">
              Gérez toutes les pharmacies abonnées au système
            </p>
          </div>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-primary hover:opacity-90 transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une Pharmacie
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
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

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pharmacies Actives</p>
                <p className="text-3xl font-bold text-success">{activePharmacies}</p>
              </div>
              <Activity className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenus Totaux</p>
                <p className="text-3xl font-bold text-warning">€{totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilisateurs Total</p>
                <p className="text-3xl font-bold text-primary">{totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="pharmacies" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="pharmacies" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Building2 className="h-4 w-4 mr-2" />
            Pharmacies
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Activity className="h-4 w-4 mr-2" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Settings2 className="h-4 w-4 mr-2" />
            Système
          </TabsTrigger>
        </TabsList>

        {/* Pharmacies Tab */}
        <TabsContent value="pharmacies" className="space-y-6">
          {/* Filters */}
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, propriétaire ou ville..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-48">
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
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Abonnement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les plans</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pharmacies Table */}
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Pharmacie</TableHead>
                    <TableHead>Propriétaire</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>Abonnement</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Revenus</TableHead>
                    <TableHead>Dernière Activité</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPharmacies.map((pharmacy) => (
                    <TableRow key={pharmacy.id} className="border-border/50 hover:bg-accent/30">
                      <TableCell>
                        <div>
                          <p className="font-medium">{pharmacy.name}</p>
                          <p className="text-sm text-muted-foreground">{pharmacy.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{pharmacy.owner}</p>
                          <p className="text-sm text-muted-foreground">{pharmacy.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{pharmacy.city}, {pharmacy.country}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getSubscriptionBadge(pharmacy.subscriptionType)}</TableCell>
                      <TableCell>{getStatusBadge(pharmacy.status)}</TableCell>
                      <TableCell className="font-medium">€{pharmacy.revenue.toLocaleString()}</TableCell>
                      <TableCell>{new Date(pharmacy.lastActivity).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Voir
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Répartition par Abonnement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Enterprise</span>
                    <span>20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span>Premium</span>
                    <span>40%</span>
                  </div>
                  <Progress value={40} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span>Basic</span>
                    <span>40%</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Répartition Géographique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>France</span>
                    <span>40%</span>
                  </div>
                  <Progress value={40} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span>USA</span>
                    <span>20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span>Espagne</span>
                    <span>20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span>Maroc</span>
                    <span>20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-success" />
                  Performance Système
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>CPU</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Mémoire</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Stockage</span>
                      <span>23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Base de Données
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Connexions actives</span>
                    <span className="font-medium">127</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Queries/sec</span>
                    <span className="font-medium">3,456</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Temps de réponse</span>
                    <span className="font-medium text-success">12ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-warning" />
                  Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tentatives bloquées</span>
                    <span className="font-medium text-destructive">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SSL valide</span>
                    <span className="font-medium text-success">✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dernière sauvegarde</span>
                    <span className="font-medium">Il y a 2h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Configuration Système</CardTitle>
              <CardDescription>
                Gérer les paramètres globaux du système
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Notifications</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span>Alertes de sécurité</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span>Rapports automatiques</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span>Notifications de performance</span>
                    </label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Sauvegarde</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Fréquence</span>
                      <span>Quotidienne</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rétention</span>
                      <span>30 jours</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Configurer
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddPharmacyModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(pharmacy) => {
          setPharmacies(prev => [...prev, { ...pharmacy, id: Date.now().toString() }])
          setIsAddModalOpen(false)
        }}
      />
    </div>
  )
}

export default PharmacyAdmin