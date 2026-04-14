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
import { BlurView } from 'expo-blur';

const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const BLACK = '#0A0A0A';

const REWARDS_TIERS = [
  {
    points: 1000,
    reward: '$100 Off Your Next Order',
    color: '#FFD700',
    icon: '🎁',
  },
  {
    points: 500,
    reward: '$50 Off Your Next Order',
    color: '#C0C0C0',
    icon: '🎁',
  },
  {
    points: 250,
    reward: '$25 Off Your Next Order',
    color: '#CD7F32',
    icon: '🎁',
  },
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
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRedeem = (points: number) => {
    // Navigate to redemption
    router.push('/home');
  };

  return (
    <View style={styles.container}>
      {/* Background Elements */}
      <View style={styles.orb1} />
      <View style={styles.orb2} />

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
          <BlurView intensity={20} tint='dark' style={styles.pointsCardBlur}>
            <View style={styles.pointsCardContent}>
              <View style={styles.pointsIconContainer}>
                <Text style={styles.pointsIcon}>💎</Text>
              </View>
              <View style={styles.pointsInfo}>
                <Text style={styles.pointsLabel}>Your Life Points</Text>
                <Text style={styles.pointsValue}>{currentPoints}</Text>
              </View>
            </View>
          </BlurView>
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
              <Pressable
                key={tier.points}
                style={[
                  styles.rewardCard,
                  currentPoints >= tier.points && styles.rewardCardAvailable,
                ]}
                onPress={() => currentPoints >= tier.points && handleRedeem(tier.points)}
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
              </Pressable>
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
  content: {
    flex: 1,
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
  placeholder: {
    width: 44,
  },
  heroSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#B3B3B3',
    lineHeight: 20,
  },
  pointsCard: {
    marginHorizontal: 24,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: TEAL,
  },
  pointsCardBlur: {
    padding: 24,
  },
  pointsCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 176, 155, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  pointsIcon: {
    fontSize: 32,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 40,
    fontWeight: '700',
    color: TEAL,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
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
  earnCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  earnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earnIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  earnContent: {
    flex: 1,
  },
  earnTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  earnDescription: {
    fontSize: 13,
    color: '#B3B3B3',
  },
  earnPoints: {
    fontSize: 16,
    fontWeight: '700',
    color: TEAL,
  },
  rewardCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  rewardCardAvailable: {
    borderColor: TEAL,
    backgroundColor: 'rgba(0, 176, 155, 0.08)',
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
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rewardIcon: {
    fontSize: 24,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardPoints: {
    fontSize: 12,
    color: '#B3B3B3',
    marginBottom: 2,
  },
  rewardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  redeemButton: {
    backgroundColor: TEAL,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  redeemButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: BLACK,
  },
  lockedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  lockedButtonText: {
    fontSize: 14,
    color: '#666',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#B3B3B3',
    lineHeight: 18,
  },
});