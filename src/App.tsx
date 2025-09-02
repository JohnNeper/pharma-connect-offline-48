import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { TelepharmacyProvider } from "./contexts/TelepharmacyContext";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
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
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import "./i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <TelepharmacyProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
              <Routes>
                <Route path="/login" element={<Login />} />
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
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </TelepharmacyProvider>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
