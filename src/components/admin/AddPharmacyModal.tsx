import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Building2, User, Mail, Phone, MapPin, CreditCard } from 'lucide-react'

interface AddPharmacyModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (pharmacy: {
    name: string
    owner: string
    email: string
    phone: string
    address: string
    city: string
    country: string
    subscriptionType: 'basic' | 'premium' | 'enterprise'
    status: 'active' | 'suspended' | 'trial' | 'expired'
    joinDate: string
    lastActivity: string
    revenue: number
    medications: number
    sales: number
    users: number
    version: string
  }) => void
}

export function AddPharmacyModal({ isOpen, onClose, onAdd }: AddPharmacyModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    subscriptionType: 'basic' as const,
    status: 'trial' as const
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newPharmacy = {
      ...formData,
      joinDate: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString().split('T')[0],
      revenue: 0,
      medications: 0,
      sales: 0,
      users: 1,
      version: '2.1.0'
    }
    
    onAdd(newPharmacy)
    
    // Reset form
    setFormData({
      name: '',
      owner: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      subscriptionType: 'basic',
      status: 'trial'
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-6 w-6 text-primary" />
            Ajouter une Nouvelle Pharmacie
          </DialogTitle>
          <DialogDescription>
            Enregistrez une nouvelle pharmacie dans le système
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Informations de la Pharmacie
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la pharmacie *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Pharmacie Centrale"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="owner">Propriétaire *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="owner"
                    placeholder="Dr. Jean Dupont"
                    value={formData.owner}
                    onChange={(e) => handleInputChange('owner', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Informations de Contact
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@pharmacie.fr"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="+33 1 23 45 67 89"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Adresse
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Adresse complète *</Label>
                <Textarea
                  id="address"
                  placeholder="123 Rue de la Santé, 75000 Paris"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    placeholder="Paris"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Pays *</Label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un pays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Belgium">Belgique</SelectItem>
                      <SelectItem value="Switzerland">Suisse</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Morocco">Maroc</SelectItem>
                      <SelectItem value="Algeria">Algérie</SelectItem>
                      <SelectItem value="Tunisia">Tunisie</SelectItem>
                      <SelectItem value="Spain">Espagne</SelectItem>
                      <SelectItem value="Italy">Italie</SelectItem>
                      <SelectItem value="USA">États-Unis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Abonnement et Statut
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subscription">Type d'abonnement</Label>
                <Select 
                  value={formData.subscriptionType} 
                  onValueChange={(value: 'basic' | 'premium' | 'enterprise') => 
                    handleInputChange('subscriptionType', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic - €29/mois</SelectItem>
                    <SelectItem value="premium">Premium - €79/mois</SelectItem>
                    <SelectItem value="enterprise">Enterprise - €199/mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Statut initial</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: 'active' | 'suspended' | 'trial' | 'expired') => 
                    handleInputChange('status', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Période d'essai</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="suspended">Suspendu</SelectItem>
                    <SelectItem value="expired">Expiré</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="px-6 bg-gradient-primary hover:opacity-90"
            >
              Ajouter la Pharmacie
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}