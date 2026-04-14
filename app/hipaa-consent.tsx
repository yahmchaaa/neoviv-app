import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';

const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const BLACK = '#0A0A0A';

export default function HIPAAConsentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [step, setStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToMedical, setAgreedToMedical] = useState(false);
  const [agreedToLiability, setAgreedToLiability] = useState(false);

  const fadeAnim = useState(new Animated.Value(0))[0];

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else {
      // Submit and go to confirmation
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
      {/* Background Elements */}
      <View style={styles.orb1} />
      <View style={styles.orb2} />

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

            {/* Additional Info */}
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
    backgroundColor: BLACK,
  },
  orb1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: TEAL,
    opacity: 0.1,
    top: -100,
    right: -100,
  },
  orb2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: ELECTRIC_BLUE,
    opacity: 0.08,
    bottom: 200,
    left: -80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 44,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 60,
    marginBottom: 20,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepActive: {
    backgroundColor: TEAL,
  },
  progressStepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 12,
  },
  stepHeader: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  consentItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#666',
    marginRight: 16,
    marginTop: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: TEAL,
    backgroundColor: TEAL,
  },
  checkmark: {
    color: BLACK,
    fontSize: 16,
    fontWeight: '700',
  },
  consentContent: {
    flex: 1,
  },
  consentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  consentDescription: {
    fontSize: 13,
    color: '#B3B3B3',
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#B3B3B3',
    lineHeight: 18,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TEAL,
    borderRadius: 16,
    paddingVertical: 18,
  },
  continueButtonDisabled: {
    opacity: 0.4,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: BLACK,
  },
  continueArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: BLACK,
    marginLeft: 8,
  },
});