import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
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
import * as Notifications from 'expo-notifications';
import { savePushToken, completeOnboarding } from '../../src/services/onboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const LIGHT_MINT = '#F5F9F9';

const NOTIFICATION_TYPES = [
  { icon: '✅', title: 'Booking Confirmed', desc: 'Get notified when your booking is confirmed' },
  { icon: '🚗', title: 'Clinician On The Way', desc: 'Know when your clinician is heading to you' },
  { icon: '👨‍⚕️', title: 'Clinician Arrived', desc: 'Be alerted when your clinician has arrived' },
  { icon: '⏰', title: 'Appointment Reminder', desc: 'Receive a reminder 1 hour before your visit' },
  { icon: '✨', title: 'Visit Complete', desc: 'Know when your session has ended' },
];

export default function NotificationPermissionScreen() {
  const bellScale = useSharedValue(1);
  const bellRotate = useSharedValue(0);

  React.useEffect(() => {
    // Bell animation
    bellScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    bellRotate.value = withRepeat(
      withSequence(
        withTiming(15, { duration: 200, easing: Easing.inOut(Easing.ease) }),
        withTiming(-15, { duration: 200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const bellStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bellScale.value }, { rotate: `${bellRotate.value}deg` }],
  }));

  const handleEnable = async () => {
    try {
      // Request notification permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        // Permission denied, but still allow onboarding to complete
        await AsyncStorage.setItem('notificationPermissionShown', 'true');
        await completeOnboarding();
        router.replace('/home');
        return;
      }

      // Get push token
      const { data: tokenData } = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // Replace with actual project ID
      });

      if (tokenData) {
        // Save push token to Supabase
        await savePushToken(tokenData, Platform.OS);
      }

      // Mark notification permission as shown and complete onboarding
      await AsyncStorage.setItem('notificationPermissionShown', 'true');
      await completeOnboarding();
      router.replace('/home');
    } catch (error) {
      console.error('Error enabling notifications:', error);
      // Still complete onboarding even if there's an error
      await AsyncStorage.setItem('notificationPermissionShown', 'true');
      await completeOnboarding();
      router.replace('/home');
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('notificationPermissionShown', 'true');
      await completeOnboarding();
      router.replace('/home');
    } catch (error) {
      console.error('Error skipping notifications:', error);
      router.replace('/home');
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated Background Orbs */}
      <View style={styles.orbContainer}>
        <Animated.View style={[styles.orb, styles.orb1]}>
          <LinearGradient colors={[TEAL + '40', ELECTRIC_BLUE + '20']} style={styles.orbGradient} />
        </Animated.View>
        <Animated.View style={[styles.orb, styles.orb2]}>
          <LinearGradient colors={[ELECTRIC_BLUE + '30', TEAL + '20']} style={styles.orbGradient} />
        </Animated.View>
        <Animated.View style={[styles.orb, styles.orb3]}>
          <LinearGradient colors={[TEAL + '30', ELECTRIC_BLUE + '20']} style={styles.orbGradient} />
        </Animated.View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
        <Text style={styles.progressText}>Step 7 of 7</Text>
      </View>

      <View style={styles.content}>
        {/* Bell Icon */}
        <Animated.View style={[styles.bellContainer, bellStyle]}>
          <View style={styles.bellIcon}>
            <Text style={styles.bellIconText}>🔔</Text>
          </View>
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>Stay Updated</Text>
        <Text style={styles.subtitle}>
          Enable notifications to receive updates about your bookings and appointments
        </Text>

        {/* Notification Types */}
        <View style={styles.notificationList}>
          {NOTIFICATION_TYPES.map((item, index) => (
            <BlurView key={index} intensity={15} tint="light" style={styles.notificationItem}>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationIcon}>{item.icon}</Text>
                <View style={styles.notificationText}>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  <Text style={styles.notificationDesc}>{item.desc}</Text>
                </View>
              </View>
            </BlurView>
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.enableButton} onPress={handleEnable}>
            <LinearGradient
              colors={[TEAL, ELECTRIC_BLUE]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.enableButtonGradient}
            >
              <Text style={styles.enableButtonText}>Enable Notifications</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  orbContainer: {
    ...StyleSheet.absoluteFillObject,
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
    right: -80,
  },
  orb2: {
    width: 200,
    height: 200,
    bottom: 200,
    left: -60,
  },
  orb3: {
    width: 180,
    height: 180,
    top: '50%',
    right: -50,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  bellContainer: {
    marginBottom: 32,
  },
  bellIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: TEAL + '30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: TEAL,
  },
  bellIconText: {
    fontSize: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#131B2A',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#B3B3B3',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  notificationList: {
    width: '100%',
    marginBottom: 40,
  },
  notificationItem: {
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: TEAL + '20',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  notificationIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#131B2A',
  },
  notificationDesc: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  buttonContainer: {
    width: '100%',
  },
  enableButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
  },
  enableButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  enableButtonText: {
    color: '#131B2A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#888',
    fontSize: 16,
  },
});
