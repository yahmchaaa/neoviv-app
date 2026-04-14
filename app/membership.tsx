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

const MEMBERSHIP_TIERS = [
  {
    id: 'essential',
    name: 'Essential',
    price: 399,
    tagline: 'Start your wellness journey',
    points: '100 pts/month',
    benefits: [
      '10% off all IV services',
      'Dedicated licensed nurse',
      'Secure in-app messaging',
      'Monthly wellness check-in',
      'Member-only add-on pricing',
      'Priority scheduling',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 799,
    tagline: 'The concierge wellness standard',
    points: '500 pts + 3× multiplier',
    badge: 'MOST POPULAR',
    benefits: [
      '3 IV sessions included/month',
      '20% off all services',
      '50% off NAD+ once/month',
      'Priority same-day booking',
      'Personal health consultant',
      'VIP concierge line',
      'Everything in Essential',
    ],
  },
];

export default function MembershipScreen() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  
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

  const handleJoin = (tierId: string) => {
    router.push({
      pathname: '/register',
      params: { tier: tierId },
    });
  };

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
          <Text style={styles.headerTitle}>Membership Tiers</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Choose Your Level</Text>
          <Text style={styles.heroSubtitle}>
            All plans include a dedicated nurse, in-app scheduling, and Life Points rewards. No contracts — cancel anytime.
          </Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Membership Tiers */}
          {MEMBERSHIP_TIERS.map((tier) => (
            <View
              key={tier.id}
              style={[
                styles.tierCard,
                tier.id === 'elite' && styles.tierCardElite,
              ]}
            >
              {tier.badge && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>{tier.badge}</Text>
                </View>
              )}
              
              <View style={styles.tierHeader}>
                <View style={styles.tierInfo}>
                  <Text style={[
                    styles.tierName,
                    tier.id === 'elite' && styles.tierNameElite,
                  ]}>
                    {tier.name}
                  </Text>
                  <Text style={styles.tierTagline}>{tier.tagline}</Text>
                </View>
                
                <View style={styles.tierPriceContainer}>
                  <Text style={styles.tierPrice}>${tier.price}</Text>
                  <Text style={styles.tierPricePer}>/month</Text>
                </View>
              </View>

              <View style={styles.tierPoints}>
                <Text style={styles.tierPointsText}>💎 {tier.points}</Text>
              </View>

              <View style={styles.divider} />

              {/* Benefits List */}
              <View style={styles.benefitsList}>
                {tier.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <Text style={styles.benefitCheck}>✓</Text>
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>

              {/* Join Button */}
              <Pressable
                style={[
                  styles.joinButton,
                  tier.id === 'elite' && styles.joinButtonElite,
                ]}
                onPress={() => handleJoin(tier.id)}
              >
                <Text style={[
                  styles.joinButtonText,
                  tier.id === 'elite' && styles.joinButtonTextElite,
                ]}>
                  Get Started — {tier.name}
                </Text>
              </Pressable>
            </View>
          ))}

          {/* Referral Info */}
          <View style={styles.referralSection}>
            <Text style={styles.referralTitle}>Refer a Friend — Everyone Wins</Text>
            <Text style={styles.referralText}>
              Share your unique code and your friend gets 25% off their first month. You earn 100 Life Points for every successful referral.
            </Text>
            <Pressable style={styles.referralButton}>
              <Text style={styles.referralButtonText}>Get Your Code 💎</Text>
            </Pressable>
          </View>

          {/* Bottom Notice */}
          <View style={styles.bottomNotice}>
            <Text style={styles.bottomNoticeText}>
              All memberships include HIPAA-compliant records and same-day nurse availability. No contracts — cancel anytime.
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingBottom: 40,
  },
  tierCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.tealBorder,
    ...SHADOWS.card,
  },
  tierCardElite: {
    borderColor: COLORS.teal,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    marginLeft: -60,
    backgroundColor: COLORS.teal,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  popularBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  tierInfo: {
    flex: 1,
  },
  tierName: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.heading,
    marginBottom: 4,
  },
  tierNameElite: {
    color: COLORS.teal,
  },
  tierTagline: {
    fontSize: 14,
    color: COLORS.muted,
  },
  tierPriceContainer: {
    alignItems: 'flex-end',
  },
  tierPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.heading,
  },
  tierPricePer: {
    fontSize: 14,
    color: COLORS.muted,
  },
  tierPoints: {
    marginBottom: SPACING.md,
  },
  tierPointsText: {
    fontSize: 14,
    color: COLORS.teal,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.tealBorder,
    marginBottom: SPACING.lg,
  },
  benefitsList: {
    marginBottom: SPACING.lg,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitCheck: {
    fontSize: 14,
    color: COLORS.teal,
    marginRight: 12,
    fontWeight: '700',
  },
  benefitText: {
    fontSize: 14,
    color: COLORS.body,
    flex: 1,
  },
  joinButton: {
    backgroundColor: COLORS.tealLight,
    borderRadius: RADII.lg,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.tealBorder,
  },
  joinButtonElite: {
    backgroundColor: COLORS.teal,
    borderColor: COLORS.teal,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.teal,
  },
  joinButtonTextElite: {
    color: COLORS.white,
  },
  referralSection: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.tealBorder,
    ...SHADOWS.card,
  },
  referralTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.heading,
    marginBottom: 8,
  },
  referralText: {
    fontSize: 13,
    color: COLORS.muted,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  referralButton: {
    backgroundColor: COLORS.teal,
    borderRadius: RADII.md,
    paddingVertical: 14,
    alignItems: 'center',
    ...SHADOWS.button,
  },
  referralButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  bottomNotice: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  bottomNoticeText: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: 'center',
  },
});