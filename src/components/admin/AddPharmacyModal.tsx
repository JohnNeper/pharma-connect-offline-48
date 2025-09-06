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
    name: string;
    owner: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    subscriptionType: 'Basic' | 'Pro' | 'Enterprise';
    status: 'Active' | 'Inactive' | 'Pending' | 'Suspended';
    revenue: number;
    uptime: number;
    employeeCount: number;
    monthlyTransactions: number;
    region: string;
  }) => void
}

export function AddPharmacyModal({ isOpen, onClose, onAdd }: AddPharmacyModalProps) {
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [subscriptionType, setSubscriptionType] = useState<'Basic' | 'Pro' | 'Enterprise'>('Basic');
  const [status, setStatus] = useState<'Active' | 'Inactive' | 'Pending' | 'Suspended'>('Active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPharmacy = {
      name,
      owner,
      email,
      phone,
      address,
      city,
      country,
      subscriptionType,
      status,
      revenue: 0,
      uptime: 100,
      employeeCount: 1,
      monthlyTransactions: 0,
      region: country === 'France' ? 'France' : 
              country === 'Maroc' ? 'Maghreb' : 
              country.includes('Sénégal') || country.includes('Côte d\'Ivoire') ? 'Afrique de l\'Ouest' : 'Autre'
    };
    
    onAdd(newPharmacy);
    
    // Reset form
    setName('');
    setOwner('');
    setEmail('');
    setPhone('');
    setAddress('');
    setCity('');
    setCountry('');
    setSubscriptionType('Basic');
    setStatus('Active');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Ajouter une Nouvelle Pharmacie
          </DialogTitle>
          <DialogDescription>
            Enregistrez une nouvelle pharmacie dans le système
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la pharmacie *</Label>
              <Input
                id="name"
                placeholder="Ex: Pharmacie Centrale"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="owner">Propriétaire *</Label>
              <Input
                id="owner"
                placeholder="Dr. Jean Dupont"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@pharmacie.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                placeholder="+33 1 23 45 67 89"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                placeholder="Paris"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Pays *</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un pays" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Maroc">Maroc</SelectItem>
                  <SelectItem value="Sénégal">Sénégal</SelectItem>
                  <SelectItem value="Côte d'Ivoire">Côte d'Ivoire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscription">Type d'abonnement</Label>
              <Select value={subscriptionType} onValueChange={(value: 'Basic' | 'Pro' | 'Enterprise') => setSubscriptionType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut initial</Label>
              <Select value={status} onValueChange={(value: 'Active' | 'Inactive' | 'Pending' | 'Suspended') => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Actif</SelectItem>
                  <SelectItem value="Inactive">Inactif</SelectItem>
                  <SelectItem value="Pending">En attente</SelectItem>
                  <SelectItem value="Suspended">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse complète *</Label>
            <Textarea
              id="address"
              placeholder="123 Rue de la Santé, 75000 Paris"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Ajouter la Pharmacie
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}