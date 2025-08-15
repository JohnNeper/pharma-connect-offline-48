import React, { createContext, useContext, useState, ReactNode } from 'react'

// Types et interfaces
export interface TeleconsultationPatient {
  id: string
  name: string
  phone: string
  email?: string
  avatar?: string
  status: 'waiting' | 'in-consultation' | 'completed'
  waitingSince: string
  consultationType: 'chat' | 'video' | 'async'
  priority: 'low' | 'medium' | 'high'
  reason: string
  medicalHistory?: string[]
  allergies?: string[]
}

export interface Consultation {
  id: string
  patientId: string
  pharmacistId: string
  date: string
  startTime?: string
  endTime?: string
  type: 'chat' | 'video' | 'async'
  status: 'scheduled' | 'active' | 'completed' | 'cancelled'
  notes: string
  prescriptions?: string[]
  followUpRequired: boolean
  rating?: number
  summary?: string
}

export interface ChatMessage {
  id: string
  consultationId: string
  senderId: string
  senderType: 'patient' | 'pharmacist'
  message: string
  timestamp: string
  type: 'text' | 'image' | 'prescription' | 'system'
  attachments?: string[]
  read: boolean
}

export interface DigitalPrescription {
  id: string
  patientId: string
  pharmacistId: string
  consultationId?: string
  date: string
  status: 'pending' | 'validated' | 'dispensed' | 'cancelled'
  medicines: {
    medicineId: string
    name: string
    dosage: string
    quantity: number
    instructions: string
    duration: string
  }[]
  validationDate?: string
  dispensingDate?: string
  notes?: string
  digitalSignature?: string
}

export interface TreatmentFollowUp {
  id: string
  patientId: string
  prescriptionId: string
  medicineId: string
  medicineName: string
  schedule: {
    frequency: string
    times: string[]
    duration: string
  }
  adherence: {
    taken: boolean
    date: string
    time: string
    notes?: string
  }[]
  reminders: {
    id: string
    type: 'medication' | 'appointment' | 'refill'
    message: string
    scheduledTime: string
    sent: boolean
  }[]
  sideEffects?: {
    effect: string
    severity: 'mild' | 'moderate' | 'severe'
    date: string
  }[]
}

export interface PharmacistAvailability {
  pharmacistId: string
  name: string
  specialties: string[]
  isOnline: boolean
  status: 'available' | 'busy' | 'break' | 'offline'
  workingHours: {
    day: string
    start: string
    end: string
  }[]
  consultationTypes: ('chat' | 'video' | 'async')[]
  currentConsultations: number
  maxConsultations: number
}

export interface Notification {
  id: string
  recipientId: string
  type: 'new-consultation' | 'prescription-validation' | 'medication-reminder' | 'followup-due' | 'system'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  timestamp: string
  read: boolean
  actionRequired: boolean
  relatedId?: string
  relatedType?: 'consultation' | 'prescription' | 'patient'
}

interface TelepharmacyContextType {
  // Patients en attente
  waitingPatients: TeleconsultationPatient[]
  addWaitingPatient: (patient: Omit<TeleconsultationPatient, 'id'>) => void
  updatePatientStatus: (patientId: string, status: TeleconsultationPatient['status']) => void
  
  // Consultations
  consultations: Consultation[]
  activeConsultation: Consultation | null
  startConsultation: (patientId: string, type: 'chat' | 'video' | 'async') => void
  endConsultation: (consultationId: string, notes: string, rating?: number) => void
  scheduleConsultation: (consultation: Omit<Consultation, 'id'>) => void
  
  // Messages
  chatMessages: ChatMessage[]
  sendMessage: (consultationId: string, message: string, attachments?: string[]) => void
  markMessagesAsRead: (consultationId: string) => void
  
  // Prescriptions numériques
  digitalPrescriptions: DigitalPrescription[]
  createPrescription: (prescription: Omit<DigitalPrescription, 'id'>) => void
  validatePrescription: (prescriptionId: string, pharmacistId: string) => void
  dispensePrescription: (prescriptionId: string) => void
  
  // Suivi des traitements
  treatmentFollowUps: TreatmentFollowUp[]
  createTreatmentFollowUp: (followUp: Omit<TreatmentFollowUp, 'id'>) => void
  updateAdherence: (followUpId: string, medicineId: string, taken: boolean, notes?: string) => void
  addSideEffect: (followUpId: string, effect: string, severity: 'mild' | 'moderate' | 'severe') => void
  
  // Disponibilité des pharmaciens
  pharmacistAvailability: PharmacistAvailability[]
  updatePharmacistStatus: (pharmacistId: string, status: PharmacistAvailability['status']) => void
  
  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  markNotificationAsRead: (notificationId: string) => void
  getUnreadNotifications: () => Notification[]
}

const TelepharmacyContext = createContext<TelepharmacyContextType | undefined>(undefined)

// Données mockées
const mockWaitingPatients: TeleconsultationPatient[] = [
  {
    id: 'PAT-001',
    name: 'Aminata Traoré',
    phone: '+223 70 12 34 56',
    email: 'aminata.traore@email.com',
    status: 'waiting',
    waitingSince: '2024-01-15T14:30:00Z',
    consultationType: 'video',
    priority: 'medium',
    reason: 'Questions sur son traitement contre l\'hypertension',
    medicalHistory: ['Hypertension', 'Diabète type 2'],
    allergies: ['Pénicilline']
  },
  {
    id: 'PAT-002',
    name: 'Ibrahim Koné',
    phone: '+223 75 11 22 33',
    status: 'waiting',
    waitingSince: '2024-01-15T15:00:00Z',
    consultationType: 'chat',
    priority: 'high',
    reason: 'Effets secondaires du nouveau médicament',
    medicalHistory: ['Asthme']
  }
]

const mockConsultations: Consultation[] = [
  {
    id: 'CONS-001',
    patientId: 'PAT-001',
    pharmacistId: 'PHARM-001',
    date: '2024-01-15',
    startTime: '14:00',
    type: 'video',
    status: 'completed',
    notes: 'Patient satisfait du traitement. Rappel sur l\'importance de la régularité.',
    followUpRequired: true,
    rating: 5
  }
]

const mockChatMessages: ChatMessage[] = [
  {
    id: 'MSG-001',
    consultationId: 'CONS-001',
    senderId: 'PAT-001',
    senderType: 'patient',
    message: 'Bonjour docteur, j\'ai des questions sur mon traitement',
    timestamp: '2024-01-15T14:05:00Z',
    type: 'text',
    read: true
  },
  {
    id: 'MSG-002',
    consultationId: 'CONS-001',
    senderId: 'PHARM-001',
    senderType: 'pharmacist',
    message: 'Bonjour Aminata, je suis là pour vous aider. Quelles sont vos questions ?',
    timestamp: '2024-01-15T14:06:00Z',
    type: 'text',
    read: true
  }
]

const mockDigitalPrescriptions: DigitalPrescription[] = [
  {
    id: 'PRESC-001',
    patientId: 'PAT-001',
    pharmacistId: 'PHARM-001',
    consultationId: 'CONS-001',
    date: '2024-01-15',
    status: 'validated',
    medicines: [
      {
        medicineId: 'MED-001',
        name: 'Amlodipine',
        dosage: '5mg',
        quantity: 30,
        instructions: '1 comprimé par jour le matin',
        duration: '30 jours'
      }
    ],
    validationDate: '2024-01-15T14:30:00Z'
  }
]

const mockTreatmentFollowUps: TreatmentFollowUp[] = [
  {
    id: 'FOLLOW-001',
    patientId: 'PAT-001',
    prescriptionId: 'PRESC-001',
    medicineId: 'MED-001',
    medicineName: 'Amlodipine 5mg',
    schedule: {
      frequency: 'Une fois par jour',
      times: ['08:00'],
      duration: '30 jours'
    },
    adherence: [
      {
        taken: true,
        date: '2024-01-15',
        time: '08:15',
        notes: 'Pris avec le petit déjeuner'
      }
    ],
    reminders: [
      {
        id: 'REM-001',
        type: 'medication',
        message: 'Il est temps de prendre votre Amlodipine',
        scheduledTime: '2024-01-16T08:00:00Z',
        sent: false
      }
    ]
  }
]

const mockPharmacistAvailability: PharmacistAvailability[] = [
  {
    pharmacistId: 'PHARM-001',
    name: 'Dr. Amina Diallo',
    specialties: ['Cardiologie', 'Diabétologie'],
    isOnline: true,
    status: 'available',
    workingHours: [
      { day: 'Lundi', start: '08:00', end: '18:00' },
      { day: 'Mardi', start: '08:00', end: '18:00' },
      { day: 'Mercredi', start: '08:00', end: '18:00' },
      { day: 'Jeudi', start: '08:00', end: '18:00' },
      { day: 'Vendredi', start: '08:00', end: '18:00' }
    ],
    consultationTypes: ['chat', 'video', 'async'],
    currentConsultations: 1,
    maxConsultations: 5
  }
]

const mockNotifications: Notification[] = [
  {
    id: 'NOTIF-001',
    recipientId: 'PHARM-001',
    type: 'new-consultation',
    title: 'Nouvelle consultation',
    message: 'Aminata Traoré demande une consultation vidéo',
    priority: 'medium',
    timestamp: '2024-01-15T14:30:00Z',
    read: false,
    actionRequired: true,
    relatedId: 'PAT-001',
    relatedType: 'patient'
  },
  {
    id: 'NOTIF-002',
    recipientId: 'PHARM-001',
    type: 'prescription-validation',
    title: 'Ordonnance à valider',
    message: 'Nouvelle ordonnance en attente de validation',
    priority: 'high',
    timestamp: '2024-01-15T15:00:00Z',
    read: false,
    actionRequired: true,
    relatedId: 'PRESC-002',
    relatedType: 'prescription'
  }
]

export function TelepharmacyProvider({ children }: { children: ReactNode }) {
  const [waitingPatients, setWaitingPatients] = useState<TeleconsultationPatient[]>(mockWaitingPatients)
  const [consultations, setConsultations] = useState<Consultation[]>(mockConsultations)
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages)
  const [digitalPrescriptions, setDigitalPrescriptions] = useState<DigitalPrescription[]>(mockDigitalPrescriptions)
  const [treatmentFollowUps, setTreatmentFollowUps] = useState<TreatmentFollowUp[]>(mockTreatmentFollowUps)
  const [pharmacistAvailability, setPharmacistAvailability] = useState<PharmacistAvailability[]>(mockPharmacistAvailability)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const addWaitingPatient = (patient: Omit<TeleconsultationPatient, 'id'>) => {
    const newPatient = { ...patient, id: `PAT-${Date.now()}` }
    setWaitingPatients(prev => [...prev, newPatient])
    
    // Ajouter notification
    addNotification({
      recipientId: 'PHARM-001',
      type: 'new-consultation',
      title: 'Nouvelle consultation',
      message: `${patient.name} demande une consultation ${patient.consultationType}`,
      priority: patient.priority,
      timestamp: new Date().toISOString(),
      read: false,
      actionRequired: true,
      relatedId: newPatient.id,
      relatedType: 'patient'
    })
  }

  const updatePatientStatus = (patientId: string, status: TeleconsultationPatient['status']) => {
    setWaitingPatients(prev => prev.map(patient => 
      patient.id === patientId ? { ...patient, status } : patient
    ))
  }

  const startConsultation = (patientId: string, type: 'chat' | 'video' | 'async') => {
    const consultation: Consultation = {
      id: `CONS-${Date.now()}`,
      patientId,
      pharmacistId: 'PHARM-001',
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      type,
      status: 'active',
      notes: '',
      followUpRequired: false
    }
    
    setConsultations(prev => [...prev, consultation])
    setActiveConsultation(consultation)
    updatePatientStatus(patientId, 'in-consultation')
  }

  const endConsultation = (consultationId: string, notes: string, rating?: number) => {
    setConsultations(prev => prev.map(consultation => 
      consultation.id === consultationId 
        ? { 
            ...consultation, 
            status: 'completed' as const,
            endTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            notes,
            rating
          }
        : consultation
    ))
    setActiveConsultation(null)
  }

  const scheduleConsultation = (consultation: Omit<Consultation, 'id'>) => {
    const newConsultation = { ...consultation, id: `CONS-${Date.now()}` }
    setConsultations(prev => [...prev, newConsultation])
  }

  const sendMessage = (consultationId: string, message: string, attachments?: string[]) => {
    const newMessage: ChatMessage = {
      id: `MSG-${Date.now()}`,
      consultationId,
      senderId: 'PHARM-001',
      senderType: 'pharmacist',
      message,
      timestamp: new Date().toISOString(),
      type: 'text',
      attachments,
      read: false
    }
    setChatMessages(prev => [...prev, newMessage])
  }

  const markMessagesAsRead = (consultationId: string) => {
    setChatMessages(prev => prev.map(msg => 
      msg.consultationId === consultationId ? { ...msg, read: true } : msg
    ))
  }

  const createPrescription = (prescription: Omit<DigitalPrescription, 'id'>) => {
    const newPrescription = { ...prescription, id: `PRESC-${Date.now()}` }
    setDigitalPrescriptions(prev => [...prev, newPrescription])
    
    addNotification({
      recipientId: 'PHARM-001',
      type: 'prescription-validation',
      title: 'Nouvelle ordonnance',
      message: 'Nouvelle ordonnance créée en attente de validation',
      priority: 'medium',
      timestamp: new Date().toISOString(),
      read: false,
      actionRequired: true,
      relatedId: newPrescription.id,
      relatedType: 'prescription'
    })
  }

  const validatePrescription = (prescriptionId: string, pharmacistId: string) => {
    setDigitalPrescriptions(prev => prev.map(presc => 
      presc.id === prescriptionId 
        ? { ...presc, status: 'validated' as const, validationDate: new Date().toISOString() }
        : presc
    ))
  }

  const dispensePrescription = (prescriptionId: string) => {
    setDigitalPrescriptions(prev => prev.map(presc => 
      presc.id === prescriptionId 
        ? { ...presc, status: 'dispensed' as const, dispensingDate: new Date().toISOString() }
        : presc
    ))
  }

  const createTreatmentFollowUp = (followUp: Omit<TreatmentFollowUp, 'id'>) => {
    const newFollowUp = { ...followUp, id: `FOLLOW-${Date.now()}` }
    setTreatmentFollowUps(prev => [...prev, newFollowUp])
  }

  const updateAdherence = (followUpId: string, medicineId: string, taken: boolean, notes?: string) => {
    setTreatmentFollowUps(prev => prev.map(followUp => 
      followUp.id === followUpId 
        ? {
            ...followUp,
            adherence: [
              ...followUp.adherence,
              {
                taken,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                notes
              }
            ]
          }
        : followUp
    ))
  }

  const addSideEffect = (followUpId: string, effect: string, severity: 'mild' | 'moderate' | 'severe') => {
    setTreatmentFollowUps(prev => prev.map(followUp => 
      followUp.id === followUpId 
        ? {
            ...followUp,
            sideEffects: [
              ...(followUp.sideEffects || []),
              {
                effect,
                severity,
                date: new Date().toISOString().split('T')[0]
              }
            ]
          }
        : followUp
    ))
  }

  const updatePharmacistStatus = (pharmacistId: string, status: PharmacistAvailability['status']) => {
    setPharmacistAvailability(prev => prev.map(pharm => 
      pharm.pharmacistId === pharmacistId ? { ...pharm, status } : pharm
    ))
  }

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification = { ...notification, id: `NOTIF-${Date.now()}` }
    setNotifications(prev => [newNotification, ...prev])
  }

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ))
  }

  const getUnreadNotifications = () => {
    return notifications.filter(notif => !notif.read)
  }

  return (
    <TelepharmacyContext.Provider value={{
      waitingPatients,
      addWaitingPatient,
      updatePatientStatus,
      consultations,
      activeConsultation,
      startConsultation,
      endConsultation,
      scheduleConsultation,
      chatMessages,
      sendMessage,
      markMessagesAsRead,
      digitalPrescriptions,
      createPrescription,
      validatePrescription,
      dispensePrescription,
      treatmentFollowUps,
      createTreatmentFollowUp,
      updateAdherence,
      addSideEffect,
      pharmacistAvailability,
      updatePharmacistStatus,
      notifications,
      addNotification,
      markNotificationAsRead,
      getUnreadNotifications
    }}>
      {children}
    </TelepharmacyContext.Provider>
  )
}

export function useTelepharmacy() {
  const context = useContext(TelepharmacyContext)
  if (context === undefined) {
    throw new Error('useTelepharmacy must be used within a TelepharmacyProvider')
  }
  return context
}