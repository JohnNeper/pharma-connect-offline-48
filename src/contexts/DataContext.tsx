import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

// Data interfaces
export interface Medicine {
  id: string
  name: string
  form: string
  dosage: string
  barcode: string
  image?: string
  currentStock: number
  minStock: number
  expiryDate: string
  supplier: string
  price: number
  cost: number
  batchNumber: string
  category: string
}

export interface Sale {
  id: string
  date: string
  medicines: { medicineId: string; quantity: number; price: number; name: string }[]
  total: number
  paymentMethod: 'cash' | 'card' | 'mobile'
  cashierId: string
  cashierName: string
  prescriptionId?: string
}

export interface Order {
  id: string
  supplier: string
  date: string
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
  items: { medicineId: string; quantity: number; unitCost: number; name: string }[]
  total: number
  deliveryDate?: string
  notes?: string
}

export interface Prescription {
  id: string
  patientName: string
  patientPhone?: string
  doctorName: string
  date: string
  status: 'pending' | 'partial' | 'completed'
  medicines: { medicineId: string; quantity: number; instructions: string; name: string }[]
  notes?: string
}

export interface Patient {
  id: string
  name: string
  phone?: string
  email?: string
  address?: string
  allergies?: string
  dob?: string
  notes?: string
}

export interface Invoice {
  id: string
  number: string
  date: string
  patientId: string
  items: { medicineId: string; quantity: number; price: number; name: string }[]
  total: number
  status: 'paid' | 'unpaid' | 'partial'
}

export interface MobileReservation {
  id: string
  customer: string
  phone: string
  items: Array<{ name: string; quantity: number; price: number; medicineId: string }>
  total: number
  status: "pending" | "ready" | "delivered" | "cancelled"
  orderDate: string
  pharmacy: string
  notes?: string
  prescriptionId?: string
  prescriptionAttachment?: string
  prescriptionFromApp?: boolean
}

interface DataContextType {
  // Data
  medicines: Medicine[]
  sales: Sale[]
  orders: Order[]
  prescriptions: Prescription[]
  patients: Patient[]
  invoices: Invoice[]
  mobileReservations: MobileReservation[]
  
  // Medicine operations
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void
  updateMedicine: (id: string, medicine: Partial<Medicine>) => void
  deleteMedicine: (id: string) => void
  
  // Sale operations
  addSale: (sale: Omit<Sale, 'id'>) => void
  
  // Order operations
  addOrder: (order: Omit<Order, 'id'>) => void
  updateOrder: (id: string, order: Partial<Order>) => void
  
  // Prescription operations
  addPrescription: (prescription: Omit<Prescription, 'id'>) => void
  updatePrescription: (id: string, prescription: Partial<Prescription>) => void

  // Patient operations
  addPatient: (patient: Omit<Patient, 'id'>) => void
  updatePatient: (id: string, patient: Partial<Patient>) => void
  deletePatient: (id: string) => void

  // Invoice operations
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void

  // Mobile reservations operations
  addMobileReservation: (reservation: Omit<MobileReservation, 'id'>) => void
  updateMobileReservation: (id: string, reservation: Partial<MobileReservation>) => void
}


const DataContext = createContext<DataContextType | undefined>(undefined)

// Mock data
const mockMedicines: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol',
    form: 'Tablet',
    dosage: '500mg',
    barcode: '123456789012',
    currentStock: 150,
    minStock: 50,
    expiryDate: '2025-12-31',
    supplier: 'MediCorp Pharmaceuticals',
    price: 250,
    cost: 180,
    batchNumber: 'PAR001',
    category: 'Analgesic'
  },
  {
    id: '2',
    name: 'Amoxicillin',
    form: 'Capsule',
    dosage: '250mg',
    barcode: '123456789013',
    currentStock: 8,
    minStock: 30,
    expiryDate: '2024-08-15',
    supplier: 'PharmaDist Global',
    price: 450,
    cost: 320,
    batchNumber: 'AMX002',
    category: 'Antibiotic'
  },
  {
    id: '3',
    name: 'Insulin',
    form: 'Injection',
    dosage: '100UI',
    barcode: '123456789014',
    currentStock: 3,
    minStock: 20,
    expiryDate: '2024-06-30',
    supplier: 'DiabetCare Solutions',
    price: 2500,
    cost: 1800,
    batchNumber: 'INS003',
    category: 'Hormone'
  }
]

const mockSales: Sale[] = [
  {
    id: '1',
    date: '2024-01-15T10:30:00Z',
    medicines: [{ medicineId: '1', quantity: 2, price: 250, name: 'Paracetamol 500mg' }],
    total: 500,
    paymentMethod: 'cash',
    cashierId: '3',
    cashierName: 'Marie Traore'
  }
]

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    supplier: 'MediCorp Pharmaceuticals',
    date: '2024-01-15',
    status: 'pending',
    items: [{ medicineId: '1', quantity: 100, unitCost: 180, name: 'Paracetamol 500mg' }],
    total: 18000,
    deliveryDate: '2024-01-18'
  }
]

const mockPrescriptions: Prescription[] = [
  {
    id: 'PRES-001',
    patientName: 'Fatima Diallo',
    patientPhone: '+223 70 12 34 56',
    doctorName: 'Dr. Mamadou Keita',
    date: '2024-01-15',
    status: 'pending',
    medicines: [{ medicineId: '1', quantity: 10, instructions: '1 tablet twice daily', name: 'Paracetamol 500mg' }]
  },
  {
    id: 'PRES-002',
    patientName: 'Ibrahim Koné',
    patientPhone: '+223 75 11 22 33',
    doctorName: 'Dr. Aminata Soumaré',
    date: '2024-01-15',
    status: 'pending',
    medicines: [
      { medicineId: '2', quantity: 14, instructions: '1 capsule 3 times daily', name: 'Amoxicillin 250mg' },
      { medicineId: '1', quantity: 20, instructions: 'As needed for pain', name: 'Paracetamol 500mg' }
    ]
  }
]

const mockMobileReservations: MobileReservation[] = [
  {
    id: "RES-001",
    customer: "Fatima Diallo",
    phone: "+223 70 12 34 56",
    items: [
      { name: "Paracetamol 500mg", quantity: 10, price: 250, medicineId: '1' }
    ],
    total: 2500,
    status: "pending",
    orderDate: "2024-01-15 10:30",
    pharmacy: "Pharmacie Centrale",
    notes: "Ordonnance jointe via l'app",
    prescriptionId: "PRES-001",
    prescriptionFromApp: true,
    prescriptionAttachment: "prescription_fatima_20240115.pdf"
  },
  {
    id: "RES-002",
    customer: "Ibrahim Koné",
    phone: "+223 75 11 22 33",
    items: [
      { name: "Amoxicillin 250mg", quantity: 14, price: 450, medicineId: '2' },
      { name: "Paracetamol 500mg", quantity: 20, price: 250, medicineId: '1' }
    ],
    total: 11300,
    status: "ready",
    orderDate: "2024-01-14 16:45",
    pharmacy: "Pharmacie Nord",
    prescriptionId: "PRES-002",
    prescriptionFromApp: true,
    prescriptionAttachment: "prescription_ibrahim_20240114.pdf"
  },
  {
    id: "RES-003",
    customer: "Aminata Traoré",
    phone: "+223 65 44 33 22",
    items: [
      { name: "Vitamine C", quantity: 1, price: 300, medicineId: '4' }
    ],
    total: 300,
    status: "delivered",
    orderDate: "2024-01-14 09:15",
    pharmacy: "Pharmacie Centrale",
    prescriptionFromApp: false
  }
]

const mockPatients: Patient[] = [
  { id: 'PAT-001', name: 'Fatima Diallo', phone: '+223 70 12 34 56', address: 'Bamako', allergies: 'Penicillin' },
  { id: 'PAT-002', name: 'Ibrahim Koné', phone: '+223 75 11 22 33', address: 'Bamako' },
]

const mockInvoices: Invoice[] = [
  { id: 'INV-001', number: 'INV-001', date: '2024-01-15', patientId: 'PAT-001', items: [ { medicineId: '1', quantity: 2, price: 250, name: 'Paracetamol 500mg' } ], total: 500, status: 'paid' }
]


export function DataProvider({ children }: { children: ReactNode }) {
  const [medicines, setMedicines] = useState<Medicine[]>(mockMedicines)
  const [sales, setSales] = useState<Sale[]>(mockSales)
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions)
  const [patients, setPatients] = useState<Patient[]>(mockPatients)
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [mobileReservations, setMobileReservations] = useState<MobileReservation[]>(mockMobileReservations)

  // Medicine operations
  const addMedicine = (medicine: Omit<Medicine, 'id'>) => {
    const newMedicine = { ...medicine, id: Date.now().toString() }
    setMedicines(prev => [...prev, newMedicine])
  }

  const updateMedicine = (id: string, updates: Partial<Medicine>) => {
    setMedicines(prev => prev.map(med => med.id === id ? { ...med, ...updates } : med))
  }

  const deleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(med => med.id !== id))
  }

  // Sale operations
  const addSale = (sale: Omit<Sale, 'id'>) => {
    const newSale = { ...sale, id: Date.now().toString() }
    setSales(prev => [...prev, newSale])
    
    // Update stock levels
    sale.medicines.forEach(item => {
      updateMedicine(item.medicineId, { 
        currentStock: medicines.find(m => m.id === item.medicineId)!.currentStock - item.quantity 
      })
    })
  }

  // Order operations
  const addOrder = (order: Omit<Order, 'id'>) => {
    const newOrder = { ...order, id: `ORD-${Date.now()}` }
    setOrders(prev => [...prev, newOrder])
  }

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(order => order.id === id ? { ...order, ...updates } : order))
  }

// Prescription operations
const addPrescription = (prescription: Omit<Prescription, 'id'>) => {
  const newPrescription = { ...prescription, id: `PRES-${Date.now()}` }
  setPrescriptions(prev => [...prev, newPrescription])
}

const updatePrescription = (id: string, updates: Partial<Prescription>) => {
  setPrescriptions(prev => prev.map(pres => pres.id === id ? { ...pres, ...updates } : pres))
}

// Patient operations
const addPatient = (patient: Omit<Patient, 'id'>) => {
  const newPatient = { ...patient, id: `PAT-${Date.now()}` }
  setPatients(prev => [...prev, newPatient])
}

const updatePatient = (id: string, updates: Partial<Patient>) => {
  setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
}

const deletePatient = (id: string) => {
  setPatients(prev => prev.filter(p => p.id !== id))
}

// Invoice operations
const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
  const newInvoice = { ...invoice, id: `INV-${Date.now()}` }
  setInvoices(prev => [...prev, newInvoice])
}

const updateInvoice = (id: string, updates: Partial<Invoice>) => {
  setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, ...updates } : inv))
}

// Mobile reservations operations
const addMobileReservation = (reservation: Omit<MobileReservation, 'id'>) => {
  const newReservation = { ...reservation, id: `RES-${Date.now()}` }
  setMobileReservations(prev => [...prev, newReservation])
}

const updateMobileReservation = (id: string, updates: Partial<MobileReservation>) => {
  setMobileReservations(prev => prev.map(res => res.id === id ? { ...res, ...updates } : res))
}

return (
  <DataContext.Provider value={{
    medicines,
    sales,
    orders,
    prescriptions,
    patients,
    invoices,
    mobileReservations,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    addSale,
    addOrder,
    updateOrder,
    addPrescription,
    updatePrescription,
    addPatient,
    updatePatient,
    deletePatient,
    addInvoice,
    updateInvoice,
    addMobileReservation,
    updateMobileReservation,
  }}>
    {children}
  </DataContext.Provider>
)
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}