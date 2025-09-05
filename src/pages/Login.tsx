import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff, Shield, Users, Heart, BarChart3 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import pharmaLogo from '@/assets/pharma-logo.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login, user, isLoading } = useAuth()
  const { t } = useTranslation()

  // Demo accounts for easy testing
  const demoAccounts = [
    { email: 'superadmin@pharmalink.com', role: 'Super Admin', name: 'Administrateur Système', icon: Shield },
    { email: 'admin@pharmalink.com', role: 'Administrator', name: 'Dr. Amina Diallo', icon: Shield },
    { email: 'pharmacist@pharmalink.com', role: 'Pharmacist', name: 'Dr. Ibrahim Kone', icon: Heart },
    { email: 'cashier@pharmalink.com', role: 'Cashier', name: 'Marie Traore', icon: Users },
    { email: 'stock@pharmalink.com', role: 'Stock Manager', name: 'Ousmane Bah', icon: BarChart3 }
  ]

  if (user) {
    // Redirect based on role
    if (user.role === 'SuperAdmin') {
      return <Navigate to="/super-admin" replace />
    }
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      await login(email, password)
    } catch (err) {
      setError(t('invalidCredentials') || 'Invalid credentials')
    }
  }

  const loginWithDemo = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('password123')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header with controls */}
          <div className="flex justify-between items-start mb-8">
            <div></div>
            <div className="flex gap-2">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </div>

          {/* Logo and Brand */}
          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 rounded-2xl overflow-hidden shadow-elegant bg-white flex items-center justify-center">
              <img src={pharmaLogo} alt="PharmaLink" className="w-20 h-20 object-contain" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-display font-bold text-foreground">PharmaLink</h1>
              <p className="text-lg text-muted-foreground">{t('healthcareManagement')}</p>
            </div>
          </div>

          {/* Login Form */}
          <Card className="shadow-elegant border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-semibold">{t('signIn')}</CardTitle>
              <CardDescription className="text-base">{t('signInDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive" className="animate-fade-in">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@pharmalink.com"
                    className="h-12 bg-background/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">{t('password')}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="password123"
                      className="h-12 bg-background/50 pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading}>
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t('signIn')}
                </Button>
              </form>

              {/* Demo Accounts */}
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground font-medium">{t('demoAccounts')}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {demoAccounts.map((account, index) => {
                    const IconComponent = account.icon
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => loginWithDemo(account.email)}
                        className="h-16 flex-col gap-1 hover:shadow-soft transition-all"
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="text-xs font-medium">{t(account.role.toLowerCase().replace(' ', ''))}</span>
                      </Button>
                    )
                  })}
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  {t('defaultPassword')}: <span className="font-mono font-medium">password123</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 PharmaLink. {t('allRightsReserved')}</p>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        <img 
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Modern Pharmacy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-background/5" />
        
        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 p-12 text-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-display font-bold text-white drop-shadow-lg">
              {t('modernPharmacyManagement')}
            </h2>
            <p className="text-xl text-white/90 drop-shadow max-w-lg mx-auto">
              {t('digitalSolutionForHealthcare')}
            </p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <Heart className="w-6 h-6 text-white mx-auto mb-2" />
                <p className="text-sm text-white font-medium">{t('patientCare')}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <Shield className="w-6 h-6 text-white mx-auto mb-2" />
                <p className="text-sm text-white font-medium">{t('secureData')}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <BarChart3 className="w-6 h-6 text-white mx-auto mb-2" />
                <p className="text-sm text-white font-medium">{t('analytics')}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <Users className="w-6 h-6 text-white mx-auto mb-2" />
                <p className="text-sm text-white font-medium">{t('teamManagement')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}