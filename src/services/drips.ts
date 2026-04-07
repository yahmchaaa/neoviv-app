import { supabase } from '../lib/supabase';
import { Drip } from '../types/models';

export const getDrips = async (): Promise<{ drips: Drip[]; error: string | null }> => {
  const { data, error } = await supabase
    .from('drips')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true });

  if (error) {
    return { drips: [], error: error.message };
  }

  return { drips: data as Drip[], error: null };
};

export const getDripById = async (dripId: string): Promise<{ drip: Drip | null; error: string | null }> => {
  const { data, error } = await supabase
    .from('drips')
    .select('*')
    .eq('id', dripId)
    .single();

  if (error) {
    return { drip: null, error: error.message };
  }

  return { drip: data as Drip, error: null };
};
