import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';

const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const BLACK = '#0A0A0A';

export default function ConfirmationScreen() {
  const params = useLocalSearchParams();
  const { type, location, eta, date, time } = params;

  const [etaMinutes, setEtaMinutes] = useState(parseInt(eta) || 45);
  const [clinicianName] = useState('Dr. Sarah Mitchell');
  const [trackingActive, setTrackingActive] = useState(true);

  // Pulsing animation for live indicator
  const pulseScale = useSharedValue(1);
  const carPosition = useSharedValue(0);

  useEffect(() => {
    // Pulsing animation for live indicator
    pulseScale.value = withRepeat(
      withTiming(1.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Simulate car moving towards destination
    carPosition.value = withRepeat(
      withTiming(100, { duration: 5000, easing: Easing.linear }),
      -1,
      true
    );

    // Countdown timer simulation
    const interval = setInterval(() => {
      setEtaMinutes((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // Decrease every minute for demo

    return () => clearInterval(interval);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const carStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: carPosition.value }],
  }));

  const handleCancel = () => {
    router.replace('/home');
  };

  const handleDone = () => {
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Booking Confirmed</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Live Tracking Banner */}
      <View style={styles.trackingBanner}>
        <BlurView intensity={20} tint="dark" style={styles.trackingCard}>
          <View style={styles.trackingContent}>
            <View style={styles.liveIndicator}>
              <Animated.View style={[styles.liveDot, pulseStyle]} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <Text style={styles.trackingTitle}>Clinician En Route</Text>
            <Text style={styles.trackingSubtitle}>
              {type === 'now'
                ? `Arriving in ${etaMinutes} minutes`
                : `Scheduled for ${date} at ${time}`}
            </Text>
          </View>
        </BlurView>
      </View>

      {/* Route Visualization */}
      <View style={styles.routeSection}>
        <View style={styles.routeContainer}>
          {/* Start Point */}
          <View style={styles.routePoint}>
            <View style={[styles.pointMarker, styles.startMarker]}>
              <Text style={styles.pointIcon}>📍</Text>
            </View>
            <View style={styles.pointInfo}>
              <Text style={styles.pointLabel}>Visit Location</Text>
              <Text style={styles.pointAddress}>{location || 'Your Location'}</Text>
            </View>
          </View>

          {/* Route Line */}
          <View style={styles.routeLineContainer}>
            <View style={styles.routeLine} />
            <View style={styles.carContainer}>
              <Animated.View style={[styles.car, carStyle]}>
                <Text style={styles.carIcon}>🚗</Text>
              </Animated.View>
            </View>
          </View>

          {/* End Point (Clinician) */}
          <View style={styles.routePoint}>
            <View style={[styles.pointMarker, styles.endMarker]}>
              <Text style={styles.pointIcon}>👨‍⚕️</Text>
            </View>
            <View style={styles.pointInfo}>
              <Text style={styles.pointLabel}>Clinician</Text>
              <Text style={styles.pointAddress}>{clinicianName}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ETA Display */}
      <View style={styles.etaSection}>
        <BlurView intensity={15} tint="dark" style={styles.etaCard}>
          <LinearGradient
            colors={[TEAL + '30', ELECTRIC_BLUE + '20']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.etaGradient}
          >
            <View style={styles.etaContent}>
              <Text style={styles.etaLabel}>Estimated Arrival</Text>
              <Text style={styles.etaTime}>
                {etaMinutes} <Text style={styles.etaUnit}>min</Text>
              </Text>
              <Text style={styles.etaSubtext}>
                {type === 'now'
                  ? 'On-demand visit'
                  : `Scheduled: ${date} at ${time}`}
              </Text>
            </View>
          </LinearGradient>
        </BlurView>
      </View>

      {/* Clinician Card */}
      <View style={styles.clinicianSection}>
        <BlurView intensity={15} tint="dark" style={styles.clinicianCard}>
          <View style={styles.clinicianContent}>
            <View style={styles.clinicianAvatar}>
              <Text style={styles.clinicianAvatarText}>👨‍⚕️</Text>
            </View>
            <View style={styles.clinicianInfo}>
              <Text style={styles.clinicianName}>{clinicianName}</Text>
              <Text style={styles.clinicianLicense}>RN License #12345</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>⭐ 4.9</Text>
                <Text style={styles.ratingCount}>(127 reviews)</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.messageButton}>
              <Text style={styles.messageButtonText}>💬</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <BlurView intensity={10} tint="dark" style={styles.cancelButtonBlur}>
            <Text style={styles.cancelButtonText}>Cancel Visit</Text>
          </BlurView>
        </TouchableOpacity>

        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <LinearGradient
            colors={[TEAL, ELECTRIC_BLUE]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.doneButtonGradient}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
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
    backgroundColor: TEAL + '33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 24,
    color: TEAL,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 44,
  },
  trackingBanner: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  trackingCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: TEAL + '33',
  },
  trackingContent: {
    padding: 16,
    alignItems: 'center',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    marginRight: 8,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  liveText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  trackingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  trackingSubtitle: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  routeSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  routeContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startMarker: {
    backgroundColor: TEAL + '30',
  },
  endMarker: {
    backgroundColor: ELECTRIC_BLUE + '30',
  },
  pointIcon: {
    fontSize: 20,
  },
  pointInfo: {
    marginLeft: 16,
    flex: 1,
  },
  pointLabel: {
    fontSize: 12,
    color: '#B3B3B3',
  },
  pointAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginTop: 2,
  },
  routeLineContainer: {
    height: 40,
    marginLeft: 20,
    position: 'relative',
  },
  routeLine: {
    position: 'absolute',
    left: 2,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: TEAL + '40',
  },
  carContainer: {
    position: 'absolute',
    left: -8,
    top: 10,
  },
  car: {
    fontSize: 24,
  },
  carIcon: {
    fontSize: 24,
  },
  etaSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  etaCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: TEAL + '33',
  },
  etaGradient: {
    padding: 20,
  },
  etaContent: {
    alignItems: 'center',
  },
  etaLabel: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 8,
  },
  etaTime: {
    fontSize: 48,
    fontWeight: 'bold',
    color: TEAL,
  },
  etaUnit: {
    fontSize: 24,
    fontWeight: 'normal',
  },
  etaSubtext: {
    fontSize: 12,
    color: '#B3B3B3',
    marginTop: 8,
  },
  clinicianSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  clinicianCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: TEAL + '33',
  },
  clinicianContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  clinicianAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: TEAL + '33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clinicianAvatarText: {
    fontSize: 28,
  },
  clinicianInfo: {
    marginLeft: 16,
    flex: 1,
  },
  clinicianName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  clinicianLicense: {
    fontSize: 12,
    color: '#B3B3B3',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 14,
    color: '#FFD700',
  },
  ratingCount: {
    fontSize: 12,
    color: '#B3B3B3',
    marginLeft: 4,
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: TEAL + '33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageButtonText: {
    fontSize: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cancelButtonBlur: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B6B20',
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  doneButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  doneButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

