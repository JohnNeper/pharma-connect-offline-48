import { useState, useMemo, useRef, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  ShoppingCart, Plus, Minus, Calculator, CreditCard, Banknote, Receipt, X,
  History, Package, Smartphone, Search, FileWarning, ClipboardCheck, Printer,
  FileText, AlertTriangle, User
} from "lucide-react"
import SalesHistory from "@/components/sales/SalesHistory"
import ReservationsManagement from "@/components/sales/ReservationsManagement"
import PaymentTracking from "@/components/sales/PaymentTracking"
import { useData } from "@/contexts/DataContext"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "@/hooks/use-toast"
import { printThermalReceipt, printA4Invoice } from "@/lib/print"

interface CartItem {
  medicineId: string
  name: string
  dosage: string
  price: number
  quantity: number
  stock: number
  requiresPrescription: boolean
}

interface PrescriptionData {
  doctorName: string
  patientName: string
  patientPhone: string
  prescriptionNumber: string
  notes: string
}

export default function Sales() {
  const { medicines, addSale, addInvoice, addPrescription, patients } = useData()
  const { user } = useAuth()
  
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "mobile">("cash")
  const [selectedPatient, setSelectedPatient] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)
  
  // Prescription modal
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData>({
    doctorName: '', patientName: '', patientPhone: '', prescriptionNumber: '', notes: ''
  })
  const [prescriptionValidated, setPrescriptionValidated] = useState(false)
  const [savedPrescriptionId, setSavedPrescriptionId] = useState<string | null>(null)

  // Focus search on keyboard shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'F2' || ((e.ctrlKey || e.metaKey) && e.key === 'f')) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Smart search: match by initials, name start, or full text
  const filteredMedicines = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return medicines.filter(m => m.currentStock > 0)
    
    return medicines.filter(m => {
      if (m.currentStock <= 0) return false
      const fullName = `${m.name} ${m.dosage}`.toLowerCase()
      // Exact match
      if (fullName.includes(q)) return true
      // Initials match: "par" matches "Paracetamol", "amo" matches "Amoxicillin"
      if (m.name.toLowerCase().startsWith(q)) return true
      // Category match
      if (m.category.toLowerCase().includes(q)) return true
      // Barcode match
      if (m.barcode.includes(q)) return true
      // First letters of each word: "pc" matches "Paracetamol Capsule"
      const words = fullName.split(/\s+/)
      const initials = words.map(w => w[0]).join('')
      if (initials.includes(q)) return true
      return false
    })
  }, [searchTerm, medicines])

  const cartHasPrescriptionItems = cart.some(item => item.requiresPrescription)

  const addToCart = useCallback((med: typeof medicines[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.medicineId === med.id)
      if (existing) {
        if (existing.quantity >= med.currentStock) return prev
        return prev.map(i => i.medicineId === med.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, {
        medicineId: med.id,
        name: med.name,
        dosage: med.dosage,
        price: med.price,
        quantity: 1,
        stock: med.currentStock,
        requiresPrescription: med.requiresPrescription
      }]
    })
  }, [])

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) setCart(prev => prev.filter(i => i.medicineId !== id))
    else setCart(prev => prev.map(i => i.medicineId === id ? { ...i, quantity: qty } : i))
  }

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.medicineId !== id))

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + tax

  const validatePrescription = () => {
    if (!prescriptionData.doctorName || !prescriptionData.patientName) {
      toast({ title: 'Erreur', description: 'Nom du médecin et du patient requis', variant: 'destructive' })
      return
    }
    
    // Save prescription
    addPrescription({
      patientName: prescriptionData.patientName,
      patientPhone: prescriptionData.patientPhone,
      doctorName: prescriptionData.doctorName,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      medicines: cart.filter(i => i.requiresPrescription).map(i => ({
        medicineId: i.medicineId,
        quantity: i.quantity,
        instructions: '',
        name: `${i.name} ${i.dosage}`
      })),
      notes: prescriptionData.notes
    })
    
    const presId = `PRES-${Date.now()}`
    setSavedPrescriptionId(presId)
    setPrescriptionValidated(true)
    setShowPrescriptionModal(false)
    toast({ title: 'Ordonnance validée', description: `Ordonnance enregistrée: ${presId}` })
  }

  const handleCheckout = () => {
    if (cart.length === 0) return
    
    // Check if prescription is needed
    if (cartHasPrescriptionItems && !prescriptionValidated) {
      setShowPrescriptionModal(true)
      return
    }

    const invoiceNumber = `FAC-${Date.now()}`
    
    // Record sale
    addSale({
      date: new Date().toISOString(),
      medicines: cart.map(i => ({ medicineId: i.medicineId, quantity: i.quantity, price: i.price, name: `${i.name} ${i.dosage}` })),
      total,
      paymentMethod,
      cashierId: user?.id || '',
      cashierName: user?.name || '',
      prescriptionId: savedPrescriptionId || undefined
    })

    // Record invoice
    const patient = patients.find(p => p.id === selectedPatient)
    addInvoice({
      number: invoiceNumber,
      date: new Date().toISOString(),
      patientId: selectedPatient || '',
      items: cart.map(i => ({ medicineId: i.medicineId, quantity: i.quantity, price: i.price, name: `${i.name} ${i.dosage}` })),
      total,
      status: 'paid'
    })

    toast({ 
      title: 'Vente enregistrée ✓', 
      description: `${invoiceNumber} - ${total} FCFA (${paymentMethod === 'cash' ? 'Espèces' : paymentMethod === 'card' ? 'Carte' : 'Mobile Money'})` 
    })

    // Reset
    setCart([])
    setPrescriptionValidated(false)
    setSavedPrescriptionId(null)
    setSelectedPatient("")
    setPrescriptionData({ doctorName: '', patientName: '', patientPhone: '', prescriptionNumber: '', notes: '' })
    setSearchTerm("")
    searchRef.current?.focus()
  }

  const handlePrintTicket = () => {
    const patient = patients.find(p => p.id === selectedPatient)
    printThermalReceipt({
      invoiceNumber: `FAC-${Date.now()}`,
      date: new Date().toLocaleString('fr-FR'),
      pharmacyName: 'Pharmacie Centrale',
      pharmacyAddress: 'Bamako, Mali',
      pharmacyPhone: '+223 20 22 33 44',
      patientName: patient?.name || prescriptionData.patientName || undefined,
      cashierName: user?.name || '',
      items: cart.map(i => ({ name: `${i.name} ${i.dosage}`, quantity: i.quantity, price: i.price, total: i.price * i.quantity })),
      subtotal, tax, total,
      paymentMethod: paymentMethod === 'cash' ? 'Espèces' : paymentMethod === 'card' ? 'Carte' : 'Mobile Money',
      prescriptionId: savedPrescriptionId || undefined
    })
  }

  const handlePrintA4 = () => {
    const patient = patients.find(p => p.id === selectedPatient)
    printA4Invoice({
      invoiceNumber: `FAC-${Date.now()}`,
      date: new Date().toLocaleString('fr-FR'),
      pharmacyName: 'Pharmacie Centrale',
      pharmacyAddress: 'Bamako, Mali',
      pharmacyPhone: '+223 20 22 33 44',
      patientName: patient?.name || prescriptionData.patientName || undefined,
      cashierName: user?.name || '',
      items: cart.map(i => ({ name: `${i.name} ${i.dosage}`, quantity: i.quantity, price: i.price, total: i.price * i.quantity })),
      subtotal, tax, total,
      paymentMethod: paymentMethod === 'cash' ? 'Espèces' : paymentMethod === 'card' ? 'Carte' : 'Mobile Money',
      prescriptionId: savedPrescriptionId || undefined
    })
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Point de Vente</h1>
          <p className="text-sm text-muted-foreground">Recherche rapide: tapez les premières lettres (F2)</p>
        </div>
        <div className="flex items-center gap-2">
          {cartHasPrescriptionItems && (
            <Badge variant={prescriptionValidated ? "default" : "destructive"} className="gap-1">
              <ClipboardCheck className="w-3 h-3" />
              {prescriptionValidated ? 'Ordonnance validée' : 'Ordonnance requise'}
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="pos" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pos" className="gap-2">
            <ShoppingCart className="w-4 h-4" /> Vente rapide
          </TabsTrigger>
          <TabsTrigger value="reservations" className="gap-2">
            <Package className="w-4 h-4" /> Réservations
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="w-4 h-4" /> Paiements
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="w-4 h-4" /> Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pos" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Search + Results */}
            <div className="lg:col-span-2 space-y-4">
              {/* Search Bar */}
              <Card>
                <CardContent className="p-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      ref={searchRef}
                      placeholder="Recherche rapide par nom, initiales, catégorie ou code-barre... (F2)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 text-lg h-12"
                      autoFocus
                    />
                    {searchTerm && (
                      <Button
                        variant="ghost" size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => { setSearchTerm(""); searchRef.current?.focus() }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {['Analgesic', 'Antibiotic', 'Vitamin', 'Hormone'].map(cat => (
                      <Badge
                        key={cat}
                        variant="outline"
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => setSearchTerm(cat.toLowerCase())}
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto">
                {filteredMedicines.map((med) => (
                  <Card 
                    key={med.id}
                    className="cursor-pointer hover:shadow-md transition-all border-l-4"
                    style={{ borderLeftColor: med.requiresPrescription ? 'hsl(var(--destructive))' : 'hsl(var(--primary))' }}
                    onClick={() => addToCart(med)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{med.name}</h4>
                          <p className="text-xs text-muted-foreground">{med.dosage} · {med.form}</p>
                          <p className="text-sm font-bold text-primary mt-1">{med.price} FCFA</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                          <Badge variant={med.currentStock <= med.minStock ? "destructive" : "outline"} className="text-xs">
                            Stock: {med.currentStock}
                          </Badge>
                          {med.requiresPrescription && (
                            <Badge variant="destructive" className="text-xs gap-1">
                              <FileWarning className="w-3 h-3" /> Ordo
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredMedicines.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Aucun médicament trouvé pour "{searchTerm}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Cart + Checkout */}
            <div className="space-y-4">
              {/* Patient Selection */}
              <Card>
                <CardContent className="p-3">
                  <Label className="text-xs font-medium text-muted-foreground">Client (optionnel)</Label>
                  <select
                    className="w-full h-9 rounded-md border bg-background px-3 text-sm mt-1"
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                  >
                    <option value="">Client anonyme</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.isChronic ? '🔴' : ''} {p.phone || ''}
                      </option>
                    ))}
                  </select>
                </CardContent>
              </Card>

              {/* Cart */}
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> Panier ({cart.length})
                  </CardTitle>
                  {cart.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setCart([])}>
                      Vider
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-2 max-h-[35vh] overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Panier vide</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.medicineId} className="flex items-center gap-2 p-2 border rounded-lg text-sm">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-medium truncate">{item.name}</span>
                            {item.requiresPrescription && <FileWarning className="w-3 h-3 text-destructive flex-shrink-0" />}
                          </div>
                          <span className="text-xs text-muted-foreground">{item.price} FCFA × {item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="sm" className="w-7 h-7 p-0"
                            onClick={() => updateQuantity(item.medicineId, item.quantity - 1)}>
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <Button variant="outline" size="sm" className="w-7 h-7 p-0"
                            onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}>
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="w-7 h-7 p-0 ml-1"
                            onClick={() => removeFromCart(item.medicineId)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        <span className="font-semibold text-sm w-20 text-right">{item.price * item.quantity} F</span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Checkout */}
              {cart.length > 0 && (
                <Card>
                  <CardContent className="p-4 space-y-4">
                    {/* Prescription warning */}
                    {cartHasPrescriptionItems && !prescriptionValidated && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-destructive">Ordonnance requise</p>
                          <p className="text-xs text-muted-foreground">
                            {cart.filter(i => i.requiresPrescription).map(i => i.name).join(', ')}
                          </p>
                        </div>
                        <Button size="sm" variant="destructive" onClick={() => setShowPrescriptionModal(true)}>
                          <ClipboardCheck className="w-4 h-4 mr-1" /> Valider
                        </Button>
                      </div>
                    )}

                    {prescriptionValidated && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 border border-primary/20">
                        <ClipboardCheck className="w-4 h-4 text-primary" />
                        <span className="text-xs text-primary font-medium">Ordonnance: {savedPrescriptionId}</span>
                      </div>
                    )}

                    {/* Payment Method */}
                    <div>
                      <Label className="text-xs text-muted-foreground">Mode de paiement</Label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {[
                          { value: 'cash' as const, icon: Banknote, label: 'Espèces' },
                          { value: 'card' as const, icon: CreditCard, label: 'Carte' },
                          { value: 'mobile' as const, icon: Smartphone, label: 'Mobile' }
                        ].map(pm => (
                          <Button
                            key={pm.value}
                            variant={paymentMethod === pm.value ? "default" : "outline"}
                            onClick={() => setPaymentMethod(pm.value)}
                            className="h-auto py-2 text-xs"
                          >
                            <pm.icon className="w-4 h-4 mr-1" />
                            {pm.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-1 pt-2 border-t text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sous-total:</span>
                        <span>{subtotal} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">TVA (18%):</span>
                        <span>{tax} FCFA</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span className="text-primary">{total} FCFA</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button className="w-full" size="lg" onClick={handleCheckout}
                        disabled={cartHasPrescriptionItems && !prescriptionValidated}>
                        <Receipt className="w-5 h-5 mr-2" /> Finaliser la vente
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" onClick={handlePrintTicket}>
                          <Printer className="w-4 h-4 mr-1" /> Ticket
                        </Button>
                        <Button variant="outline" size="sm" onClick={handlePrintA4}>
                          <FileText className="w-4 h-4 mr-1" /> Facture A4
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reservations"><ReservationsManagement /></TabsContent>
        <TabsContent value="payments"><PaymentTracking /></TabsContent>
        <TabsContent value="history"><SalesHistory /></TabsContent>
      </Tabs>

      {/* Prescription Validation Modal */}
      <Dialog open={showPrescriptionModal} onOpenChange={setShowPrescriptionModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5" /> Validation de l'ordonnance
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm font-medium">Médicaments sous ordonnance dans le panier:</p>
              <ul className="mt-1 space-y-1">
                {cart.filter(i => i.requiresPrescription).map(i => (
                  <li key={i.medicineId} className="text-sm flex items-center gap-2">
                    <FileWarning className="w-3 h-3 text-destructive" />
                    {i.name} {i.dosage} × {i.quantity}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nom du médecin *</Label>
                <Input value={prescriptionData.doctorName}
                  onChange={(e) => setPrescriptionData(p => ({ ...p, doctorName: e.target.value }))}
                  placeholder="Dr. ..."
                />
              </div>
              <div>
                <Label>N° Ordonnance</Label>
                <Input value={prescriptionData.prescriptionNumber}
                  onChange={(e) => setPrescriptionData(p => ({ ...p, prescriptionNumber: e.target.value }))}
                  placeholder="ORD-..."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nom du patient *</Label>
                <Input value={prescriptionData.patientName}
                  onChange={(e) => setPrescriptionData(p => ({ ...p, patientName: e.target.value }))}
                  placeholder="Nom complet"
                />
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input value={prescriptionData.patientPhone}
                  onChange={(e) => setPrescriptionData(p => ({ ...p, patientPhone: e.target.value }))}
                  placeholder="+223..."
                />
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={prescriptionData.notes}
                onChange={(e) => setPrescriptionData(p => ({ ...p, notes: e.target.value }))}
                placeholder="Observations..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPrescriptionModal(false)}>Annuler</Button>
            <Button onClick={validatePrescription}>
              <ClipboardCheck className="w-4 h-4 mr-2" /> Valider l'ordonnance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
