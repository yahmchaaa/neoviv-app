import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { saveMedicalHistory } from '../../src/services/onboarding';

const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const LIGHT_MINT = '#F5F9F9';

// 14 screening items from NEOVIV RN intake form
const SCREENING_ITEMS = [
  { key: 'medicationAllergies', label: 'Medication Allergies', desc: 'Any known drug allergies or adverse reactions to medications' },
  { key: 'pregnancy', label: 'Pregnancy', desc: 'Are you currently pregnant or suspect you may be pregnant?', warning: true },
  { key: 'cardiacDisease', label: 'Cardiac Disease', desc: 'Heart disease, heart failure, irregular heartbeat, or other cardiac conditions', warning: true },
  { key: 'kidneyDisease', label: 'Kidney Disease', desc: 'Kidney disease, kidney stones, or reduced kidney function' },
  { key: 'liverDisease', label: 'Liver Disease', desc: 'Liver disease, hepatitis, or reduced liver function' },
  { key: 'diabetes', label: 'Diabetes', desc: 'Type 1 or Type 2 diabetes, or elevated blood sugar' },
  { key: 'asthma', label: 'Asthma', desc: 'Asthma, reactive airway disease, or chronic lung conditions' },
  { key: 'seizureHistory', label: 'Seizure History', desc: 'History of seizures, epilepsy, or seizure-like episodes' },
  { key: 'activeInfection', label: 'Active Infection', desc: 'Currently have an active bacterial, viral, or fungal infection' },
  { key: 'cancerOrChemotherapy', label: 'Cancer or Chemotherapy', desc: 'Current cancer diagnosis or undergoing chemotherapy/radiation', warning: true },
  { key: 'recentSurgery', label: 'Recent Surgery', desc: 'Surgical procedure within the past 4 weeks' },
  { key: 'bloodThinners', label: 'Blood Thinners', desc: 'Taking blood thinning medications (e.g., Warfarin, Eliquis, Plavix)', warning: true },
  { key: 'implantedLine', label: 'Implanted Line', desc: 'Central line, PICC line, port, or other implanted medical device' },
  { key: 'currentMedications', label: 'Current Medications', desc: 'Taking any prescription or over-the-counter medications', isTextInput: true },
];

// High-risk conditions that trigger hard stop
const HIGH_RISK_CONDITIONS = ['cardiacDisease', 'pregnancy', 'cancerOrChemotherapy', 'bloodThinners'];

export default function MedicalHistoryScreen() {
  const [responses, setResponses] = useState<Record<string, boolean | string>>({});
  const [currentMedications, setCurrentMedications] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [isHighRisk, setIsHighRisk] = useState(false);
  const buttonScale = useSharedValue(1);

  // Animation values
  const orb1Y = useSharedValue(0);
  const orb1X = useSharedValue(0);
  const orb2Y = useSharedValue(0);
  const orb2X = useSharedValue(0);
  const orb3Y = useSharedValue(0);
  const orb3X = useSharedValue(0);

  React.useEffect(() => {
    orb1Y.value = withRepeat(
      withSequence(
        withTiming(-30, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(30, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    orb1X.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-20, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    orb2Y.value = withRepeat(
      withSequence(
        withTiming(25, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-25, { duration: 3500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    orb2X.value = withRepeat(
      withSequence(
        withTiming(-25, { duration: 4500, easing: Easing.inOut(Easing.ease) }),
        withTiming(25, { duration: 4500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    orb3Y.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-20, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    orb3X.value = withRepeat(
      withSequence(
        withTiming(30, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-30, { duration: 5000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const orb1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: orb1Y.value }, { translateX: orb1X.value }],
  }));

  const orb2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: orb2Y.value }, { translateX: orb2X.value }],
  }));

  const orb3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: orb3Y.value }, { translateX: orb3X.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const toggleResponse = (key: string, currentValue: boolean | string | undefined) => {
    const newValue = !currentValue;
    setResponses((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const handleContinue = async () => {
    // Check for high-risk conditions
    const hasHighRisk = HIGH_RISK_CONDITIONS.some(
      (condition) => responses[condition] === true
    );

    setIsHighRisk(hasHighRisk);

    buttonScale.value = withRepeat(
      withSequence(
        withTiming(0.95, { duration: 300, useNativeDriver: true }),
        withTiming(1, { duration: 300, useNativeDriver: true })
      ),
      3,
      false
    );

    setLoading(true);

    try {
      const medicalData = {
        medicationAllergies: responses.medicationAllergies === true,
        medicationAllergiesDetails: responses.medicationAllergies === true ? '' : undefined,
        pregnancy: responses.pregnancy === true,
        cardiacDisease: responses.cardiacDisease === true,
        kidneyDisease: responses.kidneyDisease === true,
        liverDisease: responses.liverDisease === true,
        diabetes: responses.diabetes === true,
        asthma: responses.asthma === true,
        seizureHistory: responses.seizureHistory === true,
        activeInfection: responses.activeInfection === true,
        cancerOrChemotherapy: responses.cancerOrChemotherapy === true,
        recentSurgery: responses.recentSurgery === true,
        bloodThinners: responses.bloodThinners === true,
        implantedLine: responses.implantedLine === true,
        currentMedications: currentMedications,
      };

      const { success, error, requiresReview } = await saveMedicalHistory(medicalData);

      if (error) {
        Alert.alert('Error', error);
        return;
      }

      // Show warning for high-risk conditions
      if (hasHighRisk) {
        setWarningMessage(
          'Our clinical team will review your health history before confirming your first visit. You may still complete signup.'
        );
        setShowWarning(true);
      } else if (requiresReview) {
        setWarningMessage(
          'Our clinical team will review your health history before confirming your first visit.'
        );
        setShowWarning(true);
      } else {
        // Navigate to HIPAA Consent (Step 6)
        router.replace('/onboarding/hipaa-consent');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
      buttonScale.value = 1;
    }
  };

  const closeWarningAndContinue = () => {
    setShowWarning(false);
    // Navigate to HIPAA Consent (Step 6)
    router.replace('/onboarding/hipaa-consent');
  };

  return (
    <View style={styles.container}>
      {/* Animated Background Orbs */}
      <Animated.View style={[styles.orb, styles.orb1, orb1Style]}>
        <LinearGradient colors={[TEAL + '40', ELECTRIC_BLUE + '20']} style={styles.orbGradient} />
      </Animated.View>
      <Animated.View style={[styles.orb, styles.orb2, orb2Style]}>
        <LinearGradient colors={[ELECTRIC_BLUE + '30', TEAL + '20']} style={styles.orbGradient} />
      </Animated.View>
      <Animated.View style={[styles.orb, styles.orb3, orb3Style]}>
        <LinearGradient colors={[TEAL + '30', ELECTRIC_BLUE + '20']} style={styles.orbGradient} />
      </Animated.View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '71.4%' }]} />
        </View>
        <Text style={styles.progressText}>Step 5 of 7</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.logo}>NEOVIV</Text>
              <Text style={styles.tagline}>drops of life</Text>
            </View>

            {/* Medical History Card */}
            <BlurView intensity={20} tint="light" style={styles.glassCard}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Health Screening</Text>
                <Text style={styles.subtitle}>
                  Please answer the following health questions. Your responses help us ensure your safety during treatment.
                </Text>

                {/* Screening Items */}
                {SCREENING_ITEMS.map((item) => {
                  if (item.isTextInput) {
                    return (
                      <View key={item.key} style={styles.textInputItem}>
                        <View style={styles.screeningInfo}>
                          <Text style={styles.screeningLabel}>{item.label}</Text>
                          <Text style={styles.screeningDesc}>{item.desc}</Text>
                        </View>
                        <View style={styles.textInputContainer}>
                          <View style={styles.textArea}>
                            <Text style={styles.textAreaPlaceholder}>
                              {currentMedications || 'List your current medications...'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  }

                  return (
                    <View key={item.key} style={styles.screeningItem}>
                      <View style={styles.screeningInfo}>
                        <View style={styles.screeningHeader}>
                          <Text style={styles.screeningLabel}>{item.label}</Text>
                          {item.warning && <Text style={styles.warningBadge}>⚠️ High Risk</Text>}
                        </View>
                        <Text style={styles.screeningDesc}>{item.desc}</Text>
                      </View>
                      <View style={styles.toggleContainer}>
                        <TouchableOpacity
                          style={[
                            styles.toggleButton,
                            styles.toggleNo,
                            responses[item.key] === false && styles.toggleActive,
                          ]}
                          onPress={() => toggleResponse(item.key, responses[item.key])}
                        >
                          <Text
                            style={[
                              styles.toggleText,
                              styles.toggleTextNo,
                              responses[item.key] === false && styles.toggleTextActive,
                            ]}
                          >
                            No
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.toggleButton,
                            styles.toggleYes,
                            responses[item.key] === true && styles.toggleActiveYes,
                          ]}
                          onPress={() => toggleResponse(item.key, responses[item.key])}
                        >
                          <Text
                            style={[
                              styles.toggleText,
                              styles.toggleTextYes,
                              responses[item.key] === true && styles.toggleTextActive,
                            ]}
                          >
                            Yes
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}

                {/* Continue Button */}
                <Animated.View style={[buttonStyle, { marginTop: 24 }]}>
                  <TouchableOpacity style={styles.submitButton} onPress={handleContinue} disabled={loading}>
                    <LinearGradient
                      colors={[TEAL, ELECTRIC_BLUE]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientButton}
                    >
                      <Text style={styles.submitButtonText}>
                        {loading ? 'Saving...' : 'Continue'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </BlurView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Warning Modal */}
      <Modal visible={showWarning} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.warningIcon, isHighRisk && styles.warningIconHighRisk]}>
              <Text style={styles.warningIconText}>⚠️</Text>
            </View>
            <Text style={styles.warningTitle}>
              {isHighRisk ? 'Clinical Review Required' : 'Health History Submitted'}
            </Text>
            <Text style={styles.warningText}>{warningMessage}</Text>
            <TouchableOpacity style={styles.warningButton} onPress={closeWarningAndContinue}>
              <LinearGradient
                colors={[TEAL, ELECTRIC_BLUE]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.warningButtonGradient}
              >
                <Text style={styles.warningButtonText}>I Understand</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_MINT,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: TEAL,
    borderRadius: 2,
  },
  progressText: {
    color: '#888',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: TEAL,
    letterSpacing: 6,
  },
  tagline: {
    fontSize: 14,
    color: ELECTRIC_BLUE,
    letterSpacing: 4,
    marginTop: 8,
    fontStyle: 'italic',
  },
  glassCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: TEAL + '20',
  },
  cardContent: {
    padding: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#131B2A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#B3B3B3',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  screeningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: TEAL + '10',
  },
  screeningInfo: {
    flex: 1,
    marginRight: 12,
  },
  screeningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  screeningLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#131B2A',
  },
  warningBadge: {
    fontSize: 10,
    color: '#FF6B6B',
    marginLeft: 8,
    fontWeight: '600',
  },
  screeningDesc: {
    fontSize: 11,
    color: '#888',
    lineHeight: 14,
  },
  toggleContainer: {
    flexDirection: 'row',
  },
  toggleButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 4,
    borderWidth: 1,
  },
  toggleNo: {
    backgroundColor: '#FFFFFF',
    borderColor: '#333',
  },
  toggleYes: {
    backgroundColor: '#FFFFFF',
    borderColor: '#333',
  },
  toggleActive: {
    backgroundColor: '#FF6B6B' + '30',
    borderColor: '#FF6B6B',
  },
  toggleActiveYes: {
    backgroundColor: TEAL + '30',
    borderColor: TEAL,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
  },
  toggleTextNo: {},
  toggleTextYes: {},
  toggleTextActive: {
    color: '#131B2A',
  },
  textInputItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: TEAL + '10',
  },
  textInputContainer: {
    marginTop: 12,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: TEAL + '20',
    minHeight: 60,
  },
  textAreaPlaceholder: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#131B2A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    overflow: 'hidden',
  },
  orbGradient: {
    width: '100%',
    height: '100%',
  },
  orb1: {
    width: 250,
    height: 250,
    top: -80,
    right: -60,
    opacity: 0.5,
  },
  orb2: {
    width: 200,
    height: 200,
    bottom: 200,
    left: -50,
    opacity: 0.4,
  },
  orb3: {
    width: 150,
    height: 150,
    top: '40%',
    right: -40,
    opacity: 0.3,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: TEAL + '40',
  },
  warningIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: TEAL + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  warningIconHighRisk: {
    backgroundColor: '#FF6B6B' + '20',
  },
  warningIconText: {
    fontSize: 40,
  },
  warningTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#131B2A',
    marginBottom: 16,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 15,
    color: '#B3B3B3',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  warningButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  warningButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  warningButtonText: {
    color: '#131B2A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
