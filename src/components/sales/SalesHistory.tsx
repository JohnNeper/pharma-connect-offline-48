import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Filter, Download, Eye, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Sale {
  id: string
  date: string
  customer: string
  items: number
  total: number
  paymentMethod: string
  status: "paid" | "partial" | "pending"
  pharmacy: string
}

const mockSales: Sale[] = [
  {
    id: "VNT-001",
    date: "2024-01-15 14:30",
    customer: "Jean Dupont",
    items: 3,
    total: 850,
    paymentMethod: "Mobile Money",
    status: "paid",
    pharmacy: "Pharmacie Centrale"
  },
  {
    id: "VNT-002", 
    date: "2024-01-15 13:45",
    customer: "Marie Martin",
    items: 1,
    total: 300,
    paymentMethod: "Espèces",
    status: "paid",
    pharmacy: "Pharmacie Nord"
  },
  {
    id: "VNT-003",
    date: "2024-01-15 12:20",
    customer: "Paul Bernard",
    items: 5,
    total: 1250,
    paymentMethod: "Carte bancaire",
    status: "partial",
    pharmacy: "Pharmacie Centrale"
  }
]

export default function SalesHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPharmacy, setSelectedPharmacy] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "paid": return "success"
      case "partial": return "warning" 
      case "pending": return "destructive"
      default: return "default"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid": return "Payé"
      case "partial": return "Partiel"
      case "pending": return "En attente"
      default: return status
    }
  }

  const filteredSales = mockSales.filter(sale => {
    const matchesSearch = sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPharmacy = selectedPharmacy === "all" || sale.pharmacy === selectedPharmacy
    const matchesStatus = selectedStatus === "all" || sale.status === selectedStatus
    
    return matchesSearch && matchesPharmacy && matchesStatus
  })

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0)

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Historique des ventes
          </CardTitle>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher vente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedPharmacy} onValueChange={setSelectedPharmacy}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes pharmacies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes pharmacies</SelectItem>
              <SelectItem value="Pharmacie Centrale">Pharmacie Centrale</SelectItem>
              <SelectItem value="Pharmacie Nord">Pharmacie Nord</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Tous statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              <SelectItem value="paid">Payé</SelectItem>
              <SelectItem value="partial">Partiel</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Période
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">₣ {totalSales.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total des ventes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{filteredSales.length}</p>
            <p className="text-sm text-muted-foreground">Transactions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">₣ {Math.round(totalSales / filteredSales.length || 0)}</p>
            <p className="text-sm text-muted-foreground">Panier moyen</p>
          </div>
        </div>

        {/* Sales Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Vente</TableHead>
              <TableHead>Date/Heure</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Articles</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paiement</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Pharmacie</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">{sale.id}</TableCell>
                <TableCell>{sale.date}</TableCell>
                <TableCell>{sale.customer}</TableCell>
                <TableCell>{sale.items}</TableCell>
                <TableCell className="font-medium">₣ {sale.total.toLocaleString()}</TableCell>
                <TableCell>{sale.paymentMethod}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(sale.status) as any}>
                    {getStatusLabel(sale.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{sale.pharmacy}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}