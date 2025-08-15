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
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Calendar, CalendarIcon, Tag, Plus, Search, Filter, Download, Eye, Edit, Trash2, Share2, Target, TrendingUp, Users, ShoppingCart, Smartphone, Megaphone, Gift, Percent, Star, BarChart3 } from "lucide-react"
import { useData } from "@/contexts/DataContext"
import { useTranslation } from "react-i18next"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Promotion {
  id: string
  title: string
  description: string
  type: 'discount' | 'bogo' | 'bundle' | 'loyalty' | 'seasonal'
  discountType: 'percentage' | 'fixed' | 'freeShipping'
  discountValue: number
  startDate: Date
  endDate: Date
  targetAudience: 'all' | 'new' | 'returning' | 'vip' | 'mobile'
  medicineIds: string[]
  isActive: boolean
  usageCount: number
  usageLimit?: number
  minPurchase?: number
  maxDiscount?: number
  promoCode?: string
  mobileOnly: boolean
  priority: number
  createdAt: Date
  imageUrl?: string
  tags: string[]
  analytics: {
    views: number
    clicks: number
    conversions: number
    revenue: number
  }
}

const mockPromotions: Promotion[] = [
  {
    id: "1",
    title: "Réduction Santé Hivernale",
    description: "20% de réduction sur tous les médicaments contre le rhume et la grippe",
    type: "discount",
    discountType: "percentage",
    discountValue: 20,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    targetAudience: "all",
    medicineIds: ["1", "2"],
    isActive: true,
    usageCount: 45,
    usageLimit: 100,
    minPurchase: 25,
    maxDiscount: 50,
    promoCode: "HIVER20",
    mobileOnly: false,
    priority: 1,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    tags: ["hiver", "santé", "mobile"],
    analytics: {
      views: 1250,
      clicks: 180,
      conversions: 45,
      revenue: 890.50
    }
  },
  {
    id: "2",
    title: "Offre Mobile Exclusive",
    description: "Livraison gratuite + 10% de réduction via l'app mobile",
    type: "bundle",
    discountType: "freeShipping",
    discountValue: 10,
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    targetAudience: "mobile",
    medicineIds: [],
    isActive: true,
    usageCount: 23,
    minPurchase: 30,
    promoCode: "MOBILE10",
    mobileOnly: true,
    priority: 2,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    tags: ["mobile", "livraison", "exclusif"],
    analytics: {
      views: 890,
      clicks: 120,
      conversions: 23,
      revenue: 456.80
    }
  }
]

export default function Promotions() {
  const { t } = useTranslation()
  const { medicines } = useData()
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("list")
  const [newPromotion, setNewPromotion] = useState({
    title: "",
    description: "",
    type: "discount" as const,
    discountType: "percentage" as const,
    discountValue: 0,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    targetAudience: "all" as const,
    medicineIds: [] as string[],
    promoCode: "",
    minPurchase: 0,
    usageLimit: 100,
    mobileOnly: false,
    tags: ""
  })

  const filteredPromotions = useMemo(() => {
    return promotions.filter(promotion => {
      const matchesSearch = 
        promotion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.promoCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesType = typeFilter === "all" || promotion.type === typeFilter
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "active" && promotion.isActive) ||
        (statusFilter === "inactive" && !promotion.isActive) ||
        (statusFilter === "mobile" && promotion.mobileOnly)
      
      return matchesSearch && matchesType && matchesStatus
    })
  }, [promotions, searchTerm, typeFilter, statusFilter])

  const stats = useMemo(() => {
    const activePromotions = promotions.filter(p => p.isActive)
    const totalRevenue = promotions.reduce((sum, p) => sum + p.analytics.revenue, 0)
    const totalConversions = promotions.reduce((sum, p) => sum + p.analytics.conversions, 0)
    const totalViews = promotions.reduce((sum, p) => sum + p.analytics.views, 0)
    const mobilePromotions = promotions.filter(p => p.mobileOnly || p.targetAudience === 'mobile')
    
    return {
      total: promotions.length,
      active: activePromotions.length,
      mobile: mobilePromotions.length,
      revenue: totalRevenue,
      conversions: totalConversions,
      views: totalViews,
      conversionRate: totalViews > 0 ? (totalConversions / totalViews * 100) : 0,
      avgOrderValue: totalConversions > 0 ? totalRevenue / totalConversions : 0
    }
  }, [promotions])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'discount': return 'bg-primary/20 text-primary-foreground border-primary/30'
      case 'bogo': return 'bg-success/20 text-success-foreground border-success/30'
      case 'bundle': return 'bg-warning/20 text-warning-foreground border-warning/30'
      case 'loyalty': return 'bg-accent text-accent-foreground border-accent'
      case 'seasonal': return 'bg-secondary text-secondary-foreground border-secondary'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const generatePromoCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setNewPromotion(prev => ({ ...prev, promoCode: code }))
  }

  const handleCreatePromotion = () => {
    if (!newPromotion.title || !newPromotion.startDate || !newPromotion.endDate) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      })
      return
    }

    const promotion: Promotion = {
      id: Date.now().toString(),
      title: newPromotion.title,
      description: newPromotion.description,
      type: newPromotion.type,
      discountType: newPromotion.discountType,
      discountValue: newPromotion.discountValue,
      startDate: newPromotion.startDate,
      endDate: newPromotion.endDate,
      targetAudience: newPromotion.targetAudience,
      medicineIds: newPromotion.medicineIds,
      isActive: true,
      usageCount: 0,
      usageLimit: newPromotion.usageLimit,
      minPurchase: newPromotion.minPurchase,
      promoCode: newPromotion.promoCode,
      mobileOnly: newPromotion.mobileOnly,
      priority: promotions.length + 1,
      createdAt: new Date(),
      tags: newPromotion.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      analytics: {
        views: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0
      }
    }

    setPromotions(prev => [promotion, ...prev])
    setIsCreateModalOpen(false)
    setNewPromotion({
      title: "",
      description: "",
      type: "discount",
      discountType: "percentage",
      discountValue: 0,
      startDate: undefined,
      endDate: undefined,
      targetAudience: "all",
      medicineIds: [],
      promoCode: "",
      minPurchase: 0,
      usageLimit: 100,
      mobileOnly: false,
      tags: ""
    })

    toast({
      title: "Promotion créée",
      description: "La promotion a été créée avec succès"
    })
  }

  const togglePromotionStatus = (id: string) => {
    setPromotions(prev => prev.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête avec statistiques */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Promotions & Marketing</h1>
            <p className="text-muted-foreground">Gérez vos campagnes promotionnelles et marketing mobile</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Rapport
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle promotion
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Créer une promotion</DialogTitle>
                  <DialogDescription>
                    Créez une nouvelle campagne promotionnelle pour booster vos ventes
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre de la promotion *</Label>
                      <Input
                        placeholder="Ex: Réduction printemps"
                        value={newPromotion.title}
                        onChange={(e) => setNewPromotion(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type de promotion *</Label>
                      <Select value={newPromotion.type} onValueChange={(value: any) => setNewPromotion(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="discount">Réduction</SelectItem>
                          <SelectItem value="bogo">Achetez 1, obtenez 1</SelectItem>
                          <SelectItem value="bundle">Offre groupée</SelectItem>
                          <SelectItem value="loyalty">Programme fidélité</SelectItem>
                          <SelectItem value="seasonal">Promotion saisonnière</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      placeholder="Décrivez votre promotion..."
                      value={newPromotion.description}
                      onChange={(e) => setNewPromotion(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discountType">Type de réduction</Label>
                      <Select value={newPromotion.discountType} onValueChange={(value: any) => setNewPromotion(prev => ({ ...prev, discountType: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Pourcentage</SelectItem>
                          <SelectItem value="fixed">Montant fixe</SelectItem>
                          <SelectItem value="freeShipping">Livraison gratuite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discountValue">Valeur de la réduction</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={newPromotion.discountValue}
                        onChange={(e) => setNewPromotion(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minPurchase">Achat minimum (€)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={newPromotion.minPurchase}
                        onChange={(e) => setNewPromotion(prev => ({ ...prev, minPurchase: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date de début *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newPromotion.startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newPromotion.startDate ? format(newPromotion.startDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={newPromotion.startDate}
                            onSelect={(date) => setNewPromotion(prev => ({ ...prev, startDate: date }))}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Date de fin *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newPromotion.endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newPromotion.endDate ? format(newPromotion.endDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={newPromotion.endDate}
                            onSelect={(date) => setNewPromotion(prev => ({ ...prev, endDate: date }))}
                            disabled={(date) => newPromotion.startDate ? date < newPromotion.startDate : false}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="audience">Audience cible</Label>
                      <Select value={newPromotion.targetAudience} onValueChange={(value: any) => setNewPromotion(prev => ({ ...prev, targetAudience: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les clients</SelectItem>
                          <SelectItem value="new">Nouveaux clients</SelectItem>
                          <SelectItem value="returning">Clients fidèles</SelectItem>
                          <SelectItem value="vip">Clients VIP</SelectItem>
                          <SelectItem value="mobile">Utilisateurs mobile</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="usageLimit">Limite d'utilisation</Label>
                      <Input
                        type="number"
                        min="1"
                        value={newPromotion.usageLimit}
                        onChange={(e) => setNewPromotion(prev => ({ ...prev, usageLimit: parseInt(e.target.value) || 100 }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="promoCode">Code promo</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Ex: PRINTEMPS2024"
                          value={newPromotion.promoCode}
                          onChange={(e) => setNewPromotion(prev => ({ ...prev, promoCode: e.target.value }))}
                        />
                        <Button type="button" variant="outline" onClick={generatePromoCode}>
                          Générer
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                      <Input
                        placeholder="mobile, été, vitamines"
                        value={newPromotion.tags}
                        onChange={(e) => setNewPromotion(prev => ({ ...prev, tags: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="mobileOnly"
                      checked={newPromotion.mobileOnly}
                      onCheckedChange={(checked) => setNewPromotion(prev => ({ ...prev, mobileOnly: checked }))}
                    />
                    <Label htmlFor="mobileOnly" className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      Promotion exclusive à l'application mobile
                    </Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreatePromotion}>
                    Créer la promotion
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistiques en cartes */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card className="bg-gradient-primary text-primary-foreground">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm opacity-90">Total</p>
            </CardContent>
          </Card>
          <Card className="border-success/30 bg-success/10">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-success">{stats.active}</div>
              <p className="text-sm text-success-foreground">Actives</p>
            </CardContent>
          </Card>
          <Card className="border-primary/30 bg-accent">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-accent-foreground">{stats.mobile}</div>
              <p className="text-sm text-accent-foreground">Mobile</p>
            </CardContent>
          </Card>
          <Card className="border-warning/30 bg-warning/10">
            <CardContent className="p-4">
              <div className="text-xl font-bold text-warning">{stats.views.toLocaleString()}</div>
              <p className="text-sm text-warning-foreground">Vues</p>
            </CardContent>
          </Card>
          <Card className="border-primary/30 bg-primary/10">
            <CardContent className="p-4">
              <div className="text-xl font-bold text-primary">{stats.conversions}</div>
              <p className="text-sm text-primary-foreground">Conversions</p>
            </CardContent>
          </Card>
          <Card className="border-success/30 bg-gradient-success text-success-foreground">
            <CardContent className="p-4">
              <div className="text-lg font-bold">{stats.revenue.toFixed(0)}€</div>
              <p className="text-sm opacity-90">CA généré</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-muted/30">
            <CardContent className="p-4">
              <div className="text-lg font-bold text-muted-foreground">{stats.conversionRate.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">Taux conversion</p>
            </CardContent>
          </Card>
          <Card className="border-accent bg-secondary">
            <CardContent className="p-4">
              <div className="text-lg font-bold text-secondary-foreground">{stats.avgOrderValue.toFixed(0)}€</div>
              <p className="text-sm text-secondary-foreground">Panier moyen</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Promotions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="mobile">App Mobile</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Filtres et recherche */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Rechercher promotions, codes, tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="discount">Réduction</SelectItem>
                    <SelectItem value="bogo">Achetez 1, obtenez 1</SelectItem>
                    <SelectItem value="bundle">Offre groupée</SelectItem>
                    <SelectItem value="loyalty">Programme fidélité</SelectItem>
                    <SelectItem value="seasonal">Saisonnière</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actives</SelectItem>
                    <SelectItem value="inactive">Inactives</SelectItem>
                    <SelectItem value="mobile">Mobile uniquement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liste des promotions */}
          <div className="grid gap-4">
            {filteredPromotions.map((promotion) => (
              <Card key={promotion.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{promotion.title}</h3>
                        <Badge className={getTypeColor(promotion.type)}>
                          {promotion.type === 'discount' ? 'Réduction' :
                           promotion.type === 'bogo' ? 'BOGO' :
                           promotion.type === 'bundle' ? 'Groupée' :
                           promotion.type === 'loyalty' ? 'Fidélité' : 'Saisonnière'}
                        </Badge>
                        {promotion.mobileOnly && (
                          <Badge variant="outline" className="border-primary text-primary">
                            <Smartphone className="w-3 h-3 mr-1" />
                            Mobile
                          </Badge>
                        )}
                        <Switch
                          checked={promotion.isActive}
                          onCheckedChange={() => togglePromotionStatus(promotion.id)}
                        />
                      </div>
                      <p className="text-muted-foreground mb-3">{promotion.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Percent className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {promotion.discountType === 'percentage' ? `${promotion.discountValue}%` :
                             promotion.discountType === 'fixed' ? `${promotion.discountValue}€` : 'Livraison gratuite'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {format(promotion.startDate, "dd/MM", { locale: fr })} - {format(promotion.endDate, "dd/MM/yyyy", { locale: fr })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-mono">{promotion.promoCode}</span>
                        </div>
                      </div>

                      {promotion.usageLimit && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Utilisation</span>
                            <span>{promotion.usageCount}/{promotion.usageLimit}</span>
                          </div>
                          <Progress value={(promotion.usageCount / promotion.usageLimit) * 100} className="h-2" />
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mb-4">
                        {promotion.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-muted-foreground">Vues</div>
                          <div className="text-lg font-bold">{promotion.analytics.views.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground">Clics</div>
                          <div className="text-lg font-bold">{promotion.analytics.clicks}</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground">Conversions</div>
                          <div className="text-lg font-bold">{promotion.analytics.conversions}</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground">CA généré</div>
                          <div className="text-lg font-bold">{promotion.analytics.revenue.toFixed(0)}€</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance des promotions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  Graphiques et analyses détaillées à venir...
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Marketing Mobile
              </CardTitle>
              <CardDescription>
                Promotions spécifiques pour l'application mobile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-gradient-primary text-primary-foreground">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-8 h-8" />
                        <div>
                          <div className="text-2xl font-bold">{stats.mobile}</div>
                          <p className="text-sm opacity-90">Promotions mobiles</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-success text-success-foreground">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Download className="w-8 h-8" />
                        <div>
                          <div className="text-2xl font-bold">1.2K</div>
                          <p className="text-sm opacity-90">Téléchargements app</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Promotions mobiles actives</h3>
                  {promotions.filter(p => p.mobileOnly || p.targetAudience === 'mobile').map((promotion) => (
                    <Card key={promotion.id} className="border-primary/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{promotion.title}</h4>
                            <p className="text-sm text-muted-foreground">{promotion.description}</p>
                          </div>
                          <Badge className="bg-primary text-primary-foreground">
                            <Smartphone className="w-3 h-3 mr-1" />
                            Mobile
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}