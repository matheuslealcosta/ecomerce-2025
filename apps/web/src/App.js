import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
// import { usePermissions } from './hooks/usePermissions';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage from './pages/public/HomePage';
import ProductPage from './pages/public/ProductPage';
import CartPage from './pages/public/CartPage';
import CheckoutPage from './pages/public/CheckoutPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Buyer Pages
import OrderHistoryPage from './pages/buyer/OrderHistoryPage';

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProductsPage from './pages/seller/SellerProductsPage';
import NewProductPage from './pages/seller/NewProductPage';
import EditProductPage from './pages/seller/EditProductPage';
import SellerOrdersPage from './pages/seller/SellerOrdersPage';

// Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ApprovalQueuePage from './pages/manager/ApprovalQueuePage';
import CatalogManagementPage from './pages/manager/CatalogManagementPage';
import ModerationPage from './pages/manager/ModerationPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagementPage from './pages/admin/UserManagementPage';
import SettingsPage from './pages/admin/SettingsPage';
import ReportsPage from './pages/admin/ReportsPage';

// Route Guards
import ProtectedRoute from './components/guards/ProtectedRoute';
import RoleGuard from './components/guards/RoleGuard';

import './App.css';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/produto/:id" element={<ProductPage />} />
          <Route path="/carrinho" element={<CartPage />} />
          
          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
            } 
          />

          {/* Protected Routes */}
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />

          {/* Buyer Routes */}
          <Route path="/conta/pedidos" element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          } />

          {/* Seller Routes */}
          <Route path="/vendedor" element={
            <RoleGuard allowedRoles={['vendedor', 'gestor', 'superadmin']}>
              <SellerDashboard />
            </RoleGuard>
          } />
          <Route path="/vendedor/produtos" element={
            <RoleGuard allowedRoles={['vendedor', 'gestor', 'superadmin']}>
              <SellerProductsPage />
            </RoleGuard>
          } />
          <Route path="/vendedor/produtos/novo" element={
            <RoleGuard allowedRoles={['vendedor', 'gestor', 'superadmin']}>
              <NewProductPage />
            </RoleGuard>
          } />
          <Route path="/vendedor/produtos/:id/editar" element={
            <RoleGuard allowedRoles={['vendedor', 'gestor', 'superadmin']}>
              <EditProductPage />
            </RoleGuard>
          } />
          <Route path="/vendedor/vendas" element={
            <RoleGuard allowedRoles={['vendedor', 'gestor', 'superadmin']}>
              <SellerOrdersPage />
            </RoleGuard>
          } />

          {/* Manager Routes */}
          <Route path="/gestor" element={
            <RoleGuard allowedRoles={['gestor', 'superadmin']}>
              <ManagerDashboard />
            </RoleGuard>
          } />
          <Route path="/gestor/aprovacao" element={
            <RoleGuard allowedRoles={['gestor', 'superadmin']}>
              <ApprovalQueuePage />
            </RoleGuard>
          } />
          <Route path="/gestor/catalogo" element={
            <RoleGuard allowedRoles={['gestor', 'superadmin']}>
              <CatalogManagementPage />
            </RoleGuard>
          } />
          <Route path="/gestor/moderacao" element={
            <RoleGuard allowedRoles={['gestor', 'superadmin']}>
              <ModerationPage />
            </RoleGuard>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <RoleGuard allowedRoles={['superadmin']}>
              <AdminDashboard />
            </RoleGuard>
          } />
          <Route path="/admin/usuarios" element={
            <RoleGuard allowedRoles={['superadmin']}>
              <UserManagementPage />
            </RoleGuard>
          } />
          <Route path="/admin/configuracoes" element={
            <RoleGuard allowedRoles={['superadmin']}>
              <SettingsPage />
            </RoleGuard>
          } />
          <Route path="/admin/relatorios" element={
            <RoleGuard allowedRoles={['superadmin']}>
              <ReportsPage />
            </RoleGuard>
          } />

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
