import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const BLACK = '#0A0A0A';

const MEMBERSHIP_TIERS = [
  {
    id: 'essential',
    name: 'Essential',
    price: 399,
    tagline: 'Start your wellness journey',
    points: '100 pts/month',
    color: ELECTRIC_BLUE,
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
    color: TEAL,
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
  const slideAnim = useRef(new Animated.Value(50)).current;

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

  const handleJoin = (tierId: string) => {
    router.push({
      pathname: '/register',
      params: { tier: tierId },
    });
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
            <Pressable
              key={tier.id}
              style={[
                styles.tierCard,
                tier.id === 'elite' && styles.tierCardElite,
                selectedTier === tier.id && styles.tierCardSelected,
              ]}
              onPress={() => setSelectedTier(tier.id)}
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
                <Text style={[
                  styles.tierPointsText,
                  tier.id === 'elite' && styles.tierPointsTextElite,
                ]}>
                  💎 {tier.points}
                </Text>
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
                <LinearGradient
                  colors={
                    tier.id === 'elite'
                      ? [TEAL + 'CC', TEAL]
                      : ['rgba(0, 212, 255, 0.3)', 'rgba(0, 212, 255, 0.2)']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.joinButtonGradient}
                >
                  <Text style={[
                    styles.joinButtonText,
                    tier.id === 'elite' && styles.joinButtonTextElite,
                  ]}>
                    Get Started — {tier.name}
                  </Text>
                </LinearGradient>
              </Pressable>
            </Pressable>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  tierCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tierCardElite: {
    borderColor: TEAL,
    backgroundColor: 'rgba(0, 176, 155, 0.08)',
  },
  tierCardSelected: {
    borderColor: ELECTRIC_BLUE,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    marginLeft: -60,
    backgroundColor: TEAL,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  popularBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: BLACK,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tierInfo: {
    flex: 1,
  },
  tierName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tierNameElite: {
    color: TEAL,
  },
  tierTagline: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  tierPriceContainer: {
    alignItems: 'flex-end',
  },
  tierPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tierPricePer: {
    fontSize: 14,
    color: '#666',
  },
  tierPoints: {
    marginBottom: 16,
  },
  tierPointsText: {
    fontSize: 14,
    color: ELECTRIC_BLUE,
    fontWeight: '600',
  },
  tierPointsTextElite: {
    color: TEAL,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  benefitsList: {
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitCheck: {
    fontSize: 14,
    color: TEAL,
    marginRight: 12,
    fontWeight: '700',
  },
  benefitText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  joinButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  joinButtonElite: {},
  joinButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 16,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: ELECTRIC_BLUE,
  },
  joinButtonTextElite: {
    color: BLACK,
  },
  referralSection: {
    backgroundColor: 'rgba(0, 176, 155, 0.1)',
    borderRadius: 20,
    padding: 24,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: TEAL + '30',
  },
  referralTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  referralText: {
    fontSize: 13,
    color: '#B3B3B3',
    lineHeight: 20,
    marginBottom: 16,
  },
  referralButton: {
    backgroundColor: TEAL,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  referralButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: BLACK,
  },
  bottomNotice: {
    alignItems: 'center',
    marginTop: 10,
  },
  bottomNoticeText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});