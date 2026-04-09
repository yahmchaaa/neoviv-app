import { supabase } from '../lib/supabase';
import { router } from 'expo-router';

// Types for onboarding
export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface AddressInfo {
  id?: string;
  locationType: 'home' | 'hotel' | 'office' | 'event';
  label?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  isPrimary: boolean;
}

export interface MedicalHistoryInfo {
  medicationAllergies: boolean;
  medicationAllergiesDetails?: string;
  pregnancy: boolean;
  cardiacDisease: boolean;
  kidneyDisease: boolean;
  liverDisease: boolean;
  diabetes: boolean;
  asthma: boolean;
  seizureHistory: boolean;
  activeInfection: boolean;
  cancerOrChemotherapy: boolean;
  recentSurgery: boolean;
  bloodThinners: boolean;
  implantedLine: boolean;
  currentMedications?: string;
}

export interface ConsentInfo {
  identityVerification: boolean;
  hipaaPrivacy: boolean;
  informedConsent: boolean;
  informationSharing: boolean;
  digitalSignatureData: string;
  signatureIpAddress?: string;
  signatureUserAgent?: string;
}

// High-risk conditions that require clinical review
const HIGH_RISK_CONDITIONS = ['cardiacDisease', 'pregnancy', 'cancerOrChemotherapy', 'bloodThinners'];

// Check if any high-risk condition is present
export function requiresClinicalReview(medicalHistory: MedicalHistoryInfo): boolean {
  return HIGH_RISK_CONDITIONS.some(
    (condition) => medicalHistory[condition as keyof MedicalHistoryInfo] === true
  );
}

// Update user profile with personal info (Step 3)
export async function updatePersonalInfo(data: PersonalInfo): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Use upsert to create the user record if it doesn't exist (handles race condition with Supabase triggers)
    const { error } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email,
        full_name: data.fullName,
        date_of_birth: data.dateOfBirth,
        phone: data.phone,
        emergency_contact_name: data.emergencyContactName,
        emergency_contact_phone: data.emergencyContactPhone,
        account_status: 'active',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (error) {
      return { success: false, error: error.message };
    }

    // Create audit log
    await createAuditLog(user.id, 'UPDATE_PERSONAL_INFO', 'users', user.id, null, data);

    return { success: true };
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Save address (Step 4)
export async function saveAddress(address: AddressInfo): Promise<{ success: boolean; error?: string; addressId?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const addressData = {
      user_id: user.id,
      location_type: address.locationType,
      label: address.label,
      address_line1: address.addressLine1,
      address_line2: address.addressLine2,
      city: address.city,
      state: address.state,
      zip_code: address.zipCode,
      latitude: address.latitude,
      longitude: address.longitude,
      is_primary: address.isPrimary,
    };

    let result;

    if (address.id) {
      // Update existing address
      result = await supabase
        .from('user_addresses')
        .update({ ...addressData, updated_at: new Date().toISOString() })
        .eq('id', address.id)
        .select()
        .single();
    } else {
      // Insert new address
      result = await supabase
        .from('user_addresses')
        .insert(addressData)
        .select()
        .single();
    }

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    // Create audit log
    await createAuditLog(user.id, address.id ? 'UPDATE' : 'INSERT', 'user_addresses', result.data.id, null, addressData);

    return { success: true, addressId: result.data.id };
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Get user addresses
export async function getUserAddresses() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: [], error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: data || [], error: null };
  } catch (err) {
    return { data: [], error: 'An unexpected error occurred' };
  }
}

// Delete address
export async function deleteAddress(addressId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    // Create audit log
    await createAuditLog(user.id, 'DELETE', 'user_addresses', addressId, null, null);

    return { success: true };
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Save medical history (Step 5)
export async function saveMedicalHistory(data: MedicalHistoryInfo): Promise<{ success: boolean; error?: string; requiresReview?: boolean }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const medicalData = {
      medication_allergies: data.medicationAllergies,
      medication_allergies_details: data.medicationAllergiesDetails,
      pregnancy: data.pregnancy,
      cardiac_disease: data.cardiacDisease,
      kidney_disease: data.kidneyDisease,
      liver_disease: data.liverDisease,
      diabetes: data.diabetes,
      asthma: data.asthma,
      seizure_history: data.seizureHistory,
      active_infection: data.activeInfection,
      cancer_or_chemotherapy: data.cancerOrChemotherapy,
      recent_surgery: data.recentSurgery,
      blood_thinners: data.bloodThinners,
      implanted_line: data.implantedLine,
      current_medications: data.currentMedications,
    };

    // Store health_screening as JSONB in users table (use upsert to handle race condition)
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        health_screening: medicalData,
        account_status: requiresClinicalReview(data) ? 'pending_review' : 'active',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (userError) {
      return { success: false, error: userError.message };
    }

    // Create audit log
    await createAuditLog(user.id, 'UPDATE_MEDICAL_HISTORY', 'users', user.id, null, medicalData);

    return { success: true, requiresReview: requiresClinicalReview(data) };
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Save HIPAA consent (Step 6)
export async function saveConsents(data: ConsentInfo): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const allSigned = data.identityVerification && data.hipaaPrivacy && data.informedConsent && data.informationSharing;
    const timestamp = new Date().toISOString();

    // Update users table with HIPAA consent info (use upsert to handle race condition)
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        hipaa_consent_signed: allSigned,
        hipaa_consent_timestamp: allSigned ? timestamp : null,
        hipaa_signature_url: data.digitalSignatureData, // Store base64 signature
        updated_at: timestamp,
      }, { onConflict: 'id' });

    if (userError) {
      return { success: false, error: userError.message };
    }

    // Create audit log with IP and user agent
    await createAuditLog(
      user.id,
      'HIPAA_CONSENT',
      'users',
      user.id,
      null,
      {
        consents: {
          identityVerification: data.identityVerification,
          hipaaPrivacy: data.hipaaPrivacy,
          informedConsent: data.informedConsent,
          informationSharing: data.informationSharing,
        },
        signatureTimestamp: timestamp,
      },
      data.signatureIpAddress,
      data.signatureUserAgent
    );

    return { success: true };
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Save push token (Step 7)
export async function savePushToken(pushToken: string, deviceType: string = 'ios'): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if token already exists
    const { data: existingToken } = await supabase
      .from('user_push_tokens')
      .select('id')
      .eq('user_id', user.id)
      .eq('push_token', pushToken)
      .single();

    if (existingToken) {
      // Token already exists, just update it
      const { error } = await supabase
        .from('user_push_tokens')
        .update({ is_active: true, updated_at: new Date().toISOString() })
        .eq('id', existingToken.id);

      if (error) {
        return { success: false, error: error.message };
      }
    } else {
      // Insert new token
      const { error } = await supabase
        .from('user_push_tokens')
        .insert({
          user_id: user.id,
          push_token: pushToken,
          device_type: deviceType,
          is_active: true,
        });

      if (error) {
        return { success: false, error: error.message };
      }
    }

    // Create audit log
    await createAuditLog(user.id, 'PUSH_TOKEN_REGISTERED', 'user_push_tokens', null, null, { pushToken: pushToken.substring(0, 20) + '...' });

    return { success: true };
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Complete onboarding
export async function completeOnboarding(): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Create audit log
    await createAuditLog(user.id, 'ONBOARDING_COMPLETE', 'users', user.id, null, { completed_at: new Date().toISOString() });

    return { success: true };
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Get user profile
export async function getUserProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: 'An unexpected error occurred' };
  }
}

// Create audit log helper
async function createAuditLog(
  userId: string,
  action: string,
  tableName: string,
  recordId: string | null,
  oldData: any,
  newData: any,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await supabase.rpc('create_audit_log', {
      p_user_id: userId,
      p_action: action,
      p_table_name: tableName,
      p_record_id: recordId,
      p_old_data: oldData,
      p_new_data: newData,
      p_ip_address: ipAddress,
      p_user_agent: userAgent,
    });
  } catch (err) {
    // Silently fail audit logging
    console.error('Failed to create audit log:', err);
  }
}

// Navigate to next onboarding step
export function navigateToNextStep(currentStep: number) {
  switch (currentStep) {
    case 1:
      router.replace('/onboarding/verify-email');
      break;
    case 2:
      router.replace('/onboarding/personal-info');
      break;
    case 3:
      router.replace('/onboarding/address-management');
      break;
    case 4:
      router.replace('/onboarding/medical-history');
      break;
    case 5:
      router.replace('/onboarding/hipaa-consent');
      break;
    case 6:
      router.replace('/onboarding/notification-permission');
      break;
    case 7:
      router.replace('/home');
      break;
    default:
      router.replace('/home');
  }
}
