import React, { useState } from 'react';
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
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { signUp } from '../src/services/auth';

const TEAL = '#2D8A7D';
const NAVY = '#131B2A';
const LIGHT_MINT = '#F5F9F9';
const TEXT_SECONDARY = '#54837F';
const WHITE = '#FFFFFF';

export default function CreateAccountScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const buttonScale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    buttonScale.value = withTiming(0.95, { duration: 100 }, () => {
      buttonScale.value = withTiming(1, { duration: 100 });
    });

    setLoading(true);

    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        Alert.alert('Sign Up Failed', error);
      } else {
        router.replace('/onboarding/verify-email');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.content}>
          {/* Logo and Tagline */}
          <View style={styles.header}>
            <Text style={styles.logo}>NEOVIV</Text>
            <Text style={styles.tagline}>drops of life</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Create Account</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              <Animated.View style={buttonStyle}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSignUp} disabled={loading}>
                  <Text style={styles.submitButtonText}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              <TouchableOpacity style={styles.logInButton} onPress={() => router.push('/signin')}>
                <Text style={styles.logInButtonText}>Already have an account? Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    color: TEXT_SECONDARY,
    letterSpacing: 4,
    marginTop: 8,
    fontStyle: 'italic',
  },
  card: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: WHITE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardContent: {
    padding: 32,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: NAVY,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: NAVY,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F5F9F9',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: NAVY,
    borderWidth: 1,
    borderColor: 'rgba(45, 138, 125, 0.2)',
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: TEAL,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },
  submitButtonText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: '600',
  },
  logInButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  logInButtonText: {
    color: TEAL,
    fontSize: 14,
    fontWeight: '600',
  },
});
