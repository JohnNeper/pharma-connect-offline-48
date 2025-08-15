import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, TruckIcon, Clock, CheckCircle } from "lucide-react"
import { useTranslation } from 'react-i18next'

const mockOrders = [
  {
    id: "ORD-001",
    supplier: "MediCorp Pharmaceuticals",
    date: "2024-01-15",
    status: "pending",
    items: 12,
    total: "₣ 15,240",
    deliveryDate: "2024-01-18"
  },
  {
    id: "ORD-002", 
    supplier: "PharmaDist Global",
    date: "2024-01-14",
    status: "shipped",
    items: 8,
    total: "₣ 8,750",
    deliveryDate: "2024-01-17"
  },
  {
    id: "ORD-003",
    supplier: "DiabetCare Solutions",
    date: "2024-01-12",
    status: "delivered",
    items: 5,
    total: "₣ 3,200",
    deliveryDate: "2024-01-16"
  }
]

export default function Orders() {
  const { t } = useTranslation()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'shipped':
        return <TruckIcon className="w-4 h-4" />
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning' as const
      case 'shipped':
        return 'default' as const
      case 'delivered':
        return 'success' as const
      default:
        return 'default' as const
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('orderManagement')}</h1>
          <p className="text-muted-foreground">Gérez vos commandes et suivez les livraisons</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          {t('createOrder')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher commandes..."
                className="w-full pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('orderHistory')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Commande</TableHead>
                <TableHead>{t('supplier')}</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead>{t('total')}</TableHead>
                <TableHead>Livraison</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.supplier}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)} className="gap-1">
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell className="font-medium">{order.total}</TableCell>
                  <TableCell>{order.deliveryDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Voir</Button>
                      <Button variant="outline" size="sm">{t('edit')}</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Commandes ce mois</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <TruckIcon className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valeur totale</p>
                <p className="text-2xl font-bold">₣ 127K</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}