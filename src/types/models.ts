// User Model
export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

// Drip Model (IV Therapy Types)
export interface Drip {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  benefits: string[];
  ingredients: string[];
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

// Order Model
export interface Order {
  id: string;
  user_id: string;
  drip_id: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  delivery_address: string;
  delivery_latitude: number;
  delivery_longitude: number;
  scheduled_time?: string;
  notes?: string;
  total_price: number;
  stripe_payment_id?: string;
  created_at: string;
  updated_at: string;
}

// Assignment Model (Nurse/Therapist Assignment)
export interface Assignment {
  id: string;
  order_id: string;
  nurse_id: string;
  status: 'pending' | 'accepted' | 'en_route' | 'in_progress' | 'completed';
  estimated_arrival?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// Database tables with foreign keys
export interface OrderWithDrip extends Order {
  drip: Drip;
}

export interface AssignmentWithOrder extends Assignment {
  order: Order;
}
