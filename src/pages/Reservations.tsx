import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CalendarIcon, Clock, Plus, Search, Filter, Download, Phone, Mail, User, Package, AlertCircle, CheckCircle2, XCircle, MoreHorizontal } from "lucide-react"
import { useData } from "@/contexts/DataContext"
import { useTranslation } from "react-i18next"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Reservation {
  id: string
  patientId: string
  medicineId: string
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled'
  reservationDate: Date
  pickupDate?: Date
  quantity: number
  notes?: string
  phoneNumber?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  totalAmount: number
  createdAt: Date
}

const mockReservations: Reservation[] = [
  {
    id: "1",
    patientId: "1",
    medicineId: "1",
    status: "confirmed",
    reservationDate: new Date(),
    pickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    quantity: 2,
    notes: "Besoin urgent pour traitement",
    phoneNumber: "+33123456789",
    priority: "high",
    paymentStatus: "pending",
    totalAmount: 45.80,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: "2",
    patientId: "2",
    medicineId: "2",
    status: "ready",
    reservationDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    pickupDate: new Date(),
    quantity: 1,
    phoneNumber: "+33987654321",
    priority: "medium",
    paymentStatus: "paid",
    totalAmount: 12.50,
    createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000)
  }
]

export default function Reservations() {
  const { t } = useTranslation()
  const { patients, medicines } = useData()
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newReservation, setNewReservation] = useState({
    patientId: "",
    medicineId: "",
    quantity: 1,
    pickupDate: undefined as Date | undefined,
    notes: "",
    phoneNumber: "",
    priority: "medium" as const
  })

  const filteredReservations = useMemo(() => {
    return reservations.filter(reservation => {
      const patient = patients.find(p => p.id === reservation.patientId)
      const medicine = medicines.find(m => m.id === reservation.medicineId)
      
      const matchesSearch = 
        patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.phoneNumber?.includes(searchTerm) ||
        reservation.id.includes(searchTerm)
      
      const matchesStatus = statusFilter === "all" || reservation.status === statusFilter
      const matchesPriority = priorityFilter === "all" || reservation.priority === priorityFilter
      
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [reservations, searchTerm, statusFilter, priorityFilter, patients, medicines])

  const stats = useMemo(() => {
    return {
      total: reservations.length,
      pending: reservations.filter(r => r.status === 'pending').length,
      confirmed: reservations.filter(r => r.status === 'confirmed').length,
      ready: reservations.filter(r => r.status === 'ready').length,
      completed: reservations.filter(r => r.status === 'completed').length,
      cancelled: reservations.filter(r => r.status === 'cancelled').length,
      todayPickups: reservations.filter(r => 
        r.pickupDate && format(r.pickupDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
      ).length,
      revenue: reservations.filter(r => r.paymentStatus === 'paid').reduce((sum, r) => sum + r.totalAmount, 0)
    }
  }, [reservations])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/20 text-warning-foreground border-warning/30'
      case 'confirmed': return 'bg-primary/20 text-primary-foreground border-primary/30'
      case 'ready': return 'bg-success/20 text-success-foreground border-success/30'
      case 'completed': return 'bg-muted text-muted-foreground border-border'
      case 'cancelled': return 'bg-destructive/20 text-destructive-foreground border-destructive/30'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive text-destructive-foreground'
      case 'high': return 'bg-warning text-warning-foreground'
      case 'medium': return 'bg-primary text-primary-foreground'
      case 'low': return 'bg-muted text-muted-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const handleCreateReservation = () => {
    if (!newReservation.patientId || !newReservation.medicineId || !newReservation.pickupDate) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      })
      return
    }

    const medicine = medicines.find(m => m.id === newReservation.medicineId)
    if (!medicine) return

    const reservation: Reservation = {
      id: Date.now().toString(),
      patientId: newReservation.patientId,
      medicineId: newReservation.medicineId,
      status: 'pending',
      reservationDate: new Date(),
      pickupDate: newReservation.pickupDate,
      quantity: newReservation.quantity,
      notes: newReservation.notes,
      phoneNumber: newReservation.phoneNumber,
      priority: newReservation.priority,
      paymentStatus: 'pending',
      totalAmount: medicine.price * newReservation.quantity,
      createdAt: new Date()
    }

    setReservations(prev => [reservation, ...prev])
    setIsCreateModalOpen(false)
    setNewReservation({
      patientId: "",
      medicineId: "",
      quantity: 1,
      pickupDate: undefined,
      notes: "",
      phoneNumber: "",
      priority: "medium"
    })

    toast({
      title: "Réservation créée",
      description: "La réservation a été créée avec succès"
    })
  }

  const updateReservationStatus = (id: string, newStatus: Reservation['status']) => {
    setReservations(prev => prev.map(r => 
      r.id === id ? { ...r, status: newStatus } : r
    ))
    toast({
      title: "Statut mis à jour",
      description: `Réservation marquée comme ${newStatus}`
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête avec statistiques */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Réservations</h1>
            <p className="text-muted-foreground">Gérez les réservations de médicaments</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle réservation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Créer une réservation</DialogTitle>
                  <DialogDescription>
                    Créez une nouvelle réservation de médicament pour un patient
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient">Patient *</Label>
                      <Select value={newReservation.patientId} onValueChange={(value) => setNewReservation(prev => ({ ...prev, patientId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map(patient => (
                            <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medicine">Médicament *</Label>
                      <Select value={newReservation.medicineId} onValueChange={(value) => setNewReservation(prev => ({ ...prev, medicineId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un médicament" />
                        </SelectTrigger>
                        <SelectContent>
                          {medicines.map(medicine => (
                            <SelectItem key={medicine.id} value={medicine.id}>{medicine.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantité</Label>
                      <Input
                        type="number"
                        min="1"
                        value={newReservation.quantity}
                        onChange={(e) => setNewReservation(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priorité</Label>
                      <Select value={newReservation.priority} onValueChange={(value: any) => setNewReservation(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Faible</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="high">Élevée</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date de retrait *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newReservation.pickupDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newReservation.pickupDate ? format(newReservation.pickupDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={newReservation.pickupDate}
                            onSelect={(date) => setNewReservation(prev => ({ ...prev, pickupDate: date }))}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Numéro de téléphone</Label>
                    <Input
                      placeholder="+33..."
                      value={newReservation.phoneNumber}
                      onChange={(e) => setNewReservation(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      placeholder="Instructions spéciales, informations complémentaires..."
                      value={newReservation.notes}
                      onChange={(e) => setNewReservation(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateReservation}>
                    Créer la réservation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistiques en cartes */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card className="bg-gradient-primary text-primary-foreground">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm opacity-90">Total</p>
            </CardContent>
          </Card>
          <Card className="border-warning/30 bg-warning/10">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-warning">{stats.pending}</div>
              <p className="text-sm text-warning-foreground">En attente</p>
            </CardContent>
          </Card>
          <Card className="border-primary/30 bg-primary/10">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{stats.confirmed}</div>
              <p className="text-sm text-primary-foreground">Confirmées</p>
            </CardContent>
          </Card>
          <Card className="border-success/30 bg-success/10">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-success">{stats.ready}</div>
              <p className="text-sm text-success-foreground">Prêtes</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-muted/30">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-muted-foreground">{stats.completed}</div>
              <p className="text-sm text-muted-foreground">Terminées</p>
            </CardContent>
          </Card>
          <Card className="border-primary/30 bg-accent">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-accent-foreground">{stats.todayPickups}</div>
              <p className="text-sm text-accent-foreground">Aujourd'hui</p>
            </CardContent>
          </Card>
          <Card className="border-success/30 bg-gradient-success text-success-foreground">
            <CardContent className="p-4">
              <div className="text-xl font-bold">{stats.revenue.toFixed(2)}€</div>
              <p className="text-sm opacity-90">Chiffre d'affaires</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher par patient, médicament, téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmée</SelectItem>
                <SelectItem value="ready">Prête</SelectItem>
                <SelectItem value="completed">Terminée</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Toutes priorités" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes priorités</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="high">Élevée</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="low">Faible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des réservations */}
      <Card>
        <CardHeader>
          <CardTitle>Réservations actives</CardTitle>
          <CardDescription>
            {filteredReservations.length} réservation(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Médicament</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Date retrait</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation) => {
                  const patient = patients.find(p => p.id === reservation.patientId)
                  const medicine = medicines.find(m => m.id === reservation.medicineId)
                  
                  return (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-mono text-sm">#{reservation.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{patient?.name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <span>{medicine?.name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{reservation.quantity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {reservation.pickupDate ? format(reservation.pickupDate, "dd/MM/yyyy", { locale: fr }) : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(reservation.priority)}>
                          {reservation.priority === 'urgent' ? 'Urgente' :
                           reservation.priority === 'high' ? 'Élevée' :
                           reservation.priority === 'medium' ? 'Moyenne' : 'Faible'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status === 'pending' ? 'En attente' :
                           reservation.status === 'confirmed' ? 'Confirmée' :
                           reservation.status === 'ready' ? 'Prête' :
                           reservation.status === 'completed' ? 'Terminée' : 'Annulée'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{reservation.totalAmount.toFixed(2)}€</TableCell>
                      <TableCell>
                        {reservation.phoneNumber && (
                          <Button variant="ghost" size="sm">
                            <Phone className="w-4 h-4" />
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {reservation.status === 'pending' && (
                              <DropdownMenuItem onClick={() => updateReservationStatus(reservation.id, 'confirmed')}>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Confirmer
                              </DropdownMenuItem>
                            )}
                            {reservation.status === 'confirmed' && (
                              <DropdownMenuItem onClick={() => updateReservationStatus(reservation.id, 'ready')}>
                                <Package className="w-4 h-4 mr-2" />
                                Marquer prête
                              </DropdownMenuItem>
                            )}
                            {reservation.status === 'ready' && (
                              <DropdownMenuItem onClick={() => updateReservationStatus(reservation.id, 'completed')}>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Marquer terminée
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => updateReservationStatus(reservation.id, 'cancelled')}>
                              <XCircle className="w-4 h-4 mr-2" />
                              Annuler
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}