import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicRoute } from './guards/PublicRoute';
import { AdminRoute } from './guards/AdminRoute';
import { EditorRoute } from './guards/EditorRoute';
import { ClientRoute } from './guards/ClientRoute';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { LandingPage } from '../pages/LandingPage';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';
import { ClientDashboard } from '../pages/client/Dashboard';
import { AdminDashboard } from '../pages/admin/Dashboard';
import EditorDashboard from '../pages/editor/Dashboard';
import { OrdersList } from '../pages/client/OrdersList';
import { OrderDetails } from '../pages/client/OrderDetails';
import { CreateOrder } from '../pages/client/CreateOrder';
import { AdminOrdersList } from '../pages/admin/OrdersList';
import { EditorOrdersList } from '../pages/editor/OrdersList';
import { NewOrder } from '../pages/admin/NewOrder';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginForm /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterForm /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordForm /></PublicRoute>} />

      {/* Protected Routes */}
      <Route element={<DashboardLayout />}>
        {/* Client Routes */}
        <Route path="/dashboard" element={<ClientRoute><ClientDashboard /></ClientRoute>} />
        <Route path="/orders" element={<ClientRoute><OrdersList /></ClientRoute>} />
        <Route path="/orders/:orderId" element={<ClientRoute><OrderDetails /></ClientRoute>} />
        <Route path="/orders/new" element={<ClientRoute><CreateOrder /></ClientRoute>} />
        
        {/* Editor Routes */}
        <Route path="/editor" element={<EditorRoute><EditorDashboard /></EditorRoute>} />
        <Route path="/editor/orders" element={<EditorRoute><EditorOrdersList /></EditorRoute>} />
        <Route path="/editor/orders/:orderId" element={<EditorRoute><OrderDetails /></EditorRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrdersList /></AdminRoute>} />
        <Route path="/admin/orders/new" element={<AdminRoute><NewOrder /></AdminRoute>} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}