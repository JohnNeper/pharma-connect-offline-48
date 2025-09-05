import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminStatsCard } from "@/components/admin/AdminStatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

export default function SuperAdminDashboard() {
  const systemStats = [
    {
      title: "Pharmacies Actives",
      value: "847",
      description: "+12 cette semaine",
      icon: Building2,
      trend: "up",
      gradient: "bg-gradient-to-br from-blue-500/10 to-blue-600/20",
      textColor: "text-blue-600"
    },
    {
      title: "Utilisateurs Total",
      value: "3,245",
      description: "+89 ce mois",
      icon: Users,
      trend: "up",
      gradient: "bg-gradient-to-br from-green-500/10 to-green-600/20",
      textColor: "text-green-600"
    },
    {
      title: "Revenus Mensuels",
      value: "€125,840",
      description: "+15.3% vs mois dernier",
      icon: DollarSign,
      trend: "up",
      gradient: "bg-gradient-to-br from-purple-500/10 to-purple-600/20",
      textColor: "text-purple-600"
    },
    {
      title: "Transactions/jour",
      value: "12,847",
      description: "Moyenne sur 7 jours",
      icon: TrendingUp,
      trend: "stable",
      gradient: "bg-gradient-to-br from-orange-500/10 to-orange-600/20",
      textColor: "text-orange-600"
    }
  ];

  const recentAlerts = [
    {
      type: "error",
      message: "Connexion échouée - Pharmacie Centre-Ville",
      time: "Il y a 5 min",
      severity: "high"
    },
    {
      type: "warning", 
      message: "Quota d'API presque atteint - Région Nord",
      time: "Il y a 15 min",
      severity: "medium"
    },
    {
      type: "info",
      message: "Nouvelle demande d'inscription - Pharmacie Soleil",
      time: "Il y a 1h",
      severity: "low"
    }
  ];

  const pendingActions = [
    { action: "Valider 3 nouvelles pharmacies", priority: "high", count: 3 },
    { action: "Renouveler 15 abonnements", priority: "medium", count: 15 },
    { action: "Vérifier 8 rapports d'erreur", priority: "medium", count: 8 },
    { action: "Mettre à jour la documentation", priority: "low", count: 1 }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord Système</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de la plateforme PharmaLink
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Activity className="h-3 w-3 mr-1" />
            Système Opérationnel
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemStats.map((stat, index) => (
          <AdminStatsCard 
            key={index} 
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            gradient={stat.gradient}
            textColor={stat.textColor}
            subtitle={stat.description}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              État du Système
            </CardTitle>
            <CardDescription>Statut des services principaux</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { service: "API Principal", status: "operational", uptime: "99.9%" },
              { service: "Base de Données", status: "operational", uptime: "99.8%" },
              { service: "Service de Paiement", status: "operational", uptime: "100%" },
              { service: "Notifications", status: "degraded", uptime: "95.2%" }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.status === "operational" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="text-sm font-medium">{item.service}</span>
                </div>
                <span className="text-xs text-muted-foreground">{item.uptime}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertes Récentes
            </CardTitle>
            <CardDescription>Événements système importants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAlerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.severity === 'high' ? 'bg-red-500' : 
                  alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full">
              Voir toutes les alertes
            </Button>
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Actions Requises
            </CardTitle>
            <CardDescription>Tâches en attente de validation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingActions.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded border">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    item.priority === 'high' ? 'bg-red-500' : 
                    item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className="text-sm">{item.action}</span>
                </div>
                <Badge variant="secondary">{item.count}</Badge>
              </div>
            ))}
            <Button size="sm" className="w-full">
              Gérer les Actions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}