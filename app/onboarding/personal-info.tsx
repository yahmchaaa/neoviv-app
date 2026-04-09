import React, { useState } from 'react';
import LoadingModal from '../../src/components/LoadingModal';
import {
  View,
  Text,
  TextInput,
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
import { updatePersonalInfo } from '../../src/services/onboarding';

const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const BLACK = '#0A0A0A';

export default function PersonalInfoScreen() {
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2000);
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

  const handleDatePress = () => {
    setShowDatePicker(true);
  };

  const handleDateConfirm = () => {
    const formatted = `${selectedMonth.toString().padStart(2, '0')}/${selectedDay.toString().padStart(2, '0')}/${selectedYear}`;
    setDateOfBirth(formatted);
    setShowDatePicker(false);
  };

  const handleContinue = async () => {
    // Validation
    if (!fullName || !dateOfBirth || !phone || !emergencyContactName || !emergencyContactPhone) {
      Alert.alert('Error', 'Please fill in all fields');
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
      const { success, error } = await updatePersonalInfo({
        fullName,
        dateOfBirth,
        phone,
        emergencyContactName,
        emergencyContactPhone,
      });

      if (error) {
        Alert.alert('Error', error);
      } else {
        // Navigate to Address Management (Step 4)
        router.replace('/onboarding/address-management');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
      buttonScale.value = 1;
    }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 18 - i);

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
          <View style={[styles.progressFill, { width: '42.8%' }]} />
        </View>
        <Text style={styles.progressText}>Step 3 of 7</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.logo}>NEOVIV</Text>
              <Text style={styles.tagline}>drops of life</Text>
            </View>

            {/* Frosted Glass Card */}
            <BlurView intensity={20} tint="dark" style={styles.glassCard}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Personal Information</Text>
                <Text style={styles.subtitle}>
                  Please provide your personal details and emergency contact information
                </Text>

                {/* Full Name */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor="#666"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                  />
                </View>

                {/* Date of Birth with Picker */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Date of Birth</Text>
                  <TouchableOpacity style={styles.dateInput} onPress={handleDatePress}>
                    <Text style={[styles.dateInputText, !dateOfBirth && styles.dateInputPlaceholder]}>
                      {dateOfBirth || 'Select your date of birth'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Phone Number */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="(555) 123-4567"
                    placeholderTextColor="#666"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>

                {/* Emergency Contact Name */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Emergency Contact Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter emergency contact name"
                    placeholderTextColor="#666"
                    value={emergencyContactName}
                    onChangeText={setEmergencyContactName}
                    autoCapitalize="words"
                  />
                </View>

                {/* Emergency Contact Phone */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Emergency Contact Phone</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="(555) 123-4567"
                    placeholderTextColor="#666"
                    value={emergencyContactPhone}
                    onChangeText={setEmergencyContactPhone}
                    keyboardType="phone-pad"
                  />
                </View>

                <Animated.View style={buttonStyle}>
                  <TouchableOpacity style={styles.submitButton} onPress={handleContinue} disabled={loading}>
                    <LinearGradient
                      colors={[TEAL, ELECTRIC_BLUE]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientButton}
                    >
                      <Text style={styles.submitButtonText}>
                        Continue
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
                <LoadingModal visible={loading} message="Saving..." />
              </View>
            </BlurView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date of Birth</Text>
            
            <View style={styles.pickerContainer}>
              {/* Month Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Month</Text>
                <ScrollView style={styles.pickerScroll}>
                  {months.map((month, index) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.pickerItem,
                        selectedMonth === index + 1 && styles.pickerItemSelected,
                      ]}
                      onPress={() => setSelectedMonth(index + 1)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedMonth === index + 1 && styles.pickerItemTextSelected,
                        ]}
                      >
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Day Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Day</Text>
                <ScrollView style={styles.pickerScroll}>
                  {days.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.pickerItem,
                        selectedDay === day && styles.pickerItemSelected,
                      ]}
                      onPress={() => setSelectedDay(day)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedDay === day && styles.pickerItemTextSelected,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Year Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Year</Text>
                <ScrollView style={styles.pickerScroll}>
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.pickerItem,
                        selectedYear === year && styles.pickerItemSelected,
                      ]}
                      onPress={() => setSelectedYear(year)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedYear === year && styles.pickerItemTextSelected,
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowDatePicker(false)}>
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmButton} onPress={handleDateConfirm}>
                <LinearGradient colors={[TEAL, ELECTRIC_BLUE]} style={styles.modalConfirmButtonGradient}>
                  <Text style={styles.modalConfirmButtonText}>Confirm</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
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
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: '#B3B3B3',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: TEAL + '20',
  },
  dateInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: TEAL + '20',
  },
  dateInputText: {
    fontSize: 16,
    color: '#fff',
  },
  dateInputPlaceholder: {
    color: '#666',
  },
  submitButton: {
    marginTop: 24,
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
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  pickerLabel: {
    fontSize: 12,
    color: TEAL,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  pickerScroll: {
    height: 200,
  },
  pickerItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  pickerItemSelected: {
    backgroundColor: TEAL + '30',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  pickerItemTextSelected: {
    color: TEAL,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: '#0a0a0a',
  },
  modalCancelButtonText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  modalConfirmButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalConfirmButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalConfirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
