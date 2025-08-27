import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreditCard, Banknote, Smartphone, Receipt, Eye, Download } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Payment {
  id: string
  saleId: string
  customer: string
  amount: number
  paidAmount: number
  method: "cash" | "card" | "mobile_money"
  status: "paid" | "partial" | "pending"
  date: string
  reference?: string
  pharmacy: string
}

const mockPayments: Payment[] = [
  {
    id: "PAY-001",
    saleId: "VNT-001",
    customer: "Jean Dupont",
    amount: 850,
    paidAmount: 850,
    method: "mobile_money",
    status: "paid",
    date: "2024-01-15 14:30",
    reference: "MM123456789",
    pharmacy: "Pharmacie Centrale"
  },
  {
    id: "PAY-002",
    saleId: "VNT-002",
    customer: "Marie Martin",
    amount: 300,
    paidAmount: 300,
    method: "cash",
    status: "paid",
    date: "2024-01-15 13:45",
    pharmacy: "Pharmacie Nord"
  },
  {
    id: "PAY-003",
    saleId: "VNT-003",
    customer: "Paul Bernard",
    amount: 1250,
    paidAmount: 800,
    method: "card",
    status: "partial",
    date: "2024-01-15 12:20",
    reference: "CARD789456123",
    pharmacy: "Pharmacie Centrale"
  }
]

export default function PaymentTracking() {
  const [payments, setPayments] = useState(mockPayments)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [partialPaymentAmount, setPartialPaymentAmount] = useState("")

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cash": return <Banknote className="w-4 h-4" />
      case "card": return <CreditCard className="w-4 h-4" />
      case "mobile_money": return <Smartphone className="w-4 h-4" />
      default: return <CreditCard className="w-4 h-4" />
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "cash": return "Espèces"
      case "card": return "Carte bancaire"
      case "mobile_money": return "Mobile Money"
      default: return method
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "paid": return "success"
      case "partial": return "warning"
      case "pending": return "destructive"
      default: return "default"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid": return "Payé"
      case "partial": return "Partiel"
      case "pending": return "En attente"
      default: return status
    }
  }

  const processPartialPayment = (paymentId: string, amount: number) => {
    setPayments(payments.map(payment => {
      if (payment.id === paymentId) {
        const newPaidAmount = payment.paidAmount + amount
        const newStatus = newPaidAmount >= payment.amount ? "paid" : "partial"
        return { ...payment, paidAmount: newPaidAmount, status: newStatus as any }
      }
      return payment
    }))
  }

  const generateReceipt = (payment: Payment) => {
    // Simulate receipt generation
    alert(`Reçu généré pour le paiement ${payment.id}`)
  }

  const totalPaid = payments.reduce((sum, payment) => sum + payment.paidAmount, 0)
  const totalPending = payments.reduce((sum, payment) => sum + (payment.amount - payment.paidAmount), 0)

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Suivi des paiements
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-green-50 dark:bg-green-950/20">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">₣ {totalPaid.toLocaleString()}</p>
                <p className="text-sm text-green-600">Total encaissé</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">₣ {totalPending.toLocaleString()}</p>
                <p className="text-sm text-orange-600">En attente</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {payments.filter(p => p.method === "mobile_money").length}
                </p>
                <p className="text-sm text-blue-600">Mobile Money</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-950/20">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {payments.filter(p => p.method === "cash").length}
                </p>
                <p className="text-sm text-purple-600">Espèces</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Paiement</TableHead>
              <TableHead>Vente</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Payé</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.id}</TableCell>
                <TableCell>{payment.saleId}</TableCell>
                <TableCell>{payment.customer}</TableCell>
                <TableCell className="font-medium">₣ {payment.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="font-medium">
                    ₣ {payment.paidAmount.toLocaleString()}
                    {payment.paidAmount < payment.amount && (
                      <span className="text-sm text-muted-foreground ml-1">
                        / ₣ {payment.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getPaymentMethodIcon(payment.method)}
                    <span>{getPaymentMethodLabel(payment.method)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(payment.status) as any}>
                    {getStatusLabel(payment.status)}
                  </Badge>
                </TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedPayment(payment)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Détails du paiement {payment.id}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Client</Label>
                              <p className="font-medium">{payment.customer}</p>
                            </div>
                            <div>
                              <Label>Montant total</Label>
                              <p className="font-medium">₣ {payment.amount.toLocaleString()}</p>
                            </div>
                            <div>
                              <Label>Montant payé</Label>
                              <p className="font-medium text-green-600">₣ {payment.paidAmount.toLocaleString()}</p>
                            </div>
                            <div>
                              <Label>Reste à payer</Label>
                              <p className="font-medium text-orange-600">₣ {(payment.amount - payment.paidAmount).toLocaleString()}</p>
                            </div>
                          </div>
                          
                          {payment.status === "partial" && (
                            <div className="border-t pt-4">
                              <Label htmlFor="partial-payment">Encaisser un complément</Label>
                              <div className="flex gap-2 mt-2">
                                <Input
                                  id="partial-payment"
                                  placeholder="Montant"
                                  value={partialPaymentAmount}
                                  onChange={(e) => setPartialPaymentAmount(e.target.value)}
                                />
                                <Button 
                                  onClick={() => {
                                    const amount = parseFloat(partialPaymentAmount)
                                    if (amount > 0) {
                                      processPartialPayment(payment.id, amount)
                                      setPartialPaymentAmount("")
                                    }
                                  }}
                                >
                                  Encaisser
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => generateReceipt(payment)}
                    >
                      <Receipt className="w-4 h-4" />
                    </Button>

                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}