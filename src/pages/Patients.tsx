import { useMemo, useState } from 'react'
import { useData } from '@/contexts/DataContext'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, Plus, Search, Trash2, Download, FileText } from 'lucide-react'
import { exportToExcel, exportToPDF } from '@/lib/export'

interface PatientForm {
  name: string
  phone?: string
  email?: string
  address?: string
  allergies?: string
  dob?: string
  notes?: string
}

export default function Patients() {
  const { t } = useTranslation()
  const { patients, addPatient, updatePatient, deletePatient } = useData()
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState<PatientForm>({ name: '' })

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return patients
    return patients.filter(p => [p.name, p.phone, p.email, p.address].some(v => v?.toLowerCase().includes(q)))
  }, [patients, search])

  const onSubmit = () => {
    if (!form.name) return
    if (editingId) {
      updatePatient(editingId, form)
    } else {
      addPatient(form)
    }
    setOpen(false)
    setEditingId(null)
    setForm({ name: '' })
  }

  const onEdit = (id: string) => {
    const p = patients.find(x => x.id === id)
    if (!p) return
    setEditingId(id)
    setForm({ name: p.name, phone: p.phone, email: p.email, address: p.address, allergies: p.allergies, dob: p.dob, notes: p.notes })
    setOpen(true)
  }

  const exportRows = filtered.map(p => ({
    Name: p.name,
    Phone: p.phone || '',
    Email: p.email || '',
    Address: p.address || '',
    Allergies: p.allergies || '',
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('patients')}</h1>
          <p className="text-muted-foreground">{t('patientManagement')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => exportToExcel('patients', exportRows)}>
            <Download className="w-4 h-4 mr-2" /> Excel
          </Button>
          <Button variant="outline" onClick={() => exportToPDF('Patients', [
            { header: 'Name', dataKey: 'Name' },
            { header: 'Phone', dataKey: 'Phone' },
            { header: 'Email', dataKey: 'Email' },
            { header: 'Address', dataKey: 'Address' },
          ], exportRows)}>
            <FileText className="w-4 h-4 mr-2" /> PDF
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> {t('add')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? t('edit') : t('add')} {t('patient')}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                <div>
                  <Label>{t('name')}</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label>{t('phone')}</Label>
                  <Input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <Label>{t('address')}</Label>
                  <Input value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label>{t('allergies')}</Label>
                  <Input value={form.allergies || ''} onChange={(e) => setForm({ ...form, allergies: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>{t('cancel')}</Button>
                <Button onClick={onSubmit}>{t('save')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('patients')}</CardTitle>
          <CardDescription>{t('search')} & {t('filters')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input placeholder={t('search')} value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
          </div>

          <Table>
            <TableCaption>{filtered.length} {t('patients')}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('phone')}</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>{t('address')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.address}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(p.id)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deletePatient(p.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
