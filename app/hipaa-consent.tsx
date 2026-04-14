import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SHADOWS, RADII, SPACING } from '../src/theme';

export default function HIPAAConsentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [step, setStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToMedical, setAgreedToMedical] = useState(false);
  const [agreedToLiability, setAgreedToLiability] = useState(false);

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else {
      router.replace({
        pathname: '/confirmation',
        params: {
          type: 'scheduled',
          location: params.address as string,
          eta: '',
          date: params.date as string,
        },
      });
    }
  };

  const isStep1Valid = agreedToTerms && agreedToPrivacy;
  const isStep2Valid = agreedToMedical && agreedToLiability;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>HIPAA Consent Form</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressStep, step >= 1 && styles.progressStepActive]}>
          <Text style={styles.progressStepText}>1</Text>
        </View>
        <View style={styles.progressLine} />
        <View style={[styles.progressStep, step >= 2 && styles.progressStepActive]}>
          <Text style={styles.progressStepText}>2</Text>
        </View>
      </View>

      {/* Step Title */}
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>
          {step === 1 ? 'General Consent' : 'Medical Consent'}
        </Text>
        <Text style={styles.stepSubtitle}>
          {step === 1 
            ? 'Please review and agree to our terms of service'
            : 'Consent to treatment and acknowledgment of risks'}
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {step === 1 ? (
          <>
            {/* Terms of Service */}
            <Pressable 
              style={styles.consentItem}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
            >
              <View style={[
                styles.checkbox,
                agreedToTerms && styles.checkboxChecked
              ]}>
                {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.consentContent}>
                <Text style={styles.consentTitle}>Terms of Service</Text>
                <Text style={styles.consentDescription}>
                  I understand and agree to the NEOVIV Terms of Service, including the concierge IV therapy services, nurse arrival times, cancellation policy, and payment terms.
                </Text>
              </View>
            </Pressable>

            {/* Privacy Policy */}
            <Pressable 
              style={styles.consentItem}
              onPress={() => setAgreedToPrivacy(!agreedToPrivacy)}
            >
              <View style={[
                styles.checkbox,
                agreedToPrivacy && styles.checkboxChecked
              ]}>
                {agreedToPrivacy && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.consentContent}>
                <Text style={styles.consentTitle}>Privacy Policy & HIPAA Notice</Text>
                <Text style={styles.consentDescription}>
                  I acknowledge receipt of the NEOVIV Privacy Notice and understand how my health information may be used and disclosed. NEOVIV is committed to protecting your personal health information in accordance with HIPAA regulations.
                </Text>
              </View>
            </Pressable>
          </>
        ) : (
          <>
            {/* Medical Consent */}
            <Pressable 
              style={styles.consentItem}
              onPress={() => setAgreedToMedical(!agreedToMedical)}
            >
              <View style={[
                styles.checkbox,
                agreedToMedical && styles.checkboxChecked
              ]}>
                {agreedToMedical && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.consentContent}>
                <Text style={styles.consentTitle}>Consent to Treatment</Text>
                <Text style={styles.consentDescription}>
                  I voluntarily request IV infusion therapy and related services from NEOVIV and its licensed healthcare providers. I understand that IV therapy involves the insertion of a small catheter into a vein and that all treatments will be administered by a licensed nurse.
                </Text>
              </View>
            </Pressable>

            {/* Liability Acknowledgment */}
            <Pressable 
              style={styles.consentItem}
              onPress={() => setAgreedToLiability(!agreedToLiability)}
            >
              <View style={[
                styles.checkbox,
                agreedToLiability && styles.checkboxChecked
              ]}>
                {agreedToLiability && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.consentContent}>
                <Text style={styles.consentTitle}>Acknowledgment of Risks</Text>
                <Text style={styles.consentDescription}>
                  I understand that IV therapy, like all medical treatments, carries potential risks and side effects including but not limited to: bruising, soreness, infection at the injection site, allergic reactions, and in rare cases, more serious complications. I have disclosed all known allergies and medical conditions to the best of my knowledge.
                </Text>
              </View>
            </Pressable>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <Text style={styles.infoText}>
                Your responses and health information will be securely stored and shared only with your assigned NEOVIV nurse and authorized healthcare personnel.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.continueButton,
            (step === 1 ? !isStep1Valid : !isStep2Valid) && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
        >
          <Text style={styles.continueButtonText}>
            {step === 1 ? 'Continue to Step 2' : 'Complete Booking'}
          </Text>
          <Text style={styles.continueArrow}>→</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.tealBorder,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 24,
    color: COLORS.teal,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.heading,
  },
  placeholder: {
    width: 44,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 60,
    marginBottom: SPACING.lg,
    paddingTop: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepActive: {
    backgroundColor: COLORS.teal,
  },
  progressStepText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.teal,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.tealBorder,
    marginHorizontal: 12,
  },
  stepHeader: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.heading,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 120,
  },
  consentItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.tealBorder,
    ...SHADOWS.card,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: RADII.sm,
    borderWidth: 2,
    borderColor: COLORS.muted,
    marginRight: SPACING.md,
    marginTop: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: COLORS.teal,
    backgroundColor: COLORS.teal,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  consentContent: {
    flex: 1,
  },
  consentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.heading,
    marginBottom: 8,
  },
  consentDescription: {
    fontSize: 13,
    color: COLORS.muted,
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.tealLight,
    borderRadius: RADII.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.body,
    lineHeight: 18,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.tealBorder,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.teal,
    borderRadius: RADII.lg,
    paddingVertical: 18,
    ...SHADOWS.button,
  },
  continueButtonDisabled: {
    opacity: 0.4,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  continueArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    marginLeft: 8,
  },
});