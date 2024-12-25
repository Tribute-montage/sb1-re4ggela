import { useState } from 'react';
import { supabase } from '../lib/supabase/client';
import { assignRole, type UserRole } from '../lib/auth/roles';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuthStore();

  const fetchUsers = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    if (!currentUser) return false;

    try {
      const success = await assignRole(userId, role, currentUser.id);
      if (success) {
        toast.success('User role updated successfully');
        await fetchUsers(); // Refresh the list
        return true;
      } else {
        throw new Error('Failed to update role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
      return false;
    }
  };

  const deactivateUser = async (userId: string) => {
    if (!currentUser) return false;

    try {
      const { error } = await supabase
        .rpc('deactivate_user', { user_id: userId });

      if (error) throw error;

      toast.success('User deactivated successfully');
      await fetchUsers(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast.error('Failed to deactivate user');
      return false;
    }
  };

  return {
    users,
    loading,
    fetchUsers,
    updateUserRole,
    deactivateUser,
  };
}