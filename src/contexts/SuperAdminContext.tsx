import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types pour les données SuperAdmin
export interface Pharmacy {
  id: string;
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
  lastActivity: Date;
  joinDate: Date;
  employeeCount: number;
  monthlyTransactions: number;
  region: string;
}

export interface PharmacyRequest {
  id: string;
  pharmacyName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  requestedPlan: 'Basic' | 'Pro' | 'Enterprise';
  submittedAt: Date;
  status: 'Pending' | 'Approved' | 'Rejected';
  documents: string[];
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'SuperAdmin' | 'RegionalAdmin' | 'Support';
  status: 'Active' | 'Inactive';
  lastLogin: Date;
  permissions: string[];
  region: string;
}

export interface Subscription {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  status: 'Active' | 'Cancelled' | 'Expired' | 'Trial';
  monthlyRevenue: number;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
}

interface SuperAdminContextType {
  // Pharmacies
  pharmacies: Pharmacy[];
  addPharmacy: (pharmacy: Omit<Pharmacy, 'id' | 'joinDate' | 'lastActivity'>) => void;
  updatePharmacy: (id: string, updates: Partial<Pharmacy>) => void;
  deletePharmacy: (id: string) => void;
  
  // Pharmacy Requests
  pharmacyRequests: PharmacyRequest[];
  approvePharmacyRequest: (id: string) => void;
  rejectPharmacyRequest: (id: string) => void;
  
  // System Users
  systemUsers: SystemUser[];
  addSystemUser: (user: Omit<SystemUser, 'id' | 'lastLogin'>) => void;
  updateSystemUser: (id: string, updates: Partial<SystemUser>) => void;
  deleteSystemUser: (id: string) => void;
  
  // Subscriptions
  subscriptions: Subscription[];
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
}

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(undefined);

// Mock Data
const mockPharmacies: Pharmacy[] = [
  {
    id: '1',
    name: 'Pharmacie Central Paris',
    owner: 'Dr. Marie Dupont',
    email: 'marie.dupont@central-paris.fr',
    phone: '+33 1 42 36 95 47',
    address: '123 Rue de Rivoli',
    city: 'Paris',
    country: 'France',
    subscriptionType: 'Pro',
    status: 'Active',
    revenue: 125000,
    uptime: 99.2,
    lastActivity: new Date(),
    joinDate: new Date('2023-01-15'),
    employeeCount: 8,
    monthlyTransactions: 2840,
    region: 'Île-de-France'
  },
  {
    id: '2',
    name: 'Pharmacie du Soleil',
    owner: 'Dr. Ahmed Ben Ali',
    email: 'ahmed@pharma-soleil.ma',
    phone: '+212 5 22 45 67 89',
    address: 'Avenue Hassan II',
    city: 'Casablanca',
    country: 'Maroc',
    subscriptionType: 'Enterprise',
    status: 'Active',
    revenue: 198000,
    uptime: 98.8,
    lastActivity: new Date(),
    joinDate: new Date('2022-11-08'),
    employeeCount: 15,
    monthlyTransactions: 4250,
    region: 'Maghreb'
  },
  {
    id: '3',
    name: 'Pharmacie Moderne Dakar',
    owner: 'Dr. Fatou Sow',
    email: 'fatou.sow@moderne-dakar.sn',
    phone: '+221 33 842 15 67',
    address: 'Plateau, Rue El Hadj Djily Mbaye',
    city: 'Dakar',
    country: 'Sénégal',
    subscriptionType: 'Basic',
    status: 'Active',
    revenue: 75000,
    uptime: 97.5,
    lastActivity: new Date(),
    joinDate: new Date('2023-05-20'),
    employeeCount: 5,
    monthlyTransactions: 1580,
    region: 'Afrique de l\'Ouest'
  }
];

const mockPharmacyRequests: PharmacyRequest[] = [
  {
    id: '1',
    pharmacyName: 'Pharmacie de l\'Avenir',
    ownerName: 'Dr. Jean Martin',
    email: 'jean.martin@avenir.fr',
    phone: '+33 4 56 78 90 12',
    address: '45 Boulevard Victor Hugo',
    city: 'Lyon',
    country: 'France',
    requestedPlan: 'Pro',
    submittedAt: new Date('2024-01-15'),
    status: 'Pending',
    documents: ['license.pdf', 'identity.pdf', 'address_proof.pdf']
  },
  {
    id: '2',
    pharmacyName: 'Pharmacie Al Baraka',
    ownerName: 'Dr. Youssef Alaoui',
    email: 'y.alaoui@albaraka.ma',
    phone: '+212 6 12 34 56 78',
    address: 'Quartier Gueliz',
    city: 'Marrakech',
    country: 'Maroc',
    requestedPlan: 'Basic',
    submittedAt: new Date('2024-01-18'),
    status: 'Pending',
    documents: ['license.pdf', 'tax_cert.pdf']
  }
];

const mockSystemUsers: SystemUser[] = [
  {
    id: '1',
    name: 'Sarah Administrative',
    email: 'sarah@pharmalink.com',
    role: 'SuperAdmin',
    status: 'Active',
    lastLogin: new Date(),
    permissions: ['all'],
    region: 'Global'
  },
  {
    id: '2',
    name: 'Mohamed Regional',
    email: 'mohamed@pharmalink.com',
    role: 'RegionalAdmin',
    status: 'Active',
    lastLogin: new Date('2024-01-19'),
    permissions: ['manage_pharmacies', 'view_reports'],
    region: 'Maghreb'
  }
];

const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    pharmacyId: '1',
    pharmacyName: 'Pharmacie Central Paris',
    plan: 'Pro',
    status: 'Active',
    monthlyRevenue: 299,
    startDate: new Date('2023-01-15'),
    endDate: new Date('2024-01-15'),
    autoRenew: true
  },
  {
    id: '2',
    pharmacyId: '2',
    pharmacyName: 'Pharmacie du Soleil',
    plan: 'Enterprise',
    status: 'Active',
    monthlyRevenue: 599,
    startDate: new Date('2022-11-08'),
    endDate: new Date('2024-11-08'),
    autoRenew: true
  }
];

export function SuperAdminProvider({ children }: { children: ReactNode }) {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(mockPharmacies);
  const [pharmacyRequests, setPharmacyRequests] = useState<PharmacyRequest[]>(mockPharmacyRequests);
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(mockSystemUsers);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);

  const addPharmacy = (pharmacyData: Omit<Pharmacy, 'id' | 'joinDate' | 'lastActivity'>) => {
    const newPharmacy: Pharmacy = {
      ...pharmacyData,
      id: Date.now().toString(),
      joinDate: new Date(),
      lastActivity: new Date()
    };
    setPharmacies(prev => [...prev, newPharmacy]);
  };

  const updatePharmacy = (id: string, updates: Partial<Pharmacy>) => {
    setPharmacies(prev => prev.map(pharmacy => 
      pharmacy.id === id ? { ...pharmacy, ...updates } : pharmacy
    ));
  };

  const deletePharmacy = (id: string) => {
    setPharmacies(prev => prev.filter(pharmacy => pharmacy.id !== id));
  };

  const approvePharmacyRequest = (id: string) => {
    const request = pharmacyRequests.find(req => req.id === id);
    if (request) {
      // Créer une nouvelle pharmacie à partir de la demande
      const newPharmacy: Omit<Pharmacy, 'id' | 'joinDate' | 'lastActivity'> = {
        name: request.pharmacyName,
        owner: request.ownerName,
        email: request.email,
        phone: request.phone,
        address: request.address,
        city: request.city,
        country: request.country,
        subscriptionType: request.requestedPlan,
        status: 'Active',
        revenue: 0,
        uptime: 100,
        employeeCount: 1,
        monthlyTransactions: 0,
        region: request.country === 'France' ? 'France' : 
               request.country === 'Maroc' ? 'Maghreb' : 'Autre'
      };
      addPharmacy(newPharmacy);
      
      // Supprimer la demande
      setPharmacyRequests(prev => prev.filter(req => req.id !== id));
    }
  };

  const rejectPharmacyRequest = (id: string) => {
    setPharmacyRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'Rejected' as const } : req
    ));
  };

  const addSystemUser = (userData: Omit<SystemUser, 'id' | 'lastLogin'>) => {
    const newUser: SystemUser = {
      ...userData,
      id: Date.now().toString(),
      lastLogin: new Date()
    };
    setSystemUsers(prev => [...prev, newUser]);
  };

  const updateSystemUser = (id: string, updates: Partial<SystemUser>) => {
    setSystemUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
  };

  const deleteSystemUser = (id: string) => {
    setSystemUsers(prev => prev.filter(user => user.id !== id));
  };

  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, ...updates } : sub
    ));
  };

  const value: SuperAdminContextType = {
    pharmacies,
    addPharmacy,
    updatePharmacy,
    deletePharmacy,
    pharmacyRequests,
    approvePharmacyRequest,
    rejectPharmacyRequest,
    systemUsers,
    addSystemUser,
    updateSystemUser,
    deleteSystemUser,
    subscriptions,
    updateSubscription
  };

  return (
    <SuperAdminContext.Provider value={value}>
      {children}
    </SuperAdminContext.Provider>
  );
}

export function useSuperAdmin() {
  const context = useContext(SuperAdminContext);
  if (context === undefined) {
    throw new Error('useSuperAdmin must be used within a SuperAdminProvider');
  }
  return context;
}