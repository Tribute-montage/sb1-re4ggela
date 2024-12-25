```typescript
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase/client';
import { toast } from 'sonner';

interface RateCardItem {
  id: string;
  itemType: string;
  videoType: string;
  amount: number;
}

interface RateCard {
  id: string;
  name: string;
  description: string;
  active: boolean;
  validFrom: string;
  validUntil: string | null;
  items: RateCardItem[];
}

export function useRateCards() {
  const [rateCards, setRateCards] = useState<RateCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRateCards() {
      try {
        const { data, error } = await supabase
          .from('rate_cards')
          .select(`
            *,
            items:rate_card_items(*)
          `)
          .order('valid_from', { ascending: false });

        if (error) throw error;
        setRateCards(data || []);
      } catch (error) {
        console.error('Error fetching rate cards:', error);
        toast.error('Failed to load rate cards');
      } finally {
        setLoading(false);
      }
    }

    fetchRateCards();
  }, []);

  const createRateCard = useCallback(async (data: Omit<RateCard, 'id'>) => {
    try {
      const { data: card, error } = await supabase
        .from('rate_cards')
        .insert([{
          name: data.name,
          description: data.description,
          active: data.active,
          valid_from: data.validFrom,
          valid_until: data.validUntil,
        }])
        .select()
        .single();

      if (error) throw error;

      // Insert rate card items
      const { error: itemsError } = await supabase
        .from('rate_card_items')
        .insert(
          data.items.map(item => ({
            rate_card_id: card.id,
            item_type: item.itemType,
            video_type: item.videoType,
            amount: item.amount,
          }))
        );

      if (itemsError) throw itemsError;

      toast.success('Rate card created successfully');
      return card.id;
    } catch (error) {
      console.error('Error creating rate card:', error);
      toast.error('Failed to create rate card');
      throw error;
    }
  }, []);

  const updateRateCard = useCallback(async (id: string, data: Partial<RateCard>) => {
    try {
      const { error } = await supabase
        .from('rate_cards')
        .update({
          name: data.name,
          description: data.description,
          active: data.active,
          valid_from: data.validFrom,
          valid_until: data.validUntil,
        })
        .eq('id', id);

      if (error) throw error;

      if (data.items) {
        // Delete existing items
        await supabase
          .from('rate_card_items')
          .delete()
          .eq('rate_card_id', id);

        // Insert new items
        const { error: itemsError } = await supabase
          .from('rate_card_items')
          .insert(
            data.items.map(item => ({
              rate_card_id: id,
              item_type: item.itemType,
              video_type: item.videoType,
              amount: item.amount,
            }))
          );

        if (itemsError) throw itemsError;
      }

      toast.success('Rate card updated successfully');
    } catch (error) {
      console.error('Error updating rate card:', error);
      toast.error('Failed to update rate card');
      throw error;
    }
  }, []);

  const archiveRateCard = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('rate_cards')
        .update({ active: false })
        .eq('id', id);

      if (error) throw error;
      toast.success('Rate card archived successfully');
    } catch (error) {
      console.error('Error archiving rate card:', error);
      toast.error('Failed to archive rate card');
      throw error;
    }
  }, []);

  return {
    rateCards,
    loading,
    createRateCard,
    updateRateCard,
    archiveRateCard,
  };
}
```