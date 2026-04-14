import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
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
import { verifyOTP, resendOTP } from '../../src/services/auth';

const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const LIGHT_MINT = '#F5F9F9';

export default function VerifyEmailScreen() {
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const buttonScale = useSharedValue(1);

  // Animation values for floating orbs
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

  const handleOtpChange = (value: string, index: number) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Auto-focus next input
    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (value.length === 1 && index === 5) {
      const otp = newOtpValues.join('');
      if (newOtpValues.every(v => v.length === 1)) {
        handleVerify(otp);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otpValues[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otp?: string) => {
    const code = otp || otpValues.join('');
    
    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
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
      const { success, error } = await verifyOTP(code);
      
      if (error) {
        Alert.alert('Verification Failed', error);
      } else {
        // Navigate to Personal Information (Step 3)
        router.replace('/onboarding/personal-info');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
      buttonScale.value = 1;
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const { success, error } = await resendOTP();
      if (error) {
        Alert.alert('Error', error);
      } else {
        Alert.alert('Success', 'A new verification code has been sent to your email');
        setOtpValues(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setResending(false);
    }
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
          <View style={[styles.progressFill, { width: '28.5%' }]} />
        </View>
        <Text style={styles.progressText}>Step 2 of 7</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.header}>
            <Text style={styles.logo}>NEOVIV</Text>
            <Text style={styles.tagline}>drops of life</Text>
          </View>

          {/* Frosted Glass Card */}
          <BlurView intensity={20} tint="light" style={styles.glassCard}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Email Verification</Text>
              <Text style={styles.subtitle}>
                Enter the 6-digit code sent to your email address
              </Text>

              {/* 6 Individual OTP Input Boxes */}
              <View style={styles.otpContainer}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={[
                      styles.otpInput,
                      otpValues[index] && styles.otpInputFilled,
                    ]}
                    placeholder="•"
                    placeholderTextColor={TEAL + '60'}
                    value={otpValues[index]}
                    onChangeText={(value) => handleOtpChange(value.slice(-1), index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                  />
                ))}
              </View>

              <Animated.View style={buttonStyle}>
                <TouchableOpacity style={styles.submitButton} onPress={() => handleVerify()} disabled={loading}>
                  <LinearGradient
                    colors={[TEAL, ELECTRIC_BLUE]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientButton}
                  >
                    <Text style={styles.submitButtonText}>
                      {loading ? 'Verifying...' : 'Verify'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              <TouchableOpacity style={styles.resendButton} onPress={handleResend} disabled={resending}>
                <Text style={styles.resendButtonText}>
                  {resending ? 'Sending...' : "Didn't receive the code? Resend"}
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </KeyboardAvoidingView>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: TEAL,
    letterSpacing: 8,
  },
  tagline: {
    fontSize: 16,
    color: ELECTRIC_BLUE,
    letterSpacing: 4,
    marginTop: 8,
    fontStyle: 'italic',
  },
  glassCard: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: TEAL + '20',
  },
  cardContent: {
    padding: 32,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#131B2A',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#B3B3B3',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpInput: {
    width: 48,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: TEAL + '30',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#131B2A',
  },
  otpInputFilled: {
    borderColor: TEAL,
    backgroundColor: TEAL + '20',
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
  resendButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  resendButtonText: {
    color: ELECTRIC_BLUE,
    fontSize: 14,
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
    width: 300,
    height: 300,
    top: -100,
    right: -100,
    opacity: 0.6,
  },
  orb2: {
    width: 250,
    height: 250,
    bottom: 100,
    left: -80,
    opacity: 0.5,
  },
  orb3: {
    width: 200,
    height: 200,
    top: 200,
    right: -50,
    opacity: 0.4,
  },
});
