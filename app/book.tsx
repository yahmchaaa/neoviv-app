import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Animated,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import DateTimePicker from '@react-native-community/datetimepicker';

const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const BLACK = '#0A0A0A';
const CLINIC_ADDRESS = '1950 SW 27 Ave, Miami, FL 33145';

const BOOKING_OPTIONS = [
  {
    id: 'clinic',
    title: 'Visit Our Clinic',
    subtitle: '1950 SW 27 Ave, Miami, FL 33145',
    icon: '🏥',
    description: 'Come to our Miami office',
  },
  {
    id: 'concierge',
    title: 'Concierge',
    subtitle: 'We come to you',
    icon: '🚐',
    description: 'We deliver to your location',
  },
];

export default function BookScreen() {
  const router = useRouter();
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [medicalInfo, setMedicalInfo] = useState('');
  const [selectedOption, setSelectedOption] = useState<'clinic' | 'concierge'>('concierge');
  const [conciergeAddress, setConciergeAddress] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else {
      // Navigate to HIPAA consent
      router.push({
        pathname: '/hipaa-consent',
        params: {
          fullName,
          phone,
          email,
          visitType: selectedOption,
          address: selectedOption === 'concierge' ? conciergeAddress : CLINIC_ADDRESS,
          date: selectedDate.toISOString(),
          notes: specialNotes,
          medicalInfo,
        },
      });
    }
  };

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      setShowTimePicker(true);
    }
  };

  const onTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) {
      const newDate = new Date(selectedDate);
      newDate.setHours(time.getHours());
      newDate.setMinutes(time.getMinutes());
      setSelectedDate(newDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isStep1Valid = fullName.trim() && phone.trim() && email.trim();
  const isStep2Valid = selectedOption === 'clinic' || (selectedOption === 'concierge' && conciergeAddress.trim());

  return (
    <View style={styles.container}>
      {/* Background Elements */}
      <View style={styles.orb1} />
      <View style={styles.orb2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backText}>←</Text>
            </Pressable>
            <View>
              <Text style={styles.headerTitle}>Book Your Drip</Text>
              <Text style={styles.headerSubtitle}>No membership required</Text>
            </View>
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

          <ScrollView 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={styles.scrollContent}
          >
            {step === 1 ? (
              <>
                {/* Contact Information */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Contact Information</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Full Name *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder='Enter your full name'
                      placeholderTextColor='#666'
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize='words'
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Phone Number *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder='(555) 555-5555'
                      placeholderTextColor='#666'
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType='phone-pad'
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email Address *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder='you@example.com'
                      placeholderTextColor='#666'
                      value={email}
                      onChangeText={setEmail}
                      keyboardType='email-address'
                      autoCapitalize='none'
                    />
                  </View>
                </View>

                {/* Preferred Date & Time */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Preferred Date & Time</Text>
                  
                  <Pressable 
                    style={styles.dateTimeButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <View style={styles.dateTimeIcon}>
                      <Text style={styles.dateTimeEmoji}>📅</Text>
                    </View>
                    <View style={styles.dateTimeContent}>
                      <Text style={styles.dateTimeLabel}>Date & Time</Text>
                      <Text style={styles.dateTimeValue}>
                        {formatDate(selectedDate)} at {formatTime(selectedDate)}
                      </Text>
                    </View>
                    <Text style={styles.editText}>Edit</Text>
                  </Pressable>
                </View>

                {/* SMS Confirmation Notice */}
                <View style={styles.smsNotice}>
                  <Text style={styles.smsIcon}>💬</Text>
                  <Text style={styles.smsText}>
                    You'll receive an SMS confirmation with your appointment details and nurse assignment.
                  </Text>
                </View>
              </>
            ) : (
              <>
                {/* Visit Type Selection */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>How would you like to visit?</Text>
                  
                  <View style={styles.visitOptions}>
                    {BOOKING_OPTIONS.map((option) => (
                      <Pressable
                        key={option.id}
                        style={[
                          styles.visitOption,
                          selectedOption === option.id && styles.visitOptionSelected,
                        ]}
                        onPress={() => setSelectedOption(option.id as 'clinic' | 'concierge')}
                      >
                        <Text style={styles.visitOptionIcon}>{option.icon}</Text>
                        <View style={styles.visitOptionContent}>
                          <Text style={styles.visitOptionTitle}>{option.title}</Text>
                          <Text style={styles.visitOptionSubtitle}>{option.subtitle}</Text>
                        </View>
                        {selectedOption === option.id && (
                          <View style={styles.selectedBadge}>
                            <Text style={styles.selectedBadgeText}>✓</Text>
                          </View>
                        )}
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Address Input (for Concierge) */}
                {selectedOption === 'concierge' && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Location</Text>
                    <View style={styles.inputGroup}>
                      <TextInput
                        style={styles.input}
                        placeholder='Enter your address'
                        placeholderTextColor='#666'
                        value={conciergeAddress}
                        onChangeText={setConciergeAddress}
                      />
                    </View>
                    <Text style={styles.fieldHint}>
                      Our nurses travel to you anywhere in Florida
                    </Text>
                  </View>
                )}

                {/* Clinic Address Display (for Clinic) */}
                {selectedOption === 'clinic' && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our Miami Clinic</Text>
                    <Pressable style={styles.clinicCard}>
                      <Text style={styles.clinicIcon}>🏥</Text>
                      <View style={styles.clinicContent}>
                        <Text style={styles.clinicName}>NEOVIV Miami</Text>
                        <Text style={styles.clinicAddress}>{CLINIC_ADDRESS}</Text>
                      </View>
                    </Pressable>
                    <Text style={styles.fieldHint}>
                      Walk-in or we can arrange concierge pickup
                    </Text>
                  </View>
                )}

                {/* Special Notes */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Special Notes (Optional)</Text>
                  <View style={styles.inputGroup}>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder='Any allergies, preferences, or special requests...'
                      placeholderTextColor='#666'
                      value={specialNotes}
                      onChangeText={setSpecialNotes}
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                </View>

                {/* Medical Information */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Medical Information (Optional)</Text>
                  <View style={styles.inputGroup}>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder='Current medications, medical conditions, or concerns...'
                      placeholderTextColor='#666'
                      value={medicalInfo}
                      onChangeText={setMedicalInfo}
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                  <Text style={styles.fieldHint}>
                    This information helps your nurse provide better care
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
                {step === 1 ? 'Continue' : 'Continue to HIPAA Consent'}
              </Text>
              <Text style={styles.continueArrow}>→</Text>
            </Pressable>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent animationType='slide'>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Pressable onPress={() => setShowDatePicker(false)}>
                <Text style={styles.pickerCancel}>Cancel</Text>
              </Pressable>
              <Text style={styles.pickerTitle}>Select Date & Time</Text>
              <Pressable onPress={() => setShowDatePicker(false)}>
                <Text style={styles.pickerDone}>Done</Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={selectedDate}
              mode='datetime'
              display='spinner'
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setSelectedDate(date);
              }}
              minimumDate={new Date()}
              textColor='#FFFFFF'
              themeVariant='dark'
            />
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
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
  headerSubtitle: {
    fontSize: 12,
    color: TEAL,
    marginTop: 2,
  },
  placeholder: {
    width: 44,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 60,
    marginBottom: 30,
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
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 176, 155, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 176, 155, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: TEAL,
  },
  dateTimeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 176, 155, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dateTimeEmoji: {
    fontSize: 24,
  },
  dateTimeContent: {
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: 12,
    color: TEAL,
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  editText: {
    fontSize: 14,
    color: TEAL,
    fontWeight: '600',
  },
  smsNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 28,
  },
  smsIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  smsText: {
    flex: 1,
    fontSize: 13,
    color: '#B3B3B3',
    lineHeight: 18,
  },
  visitOptions: {
    gap: 12,
  },
  visitOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  visitOptionSelected: {
    borderColor: TEAL,
    backgroundColor: 'rgba(0, 176, 155, 0.1)',
  },
  visitOptionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  visitOptionContent: {
    flex: 1,
  },
  visitOptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  visitOptionSubtitle: {
    fontSize: 13,
    color: '#B3B3B3',
  },
  selectedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: TEAL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: BLACK,
    fontSize: 16,
    fontWeight: '700',
  },
  clinicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 176, 155, 0.2)',
  },
  clinicIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  clinicContent: {
    flex: 1,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  clinicAddress: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  fieldHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pickerCancel: {
    fontSize: 16,
    color: '#B3B3B3',
  },
  pickerDone: {
    fontSize: 16,
    fontWeight: '600',
    color: TEAL,
  },
});