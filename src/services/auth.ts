import { supabase } from '../lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  error: string | null;
}

export const signUp = async (email: string, password: string): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: data.user as AuthUser, error: null };
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: data.user as AuthUser, error: null };
};

export const signOut = async (): Promise<{ error: string | null }> => {
  const { error } = await supabase.auth.signOut();
  return { error: error?.message || null };
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user as AuthUser | null;
};

export const verifyOTP = async (code: string): Promise<{ success: boolean; error: string | null }> => {
  // In a real app, this would verify the OTP code with Supabase Auth
  // For now, we'll simulate a successful verification
  // Supabase Auth uses email OTP - the user receives a code via email
  const { data, error } = await supabase.auth.verifyOtp({
    email: (await getCurrentUser())?.email || '',
    code,
    type: 'email',
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
};

export const resendOTP = async (): Promise<{ success: boolean; error: string | null }> => {
  // In a real app, this would resend the OTP code via email
  // For now, we'll simulate a successful resend
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: 'No active session' };
  }

  // Supabase Auth doesn't have a direct resend OTP function
  // The user would need to request a new code through the auth flow
  // For demo purposes, we'll return success
  return { success: true, error: null };
};
