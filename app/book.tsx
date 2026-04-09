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
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';
import DateTimePicker from '@react-native-community/datetimepicker';
import LoadingAnimation from '../components/LoadingAnimation';

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showConfirmAnimation, setShowConfirmAnimation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get drop data from params
  const dripId = params.id as string || 'energy-boost';
  const dripName = params.name as string || 'Reset';
  const dripPrice = parseInt(params.price as string) || 249;
  const dripDescription = params.description as string || 'Recharge with B-vitamins & amino acids';

  // Animation values
  const headerSlide = useRef(new Animated.Value(-100)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(80)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const optionsSlide = useRef(new Animated.Value(80)).current;
  const optionsOpacity = useRef(new Animated.Value(0)).current;
  const confirmSlide = useRef(new Animated.Value(100)).current;
  const confirmOpacity = useRef(new Animated.Value(0)).current;

  // Logo animations
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const logoPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Stagger animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(cardSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(optionsSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(optionsOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(confirmSlide, {
          toValue: 0,
          duration: 500,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(confirmOpacity, {
          toValue: 1,
          duration: 500,
          delay: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const triggerLogoAnimation = () => {
    setShowConfirmAnimation(true);
    setIsSubmitting(true);
    
    // Start with pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulse, {
          toValue: 1.2,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoPulse, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      { iterations: 3 }
    ).start();

    // After pulse, do the main animation
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1.5,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.timing(logoScale, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowConfirmAnimation(false);
          setIsSubmitting(false);
          router.push({
            pathname: '/confirmation',
            params: {
              type: selectedOption,
              location: location,
              eta: selectedOption === 'now' ? '60-90' : '',
              date: selectedOption === 'schedule' ? selectedDate.toLocaleDateString() : '',
              time: selectedOption === 'schedule' ? selectedDate.toLocaleTimeString() : '',
            },
          });
        });
      });
    }, 3000); // 3 seconds of pulse animation before main animation
  };

  const handleConfirm = () => {
    if (!location.trim()) {
      return;
    }
    if (!consentChecked) {
      return;
    }
    triggerLogoAnimation();
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
      setSelectedDate((prev) => {
        const newDate = new Date(prev);
        newDate.setHours(time.getHours());
        newDate.setMinutes(time.getMinutes());
        return newDate;
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <View style={styles.container}>
      {/* Animated Background */}
      <View style={styles.background}>
        <View style={[styles.orb, styles.orb1]} />
        <View style={[styles.orb, styles.orb2]} />
        <View style={[styles.orb, styles.orb3]} />
      </View>

      {/* Logo Animation Overlay (Pulse + Pop) */}
      {showConfirmAnimation && (
        <View style={styles.animationOverlay}>
          <Animated.View
            style={[
              styles.logoPop,
              {
                transform: [
                  { scale: Animated.multiply(logoScale, logoPulse) },
                  {
                    rotate: logoRotate.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <LoadingAnimation />
        </View>
      )}

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
          <Animated.View
            style={[
              styles.header,
              {
                transform: [{ translateX: headerSlide }],
                opacity: headerOpacity,
              },
            ]}
          >
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backText}>←</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Book a Visit</Text>
            <View style={styles.placeholder} />
          </Animated.View>

          {/* Selected Drop Card */}
          <Animated.View
            style={[
              styles.selectedDripCard,
              {
                transform: [{ translateY: cardSlide }],
                opacity: cardOpacity,
              },
            ]}
          >
            <BlurView intensity={20} tint="dark" style={styles.dripCardBlur}>
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
          <Animated.View
            style={[
              styles.locationSection,
              {
                transform: [{ translateY: optionsSlide }],
                opacity: optionsOpacity,
              },
            ]}
          >
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
                placeholderTextColor="#666"
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </Animated.View>

          {/* Booking Options */}
          <Animated.View
            style={[
              styles.optionsSection,
              {
                transform: [{ translateY: optionsSlide }],
                opacity: optionsOpacity,
              },
            ]}
          >
            <Text style={styles.sectionLabel}>When do you need it?</Text>
            <View style={styles.optionsRow}>
              {BOOKING_OPTIONS.map((option) => (
                <Pressable
                  key={option.id}
                  style={[
                    styles.optionCard,
                    selectedOption === option.id && styles.optionCardSelected,
                  ]}
                  onPress={() => setSelectedOption(option.id as 'now' | 'schedule')}
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
                  {selectedOption === 'now' && option.id === 'now' && (
                    <View style={styles.etaBadge}>
                      <Text style={styles.etaBadgeText}>60-120 min</Text>
                    </View>
                  )}
                  {selectedOption === option.id && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.checkmark}>✓</Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </Animated.View>

          {/* Schedule Date/Time Display */}
          {selectedOption === 'schedule' && (
            <Pressable
              style={styles.dateTimeDisplay}
              onPress={() => setShowDatePicker(true)}
            >
              <View style={styles.dateTimeContent}>
                <Text style={styles.dateTimeLabel}>Selected Time</Text>
                <Text style={styles.dateTimeValue}>
                  {formatDate(selectedDate)} at {formatTime(selectedDate)}
                </Text>
              </View>
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          )}

          {/* Consent Checkbox */}
          <Animated.View
            style={[
              styles.consentSection,
              {
                transform: [{ translateY: confirmSlide }],
                opacity: confirmOpacity,
              },
            ]}
          >
            <Pressable
              style={styles.checkboxRow}
              onPress={() => setConsentChecked(!consentChecked)}
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
        </ScrollView>

        {/* Confirm Button (Fixed at bottom) */}
        <Animated.View
          style={[
            styles.confirmContainer,
            {
              opacity: confirmOpacity,
              transform: [{ translateY: confirmSlide }],
            },
          ]}
        >
          <Pressable
            style={[
              styles.confirmButton,
              (!location.trim() || !consentChecked || isSubmitting) && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={!location.trim() || !consentChecked || isSubmitting}
          >
            <View style={styles.confirmButtonGradient}>
              <Text style={styles.confirmButtonText}>
                {isSubmitting ? 'Submitting...' : 'Confirm Visit'}
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Pressable onPress={() => setShowDatePicker(false)}>
                <Text style={styles.pickerCancel}>Cancel</Text>
              </Pressable>
              <Text style={styles.pickerTitle}>Select Date</Text>
              <Pressable onPress={() => setShowDatePicker(false)}>
                <Text style={styles.pickerDone}>Done</Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={onDateChange}
              minimumDate={new Date()}
              textColor="#FFFFFF"
              themeVariant="dark"
            />
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal visible={showTimePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Pressable onPress={() => setShowTimePicker(false)}>
                <Text style={styles.pickerCancel}>Cancel</Text>
              </Pressable>
              <Text style={styles.pickerTitle}>Select Time</Text>
              <Pressable onPress={() => setShowTimePicker(false)}>
                <Text style={styles.pickerDone}>Done</Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={selectedDate}
              mode="time"
              display="spinner"
              onChange={onTimeChange}
              textColor="#FFFFFF"
              themeVariant="dark"
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
    backgroundColor: '#0A0A0A',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
  },
  orb1: {
    width: 300,
    height: 300,
    backgroundColor: '#00B09B',
    top: -100,
    right: -100,
  },
  orb2: {
    width: 200,
    height: 200,
    backgroundColor: '#00D4FF',
    bottom: 300,
    left: -80,
  },
  orb3: {
    width: 150,
    height: 150,
    backgroundColor: '#00B09B',
    bottom: -50,
    right: 100,
  },
  animationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  logoPop: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#00B09B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00B09B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
  },
  logoPopText: {
    fontSize: 60,
  },
  submittingText: {
    marginTop: 24,
    fontSize: 16,
    color: '#B3B3B3',
    fontWeight: '500',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
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
  selectedDripCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(0, 176, 155, 0.2)',
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
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dripDescription: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  dripPriceContainer: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  dripPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00D4FF',
  },
  locationSection: {
    marginBottom: 30,
  },
  sectionLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  locationTypeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  locationTypeButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  locationTypeButtonActive: {
    borderColor: '#00B09B',
    backgroundColor: 'rgba(0, 176, 155, 0.15)',
  },
  locationTypeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  locationTypeLabel: {
    fontSize: 11,
    color: '#B3B3B3',
    fontWeight: '500',
  },
  locationTypeLabelActive: {
    color: '#00B09B',
    fontWeight: '600',
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 176, 155, 0.2)',
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
    height: 56,
    fontSize: 16,
    color: '#FFFFFF',
  },
  optionsSection: {
    marginBottom: 30,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  optionCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  optionCardSelected: {
    borderColor: '#00B09B',
    backgroundColor: 'rgba(0, 176, 155, 0.1)',
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  optionTitleSelected: {
    color: '#00B09B',
  },
  optionSubtitle: {
    fontSize: 11,
    color: '#B3B3B3',
    textAlign: 'center',
    lineHeight: 14,
  },
  etaBadge: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  etaBadgeText: {
    fontSize: 11,
    color: '#00D4FF',
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00B09B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#0A0A0A',
    fontSize: 14,
    fontWeight: '700',
  },
  dateTimeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 176, 155, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#00B09B',
    marginBottom: 30,
  },
  dateTimeContent: {
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: 12,
    color: '#00B09B',
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  editText: {
    fontSize: 14,
    color: '#00B09B',
    fontWeight: '600',
  },
  consentSection: {
    marginBottom: 20,
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
    borderColor: '#666',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: '#00B09B',
    backgroundColor: '#00B09B',
  },
  checkmarkSmall: {
    color: '#0A0A0A',
    fontSize: 14,
    fontWeight: '700',
  },
  consentText: {
    fontSize: 14,
    color: '#B3B3B3',
    flex: 1,
  },
  consentLink: {
    color: '#00B09B',
  },
  confirmContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  confirmButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#00B09B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonGradient: {
    backgroundColor: '#00B09B',
    paddingVertical: 18,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A0A0A',
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
    color: '#00B09B',
  },
});

