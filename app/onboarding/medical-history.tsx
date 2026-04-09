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
import { saveMedicalHistory, requiresClinicalReview } from '../../src/services/onboarding';

const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const BLACK = '#0A0A0A';

// High-risk conditions that require clinical review
const HIGH_RISK_CONDITIONS = ['cardiacDisease', 'pregnancy', 'cancerOrChemotherapy', 'bloodThinners'];

const SCREENING_ITEMS = [
  { key: 'medicationAllergies', label: 'Medication Allergies', desc: 'Any known allergies to medications' },
  { key: 'pregnancy', label: 'Pregnancy', desc: 'Currently pregnant or suspect pregnancy' },
  { key: 'cardiacDisease', label: 'Cardiac Disease', desc: 'Heart disease, heart failure, or cardiac conditions', warning: true },
  { key: 'kidneyDisease', label: 'Kidney Disease', desc: 'Kidney disease or reduced kidney function' },
  { key: 'liverDisease', label: 'Liver Disease', desc: 'Liver disease or reduced liver function' },
  { key: 'diabetes', label: 'Diabetes', desc: 'Type 1 or Type 2 diabetes' },
  { key: 'asthma', label: 'Asthma', desc: 'Asthma or reactive airway disease' },
  { key: 'seizureHistory', label: 'Seizure History', desc: 'History of seizures or epilepsy' },
  { key: 'activeInfection', label: 'Active Infection', desc: 'Currently have an active infection' },
  { key: 'cancerOrChemotherapy', label: 'Cancer or Chemotherapy', desc: 'Current cancer or undergoing chemotherapy', warning: true },
  { key: 'recentSurgery', label: 'Recent Surgery', desc: 'Surgery within the past 4 weeks' },
  { key: 'bloodThinners', label: 'Blood Thinners', desc: 'Taking blood thinning medications', warning: true },
  { key: 'implantedLine', label: 'Implanted Line', desc: 'Central line, PICC, or implanted port' },
];

export default function MedicalHistoryScreen() {
  const [responses, setResponses] = useState<Record<string, boolean>>({});
  const [currentMedications, setCurrentMedications] = useState('');
  const [medicationDetails, setMedicationDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
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

  const toggleResponse = (key: string, currentValue: boolean) => {
    setResponses((prev) => ({
      ...prev,
      [key]: !currentValue,
    }));
  };

  const handleContinue = async () => {
    // Check for high-risk conditions first
    const hasHighRisk = HIGH_RISK_CONDITIONS.some(
      (condition) => responses[condition] === true
    );

    if (hasHighRisk) {
      // Show hard stop modal
      setWarningMessage(
        'For your safety, please contact our clinical team before booking at support@neoviv.com'
      );
      setShowWarning(true);
      return;
    }

    // Check if clinical review is recommended
    const medicalData = {
      medicationAllergies: responses.medicationAllergies || false,
      medicationAllergiesDetails: medicationDetails,
      pregnancy: responses.pregnancy || false,
      cardiacDisease: responses.cardiacDisease || false,
      kidneyDisease: responses.kidneyDisease || false,
      liverDisease: responses.liverDisease || false,
      diabetes: responses.diabetes || false,
      asthma: responses.asthma || false,
      seizureHistory: responses.seizureHistory || false,
      activeInfection: responses.activeInfection || false,
      cancerOrChemotherapy: responses.cancerOrChemotherapy || false,
      recentSurgery: responses.recentSurgery || false,
      bloodThinners: responses.bloodThinners || false,
      implantedLine: responses.implantedLine || false,
      currentMedications: currentMedications,
    };

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
      const { success, error, requiresReview } = await saveMedicalHistory(medicalData);

      if (error) {
        Alert.alert('Error', error);
      } else {
        // If clinical review is needed, show warning but allow continuing
        if (requiresReview) {
          setWarningMessage(
            'Our clinical team will review your health history before confirming your first visit.'
          );
          setShowWarning(true);
          return;
        }
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.logo}>NEOVIV</Text>
              <Text style={styles.tagline}>drops of life</Text>
            </View>

            {/* Medical History Card */}
            <BlurView intensity={20} tint="dark" style={styles.glassCard}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Medical History & Safety Screening</Text>
                <Text style={styles.subtitle}>
                  Please answer the following health questions. This helps us ensure your safety during treatment.
                </Text>

                {/* Screening Items */}
                {SCREENING_ITEMS.map((item) => (
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
                        onPress={() => toggleResponse(item.key, responses[item.key] || false)}
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
                        onPress={() => toggleResponse(item.key, responses[item.key] || false)}
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
                ))}

                {/* Medication Allergies Details */}
                {responses.medicationAllergies && (
                  <View style={styles.detailsContainer}>
                    <Text style={styles.detailsLabel}>Please list medication allergies:</Text>
                    <View style={styles.textAreaContainer}>
                      <View style={styles.textArea}>
                        <View style={styles.textAreaInput}>
                          <View style={styles.inputWrapper}>
                            <View
                              style={[
                                styles.inputBase,
                                { minHeight: 60, paddingVertical: 12 },
                              ]}
                            >
                              <Text style={styles.inputText}>{medicationDetails || ' '}</Text>
                              <View
                                style={[
                                  styles.actualInput,
                                  { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0 },
                                ]}
                              >
                                {/* This is a placeholder - in real app would use TextInput multiline */}
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                )}

                {/* Current Medications */}
                <View style={styles.medicationsContainer}>
                  <Text style={styles.medicationsLabel}>Current Medications (optional):</Text>
                  <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                      <View style={[styles.inputBase, { minHeight: 60, paddingVertical: 12 }]}>
                        <Text style={styles.inputText}>{currentMedications || ' '}</Text>
                      </View>
                    </View>
                  </View>
                </View>

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
            <View style={styles.warningIcon}>
              <Text style={styles.warningIconText}>⚠️</Text>
            </View>
            <Text style={styles.warningTitle}>Clinical Review Required</Text>
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
    backgroundColor: BLACK,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1a1a1a',
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
    color: '#fff',
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: TEAL + '10',
  },
  screeningInfo: {
    flex: 1,
    marginRight: 16,
  },
  screeningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  screeningLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  warningBadge: {
    fontSize: 10,
    color: '#FF6B6B',
    marginLeft: 8,
    fontWeight: '600',
  },
  screeningDesc: {
    fontSize: 12,
    color: '#888',
    lineHeight: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 4,
    borderWidth: 1,
  },
  toggleNo: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333',
  },
  toggleYes: {
    backgroundColor: '#1a1a1a',
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
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
  toggleTextNo: {},
  toggleTextYes: {},
  toggleTextActive: {
    color: '#fff',
  },
  detailsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: TEAL + '10',
  },
  detailsLabel: {
    fontSize: 13,
    color: '#B3B3B3',
    marginBottom: 8,
  },
  textAreaContainer: {
    marginTop: 8,
  },
  textArea: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  textAreaInput: {
    padding: 4,
  },
  inputWrapper: {
    flex: 1,
  },
  inputBase: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: TEAL + '20',
  },
  inputText: {
    fontSize: 15,
    color: '#fff',
  },
  medicationsContainer: {
    marginTop: 24,
  },
  medicationsLabel: {
    fontSize: 14,
    color: TEAL,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    marginTop: 4,
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
    color: '#fff',
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
    backgroundColor: '#1a1a1a',
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
  warningIconText: {
    fontSize: 40,
  },
  warningTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
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
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
