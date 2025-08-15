import { useMemo, useState } from 'react'
import { useData } from '@/contexts/DataContext'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Trash2, Download, FileText } from 'lucide-react'
import { exportToExcel, exportToPDF } from '@/lib/export'

interface InvoiceItem { medicineId: string; name: string; price: number; quantity: number }

export default function Billing() {
  const { t } = useTranslation()
  const { invoices, addInvoice, patients, medicines } = useData()
  const [open, setOpen] = useState(false)
  const [patientId, setPatientId] = useState('')
  const [items, setItems] = useState<InvoiceItem[]>([])

  const total = useMemo(() => items.reduce((s, it) => s + it.price * it.quantity, 0), [items])

  const addLine = (medicineId: string) => {
    const med = medicines.find(m => m.id === medicineId)
    if (!med) return
    setItems((prev) => {
      const exists = prev.find(i => i.medicineId === medicineId)
      if (exists) return prev.map(i => i.medicineId === medicineId ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { medicineId, name: med.name + ' ' + med.dosage, price: med.price, quantity: 1 }]
    })
  }

  const removeLine = (medicineId: string) => setItems(prev => prev.filter(i => i.medicineId !== medicineId))

  const createInvoice = () => {
    if (!patientId || items.length === 0) return
    addInvoice({
      date: new Date().toISOString(),
      number: `INV-${Date.now()}`,
      patientId,
      items: items.map(i => ({ medicineId: i.medicineId, quantity: i.quantity, price: i.price, name: i.name })),
      total,
      status: 'paid'
    })
    setOpen(false)
    setPatientId('')
    setItems([])
  }

  const exportRows = invoices.map(inv => ({
    Number: inv.number,
    Date: inv.date.slice(0,10),
    Patient: patients.find(p => p.id === inv.patientId)?.name || '',
    Total: inv.total
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('billing')}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => exportToExcel('invoices', exportRows)}>
            <Download className="w-4 h-4 mr-2" /> Excel
          </Button>
          <Button variant="outline" onClick={() => exportToPDF('Invoices', [
            { header: 'Number', dataKey: 'Number' },
            { header: 'Date', dataKey: 'Date' },
            { header: 'Patient', dataKey: 'Patient' },
            { header: 'Total', dataKey: 'Total' },
          ], exportRows)}>
            <FileText className="w-4 h-4 mr-2" /> PDF
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> {t('createInvoice')}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t('createInvoice')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t('patient')}</Label>
                  <select className="w-full h-10 rounded-md border bg-background" value={patientId} onChange={(e) => setPatientId(e.target.value)}>
                    <option value="">{t('select')}</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label>{t('addMedicine')}</Label>
                  <div className="flex gap-2">
                    <select className="flex-1 h-10 rounded-md border bg-background" onChange={(e) => { if (e.target.value) { addLine(e.target.value); e.currentTarget.selectedIndex = 0 }}}>
                      <option value="">{t('select')}</option>
                      {medicines.map(m => <option key={m.id} value={m.id}>{m.name} {m.dosage} · {m.price}</option>)}
                    </select>
                  </div>
                </div>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('name')}</TableHead>
                        <TableHead>{t('quantity')}</TableHead>
                        <TableHead>{t('price')}</TableHead>
                        <TableHead className="text-right">{t('actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((i) => (
                        <TableRow key={i.medicineId}>
                          <TableCell>{i.name}</TableCell>
                          <TableCell>
                            <Input type="number" min={1} value={i.quantity} onChange={(e) => setItems(prev => prev.map(x => x.medicineId === i.medicineId ? { ...x, quantity: Math.max(1, Number(e.target.value)) } : x))} className="w-20" />
                          </TableCell>
                          <TableCell>{i.price}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => removeLine(i.medicineId)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-end text-lg font-semibold">{t('total')}: {total}</div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>{t('cancel')}</Button>
                <Button onClick={createInvoice}>{t('save')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('invoices')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>{invoices.length} {t('invoices')}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>{t('date')}</TableHead>
                <TableHead>{t('patient')}</TableHead>
                <TableHead>{t('total')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map(inv => (
                <TableRow key={inv.id}>
                  <TableCell>{inv.number}</TableCell>
                  <TableCell>{inv.date.slice(0,10)}</TableCell>
                  <TableCell>{patients.find(p => p.id === inv.patientId)?.name}</TableCell>
                  <TableCell>{inv.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
