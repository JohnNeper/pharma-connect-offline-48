import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { TelepharmacyProvider } from "./contexts/TelepharmacyContext";
import { SuperAdminProvider } from "./contexts/SuperAdminContext";
import { Layout } from "./components/layout/Layout";
import { SuperAdminLayout } from "./components/layout/SuperAdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SystemActivity from "./pages/super-admin/SystemActivity";
import PharmaciesManagement from "./pages/super-admin/PharmaciesManagement";
import PharmacyRequests from "./pages/super-admin/PharmacyRequests";
import Subscriptions from "./pages/super-admin/Subscriptions";
import Telepharmacy from "./pages/Telepharmacy";
import StockManagement from "./pages/StockManagement";
import Sales from "./pages/Sales";
import Orders from "./pages/Orders";
import Prescriptions from "./pages/Prescriptions";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Patients from "./pages/Patients";
import Billing from "./pages/Billing";
import Reservations from "./pages/Reservations";
import Promotions from "./pages/Promotions";
import PharmacyAdmin from "./pages/PharmacyAdmin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import "./i18n";

const queryClient = new QueryClient();

// Component to handle role-based routing
function RoleBasedRouter() {
  const { user } = useAuth();
  
  if (user?.role === 'SuperAdmin') {
    return (
      <Routes>
        <Route path="/login" element={<Navigate to="/super-admin" replace />} />
        <Route path="/super-admin" element={
          <ProtectedRoute allowedRoles={['SuperAdmin']}>
            <SuperAdminLayout>
              <SuperAdminDashboard />
            </SuperAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/super-admin/activity" element={
          <ProtectedRoute allowedRoles={['SuperAdmin']}>
            <SuperAdminLayout>
              <SystemActivity />
            </SuperAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/super-admin/pharmacies" element={
          <ProtectedRoute allowedRoles={['SuperAdmin']}>
            <SuperAdminLayout>
              <PharmaciesManagement />
            </SuperAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/super-admin/pharmacy-requests" element={
          <ProtectedRoute allowedRoles={['SuperAdmin']}>
            <SuperAdminLayout>
              <PharmacyRequests />
            </SuperAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/super-admin/subscriptions" element={
          <ProtectedRoute allowedRoles={['SuperAdmin']}>
            <SuperAdminLayout>
              <Subscriptions />
            </SuperAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/super-admin/*" element={
          <ProtectedRoute allowedRoles={['SuperAdmin']}>
            <SuperAdminLayout>
              <SuperAdminDashboard />
            </SuperAdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/super-admin" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  // Routes pour les pharmacies (tous les autres rôles)
  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/telepharmacy" element={
        <ProtectedRoute allowedRoles={['Administrator', 'Pharmacist']}>
          <Layout>
            <Telepharmacy />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/stock" element={
        <ProtectedRoute allowedRoles={['Administrator', 'Pharmacist', 'Stock Manager', 'Cashier']}>
          <Layout>
            <StockManagement />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/sales" element={
        <ProtectedRoute allowedRoles={['Administrator', 'Pharmacist', 'Cashier']}>
          <Layout>
            <Sales />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute allowedRoles={['Administrator', 'Pharmacist', 'Stock Manager']}>
          <Layout>
            <Orders />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/prescriptions" element={
        <ProtectedRoute allowedRoles={['Administrator', 'Pharmacist']}>
          <Layout>
            <Prescriptions />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute allowedRoles={['Administrator', 'Pharmacist', 'Stock Manager']}>
          <Layout>
            <Reports />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/patients" element={
        <ProtectedRoute allowedRoles={['Administrator', 'Pharmacist']}>
          <Layout>
            <Patients />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/billing" element={
        <ProtectedRoute allowedRoles={['Administrator', 'Pharmacist', 'Cashier']}>
          <Layout>
            <Billing />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/reservations" element={
        <ProtectedRoute allowedRoles={['Administrator', 'Pharmacist', 'Cashier']}>
          <Layout>
            <Reservations />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/promotions" element={
        <ProtectedRoute allowedRoles={['Administrator', 'Pharmacist']}>
          <Layout>
            <Promotions />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute allowedRoles={['Administrator']}>
          <Layout>
            <Settings />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/pharmacy-admin" element={
        <ProtectedRoute allowedRoles={['Administrator']}>
          <Layout>
            <PharmacyAdmin />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SuperAdminProvider>
            <DataProvider>
              <TelepharmacyProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/*" element={<RoleBasedRouter />} />
                </Routes>
              </TooltipProvider>
              </TelepharmacyProvider>
            </DataProvider>
          </SuperAdminProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
