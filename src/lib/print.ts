import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface PrintItem {
  name: string
  quantity: number
  price: number
  total: number
}

interface PrintInvoiceData {
  invoiceNumber: string
  date: string
  pharmacyName: string
  pharmacyAddress?: string
  pharmacyPhone?: string
  patientName?: string
  cashierName?: string
  items: PrintItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
  prescriptionId?: string
}

// Generate thermal receipt (80mm)
export function printThermalReceipt(data: PrintInvoiceData) {
  const receiptWidth = 80 // mm
  const doc = new jsPDF({ unit: 'mm', format: [receiptWidth, 200] })
  
  let y = 10
  const centerX = receiptWidth / 2
  
  // Header
  doc.setFontSize(14)
  doc.text(data.pharmacyName, centerX, y, { align: 'center' })
  y += 5
  
  if (data.pharmacyAddress) {
    doc.setFontSize(7)
    doc.text(data.pharmacyAddress, centerX, y, { align: 'center' })
    y += 4
  }
  if (data.pharmacyPhone) {
    doc.text(data.pharmacyPhone, centerX, y, { align: 'center' })
    y += 4
  }
  
  // Separator
  doc.setFontSize(8)
  doc.text('─'.repeat(40), centerX, y, { align: 'center' })
  y += 5
  
  // Invoice info
  doc.setFontSize(8)
  doc.text(`N°: ${data.invoiceNumber}`, 5, y)
  y += 4
  doc.text(`Date: ${data.date}`, 5, y)
  y += 4
  if (data.cashierName) {
    doc.text(`Caissier: ${data.cashierName}`, 5, y)
    y += 4
  }
  if (data.patientName) {
    doc.text(`Client: ${data.patientName}`, 5, y)
    y += 4
  }
  if (data.prescriptionId) {
    doc.text(`Ordonnance: ${data.prescriptionId}`, 5, y)
    y += 4
  }
  
  // Separator
  doc.text('─'.repeat(40), centerX, y, { align: 'center' })
  y += 5
  
  // Items
  doc.setFontSize(7)
  data.items.forEach(item => {
    doc.text(item.name, 5, y)
    y += 3.5
    doc.text(`  ${item.quantity} x ${item.price} FCFA`, 5, y)
    doc.text(`${item.total} FCFA`, receiptWidth - 5, y, { align: 'right' })
    y += 4
  })
  
  // Separator
  doc.text('─'.repeat(40), centerX, y, { align: 'center' })
  y += 5
  
  // Totals
  doc.setFontSize(8)
  doc.text('Sous-total:', 5, y)
  doc.text(`${data.subtotal} FCFA`, receiptWidth - 5, y, { align: 'right' })
  y += 4
  doc.text('TVA (18%):', 5, y)
  doc.text(`${data.tax} FCFA`, receiptWidth - 5, y, { align: 'right' })
  y += 4
  
  doc.setFontSize(10)
  doc.text('TOTAL:', 5, y)
  doc.text(`${data.total} FCFA`, receiptWidth - 5, y, { align: 'right' })
  y += 6
  
  // Payment method
  doc.setFontSize(8)
  doc.text(`Paiement: ${data.paymentMethod}`, 5, y)
  y += 6
  
  // Footer
  doc.text('Merci de votre visite !', centerX, y, { align: 'center' })
  y += 4
  doc.setFontSize(6)
  doc.text('Conservez ce reçu pour tout échange', centerX, y, { align: 'center' })
  
  // Resize to actual content height
  const finalDoc = new jsPDF({ unit: 'mm', format: [receiptWidth, y + 10] })
  // Re-render to correct size
  doc.save(`ticket_${data.invoiceNumber}.pdf`)
}

// Generate A4 invoice PDF
export function printA4Invoice(data: PrintInvoiceData) {
  const doc = new jsPDF()
  
  // Header
  doc.setFontSize(22)
  doc.text(data.pharmacyName, 105, 25, { align: 'center' })
  
  if (data.pharmacyAddress) {
    doc.setFontSize(10)
    doc.text(data.pharmacyAddress, 105, 32, { align: 'center' })
  }
  if (data.pharmacyPhone) {
    doc.text(`Tél: ${data.pharmacyPhone}`, 105, 37, { align: 'center' })
  }
  
  // Invoice title
  doc.setFontSize(16)
  doc.text('FACTURE', 105, 50, { align: 'center' })
  
  // Invoice details
  doc.setFontSize(10)
  doc.text(`N° Facture: ${data.invoiceNumber}`, 15, 62)
  doc.text(`Date: ${data.date}`, 15, 68)
  if (data.cashierName) doc.text(`Pharmacien: ${data.cashierName}`, 15, 74)
  
  if (data.patientName) {
    doc.text(`Patient: ${data.patientName}`, 120, 62)
  }
  if (data.prescriptionId) {
    doc.text(`Ordonnance: ${data.prescriptionId}`, 120, 68)
  }
  
  // Line
  doc.line(15, 80, 195, 80)
  
  // Items table
  autoTable(doc, {
    startY: 85,
    head: [['Désignation', 'Qté', 'Prix Unitaire', 'Total']],
    body: data.items.map(item => [
      item.name,
      item.quantity.toString(),
      `${item.price} FCFA`,
      `${item.total} FCFA`
    ]),
    foot: [
      ['', '', 'Sous-total:', `${data.subtotal} FCFA`],
      ['', '', 'TVA (18%):', `${data.tax} FCFA`],
      ['', '', 'TOTAL:', `${data.total} FCFA`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
  })
  
  // Payment info
  const finalY = (doc as any).lastAutoTable?.finalY || 150
  doc.setFontSize(10)
  doc.text(`Mode de paiement: ${data.paymentMethod}`, 15, finalY + 15)
  
  // Footer
  doc.setFontSize(8)
  doc.text('Merci de votre confiance. Conservez cette facture pour toute réclamation.', 105, finalY + 30, { align: 'center' })
  
  doc.save(`facture_${data.invoiceNumber}.pdf`)
}
