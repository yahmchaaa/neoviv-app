import { useEffect, useRef } from 'react';
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

const WELLNESS_PACKAGES = [
  {
    id: 'restore',
    name: 'Restore',
    description: 'Essential hydration & wellness reset',
    price: 199,
    duration: '60 min',
    icon: '💧',
    popular: true,
  },
  {
    id: 'reset',
    name: 'Reset',
    description: 'Recharge with B-vitamins & amino acids',
    price: 249,
    duration: '60 min',
    icon: '⚡',
    popular: true,
  },
  {
    id: 'recover',
    name: 'Recover',
    description: 'Post-workout recovery & muscle repair',
    price: 279,
    duration: '75 min',
    icon: '💪',
    popular: false,
  },
  {
    id: 'recover-plus',
    name: 'Recover+',
    description: 'Advanced recovery with NAD+ & glutathione',
    price: 299,
    duration: '90 min',
    icon: '✨',
    popular: true,
  },
  {
    id: 'glow',
    name: 'Glow',
    description: 'Skin radiance & antioxidant infusion',
    price: 299,
    duration: '60 min',
    icon: '🌟',
    popular: false,
  },
  {
    id: 'myers-restore',
    name: 'Myers Restore',
    description: 'Classic Myers cocktail formula',
    price: 329,
    duration: '60 min',
    icon: '🧪',
    popular: false,
  },
  {
    id: 'calm',
    name: 'Calm',
    description: 'Relaxation & stress relief blend',
    price: 279,
    duration: '60 min',
    icon: '🌙',
    popular: false,
  },
  {
    id: 'nad-restore',
    name: 'NAD+ Restore',
    description: 'Cellular repair & anti-aging powerhouse',
    price: 399,
    duration: '90 min',
    icon: '🔬',
    popular: true,
  },
  {
    id: 'defense',
    name: 'Defense',
    description: 'Immune support & vitamin C boost',
    price: 299,
    duration: '60 min',
    icon: '🛡️',
    popular: false,
  },
];

const BENEFITS = [
  { icon: '🏠', text: 'At-home convenience' },
  { icon: '⏱️', text: '60-90 min sessions' },
  { icon: '👩‍⚕️', text: 'Licensed clinicians' },
  { icon: '📅', text: 'Same-day booking' },
];

function BenefitItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.benefitItem}>
      <Text style={styles.benefitIcon}>{icon}</Text>
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

function WellnessCard({ item, index }: { item: typeof WELLNESS_PACKAGES[0]; index: number }) {
  const slideAnim = useRef(new Animated.Value(80)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.wellnessCard,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Pressable style={styles.wellnessCardPressable}>
        <View style={styles.wellnessCardHeader}>
          <View style={styles.wellnessIconContainer}>
            <Text style={styles.wellnessIcon}>{item.icon}</Text>
          </View>
          {item.popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>POPULAR</Text>
            </View>
          )}
        </View>
        <View style={styles.wellnessCardContent}>
          <Text style={styles.wellnessName}>{item.name}</Text>
          <Text style={styles.wellnessDescription}>{item.description}</Text>
          <View style={styles.wellnessCardFooter}>
            <View style={styles.wellnessPriceContainer}>
              <Text style={styles.wellnessPrice}>${item.price}</Text>
            </View>
            <View style={styles.wellnessDuration}>
              <Text style={styles.durationText}>{item.duration}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function WellnessScreen() {
  const router = useRouter();

  const headerSlide = useRef(new Animated.Value(-100)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated Background */}
      <View style={styles.background}>
        <View style={[styles.orb, styles.orb1]} />
        <View style={[styles.orb, styles.orb2]} />
        <View style={[styles.orb, styles.orb3]} />
      </View>

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
        <Text style={styles.headerTitle}>Wellness</Text>
        <Pressable style={styles.profileButton}>
          <View style={styles.profileIcon} />
        </Pressable>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <BlurView intensity={20} tint="dark" style={styles.heroCard}>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Optimize Your Wellness</Text>
              <Text style={styles.heroSubtitle}>
                Specialized IV therapy packages designed for your unique health goals
              </Text>
              <View style={styles.benefitsRow}>
                {BENEFITS.map((benefit, index) => (
                  <BenefitItem key={index} icon={benefit.icon} text={benefit.text} />
                ))}
              </View>
            </View>
          </BlurView>
        </View>

        {/* Wellness Packages */}
        <View style={styles.packagesSection}>
          <Text style={styles.sectionTitle}>Wellness Packages</Text>
          <Text style={styles.sectionSubtitle}>
            Choose the perfect package for your wellness goals
          </Text>
          <View style={styles.packagesList}>
            {WELLNESS_PACKAGES.map((item, index) => (
              <WellnessCard key={item.id} item={item} index={index} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BlurView intensity={20} tint="dark" style={styles.bottomNav}>
        <View style={styles.navContent}>
          <Pressable style={styles.navItem} onPress={() => router.push('/home')}>
            <View style={styles.navIcon} />
            <Text style={styles.navText}>Home</Text>
          </Pressable>
          <Pressable style={styles.navItem} onPress={() => router.push('/menu')}>
            <View style={styles.navIcon} />
            <Text style={styles.navText}>Menu</Text>
          </Pressable>
          <Pressable style={[styles.navItem, styles.navItemActive]}>
            <View style={[styles.navIcon, styles.navIconActive]} />
            <Text style={[styles.navText, styles.navTextActive]}>Wellness</Text>
          </Pressable>
          <Pressable style={styles.navItem} onPress={() => router.push('/orders')}>
            <View style={styles.navIcon} />
            <Text style={styles.navText}>Orders</Text>
          </Pressable>
          <Pressable style={styles.navItem} onPress={() => router.push('/account')}>
            <View style={styles.navIcon} />
            <Text style={styles.navText}>Account</Text>
          </Pressable>
        </View>
      </BlurView>
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
    bottom: 200,
    left: -80,
  },
  orb3: {
    width: 150,
    height: 150,
    backgroundColor: '#00B09B',
    bottom: -50,
    right: 100,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#00B09B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00B09B',
  },
  heroSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  heroCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 176, 155, 0.2)',
  },
  heroContent: {
    padding: 20,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#B3B3B3',
    lineHeight: 20,
    marginBottom: 20,
  },
  benefitsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 176, 155, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  benefitIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  benefitText: {
    fontSize: 12,
    color: '#B3B3B3',
    fontWeight: '500',
  },
  packagesSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 20,
  },
  packagesList: {
    gap: 16,
  },
  wellnessCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 176, 155, 0.2)',
    overflow: 'hidden',
  },
  wellnessCardPressable: {
    backgroundColor: 'rgba(20, 20, 20, 0.7)',
  },
  wellnessCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 8,
  },
  wellnessIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 176, 155, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wellnessIcon: {
    fontSize: 28,
  },
  popularBadge: {
    backgroundColor: '#00B09B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0A0A0A',
    letterSpacing: 0.5,
  },
  wellnessCardContent: {
    padding: 16,
    paddingTop: 8,
  },
  wellnessName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  wellnessDescription: {
    fontSize: 13,
    color: '#B3B3B3',
    lineHeight: 18,
    marginBottom: 16,
  },
  wellnessCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wellnessPriceContainer: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  wellnessPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00D4FF',
  },
  wellnessDuration: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 12,
    color: '#B3B3B3',
    fontWeight: '500',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 30,
    paddingTop: 10,
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  navItemActive: {
    transform: [{ scale: 1.05 }],
  },
  navIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#444',
    marginBottom: 4,
  },
  navIconActive: {
    backgroundColor: '#00B09B',
    shadowColor: '#00B09B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  navText: {
    fontSize: 11,
    color: '#B3B3B3',
  },
  navTextActive: {
    color: '#00B09B',
    fontWeight: '600',
  },
});
