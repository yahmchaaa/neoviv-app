import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { router } from 'expo-router';

const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const BLACK = '#0A0A0A';

export default function BookScreen() {
  const [bookingType, setBookingType] = useState<'now' | 'schedule'>('now');
  const [visitLocation, setVisitLocation] = useState('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Animation for pulsing indicator
  const pulseScale = useSharedValue(1);

  React.useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const handleBookNow = () => {
    if (!visitLocation) {
      Alert.alert('Error', 'Please enter a visit location');
      return;
    }
    // Navigate to confirmation with on-demand booking
    router.push({
      pathname: '/confirmation',
      params: {
        type: 'now',
        location: visitLocation,
        eta: '45-60 min',
      },
    });
  };

  const handleSchedule = () => {
    if (!visitLocation || !selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please enter visit location, date, and time');
      return;
    }
    // Navigate to confirmation with scheduled booking
    router.push({
      pathname: '/confirmation',
      params: {
        type: 'schedule',
        location: visitLocation,
        date: selectedDate,
        time: selectedTime,
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Book a Visit</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Booking Type Toggle */}
        <View style={styles.bookingTypeContainer}>
          <TouchableOpacity
            style={[
              styles.bookingTypeButton,
              bookingType === 'now' && styles.bookingTypeButtonActive,
            ]}
            onPress={() => setBookingType('now')}
          >
            {bookingType === 'now' && (
              <Animated.View style={[styles.activeIndicator, pulseStyle]}>
                <View style={styles.activeDot} />
              </Animated.View>
            )}
            <Text
              style={[
                styles.bookingTypeText,
                bookingType === 'now' && styles.bookingTypeTextActive,
              ]}
            >
              🚨 Now
            </Text>
            <Text style={styles.bookingTypeSubtext}>60-120 min arrival</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.bookingTypeButton,
              bookingType === 'schedule' && styles.bookingTypeButtonActive,
            ]}
            onPress={() => setBookingType('schedule')}
          >
            {bookingType === 'schedule' && (
              <Animated.View style={[styles.activeIndicator, pulseStyle]}>
                <View style={styles.activeDot} />
              </Animated.View>
            )}
            <Text
              style={[
                styles.bookingTypeText,
                bookingType === 'schedule' && styles.bookingTypeTextActive,
              ]}
            >
              📅 Schedule
            </Text>
            <Text style={styles.bookingTypeSubtext}>Pick a time</Text>
          </TouchableOpacity>
        </View>

        {/* Visit Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visit Location</Text>
          <Text style={styles.sectionSubtitle}>Home, hotel, office, or event venue</Text>

          <BlurView intensity={15} tint="dark" style={styles.inputCard}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>📍</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your address"
                placeholderTextColor="#666"
                value={visitLocation}
                onChangeText={setVisitLocation}
              />
            </View>
          </BlurView>
        </View>

        {/* Schedule Options */}
        {bookingType === 'schedule' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Date & Time</Text>

            <BlurView intensity={15} tint="dark" style={styles.inputCard}>
              <View style={styles.scheduleInput}>
                <View style={styles.dateTimeRow}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.inputIcon}>📅</Text>
                    <TextInput
                      style={styles.dateInput}
                      placeholder="MM/DD/YYYY"
                      placeholderTextColor="#666"
                      value={selectedDate}
                      onChangeText={setSelectedDate}
                    />
                  </View>
                  <View style={styles.timeContainer}>
                    <Text style={styles.inputIcon}>🕐</Text>
                    <TextInput
                      style={styles.timeInput}
                      placeholder="HH:MM"
                      placeholderTextColor="#666"
                      value={selectedTime}
                      onChangeText={setSelectedTime}
                    />
                  </View>
                </View>
              </View>
            </BlurView>
          </View>
        )}

        {/* Clinician Info */}
        <View style={styles.section}>
          <BlurView intensity={15} tint="dark" style={styles.clinicianCard}>
            <View style={styles.clinicianContent}>
              <View style={styles.clinicianIcon}>
                <Text style={styles.clinicianIconText}>👨‍⚕️</Text>
              </View>
              <View style={styles.clinicianInfo}>
                <Text style={styles.clinicianTitle}>Licensed Clinician</Text>
                <Text style={styles.clinicianSubtitle}>
                  A certified professional will travel to your location
                </Text>
              </View>
            </View>
          </BlurView>
        </View>

        {/* Book Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={bookingType === 'now' ? handleBookNow : handleSchedule}
          >
            <LinearGradient
              colors={[TEAL, ELECTRIC_BLUE]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.bookButtonGradient}
            >
              <Text style={styles.bookButtonText}>
                {bookingType === 'now' ? 'Confirm On-Demand Visit' : 'Confirm Scheduled Visit'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: TEAL + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 24,
    color: TEAL,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 44,
  },
  bookingTypeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 16,
  },
  bookingTypeButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  bookingTypeButtonActive: {
    borderColor: TEAL,
    backgroundColor: TEAL + '15',
  },
  activeIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: TEAL,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  bookingTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888',
    marginTop: 8,
  },
  bookingTypeTextActive: {
    color: TEAL,
  },
  bookingTypeSubtext: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },
  inputCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: TEAL + '30',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  scheduleInput: {
    padding: 16,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  timeInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  clinicianCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: TEAL + '30',
  },
  clinicianContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  clinicianIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: TEAL + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clinicianIconText: {
    fontSize: 24,
  },
  clinicianInfo: {
    marginLeft: 16,
    flex: 1,
  },
  clinicianTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  clinicianSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  buttonContainer: {
    paddingHorizontal: 24,
  },
  bookButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
