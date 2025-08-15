import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react'
import { useData } from '@/contexts/DataContext'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { toast } from '@/hooks/use-toast'

interface CartItem {
  medicineId: string
  name: string
  price: number
  quantity: number
}

interface SaleModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export function SaleModal({ 
  open: controlledOpen, 
  onOpenChange: controlledOnOpenChange,
  trigger 
}: SaleModalProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = controlledOnOpenChange || setInternalOpen
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedMedicine, setSelectedMedicine] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile'>('cash')

  const { medicines, addSale } = useData()
  const { user } = useAuth()
  const { t } = useTranslation()

  const addToCart = (medicineId: string) => {
    const medicine = medicines.find(m => m.id === medicineId)
    if (!medicine) return

    const existingItem = cart.find(item => item.medicineId === medicineId)
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.medicineId === medicineId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, {
        medicineId,
        name: medicine.name,
        price: medicine.price,
        quantity: 1
      }])
    }
  }

  const updateQuantity = (medicineId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.medicineId !== medicineId))
    } else {
      setCart(cart.map(item =>
        item.medicineId === medicineId
          ? { ...item, quantity: newQuantity }
          : item
      ))
    }
  }

  const removeFromCart = (medicineId: string) => {
    setCart(cart.filter(item => item.medicineId !== medicineId))
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleSale = () => {
    if (cart.length === 0) {
      toast({
        title: t('error'),
        description: 'Panier vide',
        variant: 'destructive'
      })
      return
    }

    try {
      addSale({
        date: new Date().toISOString(),
        medicines: cart.map(item => ({
          medicineId: item.medicineId,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        })),
        total,
        paymentMethod,
        cashierId: user?.id || '',
        cashierName: user?.name || ''
      })

      toast({
        title: t('success'),
        description: 'Vente enregistrée avec succès',
        variant: 'default'
      })

      setCart([])
      setOpen(false)
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Erreur lors de l\'enregistrement',
        variant: 'destructive'
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <ShoppingCart className="w-4 h-4" />
          {t('newSale')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('newSale')}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Medicine Selection */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="medicine">Sélectionner un médicament</Label>
              <Select value={selectedMedicine} onValueChange={setSelectedMedicine}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un médicament" />
                </SelectTrigger>
                <SelectContent>
                  {medicines.filter(m => m.currentStock > 0).map(medicine => (
                    <SelectItem key={medicine.id} value={medicine.id}>
                      {medicine.name} - {medicine.dosage} (Stock: {medicine.currentStock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={() => {
                if (selectedMedicine) {
                  addToCart(selectedMedicine)
                  setSelectedMedicine('')
                }
              }}
              disabled={!selectedMedicine}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter au panier
            </Button>

            {/* Medicine Grid */}
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
              {medicines.filter(m => m.currentStock > 0).map(medicine => (
                <Card key={medicine.id} className="cursor-pointer hover:bg-accent" onClick={() => addToCart(medicine.id)}>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-sm">{medicine.name}</h4>
                        <p className="text-xs text-muted-foreground">{medicine.dosage}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₣ {medicine.price}</p>
                        <Badge variant="outline" className="text-xs">
                          Stock: {medicine.currentStock}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="space-y-4">
            <h3 className="font-semibold">Panier</h3>
            
            {cart.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Panier vide
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map(item => (
                  <Card key={item.medicineId}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">₣ {item.price} × {item.quantity}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.medicineId, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <span className="w-8 text-center">{item.quantity}</span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromCart(item.medicineId)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-right mt-2">
                        <p className="font-medium">₣ {item.price * item.quantity}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Payment Method */}
            <div className="space-y-2">
              <Label>Mode de paiement</Label>
              <Select value={paymentMethod} onValueChange={(value: 'cash' | 'card' | 'mobile') => setPaymentMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Espèces</SelectItem>
                  <SelectItem value="card">Carte</SelectItem>
                  <SelectItem value="mobile">Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>{t('total')}:</span>
                <span>₣ {total}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
                {t('cancel')}
              </Button>
              <Button onClick={handleSale} disabled={cart.length === 0} className="flex-1">
                Finaliser la vente
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}