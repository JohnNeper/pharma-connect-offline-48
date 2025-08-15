import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Users, 
  Palette,
  Globe,
  Save,
  Plus,
  Edit,
  Trash2
} from "lucide-react"
import { useTranslation } from 'react-i18next'

const mockUsers = [
  {
    id: 1,
    name: "Dr. Amina Koné",
    email: "amina.kone@pharmalink.com",
    role: "Administrator",
    status: "active",
    lastLogin: "2024-01-15 14:30"
  },
  {
    id: 2,
    name: "Moussa Traoré",
    email: "moussa.traore@pharmalink.com", 
    role: "Pharmacist",
    status: "active",
    lastLogin: "2024-01-15 09:15"
  },
  {
    id: 3,
    name: "Fatou Camara",
    email: "fatou.camara@pharmalink.com",
    role: "Cashier", 
    status: "inactive",
    lastLogin: "2024-01-12 16:45"
  }
]

export default function Settings() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('systemSettings')}</h1>
          <p className="text-muted-foreground">Configurez votre système PharmaLink</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="backup">Sauvegarde</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  Configuration système
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pharmacyName">Nom de la pharmacie</Label>
                  <Input id="pharmacyName" defaultValue="Pharmacie Central" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" defaultValue="123 Avenue de la République" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" defaultValue="+223 20 22 45 67" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="contact@pharmaciecentral.ml" />
                </div>

                <Button className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Apparence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>{t('theme')}</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Mode d'affichage
                    </span>
                    <ThemeSwitcher />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>{t('language')}</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Langue de l'interface
                    </span>
                    <LanguageSwitcher />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Fuseau horaire</Label>
                  <Select defaultValue="gmt">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gmt">GMT (Bamako)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t('userManagement')}
              </CardTitle>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Ajouter utilisateur
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Dernière connexion: {user.lastLogin}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
                        {user.role}
                      </Badge>
                      <Badge variant={user.status === 'active' ? 'success' : 'warning'}>
                        {user.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Paramètres de notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Alertes de stock faible</h4>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications quand le stock est bas
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Expiration des médicaments</h4>
                  <p className="text-sm text-muted-foreground">
                    Alertes pour les médicaments proches de l'expiration
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Nouvelles commandes</h4>
                  <p className="text-sm text-muted-foreground">
                    Notifications pour les nouvelles commandes
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Rapports automatiques</h4>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des rapports hebdomadaires par email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Paramètres de sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Durée de session (minutes)</Label>
                  <Input type="number" defaultValue="120" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Authentification à deux facteurs</h4>
                    <p className="text-sm text-muted-foreground">
                      Renforcer la sécurité avec la 2FA
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Connexions multiples</h4>
                    <p className="text-sm text-muted-foreground">
                      Autoriser plusieurs connexions simultanées
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Audit des actions</h4>
                    <p className="text-sm text-muted-foreground">
                      Enregistrer toutes les actions utilisateur
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup */}
        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Sauvegarde et synchronisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Sauvegarde automatique</h4>
                  <p className="text-sm text-muted-foreground">
                    Sauvegarder automatiquement les données
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label>Fréquence de sauvegarde</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Toutes les heures</SelectItem>
                    <SelectItem value="daily">Quotidienne</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Synchronisation cloud</h4>
                  <p className="text-sm text-muted-foreground">
                    Synchroniser avec le serveur central
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="pt-4 border-t space-y-4">
                <h4 className="font-medium">Actions de sauvegarde</h4>
                <div className="flex gap-2">
                  <Button variant="outline">Sauvegarder maintenant</Button>
                  <Button variant="outline">Restaurer sauvegarde</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}