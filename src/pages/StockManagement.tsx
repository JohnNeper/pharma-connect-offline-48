import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Package, AlertTriangle, Edit, Trash2, Download } from "lucide-react"
import { useTranslation } from 'react-i18next'
import { useData } from "@/contexts/DataContext"
import { AddMedicineModal } from "@/components/modals/AddMedicineModal"
import { useState } from "react"
import { exportToExcel } from "@/lib/export"
import { toast } from "@/hooks/use-toast"

export default function StockManagement() {
  const { t } = useTranslation()
  const { medicines, deleteMedicine } = useData()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const lowStockMedicines = medicines.filter(medicine => medicine.currentStock <= medicine.minStock)
  const expiringMedicines = medicines.filter(medicine => {
    const expiryDate = new Date(medicine.expiryDate)
    const sixMonthsFromNow = new Date()
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)
    return expiryDate <= sixMonthsFromNow
  })

  const handleDeleteMedicine = (id: string) => {
    if (confirm(t('confirmDeleteMedicine'))) {
      deleteMedicine(id)
    }
  }

  const handleExport = () => {
    try {
      exportToExcel(
        'stock-report',
        medicines.map(med => ({
          'Medicine Name': med.name,
          'Form': med.form,
          'Dosage': med.dosage,
          'Current Stock': med.currentStock,
          'Min Stock': med.minStock,
          'Price': `${med.price} FCFA`,
          'Supplier': med.supplier,
          'Expiry Date': med.expiryDate,
          'Batch Number': med.batchNumber,
          'Category': med.category
        }))
      )
      toast({
        title: "Export successful",
        description: "Stock report exported successfully"
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export stock report",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('stock')}</h1>
          <p className="text-muted-foreground">Gérez votre inventaire et suivez les niveaux de stock</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <AddMedicineModal />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Produits en stock</p>
                <p className="text-2xl font-bold">{medicines.length}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stock faible</p>
                <p className="text-2xl font-bold text-warning">{lowStockMedicines.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiration proche</p>
                <p className="text-2xl font-bold text-destructive">{expiringMedicines.length}</p>
              </div>
              <Package className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher médicaments..."
                className="w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Medicines Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventaire des médicaments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('medicineName')}</TableHead>
                <TableHead>{t('form')}</TableHead>
                <TableHead>{t('dosage')}</TableHead>
                <TableHead>Stock actuel</TableHead>
                <TableHead>Stock min</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead>{t('supplier')}</TableHead>
                <TableHead>{t('price')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell className="font-medium">{medicine.name}</TableCell>
                  <TableCell>{medicine.form}</TableCell>
                  <TableCell>{medicine.dosage}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={medicine.currentStock <= medicine.minStock ? 'text-warning font-medium' : ''}>
                        {medicine.currentStock}
                      </span>
                      {medicine.currentStock <= medicine.minStock && (
                        <AlertTriangle className="w-4 h-4 text-warning" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{medicine.minStock}</TableCell>
                  <TableCell>{medicine.expiryDate}</TableCell>
                  <TableCell>{medicine.supplier}</TableCell>
                  <TableCell className="font-medium">₣ {medicine.price}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive"
                        onClick={() => handleDeleteMedicine(medicine.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}