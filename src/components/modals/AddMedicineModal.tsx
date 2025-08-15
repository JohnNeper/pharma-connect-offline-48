import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { useData } from '@/contexts/DataContext'
import { useTranslation } from 'react-i18next'
import { toast } from '@/hooks/use-toast'

interface AddMedicineModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export function AddMedicineModal({ 
  open: controlledOpen, 
  onOpenChange: controlledOnOpenChange,
  trigger 
}: AddMedicineModalProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = controlledOnOpenChange || setInternalOpen
  const [formData, setFormData] = useState({
    name: '',
    form: '',
    dosage: '',
    barcode: '',
    currentStock: '',
    minStock: '',
    expiryDate: '',
    supplier: '',
    price: '',
    cost: '',
    batchNumber: '',
    category: ''
  })

  const { addMedicine } = useData()
  const { t } = useTranslation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      addMedicine({
        name: formData.name,
        form: formData.form,
        dosage: formData.dosage,
        barcode: formData.barcode,
        currentStock: parseInt(formData.currentStock),
        minStock: parseInt(formData.minStock),
        expiryDate: formData.expiryDate,
        supplier: formData.supplier,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        batchNumber: formData.batchNumber,
        category: formData.category
      })

      toast({
        title: t('success'),
        description: t('medicineAdded'),
        variant: 'default'
      })

      setFormData({
        name: '',
        form: '',
        dosage: '',
        barcode: '',
        currentStock: '',
        minStock: '',
        expiryDate: '',
        supplier: '',
        price: '',
        cost: '',
        batchNumber: '',
        category: ''
      })
      setOpen(false)
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToAddMedicine'),
        variant: 'destructive'
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      {!trigger && !controlledOpen && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            {t('addMedicine')}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('addNewMedicine')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('medicineName')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="form">{t('form')} *</Label>
              <Select value={formData.form} onValueChange={(value) => setFormData(prev => ({ ...prev, form: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectForm')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="capsule">Capsule</SelectItem>
                  <SelectItem value="syrup">Syrup</SelectItem>
                  <SelectItem value="injection">Injection</SelectItem>
                  <SelectItem value="cream">Cream</SelectItem>
                  <SelectItem value="drops">Drops</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dosage">{t('dosage')} *</Label>
              <Input
                id="dosage"
                value={formData.dosage}
                onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                placeholder="500mg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">{t('category')} *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analgesic">Analgesic</SelectItem>
                  <SelectItem value="antibiotic">Antibiotic</SelectItem>
                  <SelectItem value="antacid">Antacid</SelectItem>
                  <SelectItem value="vitamin">Vitamin</SelectItem>
                  <SelectItem value="hormone">Hormone</SelectItem>
                  <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">{t('barcode')}</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                placeholder="123456789012"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batchNumber">{t('batchNumber')} *</Label>
              <Input
                id="batchNumber"
                value={formData.batchNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, batchNumber: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentStock">{t('currentStock')} *</Label>
              <Input
                id="currentStock"
                type="number"
                value={formData.currentStock}
                onChange={(e) => setFormData(prev => ({ ...prev, currentStock: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStock">{t('minimumStock')} *</Label>
              <Input
                id="minStock"
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData(prev => ({ ...prev, minStock: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">{t('sellingPrice')} (₣) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">{t('costPrice')} (₣) *</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">{t('expiryDate')} *</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">{t('supplier')} *</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit">
              {t('addMedicine')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}