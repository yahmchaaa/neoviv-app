import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, RADII, SPACING } from '../src/theme';

export default function ConfirmationScreen() {
  const params = useLocalSearchParams();
  const { fullName, address } = params;

  const handleDone = () => {
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Booking Confirmed</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Confirmation Banner */}
      <View style={styles.confirmationBanner}>
        <BlurView intensity={20} tint="light" style={styles.confirmationCard}>
          <View style={styles.confirmationContent}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>
            <Text style={styles.confirmationTitle}>Order Received!</Text>
            <Text style={styles.confirmationSubtitle}>
              Your clinician is on the way
            </Text>
          </View>
        </BlurView>
      </View>

      {/* ETA Display */}
      <View style={styles.etaSection}>
        <View style={styles.etaCard}>
          <LinearGradient
            colors={[COLORS.tealLight, COLORS.tealBorder]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.etaGradient}
          >
            <View style={styles.etaContent}>
              <Text style={styles.etaLabel}>Estimated Arrival</Text>
              <Text style={styles.etaTime}>
                60-90 <Text style={styles.etaUnit}>min</Text>
              </Text>
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Location Info */}
      <View style={styles.locationSection}>
        <View style={styles.locationCard}>
          <View style={styles.locationContent}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationAddress}>{address || 'Your Location'}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Pressable style={styles.doneButton} onPress={handleDone}>
          <LinearGradient
            colors={[COLORS.teal, COLORS.electricBlue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.doneButtonGradient}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.heading,
  },
  placeholder: {
    width: 44,
  },
  confirmationBanner: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  confirmationCard: {
    borderRadius: RADII.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.tealBorder,
  },
  confirmationContent: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.teal,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  checkIcon: {
    fontSize: 36,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  confirmationTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.heading,
    marginBottom: 8,
  },
  confirmationSubtitle: {
    fontSize: 16,
    color: COLORS.muted,
  },
  etaSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  etaCard: {
    borderRadius: RADII.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.tealBorder,
  },
  etaGradient: {
    padding: SPACING.lg,
  },
  etaContent: {
    alignItems: 'center',
  },
  etaLabel: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 8,
  },
  etaTime: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.teal,
  },
  etaUnit: {
    fontSize: 24,
    fontWeight: 'normal',
  },
  locationSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  locationCard: {
    borderRadius: RADII.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.tealBorder,
    backgroundColor: COLORS.white,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  locationIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  locationAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.heading,
  },
  actionButtons: {
    paddingHorizontal: SPACING.lg,
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  doneButton: {
    borderRadius: RADII.lg,
    overflow: 'hidden',
  },
  doneButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: RADII.lg,
  },
  doneButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
