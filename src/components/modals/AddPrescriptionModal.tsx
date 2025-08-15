import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Plus, CalendarIcon } from 'lucide-react'
import { useData } from '@/contexts/DataContext'
import { useTranslation } from 'react-i18next'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface AddPrescriptionModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export function AddPrescriptionModal({ 
  open: controlledOpen, 
  onOpenChange: controlledOnOpenChange,
  trigger 
}: AddPrescriptionModalProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = controlledOnOpenChange || setInternalOpen
  const [date, setDate] = useState<Date>(new Date())
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    doctorName: '',
    notes: '',
    medicines: [{ medicineId: '', quantity: 1, instructions: '' }]
  })

  const { medicines, addPrescription } = useData()
  const { t } = useTranslation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      addPrescription({
        patientName: formData.patientName,
        patientPhone: formData.patientPhone,
        doctorName: formData.doctorName,
        date: date.toISOString(),
        status: 'pending',
        medicines: formData.medicines.map(med => ({
          medicineId: med.medicineId,
          quantity: med.quantity,
          instructions: med.instructions,
          name: medicines.find(m => m.id === med.medicineId)?.name || ''
        })),
        notes: formData.notes
      })

      toast({
        title: t('success'),
        description: t('prescriptionAdded'),
        variant: 'default'
      })

      setFormData({
        patientName: '',
        patientPhone: '',
        doctorName: '',
        notes: '',
        medicines: [{ medicineId: '', quantity: 1, instructions: '' }]
      })
      setDate(new Date())
      setOpen(false)
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToAddPrescription'),
        variant: 'destructive'
      })
    }
  }

  const addMedicineRow = () => {
    setFormData(prev => ({
      ...prev,
      medicines: [...prev.medicines, { medicineId: '', quantity: 1, instructions: '' }]
    }))
  }

  const removeMedicineRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }))
  }

  const updateMedicine = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }))
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
            {t('addPrescription')}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('addPrescription')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">{t('patientName')} *</Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="patientPhone">{t('patientPhone')}</Label>
              <Input
                id="patientPhone"
                value={formData.patientPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, patientPhone: e.target.value }))}
                placeholder="+223 70 12 34 56"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctorName">{t('doctorName')} *</Label>
              <Input
                id="doctorName"
                value={formData.doctorName}
                onChange={(e) => setFormData(prev => ({ ...prev, doctorName: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>{t('date')} *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Medicines */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Médicaments prescrits *</Label>
              <Button type="button" onClick={addMedicineRow} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter médicament
              </Button>
            </div>

            {formData.medicines.map((medicine, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-end p-4 border rounded-lg">
                <div className="col-span-4">
                  <Label>Médicament *</Label>
                  <Select 
                    value={medicine.medicineId} 
                    onValueChange={(value) => updateMedicine(index, 'medicineId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner médicament" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicines.map(med => (
                        <SelectItem key={med.id} value={med.id}>
                          {med.name} - {med.dosage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label>{t('quantity')} *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={medicine.quantity}
                    onChange={(e) => updateMedicine(index, 'quantity', parseInt(e.target.value))}
                  />
                </div>

                <div className="col-span-5">
                  <Label>{t('instructions')} *</Label>
                  <Input
                    value={medicine.instructions}
                    onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                    placeholder="1 comprimé 2 fois par jour"
                  />
                </div>

                <div className="col-span-1">
                  {formData.medicines.length > 1 && (
                    <Button 
                      type="button" 
                      onClick={() => removeMedicineRow(index)}
                      variant="outline" 
                      size="sm"
                      className="text-destructive"
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t('notes')}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes supplémentaires..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit">
              {t('addPrescription')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}