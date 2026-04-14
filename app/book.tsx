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
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SHADOWS, RADII, SPACING } from '../src/theme';

const CLINIC_ADDRESS = '1950 SW 27 Ave, Miami, FL 33145';

const BOOKING_OPTIONS = [
  {
    id: 'clinic',
    title: 'Visit Our Clinic',
    subtitle: '1950 SW 27 Ave, Miami, FL 33145',
    icon: '🏥',
  },
  {
    id: 'concierge',
    title: 'Concierge',
    subtitle: 'We come to you',
    icon: '🚐',
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
  const [step, setStep] = useState(1);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else {
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
    if (date) setSelectedDate(date);
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
                      placeholderTextColor={COLORS.muted}
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
                      placeholderTextColor={COLORS.muted}
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
                      placeholderTextColor={COLORS.muted}
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

                {/* SMS Notice */}
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

                {/* Address Input (Concierge) */}
                {selectedOption === 'concierge' && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Location</Text>
                    <View style={styles.inputGroup}>
                      <TextInput
                        style={styles.input}
                        placeholder='Enter your address'
                        placeholderTextColor={COLORS.muted}
                        value={conciergeAddress}
                        onChangeText={setConciergeAddress}
                      />
                    </View>
                    <Text style={styles.fieldHint}>
                      Our nurses travel to you anywhere in Florida
                    </Text>
                  </View>
                )}

                {/* Clinic Address Display */}
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
                  </View>
                )}

                {/* Special Notes */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Special Notes (Optional)</Text>
                  <View style={styles.inputGroup}>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder='Any allergies, preferences, or special requests...'
                      placeholderTextColor={COLORS.muted}
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
                      placeholderTextColor={COLORS.muted}
                      value={medicalInfo}
                      onChangeText={setMedicalInfo}
                      multiline
                      numberOfLines={3}
                    />
                  </View>
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
              onChange={onDateChange}
              minimumDate={new Date()}
              textColor={COLORS.heading}
              themeVariant='light'
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
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 120,
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
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.teal,
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
    marginBottom: SPACING.xl,
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
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.heading,
    marginBottom: SPACING.md,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.tealBorder,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: 16,
    color: COLORS.body,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.teal,
  },
  dateTimeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  dateTimeEmoji: {
    fontSize: 24,
  },
  dateTimeContent: {
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: 12,
    color: COLORS.teal,
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.heading,
  },
  editText: {
    fontSize: 14,
    color: COLORS.teal,
    fontWeight: '600',
  },
  smsNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tealLight,
    borderRadius: RADII.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  smsIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  smsText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.body,
    lineHeight: 18,
  },
  visitOptions: {
    gap: SPACING.md,
  },
  visitOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.tealBorder,
    ...SHADOWS.card,
  },
  visitOptionSelected: {
    borderColor: COLORS.teal,
  },
  visitOptionIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  visitOptionContent: {
    flex: 1,
  },
  visitOptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.heading,
    marginBottom: 4,
  },
  visitOptionSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
  },
  selectedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.teal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  clinicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.tealBorder,
    ...SHADOWS.card,
  },
  clinicIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  clinicContent: {
    flex: 1,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.heading,
    marginBottom: 4,
  },
  clinicAddress: {
    fontSize: 14,
    color: COLORS.muted,
  },
  fieldHint: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: SPACING.sm,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.tealBorder,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.heading,
  },
  pickerCancel: {
    fontSize: 16,
    color: COLORS.muted,
  },
  pickerDone: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.teal,
  },
});