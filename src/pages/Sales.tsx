import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Scan,
  Calculator,
  CreditCard,
  Banknote,
  Receipt,
  X,
  History,
  Package,
  Smartphone
} from "lucide-react"
import SalesHistory from "@/components/sales/SalesHistory"
import ReservationsManagement from "@/components/sales/ReservationsManagement"
import PaymentTracking from "@/components/sales/PaymentTracking"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  stock: number
}

// Mock data
const availableMedicines = [
  { id: "1", name: "Paracetamol 500mg", price: 150, stock: 150 },
  { id: "2", name: "Amoxicillin 250mg", price: 300, stock: 8 },
  { id: "3", name: "Aspirin 100mg", price: 120, stock: 75 },
  { id: "4", name: "Vitamin C 1000mg", price: 200, stock: 200 },
  { id: "5", name: "Ibuprofen 400mg", price: 180, stock: 90 }
]

export default function Sales() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "mobile_money">("cash")

  const filteredMedicines = availableMedicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = (medicine: typeof availableMedicines[0]) => {
    const existingItem = cart.find(item => item.id === medicine.id)
    
    if (existingItem) {
      if (existingItem.quantity < medicine.stock) {
        setCart(cart.map(item =>
          item.id === medicine.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ))
      }
    } else {
      setCart([...cart, {
        id: medicine.id,
        name: medicine.name,
        price: medicine.price,
        quantity: 1,
        stock: medicine.stock
      }])
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== id))
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      ))
    }
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.18 // 18% tax
  const total = subtotal + tax

  const handleCheckout = () => {
    // In real app, this would process payment
    alert(`Payment of ₣ ${total.toFixed(0)} processed via ${paymentMethod}`)
    setCart([])
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Point de Vente</h1>
        <p className="text-muted-foreground">Gestion complète des ventes, réservations et paiements de la pharmacie.</p>
      </div>

      <Tabs defaultValue="pos" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pos" className="gap-2">
            <ShoppingCart className="w-4 h-4" />
            Vente rapide
          </TabsTrigger>
          <TabsTrigger value="reservations" className="gap-2">
            <Package className="w-4 h-4" />
            Réservations
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="w-4 h-4" />
            Paiements
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="w-4 h-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pos" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Selection */}
            <div className="lg:col-span-2 space-y-6">

              {/* Search Bar */}
              <Card className="shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Rechercher médicaments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text-lg h-12"
                      />
                    </div>
                    <Button variant="gradient" size="lg">
                      <Scan className="w-5 h-5 mr-2" />
                      Scanner code-barres
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Medicine Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredMedicines.map((medicine) => (
                  <Card 
                    key={medicine.id} 
                    className="shadow-soft hover:shadow-medium transition-all cursor-pointer"
                    onClick={() => addToCart(medicine)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{medicine.name}</h3>
                          <p className="text-sm text-muted-foreground">Stock: {medicine.stock}</p>
                          <p className="text-lg font-bold text-primary">₣ {medicine.price}</p>
                        </div>
                        <Button variant="medical" size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Shopping Cart */}
            <div className="space-y-6">
              <Card className="shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Panier ({cart.length})
                  </CardTitle>
                  {cart.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setCart([])}
                    >
                      Vider le panier
                    </Button>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Votre panier est vide</p>
                      <p className="text-sm">Ajoutez des médicaments pour commencer une transaction</p>
                    </div>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-xs text-muted-foreground">₣ {item.price} l'unité</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-8 h-8 p-0 ml-2"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-medium">₣ {item.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Checkout */}
              {cart.length > 0 && (
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Encaissement
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Payment Method */}
                    <div>
                      <p className="font-medium mb-2">Mode de paiement</p>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={paymentMethod === "cash" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("cash")}
                          className="h-auto p-3"
                        >
                          <Banknote className="w-4 h-4 mr-2" />
                          Espèces
                        </Button>
                        <Button
                          variant={paymentMethod === "card" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("card")}
                          className="h-auto p-3"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Carte
                        </Button>
                        <Button
                          variant={paymentMethod === "mobile_money" ? "default" : "outline"}
                          onClick={() => setPaymentMethod("mobile_money")}
                          className="h-auto p-3"
                        >
                          <Smartphone className="w-4 h-4 mr-2" />
                          Mobile Money
                        </Button>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between">
                        <span>Sous-total:</span>
                        <span>₣ {subtotal.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TVA (18%):</span>
                        <span>₣ {tax.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>₣ {total.toFixed(0)}</span>
                      </div>
                    </div>

                    <Button 
                      variant="gradient" 
                      size="lg" 
                      className="w-full"
                      onClick={handleCheckout}
                    >
                      <Receipt className="w-5 h-5 mr-2" />
                      Finaliser la vente
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reservations">
          <ReservationsManagement />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentTracking />
        </TabsContent>

        <TabsContent value="history">
          <SalesHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}