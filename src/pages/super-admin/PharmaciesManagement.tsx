import React, { useState } from 'react';
import { useSuperAdmin } from '@/contexts/SuperAdminContext';
import { AdminStatsCard } from '@/components/admin/AdminStatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AddPharmacyModal } from '@/components/admin/AddPharmacyModal';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Activity,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function PharmaciesManagement() {
  const { pharmacies, addPharmacy, updatePharmacy, deletePharmacy } = useSuperAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filtrer les pharmacies
  const filteredPharmacies = pharmacies.filter(pharmacy => {
    const matchesSearch = pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pharmacy.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pharmacy.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pharmacy.status === statusFilter;
    const matchesSubscription = subscriptionFilter === 'all' || pharmacy.subscriptionType === subscriptionFilter;
    
    return matchesSearch && matchesStatus && matchesSubscription;
  });

  // Calculer les statistiques
  const totalPharmacies = pharmacies.length;
  const activePharmacies = pharmacies.filter(p => p.status === 'Active').length;
  const totalRevenue = pharmacies.reduce((sum, p) => sum + p.revenue, 0);
  const avgUptime = pharmacies.reduce((sum, p) => sum + p.uptime, 0) / pharmacies.length;

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'default',
      'Inactive': 'secondary',
      'Pending': 'outline',
      'Suspended': 'destructive'
    };
    return <Badge variant={variants[status] as any}>{status}</Badge>;
  };

  const getSubscriptionBadge = (type: string) => {
    const variants = {
      'Basic': 'secondary',
      'Pro': 'default', 
      'Enterprise': 'destructive'
    };
    const colors = {
      'Basic': 'text-blue-600',
      'Pro': 'text-purple-600',
      'Enterprise': 'text-orange-600'
    };
    return <Badge variant={variants[type] as any} className={colors[type]}>{type}</Badge>;
  };

  const handlePharmacyAction = (action: string, pharmacy: any) => {
    switch (action) {
      case 'view':
        setSelectedPharmacy(pharmacy);
        setIsDetailModalOpen(true);
        break;
      case 'edit':
        // Implémenter l'édition
        break;
      case 'suspend':
        updatePharmacy(pharmacy.id, { status: 'Suspended' });
        break;
      case 'activate':
        updatePharmacy(pharmacy.id, { status: 'Active' });
        break;
      case 'delete':
        if (confirm('Êtes-vous sûr de vouloir supprimer cette pharmacie ?')) {
          deletePharmacy(pharmacy.id);
        }
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Pharmacies</h1>
          <p className="text-muted-foreground">Gérez toutes les pharmacies enregistrées sur la plateforme</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une Pharmacie
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatsCard
          title="Total Pharmacies"
          value={totalPharmacies}
          icon={Building2}
          gradient="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50"
          textColor="text-blue-600"
          trend={{ value: 12, isPositive: true }}
        />
        <AdminStatsCard
          title="Pharmacies Actives"
          value={activePharmacies}
          icon={Activity}
          gradient="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50"
          textColor="text-green-600"
          trend={{ value: 8, isPositive: true }}
        />
        <AdminStatsCard
          title="Revenus Total"
          value={`€${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          gradient="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50"
          textColor="text-purple-600"
          trend={{ value: 15, isPositive: true }}
        />
        <AdminStatsCard
          title="Uptime Moyen"
          value={`${avgUptime.toFixed(1)}%`}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50"
          textColor="text-orange-600"
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      {/* Filtres et Recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, propriétaire ou ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Active">Actif</SelectItem>
                <SelectItem value="Inactive">Inactif</SelectItem>
                <SelectItem value="Pending">En attente</SelectItem>
                <SelectItem value="Suspended">Suspendu</SelectItem>
              </SelectContent>
            </Select>
            <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Abonnement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les plans</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table des Pharmacies */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Pharmacies ({filteredPharmacies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pharmacie</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Abonnement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Revenus</TableHead>
                <TableHead>Uptime</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPharmacies.map((pharmacy) => (
                <TableRow key={pharmacy.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{pharmacy.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {pharmacy.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{pharmacy.owner}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {pharmacy.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{pharmacy.city}, {pharmacy.country}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getSubscriptionBadge(pharmacy.subscriptionType)}</TableCell>
                  <TableCell>{getStatusBadge(pharmacy.status)}</TableCell>
                  <TableCell className="font-medium">€{pharmacy.revenue.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        pharmacy.uptime > 99 ? 'bg-green-500' : 
                        pharmacy.uptime > 95 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      {pharmacy.uptime.toFixed(1)}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePharmacyAction('view', pharmacy)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePharmacyAction('edit', pharmacy)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        {pharmacy.status === 'Active' ? (
                          <DropdownMenuItem 
                            onClick={() => handlePharmacyAction('suspend', pharmacy)}
                            className="text-orange-600"
                          >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Suspendre
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => handlePharmacyAction('activate', pharmacy)}
                            className="text-green-600"
                          >
                            <Activity className="h-4 w-4 mr-2" />
                            Activer
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handlePharmacyAction('delete', pharmacy)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal d'ajout de pharmacie */}
      <AddPharmacyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(pharmacy) => {
          addPharmacy(pharmacy);
          setIsAddModalOpen(false);
        }}
      />

      {/* Modal de détails de pharmacie */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Détails de la Pharmacie</DialogTitle>
          </DialogHeader>
          {selectedPharmacy && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedPharmacy.name}</h3>
                  <p className="text-muted-foreground">Propriétaire: {selectedPharmacy.owner}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedPharmacy.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedPharmacy.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedPharmacy.address}, {selectedPharmacy.city}, {selectedPharmacy.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Membre depuis: {selectedPharmacy.joinDate.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{selectedPharmacy.employeeCount}</div>
                        <div className="text-sm text-muted-foreground">Employés</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{selectedPharmacy.monthlyTransactions}</div>
                        <div className="text-sm text-muted-foreground">Transactions/mois</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex gap-2">
                  {getSubscriptionBadge(selectedPharmacy.subscriptionType)}
                  {getStatusBadge(selectedPharmacy.status)}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}