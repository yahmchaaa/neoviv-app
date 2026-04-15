import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Animated,
  Easing,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';
import { StripePayment } from '../src/components/StripePayment';

const LIGHT_MINT = '#F5F9F9';
const TEAL = '#2D8A7D';
const NAVY = '#131B2A';
const TEXT_SECONDARY = '#54837F';
const WHITE = '#FFFFFF';

const LOCATION_TYPES = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'hotel', label: 'Hotel', icon: '🏨' },
  { id: 'office', label: 'Office', icon: '🏢' },
  { id: 'event', label: 'Event', icon: '🎉' },
];

const BOOKING_OPTIONS = [
  {
    id: 'now',
    title: 'Now',
    subtitle: 'Clinician arrives in 60-120 min',
    icon: '⚡',
  },
  {
    id: 'schedule',
    title: 'Schedule',
    subtitle: 'Pick your time slot',
    icon: '📅',
  },
];

export default function BookScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [selectedOption, setSelectedOption] = useState<'now' | 'schedule'>('now');
  const [location, setLocation] = useState('');
  const [locationType, setLocationType] = useState('home');
  const [consentChecked, setConsentChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // Get drip data from params
  const dripId = params.id as string || '1';
  const dripName = params.name as string || "Myers' Cocktail";
  const dripPrice = parseInt(params.price as string) || 249;
  const dripDescription = params.description as string || 'The classic revival';

  // Animation values
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const optionsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(optionsOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleConfirm = () => {
    if (!location.trim() || !consentChecked) {
      return;
    }
    setIsSubmitting(true);
    
    // Simulate validation before showing payment
    setTimeout(() => {
      setIsSubmitting(false);
      setShowPayment(true);
    }, 500);
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    console.log('Payment successful:', paymentIntentId);
    // Prepare parameters for confirmation screen
    const eta = selectedOption === 'now' ? 60 : undefined;
    const date = selectedOption === 'schedule' ? new Date().toLocaleDateString() : undefined;
    const time = selectedOption === 'schedule' ? '2:00 PM' : undefined;
    // Navigate to confirmation screen with booking details
    router.push({
      pathname: '/confirmation',
      params: {
        type: selectedOption,
        location: location,
        dripName: dripName,
        ...(eta && { eta: eta.toString() }),
        ...(date && { date }),
        ...(time && { time }),
      },
    });
  };

  const handlePaymentError = (error: string) => {
    Alert.alert('Payment Error', error);
    // Optionally allow retry or go back
  };

  const cancelPayment = () => {
    setShowPayment(false);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backText}>←</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Book a Visit</Text>
            <View style={styles.placeholder} />
          </Animated.View>

          {/* Selected Drip Card */}
          <Animated.View style={[styles.selectedDripCard, { opacity: cardOpacity }]}>
            <BlurView intensity={20} tint="light" style={styles.dripCardBlur}>
              <View style={styles.dripCardContent}>
                <View style={styles.dripInfo}>
                  <Text style={styles.dripName}>{dripName}</Text>
                  <Text style={styles.dripDescription}>{dripDescription}</Text>
                </View>
                <View style={styles.dripPriceContainer}>
                  <Text style={styles.dripPrice}>${dripPrice}</Text>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Visit Location */}
          <Animated.View style={[styles.locationSection, { opacity: optionsOpacity }]}>
            <Text style={styles.sectionLabel}>Visit Location</Text>
            
            {/* Location Type Selector */}
            <View style={styles.locationTypeRow}>
              {LOCATION_TYPES.map((type) => (
                <Pressable
                  key={type.id}
                  style={[
                    styles.locationTypeButton,
                    locationType === type.id && styles.locationTypeButtonActive,
                  ]}
                  onPress={() => setLocationType(type.id)}
                >
                  <Text style={styles.locationTypeIcon}>{type.icon}</Text>
                  <Text
                    style={[
                      styles.locationTypeLabel,
                      locationType === type.id && styles.locationTypeLabelActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Address Input */}
            <View style={styles.locationInputContainer}>
              <View style={styles.locationIcon}>
                <Text style={styles.locationPin}>📍</Text>
              </View>
              <TextInput
                style={styles.locationInput}
                placeholder={`Enter your ${locationType} address`}
                placeholderTextColor="#999"
                value={location}
                onChangeText={setLocation}
                editable={!showPayment}
              />
            </View>
          </Animated.View>

          {/* Booking Options */}
          <Animated.View style={[styles.optionsSection, { opacity: optionsOpacity }]}>
            <Text style={styles.sectionLabel}>When do you need it?</Text>
            <View style={styles.optionsRow}>
              {BOOKING_OPTIONS.map((option) => (
                <Pressable
                  key={option.id}
                  style={[
                    styles.optionCard,
                    selectedOption === option.id && styles.optionCardSelected,
                  ]}
                  onPress={() => !showPayment && setSelectedOption(option.id as 'now' | 'schedule')}
                  disabled={showPayment}
                >
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                  <Text
                    style={[
                      styles.optionTitle,
                      selectedOption === option.id && styles.optionTitleSelected,
                    ]}
                  >
                    {option.title}
                  </Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  {selectedOption === option.id && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.checkmark}>✓</Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </Animated.View>

          {/* Consent Checkbox */}
          <Animated.View style={[styles.consentSection, { opacity: optionsOpacity }]}>
            <Pressable
              style={styles.checkboxRow}
              onPress={() => !showPayment && setConsentChecked(!consentChecked)}
              disabled={showPayment}
            >
              <View
                style={[
                  styles.checkbox,
                  consentChecked && styles.checkboxChecked,
                ]}
              >
                {consentChecked && <Text style={styles.checkmarkSmall}>✓</Text>}
              </View>
              <Text style={styles.consentText}>
                I agree to the{' '}
                <Text style={styles.consentLink}>terms and informed consent</Text>
              </Text>
            </Pressable>
          </Animated.View>

          {/* Payment Section */}
          {showPayment && (
            <Animated.View style={[styles.paymentSection, { opacity: optionsOpacity }]}>
              <Text style={styles.sectionLabel}>Secure Payment</Text>
              <View style={styles.paymentContainer}>
                <StripePayment
                  amount={dripPrice}
                  currency="usd"
                  buttonText={`Pay $${dripPrice}`}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
                <Pressable style={styles.cancelPaymentButton} onPress={cancelPayment}>
                  <Text style={styles.cancelPaymentText}>Cancel Payment</Text>
                </Pressable>
              </View>
            </Animated.View>
          )}
        </ScrollView>

        {/* Confirm Button (only when not showing payment) */}
        {!showPayment && (
          <Animated.View style={[styles.confirmContainer, { opacity: optionsOpacity }]}>
            <Pressable
              style={[
                styles.confirmButton,
                (!location.trim() || !consentChecked || isSubmitting) && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!location.trim() || !consentChecked || isSubmitting}
            >
              <Text style={styles.confirmButtonText}>
                {isSubmitting ? 'Submitting...' : 'Confirm Visit'}
              </Text>
            </Pressable>
          </Animated.View>
        )}
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
  scrollContent: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 24,
    color: NAVY,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: NAVY,
  },
  placeholder: {
    width: 40,
  },
  selectedDripCard: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: WHITE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dripCardBlur: {
    padding: 20,
  },
  dripCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dripInfo: {
    flex: 1,
  },
  dripName: {
    fontSize: 18,
    fontWeight: '700',
    color: NAVY,
    marginBottom: 4,
  },
  dripDescription: {
    fontSize: 14,
    color: TEXT_SECONDARY,
  },
  dripPriceContainer: {
    backgroundColor: 'rgba(45, 138, 125, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dripPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: TEAL,
  },
  locationSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: NAVY,
    marginBottom: 12,
  },
  locationTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  locationTypeButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: 'rgba(45, 138, 125, 0.2)',
    flex: 1,
    marginHorizontal: 4,
  },
  locationTypeButtonActive: {
    borderColor: TEAL,
    backgroundColor: 'rgba(45, 138, 125, 0.05)',
  },
  locationTypeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  locationTypeLabel: {
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  locationTypeLabelActive: {
    color: TEAL,
    fontWeight: '600',
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(45, 138, 125, 0.2)',
    paddingHorizontal: 16,
  },
  locationIcon: {
    marginRight: 12,
  },
  locationPin: {
    fontSize: 20,
  },
  locationInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: NAVY,
  },
  optionsSection: {
    marginBottom: 24,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(45, 138, 125, 0.2)',
    alignItems: 'center',
  },
  optionCardSelected: {
    borderColor: TEAL,
    backgroundColor: 'rgba(45, 138, 125, 0.05)',
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: NAVY,
    marginBottom: 4,
  },
  optionTitleSelected: {
    color: TEAL,
  },
  optionSubtitle: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: TEAL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  consentSection: {
    marginBottom: 24,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(45, 138, 125, 0.3)',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  checkmarkSmall: {
    color: WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  consentText: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    flex: 1,
  },
  consentLink: {
    color: TEAL,
    fontWeight: '600',
  },
  paymentSection: {
    marginBottom: 24,
  },
  paymentContainer: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(45, 138, 125, 0.2)',
  },
  cancelPaymentButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  cancelPaymentText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmContainer: {
    padding: 24,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: 'rgba(45, 138, 125, 0.1)',
  },
  confirmButton: {
    backgroundColor: TEAL,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: 'rgba(45, 138, 125, 0.3)',
  },
  confirmButtonText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: '600',
  },
});