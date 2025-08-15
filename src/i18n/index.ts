import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      // Navigation and general
      welcome: "Welcome to PharmaLink",
      dashboard: "Dashboard",
      stock: "Stock Management",
      sales: "Sales",
      orders: "Orders",
      prescriptions: "Prescriptions",
      reports: "Reports",
      settings: "Settings",
      logout: "Logout",
      
      // Authentication
      signIn: "Sign In",
      signInDescription: "Enter your credentials to access your account",
      email: "Email",
      password: "Password",
      demoAccounts: "Demo Accounts",
      defaultPassword: "Default password",
      invalidCredentials: "Invalid email or password",
      healthcareManagement: "Healthcare Management System",
      allRightsReserved: "All rights reserved",
      modernPharmacyManagement: "Modern Pharmacy Management",
      digitalSolutionForHealthcare: "Complete digital solution for modern healthcare management",
      patientCare: "Patient Care",
      secureData: "Secure Data",
      analytics: "Analytics",
      teamManagement: "Team Management",
      
      // Roles
      administrator: "Administrator",
      pharmacist: "Pharmacist", 
      cashier: "Cashier",
      stockmanager: "Stock Manager",
      
      // Dashboard specific
      todayActivity: "Here's what's happening in your pharmacy today",
      systemHealthy: "System Healthy",
      totalSalesToday: "Total Sales Today",
      stockItems: "Stock Items",
      lowStockAlerts: "Low Stock Alerts",
      activePrescriptions: "Active Prescriptions",
      fromTransactions: "from {{count}} transactions",
      medicinesInInventory: "medicines in inventory",
      itemsNeedRestocking: "items need restocking",
      pendingFulfillment: "pending fulfillment",
      quickActions: "Quick Actions",
      recentActivities: "Recent Activities",
      performanceOverview: "Performance Overview",
      
      // Common actions
      edit: "Edit",
      delete: "Delete",
      add: "Add",
      save: "Save",
      cancel: "Cancel",
      search: "Search",
      success: "Success",
      error: "Error",
      view: "View",
      print: "Print",
      export: "Export",
      import: "Import",
      filter: "Filter",
      filters: "Filters",
      refresh: "Refresh",
      
      // Stock Management
      stockManagement: "Stock Management",
      addMedicine: "Add Medicine",
      addNewMedicine: "Add New Medicine",
      medicineName: "Medicine Name",
      form: "Form",
      dosage: "Dosage",
      category: "Category",
      barcode: "Barcode",
      batchNumber: "Batch Number",
      currentStock: "Current Stock",
      minimumStock: "Minimum Stock",
      sellingPrice: "Selling Price",
      costPrice: "Cost Price",
      expiryDate: "Expiry Date",
      supplier: "Supplier",
      selectForm: "Select form",
      selectCategory: "Select category",
      medicineAdded: "Medicine added successfully",
      failedToAddMedicine: "Failed to add medicine",
      confirmDeleteMedicine: "Are you sure you want to delete this medicine?",
      medicineInventory: "Medicine Inventory",
      productsInStock: "Products in Stock",
      lowStock: "Low Stock",
      nearExpiry: "Near Expiry",
      
      // Sales
      salesTitle: "Sales",
      newSale: "New Sale",
      total: "Total",
      pointOfSale: "Point of Sale",
      salesHistory: "Sales History",
      paymentMethod: "Payment Method",
      cash: "Cash",
      card: "Card",
      mobile: "Mobile Money",
      todaysSales: "Today's Sales",
      todaysRevenue: "Today's Revenue",
      totalSales: "Total Sales",
      addToCart: "Add to Cart",
      cart: "Cart",
      emptyCart: "Empty Cart",
      finalizeSale: "Finalize Sale",
      
      // Orders
      orderManagement: "Order Management",
      createOrder: "Create Order",
      orderHistory: "Order History",
      ordersThisMonth: "Orders This Month",
      pending: "Pending",
      totalValue: "Total Value",
      
      // Prescriptions
      prescriptionManagement: "Prescription Management",
      addPrescription: "Add Prescription",
      digitalPrescriptions: "Digital Prescriptions",
      patientName: "Patient Name",
      patientPhone: "Patient Phone",
      doctorName: "Doctor Name",
      instructions: "Instructions",
      prescriptionAdded: "Prescription added successfully",
      failedToAddPrescription: "Failed to add prescription",
      
      // Reports
      reportsAnalytics: "Reports & Analytics",
      generateReport: "Generate Report",
      salesReport: "Sales Report",
      stockReport: "Stock Report",
      financialReport: "Financial Report",
      customReport: "Custom Report",
      
      // Patients
      patients: "Patients",
      patientManagement: "Patient Management",
      addPatient: "Add Patient",
      patientsDatabase: "Patients Database",
      allergies: "Allergies",
      medicalHistory: "Medical History",
      contactInfo: "Contact Information",
      
      // Billing
      billing: "Billing",
      billingInvoices: "Billing & Invoices",
      invoiceManagement: "Invoice Management",
      createInvoice: "Create Invoice",
      invoiceNumber: "Invoice Number",
      invoiceHistory: "Invoice History",
      
      // Settings
      systemSettings: "System Settings",
      userManagement: "User Management",
      addUser: "Add User",
      generalSettings: "General Settings",
      notifications: "Notifications",
      backup: "Backup",
      
      // General terms
      actions: "Actions",
      status: "Status",
      date: "Date",
      amount: "Amount",
      quantity: "Quantity",
      price: "Price",
      name: "Name",
      description: "Description",
      notes: "Notes",
      phone: "Phone",
      address: "Address",
      
      // Status values
      active: "Active",
      inactive: "Inactive",
      completed: "Completed",
      partial: "Partial",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      
      // Time related
      online: "Online",
      offline: "Offline",
      today: "Today",
      yesterday: "Yesterday",
      thisWeek: "This Week",
      thisMonth: "This Month",
      
      // Theme
      themeLabel: "Theme",
      light: "Light",
      dark: "Dark",
      auto: "Auto",
      
      // Language
      language: "Language",
      french: "Français",
      english: "English",
      
      // Notifications
      stockLowNotification: "Stock is running low for {{medicineName}}",
      medicineExpiring: "{{medicineName}} expires on {{date}}",
      newOrderReceived: "New order received from {{supplier}}",
      saleCompleted: "Sale completed successfully",
      
      // Units
      tablets: "Tablets",
      capsules: "Capsules",
      syrup: "Syrup",
      injection: "Injection",
      cream: "Cream",
      drops: "Drops"
    }
  },
  fr: {
    translation: {
      // Navigation et général
      welcome: "Bienvenue sur PharmaLink",
      dashboard: "Tableau de bord",
      stock: "Gestion de stock",
      sales: "Ventes",
      orders: "Commandes",
      prescriptions: "Ordonnances",
      reports: "Rapports",
      settings: "Paramètres",
      logout: "Déconnexion",
      
      // Authentification
      signIn: "Se connecter",
      signInDescription: "Entrez vos identifiants pour accéder à votre compte",
      email: "Email",
      password: "Mot de passe",
      demoAccounts: "Comptes de démonstration",
      defaultPassword: "Mot de passe par défaut",
      invalidCredentials: "Email ou mot de passe invalide",
      healthcareManagement: "Système de Gestion de Santé",
      allRightsReserved: "Tous droits réservés",
      modernPharmacyManagement: "Gestion Moderne de Pharmacie",
      digitalSolutionForHealthcare: "Solution numérique complète pour la gestion moderne de la santé",
      patientCare: "Soins aux Patients",
      secureData: "Données Sécurisées",
      analytics: "Analyses",
      teamManagement: "Gestion d'Équipe",
      
      // Rôles
      administrator: "Administrateur",
      pharmacist: "Pharmacien",
      cashier: "Caissier",
      stockmanager: "Gestionnaire Stock",
      
      // Tableau de bord spécifique
      todayActivity: "Voici ce qui se passe dans votre pharmacie aujourd'hui",
      systemHealthy: "Système en bonne santé",
      totalSalesToday: "Ventes Totales Aujourd'hui",
      stockItems: "Articles en Stock",
      lowStockAlerts: "Alertes Stock Faible",
      activePrescriptions: "Ordonnances Actives",
      fromTransactions: "de {{count}} transactions",
      medicinesInInventory: "médicaments en inventaire",
      itemsNeedRestocking: "articles à réapprovisionner",
      pendingFulfillment: "en attente d'exécution",
      quickActions: "Actions Rapides",
      recentActivities: "Activités Récentes",
      performanceOverview: "Aperçu des Performances",
      
      // Actions communes
      edit: "Modifier",
      delete: "Supprimer",
      add: "Ajouter",
      save: "Enregistrer",
      cancel: "Annuler",
      search: "Rechercher",
      success: "Succès",
      error: "Erreur",
      view: "Voir",
      print: "Imprimer",
      export: "Exporter",
      import: "Importer",
      filter: "Filtrer",
      filters: "Filtres",
      refresh: "Actualiser",
      
      // Gestion de stock
      stockManagement: "Gestion de Stock",
      addMedicine: "Ajouter un médicament",
      addNewMedicine: "Ajouter un nouveau médicament",
      medicineName: "Nom du médicament",
      form: "Forme",
      dosage: "Dosage",
      category: "Catégorie",
      barcode: "Code-barres",
      batchNumber: "Numéro de lot",
      currentStock: "Stock actuel",
      minimumStock: "Stock minimum",
      sellingPrice: "Prix de vente",
      costPrice: "Prix de revient",
      expiryDate: "Date d'expiration",
      supplier: "Fournisseur",
      selectForm: "Sélectionner la forme",
      selectCategory: "Sélectionner la catégorie",
      medicineAdded: "Médicament ajouté avec succès",
      failedToAddMedicine: "Échec de l'ajout du médicament",
      confirmDeleteMedicine: "Êtes-vous sûr de vouloir supprimer ce médicament ?",
      medicineInventory: "Inventaire des Médicaments",
      productsInStock: "Produits en Stock",
      lowStock: "Stock Faible",
      nearExpiry: "Expiration Proche",
      
      // Ventes
      salesTitle: "Ventes",
      newSale: "Nouvelle vente",
      total: "Total",
      pointOfSale: "Point de Vente",
      salesHistory: "Historique des Ventes",
      paymentMethod: "Mode de Paiement",
      cash: "Espèces",
      card: "Carte",
      mobile: "Mobile Money",
      todaysSales: "Ventes d'Aujourd'hui",
      todaysRevenue: "Revenus du Jour",
      totalSales: "Total des Ventes",
      addToCart: "Ajouter au Panier",
      cart: "Panier",
      emptyCart: "Panier Vide",
      finalizeSale: "Finaliser la Vente",
      
      // Commandes
      orderManagement: "Gestion des commandes",
      createOrder: "Créer une commande",
      orderHistory: "Historique des commandes",
      ordersThisMonth: "Commandes ce Mois",
      pending: "En Attente",
      totalValue: "Valeur Totale",
      
      // Ordonnances
      prescriptionManagement: "Gestion des ordonnances",
      addPrescription: "Ajouter une ordonnance",
      digitalPrescriptions: "Ordonnances Numériques",
      patientName: "Nom du patient",
      patientPhone: "Téléphone du patient",
      doctorName: "Nom du médecin",
      instructions: "Instructions",
      prescriptionAdded: "Ordonnance ajoutée avec succès",
      failedToAddPrescription: "Échec de l'ajout de l'ordonnance",
      
      // Rapports
      reportsAnalytics: "Rapports et analyses",
      generateReport: "Générer un rapport",
      salesReport: "Rapport de Ventes",
      stockReport: "Rapport de Stock",
      financialReport: "Rapport Financier",
      customReport: "Rapport Personnalisé",
      
      // Patients
      patients: "Patients",
      patientManagement: "Gestion des Patients",
      addPatient: "Ajouter un Patient",
      patientsDatabase: "Base de Données Patients",
      allergies: "Allergies",
      medicalHistory: "Historique Médical",
      contactInfo: "Informations de Contact",
      
      // Facturation
      billing: "Facturation",
      billingInvoices: "Facturation et Factures",
      invoiceManagement: "Gestion des Factures",
      createInvoice: "Créer une Facture",
      invoiceNumber: "Numéro de Facture",
      invoiceHistory: "Historique des Factures",
      
      // Paramètres
      systemSettings: "Paramètres Système",
      userManagement: "Gestion des Utilisateurs",
      addUser: "Ajouter un Utilisateur",
      generalSettings: "Paramètres Généraux",
      notifications: "Notifications",
      backup: "Sauvegarde",
      
      // Termes généraux
      actions: "Actions",
      status: "Statut",
      date: "Date",
      amount: "Montant",
      quantity: "Quantité",
      price: "Prix",
      name: "Nom",
      description: "Description",
      notes: "Notes",
      phone: "Téléphone",
      address: "Adresse",
      
      // Valeurs de statut
      active: "Actif",
      inactive: "Inactif",
      completed: "Terminé",
      partial: "Partiel",
      shipped: "Expédié",
      delivered: "Livré",
      cancelled: "Annulé",
      
      // Lié au temps
      online: "En ligne",
      offline: "Hors ligne",
      today: "Aujourd'hui",
      yesterday: "Hier",
      thisWeek: "Cette Semaine",
      thisMonth: "Ce Mois",
      
      // Thème
      themeLabel: "Thème",
      light: "Clair",
      dark: "Sombre",
      auto: "Automatique",
      
      // Langue
      language: "Langue",
      french: "Français",
      english: "English",
      
      // Notifications
      stockLowNotification: "Le stock est faible pour {{medicineName}}",
      medicineExpiring: "{{medicineName}} expire le {{date}}",
      newOrderReceived: "Nouvelle commande reçue de {{supplier}}",
      saleCompleted: "Vente terminée avec succès",
      
      // Unités
      tablets: "Comprimés",
      capsules: "Gélules",
      syrup: "Sirop",
      injection: "Injection",
      cream: "Crème",
      drops: "Gouttes"
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    debug: false,
    interpolation: {
      escapeValue: false
    }
  })

export default i18n