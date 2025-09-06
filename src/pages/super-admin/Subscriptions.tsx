import React, { useState } from 'react';
import { useSuperAdmin } from '@/contexts/SuperAdminContext';
import { AdminStatsCard } from '@/components/admin/AdminStatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Users,
  Search,
  Filter,
  Calendar,
  Building2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download
} from 'lucide-react';

export default function Subscriptions() {
  const { subscriptions, updateSubscription, pharmacies } = useSuperAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  // Filtrer les abonnements
  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || subscription.status === statusFilter;
    const matchesPlan = planFilter === 'all' || subscription.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Calculer les statistiques
  const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.monthlyRevenue, 0);
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'Active').length;
  const trialSubscriptions = subscriptions.filter(sub => sub.status === 'Trial').length;
  const cancelledSubscriptions = subscriptions.filter(sub => sub.status === 'Cancelled').length;

  // Revenus par plan
  const revenueByPlan = {
    Basic: subscriptions.filter(s => s.plan === 'Basic' && s.status === 'Active').reduce((sum, s) => sum + s.monthlyRevenue, 0),
    Pro: subscriptions.filter(s => s.plan === 'Pro' && s.status === 'Active').reduce((sum, s) => sum + s.monthlyRevenue, 0),
    Enterprise: subscriptions.filter(s => s.plan === 'Enterprise' && s.status === 'Active').reduce((sum, s) => sum + s.monthlyRevenue, 0)
  };

  const getStatusBadge = (status: string) => {
    const config = {
      'Active': { variant: 'default', color: 'text-green-600', icon: CheckCircle },
      'Trial': { variant: 'secondary', color: 'text-blue-600', icon: AlertTriangle },
      'Cancelled': { variant: 'destructive', color: 'text-red-600', icon: XCircle },
      'Expired': { variant: 'outline', color: 'text-gray-600', icon: XCircle }
    };
    const item = config[status] || config.Active;
    const Icon = item.icon;
    
    return (
      <Badge variant={item.variant as any} className={item.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getPlanBadge = (plan: string) => {
    const colors = {
      'Basic': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Pro': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Enterprise': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    };
    return (
      <Badge className={colors[plan]}>
        {plan}
      </Badge>
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR');
  };

  const handleSubscriptionAction = (id: string, action: string) => {
    switch (action) {
      case 'cancel':
        updateSubscription(id, { status: 'Cancelled', autoRenew: false });
        break;
      case 'reactivate':
        updateSubscription(id, { status: 'Active', autoRenew: true });
        break;
      case 'suspend':
        updateSubscription(id, { status: 'Expired' });
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Abonnements</h1>
          <p className="text-muted-foreground">Gérez les abonnements et suivez les revenus</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatsCard
          title="Revenus Mensuels"
          value={`€${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          gradient="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50"
          textColor="text-green-600"
          trend={{ value: 12, isPositive: true }}
        />
        <AdminStatsCard
          title="Abonnements Actifs"
          value={activeSubscriptions}
          icon={CheckCircle}
          gradient="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50"
          textColor="text-blue-600"
          trend={{ value: 8, isPositive: true }}
        />
        <AdminStatsCard
          title="Essais Gratuits"
          value={trialSubscriptions}
          icon={Users}
          gradient="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50"
          textColor="text-purple-600"
          trend={{ value: 15, isPositive: true }}
        />
        <AdminStatsCard
          title="Taux de Rétention"
          value="94.2%"
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50"
          textColor="text-orange-600"
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      {/* Revenus par Plan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Plan Basic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">€{revenueByPlan.Basic.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Revenus mensuels</p>
            <div className="mt-2">
              <Badge className="bg-blue-100 text-blue-800">
                {subscriptions.filter(s => s.plan === 'Basic' && s.status === 'Active').length} actifs
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Plan Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">€{revenueByPlan.Pro.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Revenus mensuels</p>
            <div className="mt-2">
              <Badge className="bg-purple-100 text-purple-800">
                {subscriptions.filter(s => s.plan === 'Pro' && s.status === 'Active').length} actifs
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Plan Enterprise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">€{revenueByPlan.Enterprise.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Revenus mensuels</p>
            <div className="mt-2">
              <Badge className="bg-orange-100 text-orange-800">
                {subscriptions.filter(s => s.plan === 'Enterprise' && s.status === 'Active').length} actifs
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
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
                placeholder="Rechercher par nom de pharmacie..."
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
                <SelectItem value="Trial">Essai</SelectItem>
                <SelectItem value="Cancelled">Annulé</SelectItem>
                <SelectItem value="Expired">Expiré</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Plan" />
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

      {/* Table des abonnements */}
      <Card>
        <CardHeader>
          <CardTitle>Abonnements ({filteredSubscriptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pharmacie</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Revenus Mensuels</TableHead>
                <TableHead>Date de Début</TableHead>
                <TableHead>Date de Fin</TableHead>
                <TableHead>Renouvellement Auto</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{subscription.pharmacyName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getPlanBadge(subscription.plan)}</TableCell>
                  <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                  <TableCell>
                    <div className="font-medium">€{subscription.monthlyRevenue}</div>
                    <div className="text-sm text-muted-foreground">par mois</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {formatDate(subscription.startDate)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {formatDate(subscription.endDate)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {subscription.autoRenew ? (
                      <Badge variant="default" className="text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Oui
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-600">
                        <XCircle className="h-3 w-3 mr-1" />
                        Non
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {subscription.status === 'Active' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSubscriptionAction(subscription.id, 'cancel')}
                          className="text-red-600"
                        >
                          Annuler
                        </Button>
                      ) : subscription.status === 'Cancelled' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSubscriptionAction(subscription.id, 'reactivate')}
                          className="text-green-600"
                        >
                          Réactiver
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}