import { Routes, Route } from 'react-router-dom';
import { AdminDashboard } from '../pages/admin/Dashboard';
import { OrdersManagement } from '../pages/admin/OrdersManagement';
import { Analytics } from '../pages/admin/Analytics';
import { AssetManagement } from '../pages/admin/AssetManagement';
import { UserManagement } from '../components/admin/UserManagement';
import { AdminSettings } from '../pages/admin/Settings';
import { NewOrder } from '../pages/admin/NewOrder';

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/orders" element={<OrdersManagement />} />
      <Route path="/orders/new" element={<NewOrder />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/assets/*" element={<AssetManagement />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/settings" element={<AdminSettings />} />
    </Routes>
  );
}