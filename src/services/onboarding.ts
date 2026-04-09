import { supabase } from './supabase';
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

// High-risk conditions that require clinical review before booking
const HIGH_RISK_CONDITIONS = [
  'cardiacDisease',
  'pregnancy',
  'cancerOrChemotherapy',
  'bloodThinners',
];

// Check if any high-risk condition is present
export function requiresClinicalReview(medicalHistory: MedicalHistoryInfo): boolean {
  return HIGH_RISK_CONDITIONS.some(
    (condition) => medicalHistory[condition as keyof MedicalHistoryInfo] === true
  );
}

// Update user profile
export async function updateUserProfile(data: Partial<PersonalInfo>): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({
        full_name: data.fullName,
        date_of_birth: data.dateOfBirth,
        phone: data.phone,
        emergency_contact_name: data.emergencyContactName,
        emergency_contact_phone: data.emergencyContactPhone,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    // Create audit log
    await createAuditLog(user.id, 'UPDATE', 'user_profiles', user.id, null, data);

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
      .from('user_profiles')
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

// Add or update address
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

// Save medical history
export async function saveMedicalHistory(data: MedicalHistoryInfo): Promise<{ success: boolean; error?: string; requiresReview?: boolean }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const medicalData = {
      user_id: user.id,
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
      clinical_review_required: requiresClinicalReview(data),
    };

    // Check if medical history exists
    const { data: existing } = await supabase
      .from('medical_history')
      .select('id')
      .eq('user_id', user.id)
      .single();

    let result;
    if (existing) {
      result = await supabase
        .from('medical_history')
        .update({ ...medicalData, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('medical_history')
        .insert(medicalData)
        .select()
        .single();
    }

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    // Create audit log
    await createAuditLog(user.id, existing ? 'UPDATE' : 'INSERT', 'medical_history', result.data.id, null, medicalData);

    return { success: true, requiresReview: medicalData.clinical_review_required };
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Get medical history
export async function getMedicalHistory() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('medical_history')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: 'An unexpected error occurred' };
  }
}

// Save consents
export async function saveConsents(data: ConsentInfo): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const allSigned = data.identityVerification && data.hipaaPrivacy && data.informedConsent && data.informationSharing;

    const consentData = {
      user_id: user.id,
      identity_verification: data.identityVerification,
      identity_verification_signed_at: data.identityVerification ? new Date().toISOString() : null,
      hipaa_privacy: data.hipaaPrivacy,
      hipaa_privacy_signed_at: data.hipaaPrivacy ? new Date().toISOString() : null,
      informed_consent: data.informedConsent,
      informed_consent_signed_at: data.informedConsent ? new Date().toISOString() : null,
      information_sharing: data.informationSharing,
      information_sharing_signed_at: data.informationSharing ? new Date().toISOString() : null,
      digital_signature_data: data.digitalSignatureData,
      signature_ip_address: data.signatureIpAddress,
      signature_user_agent: data.signatureUserAgent,
      all_consents_signed: allSigned,
    };

    // Check if consents exist
    const { data: existing } = await supabase
      .from('user_consents')
      .select('id')
      .eq('user_id', user.id)
      .single();

    let result;
    if (existing) {
      result = await supabase
        .from('user_consents')
        .update({ ...consentData, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('user_consents')
        .insert(consentData)
        .select()
        .single();
    }

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    // Create audit log
    await createAuditLog(user.id, existing ? 'UPDATE' : 'INSERT', 'user_consents', result.data.id, null, consentData);

    return { success: true };
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Get consents
export async function getConsents() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('user_consents')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: 'An unexpected error occurred' };
  }
}

// Update onboarding step
export async function updateOnboardingStep(step: number): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({ onboarding_step: step, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

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

    const { error } = await supabase
      .from('user_profiles')
      .update({ onboarding_completed: true, onboarding_step: 7, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    // Create audit log
    await createAuditLog(user.id, 'ONBOARDING_COMPLETE', 'user_profiles', user.id, null, { completed_at: new Date().toISOString() });

    return { success: true };
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Create audit log helper
async function createAuditLog(
  userId: string,
  action: string,
  tableName: string,
  recordId: string,
  oldData: any,
  newData: any
) {
  try {
    await supabase.rpc('create_audit_log', {
      p_user_id: userId,
      p_action: action,
      p_table_name: tableName,
      p_record_id: recordId,
      p_old_data: oldData,
      p_new_data: newData,
    });
  } catch (err) {
    // Silently fail audit logging
    console.error('Failed to create audit log:', err);
  }
}

// Navigate to next onboarding step
export function navigateToNextStep(currentStep: number) {
  const nextStep = currentStep + 1;
  switch (nextStep) {
    case 1:
      router.replace('/onboarding/create-account');
      break;
    case 2:
      router.replace('/onboarding/verify-email');
      break;
    case 3:
      router.replace('/onboarding/personal-info');
      break;
    case 4:
      router.replace('/onboarding/address-management');
      break;
    case 5:
      router.replace('/onboarding/medical-history');
      break;
    case 6:
      router.replace('/onboarding/hipaa-consent');
      break;
    case 7:
      router.replace('/onboarding/notification-permission');
      break;
    default:
      router.replace('/home');
  }
}
