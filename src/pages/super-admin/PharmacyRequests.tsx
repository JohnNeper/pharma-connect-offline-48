import React, { useState } from 'react';
import { useSuperAdmin } from '@/contexts/SuperAdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  FileText, 
  Search, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building2,
  User,
  Download,
  Clock
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function PharmacyRequests() {
  const { pharmacyRequests, approvePharmacyRequest, rejectPharmacyRequest } = useSuperAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filtrer les demandes
  const filteredRequests = pharmacyRequests.filter(request =>
    request.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingRequests = filteredRequests.filter(req => req.status === 'Pending');
  const processedRequests = filteredRequests.filter(req => req.status !== 'Pending');

  const handleApprove = (id: string) => {
    approvePharmacyRequest(id);
    toast({
      title: "Demande approuvée",
      description: "La pharmacie a été ajoutée au système avec succès.",
    });
  };

  const handleReject = (id: string) => {
    rejectPharmacyRequest(id);
    toast({
      title: "Demande rejetée",
      description: "La demande d'inscription a été rejetée.",
      variant: "destructive"
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Pending': { variant: 'outline', color: 'text-yellow-600', icon: Clock },
      'Approved': { variant: 'default', color: 'text-green-600', icon: CheckCircle },
      'Rejected': { variant: 'destructive', color: 'text-red-600', icon: XCircle }
    };
    const config = variants[status] || variants.Pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant as any} className={config.color}>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Demandes d'Inscription</h1>
        <p className="text-muted-foreground">Gérez les demandes d'inscription des nouvelles pharmacies</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En Attente</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingRequests.length}</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approuvées</p>
                <p className="text-3xl font-bold text-green-600">
                  {processedRequests.filter(r => r.status === 'Approved').length}
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">Rejetées</p>
                <p className="text-3xl font-bold text-red-600">
                  {processedRequests.filter(r => r.status === 'Rejected').length}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Rechercher
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom de pharmacie, propriétaire, email ou ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Demandes en attente */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <Clock className="h-5 w-5" />
              Demandes en Attente ({pendingRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pharmacie</TableHead>
                  <TableHead>Propriétaire</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Plan Demandé</TableHead>
                  <TableHead>Date de Soumission</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {request.pharmacyName}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {request.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {request.ownerName}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {request.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{request.city}, {request.country}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getPlanBadge(request.requestedPlan)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {request.submittedAt.toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        {request.documents.length} document(s)
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Voir
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(request.id)}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Rejeter
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Historique des demandes traitées */}
      {processedRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des Demandes ({processedRequests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pharmacie</TableHead>
                  <TableHead>Propriétaire</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.pharmacyName}</div>
                        <div className="text-sm text-muted-foreground">{request.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.ownerName}</div>
                        <div className="text-sm text-muted-foreground">{request.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{request.city}, {request.country}</TableCell>
                    <TableCell>{getPlanBadge(request.requestedPlan)}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>{request.submittedAt.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedRequest(request);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Voir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Modal de détails */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Détails de la Demande</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedRequest.pharmacyName}</h3>
                    <p className="text-muted-foreground">Propriétaire: {selectedRequest.ownerName}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedRequest.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedRequest.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedRequest.address}, {selectedRequest.city}, {selectedRequest.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Soumise le: {selectedRequest.submittedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {getPlanBadge(selectedRequest.requestedPlan)}
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Documents Fournis</h4>
                    <div className="space-y-2">
                      {selectedRequest.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{doc}</span>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Télécharger
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {selectedRequest.status === 'Pending' && (
                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    onClick={() => {
                      handleApprove(selectedRequest.id);
                      setIsDetailModalOpen(false);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approuver la Demande
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleReject(selectedRequest.id);
                      setIsDetailModalOpen(false);
                    }}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter la Demande
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}