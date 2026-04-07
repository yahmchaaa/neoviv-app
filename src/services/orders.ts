import { supabase } from '../lib/supabase';
import { Order, OrderWithDrip } from '../types/models';

export const createOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<{ order: Order | null; error: string | null }> => {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (error) {
    return { order: null, error: error.message };
  }

  return { order: data as Order, error: null };
};

export const getOrders = async (userId: string): Promise<{ orders: Order[]; error: string | null }> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return { orders: [], error: error.message };
  }

  return { orders: data as Order[], error: null };
};

export const getOrderWithDrip = async (orderId: string): Promise<{ order: OrderWithDrip | null; error: string | null }> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, drip:drips(*)')
    .eq('id', orderId)
    .single();

  if (error) {
    return { order: null, error: error.message };
  }

  return { order: data as OrderWithDrip, error: null };
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order['status']
): Promise<{ order: Order | null; error: string | null }> => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    return { order: null, error: error.message };
  }

  return { order: data as Order, error: null };
};

export const cancelOrder = async (orderId: string): Promise<{ success: boolean; error: string | null }> => {
  const { error } = await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('id', orderId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
};
