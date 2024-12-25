import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/client';
import { toast } from 'sonner';

interface RegistrationData {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

export function useRegistration() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (data: RegistrationData) => {
    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            business_name: data.businessName,
            contact_name: data.contactName,
            phone: data.phone,
            address: data.address,
            role: 'client'
          }
        }
      });

      if (signUpError) throw signUpError;

      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return { register, loading };
}