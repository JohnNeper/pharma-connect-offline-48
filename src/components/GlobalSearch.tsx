import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useData } from "@/contexts/DataContext"
import { useTranslation } from "react-i18next"

export default function GlobalSearch() {
  const { medicines, prescriptions } = useData()
  // Patients and invoices will be added after context update
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen(o => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return { meds: [], pres: [] }
    const meds = medicines.filter(m => [m.name, m.barcode, m.category, m.supplier].some(v => v?.toLowerCase().includes(q)))
    const pres = prescriptions.filter(p => [p.patientName, p.doctorName, p.id].some(v => v?.toLowerCase().includes(q)))
    return { meds: meds.slice(0, 10), pres: pres.slice(0, 10) }
  }, [query, medicines, prescriptions])

  return (
    <>
      <button
        aria-label="Global search"
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 h-10 rounded-md bg-accent/50 text-sm border border-border hover:bg-accent/70"
      >
        <span className="opacity-70">{t('search')}</span>
        <kbd className="ml-6 text-xs opacity-50">Ctrl</kbd>
        <span className="text-xs opacity-50">K</span>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput autoFocus placeholder={t('search') + '…'} value={query} onValueChange={setQuery} />
        <CommandList>
          <CommandEmpty>{t('search')}: 0</CommandEmpty>

          <CommandGroup heading={t('medicineInventory')}>
            {results.meds.map((m) => (
              <CommandItem key={`m-${m.id}`} onSelect={() => { setOpen(false); navigate('/stock') }}>
                {m.name} · {m.dosage} · {m.category}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading={t('digitalPrescriptions')}>
            {results.pres.map((p) => (
              <CommandItem key={`p-${p.id}`} onSelect={() => { setOpen(false); navigate('/prescriptions') }}>
                {p.id} · {p.patientName} · {p.doctorName}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
