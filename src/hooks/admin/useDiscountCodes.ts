import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase/client';
import { toast } from 'sonner';

interface DiscountCode {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil?: string;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
}

export function useDiscountCodes() {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDiscountCodes() {
      try {
        const { data, error } = await supabase
          .from('discount_codes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDiscountCodes(data || []);
      } catch (error) {
        console.error('Error fetching discount codes:', error);
        toast.error('Failed to load discount codes');
      } finally {
        setLoading(false);
      }
    }

    fetchDiscountCodes();
  }, []);

  const createDiscountCode = useCallback(async (data: Omit<DiscountCode, 'id' | 'usedCount'>) => {
    try {
      const { error } = await supabase
        .from('discount_codes')
        .insert([{
          code: data.code.toUpperCase(),
          description: data.description,
          discount_type: data.discountType,
          discount_value: data.discountValue,
          min_order_amount: data.minOrderAmount,
          max_discount: data.maxDiscount,
          valid_from: data.validFrom,
          valid_until: data.validUntil,
          usage_limit: data.usageLimit,
          active: data.active,
        }]);

      if (error) throw error;
      toast.success('Discount code created successfully');
    } catch (error) {
      console.error('Error creating discount code:', error);
      toast.error('Failed to create discount code');
      throw error;
    }
  }, []);

  const updateDiscountCode = useCallback(async (id: string, data: Partial<DiscountCode>) => {
    try {
      const { error } = await supabase
        .from('discount_codes')
        .update({
          code: data.code?.toUpperCase(),
          description: data.description,
          discount_type: data.discountType,
          discount_value: data.discountValue,
          min_order_amount: data.minOrderAmount,
          max_discount: data.maxDiscount,
          valid_from: data.validFrom,
          valid_until: data.validUntil,
          usage_limit: data.usageLimit,
          active: data.active,
        })
        .eq('id', id);

      if (error) throw error;
      toast.success('Discount code updated successfully');
    } catch (error) {
      console.error('Error updating discount code:', error);
      toast.error('Failed to update discount code');
      throw error;
    }
  }, []);

  const validateDiscountCode = useCallback(async (code: string, orderAmount: number) => {
    try {
      const { data, error } = await supabase
        .rpc('validate_discount_code', {
          p_code: code.toUpperCase(),
          p_order_amount: orderAmount,
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error validating discount code:', error);
      throw error;
    }
  }, []);

  return {
    discountCodes,
    loading,
    createDiscountCode,
    updateDiscountCode,
    validateDiscountCode,
  };
}