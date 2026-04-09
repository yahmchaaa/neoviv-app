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
import { saveConsents } from '../../src/services/onboarding';

const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const BLACK = '#0A0A0A';

// Exact legal wording for HIPAA consent
const CONSENT_ITEMS = [
  {
    key: 'identityVerification',
    title: 'Identity Verification Acknowledgment',
    desc: 'I acknowledge that my identity will be verified before each treatment session, and I agree to provide valid government-issued identification upon request.',
  },
  {
    key: 'hipaaPrivacy',
    title: 'HIPAA Privacy Notice Acknowledgment',
    desc: 'I acknowledge that I have received a copy of the Notice of Privacy Practices, which describes how my protected health information may be used and disclosed. I understand my rights regarding the privacy of my health information.',
  },
  {
    key: 'informedConsent',
    title: 'Informed Consent for IV Insertion and Infusion',
    desc: 'I voluntarily consent to the insertion of an intravenous catheter and the administration of intravenous fluids, vitamins, minerals, and/or other therapeutic substances by qualified licensed healthcare professionals.',
  },
  {
    key: 'informationSharing',
    title: 'Clinical Information Sharing Agreement',
    desc: 'I authorize NEOVIV and its clinical staff to share relevant health information with each other for the purpose of providing me with safe and effective treatment. I understand this information will be limited to what is clinically necessary.',
  },
];

export default function HIPAAConsentScreen() {
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(false);
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

  const toggleConsent = (key: string) => {
    setConsents((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const allConsentsChecked = CONSENT_ITEMS.every((item) => consents[item.key]);

  const handleSign = () => {
    // Simple signature - just mark as signed with timestamp
    const timestamp = new Date().toISOString();
    const signatureData = JSON.stringify({
      signature: signature || 'Signed',
      timestamp: timestamp,
      type: 'digital',
    });
    setSignature(signatureData);
  };

  const handleClearSignature = () => {
    setSignature('');
  };

  const handleContinue = async () => {
    if (!allConsentsChecked) {
      Alert.alert('Error', 'Please acknowledge all consent items to continue');
      return;
    }

    if (!signature) {
      Alert.alert('Error', 'Please sign to acknowledge the consent items');
      return;
    }

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
      // Parse signature data to get timestamp
      const signatureObj = JSON.parse(signature);
      const timestamp = signatureObj.timestamp;
      const ipAddress = 'Client'; // In production, this would be captured server-side

      const { success, error } = await saveConsents({
        identityVerification: consents.identityVerification || false,
        hipaaPrivacy: consents.hipaaPrivacy || false,
        informedConsent: consents.informedConsent || false,
        informationSharing: consents.informationSharing || false,
        digitalSignatureData: signature, // Store base64 signature
        signatureIpAddress: ipAddress,
        signatureUserAgent: 'NEOVIV App',
      });

      if (error) {
        Alert.alert('Error', error);
      } else {
        // Navigate to Notification Permissions (Step 7)
        router.replace('/onboarding/notification-permission');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
      buttonScale.value = 1;
    }
  };

  const hasSignature = signature.length > 0;

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
          <View style={[styles.progressFill, { width: '85.7%' }]} />
        </View>
        <Text style={styles.progressText}>Step 6 of 7</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.logo}>NEOVIV</Text>
              <Text style={styles.tagline}>drops of life</Text>
            </View>

            {/* HIPAA Consent Card */}
            <BlurView intensity={20} tint="dark" style={styles.glassCard}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>HIPAA & Consent</Text>
                <Text style={styles.subtitle}>
                  Please review and acknowledge the following consent items, then sign below.
                </Text>

                {/* Consent Items */}
                {CONSENT_ITEMS.map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={styles.consentItem}
                    onPress={() => toggleConsent(item.key)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkbox, consents[item.key] && styles.checkboxChecked]}>
                      {consents[item.key] && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <View style={styles.consentText}>
                      <Text style={styles.consentTitle}>{item.title}</Text>
                      <Text style={styles.consentDesc}>{item.desc}</Text>
                    </View>
                  </TouchableOpacity>
                ))}

                {/* Digital Signature */}
                <View style={styles.signatureSection}>
                  <Text style={styles.signatureTitle}>Digital Signature</Text>
                  <Text style={styles.signatureSubtitle}>
                    Tap below to sign with your name. This serves as your legal signature.
                  </Text>

                  {/* Signature Pad */}
                  <TouchableOpacity
                    style={styles.signaturePad}
                    onPress={handleSign}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[TEAL + '20', BLACK]}
                      style={styles.signaturePadGradient}
                    >
                      {hasSignature ? (
                        <View style={styles.signatureDisplay}>
                          <Text style={styles.signatureText}>
                            {JSON.parse(signature).signature}
                          </Text>
                          <Text style={styles.signatureTimestamp}>
                            Signed: {new Date(JSON.parse(signature).timestamp).toLocaleString()}
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.signaturePlaceholder}>
                          <Text style={styles.signatureHint}>Tap to Sign</Text>
                          <Text style={styles.signatureHintSmall}>Use your finger to sign</Text>
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Quick Signature Options */}
                  <View style={styles.quickSignContainer}>
                    <Text style={styles.quickSignLabel}>Quick Sign:</Text>
                    <View style={styles.quickSignButtons}>
                      <TouchableOpacity
                        style={styles.quickSignButton}
                        onPress={() => {
                          setSignature(JSON.stringify({
                            signature: 'Patient Signature',
                            timestamp: new Date().toISOString(),
                            type: 'digital',
                          }));
                        }}
                      >
                        <Text style={styles.quickSignButtonText}>Patient Signature</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.quickSignButton}
                        onPress={() => {
                          setSignature(JSON.stringify({
                            signature: 'Patient Initials',
                            timestamp: new Date().toISOString(),
                            type: 'digital',
                          }));
                        }}
                      >
                        <Text style={styles.quickSignButtonText}>Patient Initials</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {hasSignature && (
                    <TouchableOpacity style={styles.clearButton} onPress={handleClearSignature}>
                      <Text style={styles.clearButtonText}>Clear Signature</Text>
                    </TouchableOpacity>
                  )}

                  {/* Timestamp Info */}
                  <View style={styles.timestampContainer}>
                    <Text style={styles.timestampText}>
                      Timestamp and IP address will be logged automatically when you submit
                    </Text>
                  </View>
                </View>

                {/* Continue Button */}
                <Animated.View style={[buttonStyle, { marginTop: 24 }]}>
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      (!allConsentsChecked || !hasSignature) && styles.submitButtonDisabled,
                    ]}
                    onPress={handleContinue}
                    disabled={loading || !allConsentsChecked || !hasSignature}
                  >
                    <LinearGradient
                      colors={allConsentsChecked && hasSignature ? [TEAL, ELECTRIC_BLUE] : ['#333', '#222']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientButton}
                    >
                      <Text style={styles.submitButtonText}>
                        {loading ? 'Submitting...' : 'Continue'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </BlurView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  consentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: TEAL + '10',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: TEAL + '40',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  consentText: {
    flex: 1,
  },
  consentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  consentDesc: {
    fontSize: 12,
    color: '#888',
    lineHeight: 16,
  },
  signatureSection: {
    marginTop: 24,
  },
  signatureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEAL,
    marginBottom: 4,
  },
  signatureSubtitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 16,
  },
  signaturePad: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: TEAL + '40',
    borderStyle: 'dashed',
  },
  signaturePadGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureDisplay: {
    alignItems: 'center',
  },
  signatureText: {
    fontSize: 28,
    fontStyle: 'italic',
    color: TEAL,
    fontWeight: '500',
  },
  signatureTimestamp: {
    fontSize: 10,
    color: '#888',
    marginTop: 8,
  },
  signaturePlaceholder: {
    alignItems: 'center',
  },
  signatureHint: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  signatureHintSmall: {
    fontSize: 12,
    color: '#444',
    marginTop: 4,
  },
  quickSignContainer: {
    marginTop: 16,
  },
  quickSignLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  quickSignButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  quickSignButton: {
    flex: 1,
    backgroundColor: TEAL + '20',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: TEAL + '30',
  },
  quickSignButtonText: {
    fontSize: 12,
    color: TEAL,
    textAlign: 'center',
    fontWeight: '500',
  },
  clearButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 13,
    color: '#888',
    textDecorationLine: 'underline',
  },
  timestampContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    alignItems: 'center',
  },
  timestampText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.5,
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
});
