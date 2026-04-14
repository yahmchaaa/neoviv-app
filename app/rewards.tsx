import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SHADOWS, RADII, SPACING } from '../src/theme';

const REWARDS_TIERS = [
  { points: 1000, reward: '$100 Off Your Next Order', icon: '🎁' },
  { points: 500, reward: '$50 Off Your Next Order', icon: '🎁' },
  { points: 250, reward: '$25 Off Your Next Order', icon: '🎁' },
];

export default function RewardsScreen() {
  const router = useRouter();
  const [currentPoints, setCurrentPoints] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { 
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Life Points Rewards</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Earn Points. Unlock Life.</Text>
          <Text style={styles.heroSubtitle}>
            Earn Life Points with every IV treatment and referral. Reach 1,000 points and get $100 off your next order, automatically applied.
          </Text>
        </View>

        {/* Current Points Card */}
        <View style={styles.pointsCard}>
          <View style={styles.pointsCardContent}>
            <View style={styles.pointsIconContainer}>
              <Text style={styles.pointsIcon}>💎</Text>
            </View>
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsLabel}>Your Life Points</Text>
              <Text style={styles.pointsValue}>{currentPoints}</Text>
            </View>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* How to Earn */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Earn</Text>
            
            <View style={styles.earnCard}>
              <View style={styles.earnRow}>
                <Text style={styles.earnIcon}>💧</Text>
                <View style={styles.earnContent}>
                  <Text style={styles.earnTitle}>Per IV Treatment</Text>
                  <Text style={styles.earnDescription}>Earn points every time you book a session</Text>
                </View>
                <Text style={styles.earnPoints}>+75 pts</Text>
              </View>
            </View>

            <View style={styles.earnCard}>
              <View style={styles.earnRow}>
                <Text style={styles.earnIcon}>👥</Text>
                <View style={styles.earnContent}>
                  <Text style={styles.earnTitle}>Per Referral</Text>
                  <Text style={styles.earnDescription}>Share your code, earn when they join</Text>
                </View>
                <Text style={styles.earnPoints}>+100 pts</Text>
              </View>
            </View>
          </View>

          {/* Reward Tiers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Redeem for Credits</Text>
            
            {REWARDS_TIERS.map((tier) => (
              <View
                key={tier.points}
                style={[
                  styles.rewardCard,
                  currentPoints >= tier.points && styles.rewardCardAvailable,
                ]}
              >
                <View style={styles.rewardContent}>
                  <View style={styles.rewardIconContainer}>
                    <Text style={styles.rewardIcon}>{tier.icon}</Text>
                  </View>
                  <View style={styles.rewardInfo}>
                    <Text style={styles.rewardPoints}>{tier.points} pts</Text>
                    <Text style={styles.rewardValue}>{tier.reward}</Text>
                  </View>
                </View>
                {currentPoints >= tier.points ? (
                  <View style={styles.redeemButton}>
                    <Text style={styles.redeemButtonText}>Redeem</Text>
                  </View>
                ) : (
                  <View style={styles.lockedButton}>
                    <Text style={styles.lockedButtonText}>🔒 Locked</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>
              Points are automatically applied to your next booking when you reach a reward tier. No codes needed!
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
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
  placeholder: {
    width: 44,
  },
  heroSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.white,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.heading,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 20,
  },
  pointsCard: {
    margin: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.teal,
    ...SHADOWS.card,
  },
  pointsCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  pointsIcon: {
    fontSize: 32,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 40,
    fontWeight: '700',
    color: COLORS.teal,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
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
  earnCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  earnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earnIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  earnContent: {
    flex: 1,
  },
  earnTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.heading,
    marginBottom: 4,
  },
  earnDescription: {
    fontSize: 13,
    color: COLORS.muted,
  },
  earnPoints: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.teal,
  },
  rewardCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.tealBorder,
    ...SHADOWS.card,
  },
  rewardCardAvailable: {
    borderColor: COLORS.teal,
  },
  rewardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rewardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF8E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  rewardIcon: {
    fontSize: 24,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardPoints: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 2,
  },
  rewardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.heading,
  },
  redeemButton: {
    backgroundColor: COLORS.teal,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: RADII.md,
    ...SHADOWS.button,
  },
  redeemButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  lockedButton: {
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADII.md,
  },
  lockedButtonText: {
    fontSize: 14,
    color: COLORS.muted,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.tealLight,
    borderRadius: RADII.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.body,
    lineHeight: 18,
  },
});