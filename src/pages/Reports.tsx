import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Download, Calendar, DollarSign, Package, Users } from "lucide-react"
import { useTranslation } from 'react-i18next'
import { exportToExcel } from "@/lib/export"
import { toast } from "@/hooks/use-toast"

const salesData = [
  { name: 'Jan', ventes: 45000, commandes: 120 },
  { name: 'Fév', ventes: 52000, commandes: 145 },
  { name: 'Mar', ventes: 48000, commandes: 132 },
  { name: 'Avr', ventes: 61000, commandes: 168 },
  { name: 'Mai', ventes: 55000, commandes: 151 },
  { name: 'Jun', ventes: 67000, commandes: 187 }
]

const topMedicines = [
  { name: 'Paracétamol', value: 2400, color: 'hsl(var(--primary))' },
  { name: 'Amoxicilline', value: 1800, color: 'hsl(var(--success))' },
  { name: 'Aspirine', value: 1200, color: 'hsl(var(--warning))' },
  { name: 'Insuline', value: 800, color: 'hsl(var(--muted))' }
]

export default function Reports() {
  const { t } = useTranslation()

  const handleExport = () => {
    try {
      exportToExcel(
        'sales-report',
        salesData.map(data => ({
          'Month': data.name,
          'Sales': data.ventes,
          'Orders': data.commandes
        }))
      )
      toast({
        title: "Export successful",
        description: "Sales report exported successfully"
      })
    } catch (error) {
      toast({
        title: "Export failed", 
        description: "Failed to export sales report",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('reportsAnalytics')}</h1>
          <p className="text-muted-foreground">Analysez les performances et générez des rapports</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="thisMonth">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisWeek">Cette semaine</SelectItem>
              <SelectItem value="thisMonth">Ce mois</SelectItem>
              <SelectItem value="lastMonth">Mois dernier</SelectItem>
              <SelectItem value="thisYear">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
                <p className="text-2xl font-bold">₣ 328K</p>
                <p className="text-xs text-success">+12% vs mois dernier</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ventes moyennes/jour</p>
                <p className="text-2xl font-bold">₣ 10.6K</p>
                <p className="text-xs text-success">+8% cette semaine</p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Produits vendus</p>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-xs text-warning">-3% vs objectif</p>
              </div>
              <Package className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clients uniques</p>
                <p className="text-2xl font-bold">892</p>
                <p className="text-xs text-success">+15% ce mois</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sales">Ventes</TabsTrigger>
          <TabsTrigger value="inventory">Stock</TabsTrigger>
          <TabsTrigger value="customers">Clients</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution des ventes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="ventes" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top médicaments</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topMedicines}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {topMedicines.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {topMedicines.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Ventes et commandes mensuelles</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ventes" fill="hsl(var(--primary))" name="Ventes (₣)" />
                  <Bar dataKey="commandes" fill="hsl(var(--success))" name="Commandes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Analyse du stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4" />
                <p>Rapports de stock en cours de développement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4" />
                <p>Rapports clients en cours de développement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}