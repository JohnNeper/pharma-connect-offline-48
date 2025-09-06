import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Activity, 
  Search, 
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Calendar,
  User,
  Building2,
  Database,
  Shield,
  RefreshCw
} from 'lucide-react';

interface SystemActivityLog {
  id: string;
  timestamp: Date;
  type: 'Login' | 'Logout' | 'PharmacyCreated' | 'PharmacyUpdated' | 'UserCreated' | 'SystemError' | 'DataBackup' | 'SecurityAlert';
  severity: 'Info' | 'Warning' | 'Error' | 'Success';
  user: string;
  description: string;
  details: string;
  ipAddress: string;
  pharmacyId?: string;
  pharmacyName?: string;
}

const mockActivityLogs: SystemActivityLog[] = [
  {
    id: '1',
    timestamp: new Date(),
    type: 'Login',
    severity: 'Info',
    user: 'sarah@pharmalink.com',
    description: 'Connexion au système SuperAdmin',
    details: 'Connexion réussie depuis Paris, France',
    ipAddress: '192.168.1.100'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: 'PharmacyCreated',
    severity: 'Success',
    user: 'sarah@pharmalink.com',
    description: 'Nouvelle pharmacie ajoutée au système',
    details: 'Pharmacie de l\'Avenir créée avec succès',
    ipAddress: '192.168.1.100',
    pharmacyId: 'ph-001',
    pharmacyName: 'Pharmacie de l\'Avenir'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    type: 'SecurityAlert',
    severity: 'Warning',
    user: 'system',
    description: 'Tentative de connexion suspecte détectée',
    details: 'Multiple tentatives de connexion échouées depuis 45.67.89.123',
    ipAddress: '45.67.89.123'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    type: 'DataBackup',
    severity: 'Success',
    user: 'system',
    description: 'Sauvegarde automatique des données',
    details: 'Sauvegarde quotidienne terminée avec succès - 2.3GB',
    ipAddress: 'system'
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: 'SystemError',
    severity: 'Error',
    user: 'system',
    description: 'Erreur de connexion base de données',
    details: 'Timeout de connexion à la base de données principale - Résolu automatiquement',
    ipAddress: 'system'
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    type: 'UserCreated',
    severity: 'Success',
    user: 'sarah@pharmalink.com',
    description: 'Nouvel utilisateur système créé',
    details: 'Compte Admin Régional pour Mohamed (région Maghreb)',
    ipAddress: '192.168.1.100'
  }
];

export default function SystemActivity() {
  const [activityLogs] = useState<SystemActivityLog[]>(mockActivityLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  // Filtrer les logs
  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    
    return matchesSearch && matchesType && matchesSeverity;
  });

  // Calculer les statistiques
  const stats = {
    total: activityLogs.length,
    errors: activityLogs.filter(log => log.severity === 'Error').length,
    warnings: activityLogs.filter(log => log.severity === 'Warning').length,
    success: activityLogs.filter(log => log.severity === 'Success').length
  };

  const getSeverityBadge = (severity: string) => {
    const config = {
      'Info': { variant: 'outline', color: 'text-blue-600', icon: Info },
      'Success': { variant: 'default', color: 'text-green-600', icon: CheckCircle },
      'Warning': { variant: 'secondary', color: 'text-orange-600', icon: AlertTriangle },
      'Error': { variant: 'destructive', color: 'text-red-600', icon: XCircle }
    };
    const item = config[severity] || config.Info;
    const Icon = item.icon;
    
    return (
      <Badge variant={item.variant as any} className={item.color}>
        <Icon className="h-3 w-3 mr-1" />
        {severity}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'Login': User,
      'Logout': User,
      'PharmacyCreated': Building2,
      'PharmacyUpdated': Building2,
      'UserCreated': User,
      'SystemError': XCircle,
      'DataBackup': Database,
      'SecurityAlert': Shield
    };
    return icons[type] || Activity;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `il y a ${diffMins} min`;
    if (diffHours < 24) return `il y a ${diffHours}h`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activité Système</h1>
          <p className="text-muted-foreground">Surveillez l'activité en temps réel sur la plateforme</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Activités</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Succès</p>
                <p className="text-3xl font-bold text-green-600">{stats.success}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avertissements</p>
                <p className="text-3xl font-bold text-orange-600">{stats.warnings}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Erreurs</p>
                <p className="text-3xl font-bold text-red-600">{stats.errors}</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les activités..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type d'activité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="Login">Connexions</SelectItem>
                <SelectItem value="PharmacyCreated">Pharmacies</SelectItem>
                <SelectItem value="UserCreated">Utilisateurs</SelectItem>
                <SelectItem value="SystemError">Erreurs système</SelectItem>
                <SelectItem value="SecurityAlert">Sécurité</SelectItem>
                <SelectItem value="DataBackup">Sauvegardes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="Info">Information</SelectItem>
                <SelectItem value="Success">Succès</SelectItem>
                <SelectItem value="Warning">Avertissement</SelectItem>
                <SelectItem value="Error">Erreur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Journal d'activité */}
      <Card>
        <CardHeader>
          <CardTitle>Journal d'Activité ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Horodatage</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Détails</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => {
                const Icon = getTypeIcon(log.type);
                return (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">{log.timestamp.toLocaleTimeString()}</div>
                        <div className="text-xs text-muted-foreground">{formatTimeAgo(log.timestamp)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{log.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{log.user}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.description}</div>
                        {log.pharmacyName && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {log.pharmacyName}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground max-w-xs truncate" title={log.details}>
                        {log.details}
                      </div>
                    </TableCell>
                    <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{log.ipAddress}</code>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}