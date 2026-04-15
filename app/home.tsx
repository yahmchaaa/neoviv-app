import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Dimensions,
  FlatList,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { COLORS, SHADOWS, RADII, SPACING } from '../src/theme';

// All 12 drips from neoviv.life
const DRIPS = [
  { id: '1', name: "Myers' Cocktail", duration: '45–60 min', tagline: 'The classic revival', badge: null },
  { id: '2', name: 'Immunity Boost', duration: '45 min', tagline: 'Fortress mode', badge: null },
  { id: '3', name: 'Hydration', duration: '30–45 min', tagline: 'Pure cellular refresh', badge: null },
  { id: '4', name: 'Energy & Vitality', duration: '45 min', tagline: 'Power up', badge: null },
  { id: '5', name: 'NAD+', duration: '2–4 hrs', tagline: 'Cellular longevity', badge: 'Elite+' },
  { id: '6', name: 'Glutathione', duration: '30 min', tagline: 'Master antioxidant', badge: null },
  { id: '7', name: 'Beauty Glow', duration: '45 min', tagline: 'Radiance from within', badge: null },
  { id: '8', name: 'Recovery', duration: '45–60 min', tagline: 'Bounce back faster', badge: null },
  { id: '9', name: 'Hangover Relief', duration: '45 min', tagline: 'Back to life — fast', badge: null },
  { id: '10', name: 'Weight Loss', duration: '45 min', tagline: 'Ignite your metabolism', badge: null },
  { id: '11', name: 'Anti-Aging', duration: '60–90 min', tagline: 'Turn back the clock', badge: 'Elite+' },
  { id: '12', name: 'Migraine Relief', duration: '30–45 min', tagline: 'Relief in 20 minutes', badge: null },
];

// Website stats
const WEBSITE_STATS = {
  members: '500+',
  sameDay: 'Same-Day Service',
  nurses: 'Licensed Nurses',
};

// Core messaging
const TAGLINE = 'Heal Smarter. LiveElevated.';
const HERO_COPY = 'Premium IV infusion therapy, longevity protocols, and concierge nursing — delivered directly to you, wherever you are.';

const NAV_ITEMS = [
  { icon: '🏠', label: 'Home', active: true, route: '/home' },
  { icon: '💧', label: 'Menu', active: false, route: '/menu' },
  { icon: '☀️', label: 'Wellness', active: false, route: '/wellness' },
  { icon: '📋', label: 'Orders', active: false, route: '/orders' },
  { icon: '👤', label: 'Account', active: false, route: '/account' },
];

const CARD_WIDTH = width * 0.75;
const CARD_SPACING = 16;

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderDripCard = ({ item, index }: { item: typeof DRIPS[0]; index: number }) => {
    const isActive = index === activeIndex;
    
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          scrollRef.current?.scrollToIndex({ index });
        }}
      >
        <View style={[styles.dripCard, isActive && styles.dripCardActive]}>
          <View style={styles.dripCardContent}>
            <View style={styles.dripHeader}>
              <Text style={styles.dripDuration}>{item.duration}</Text>
              {item.badge && (
                <View style={styles.eliteBadge}>
                  <Text style={styles.eliteBadgeText}>{item.badge}</Text>
                </View>
              )}
            </View>

            <View style={styles.dripIconContainer}>
              <Text style={styles.dripIcon}>💧</Text>
            </View>

            <Text style={styles.dripName}>{item.name}</Text>
            <Text style={styles.dripTagline}>{item.tagline}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleNavPress = (route: string) => {
    if (route !== '/home') {
      router.push(route);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>NEOVIV</Text>
            <Text style={styles.tagline}>{TAGLINE}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileIcon}>
              <Text style={styles.profileIconText}>👤</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroHeadline}>Drops of Life</Text>
          <Text style={styles.heroSubline}>Premium IV therapy. Delivered to you.</Text>
          <Pressable
            style={styles.heroButton}
            onPress={() => router.push('/book')}
          >
            <LinearGradient
              colors={[COLORS.teal, COLORS.electricBlue]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.heroButtonGradient}
            >
              <Text style={styles.heroButtonText}>Book Your Drop</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Social Proof */}
        <View style={styles.socialProof}>
          <Text style={styles.socialProofText}>{WEBSITE_STATS.members} Members</Text>
          <Text style={styles.socialDot}>·</Text>
          <Text style={styles.socialProofText}>{WEBSITE_STATS.sameDay}</Text>
          <Text style={styles.socialDot}>·</Text>
          <Text style={styles.socialProofText}>{WEBSITE_STATS.nurses}</Text>
        </View>

        {/* Choose Your Drip Section */}
        <View style={styles.dripsSection}>
          <Text style={styles.sectionTitle}>Choose Your Drip</Text>
          
          <View style={styles.carouselContainer}>
            <FlatList
              ref={scrollRef}
              data={DRIPS}
              renderItem={renderDripCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH + CARD_SPACING}
              decelerationRate="fast"
              contentContainerStyle={styles.carouselContent}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              getItemLayout={(_, index) => ({
                length: CARD_WIDTH + CARD_SPACING,
                offset: (CARD_WIDTH + CARD_SPACING) * index,
                index,
              })}
            />
          </View>

          {/* Dot Indicators */}
          <View style={styles.dotIndicators}>
            {DRIPS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === activeIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Membership CTA */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Membership</Text>
          <Text style={styles.ctaSubtitle}>Join for exclusive benefits and Life Points</Text>
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={() => router.push('/membership')}
          >
            <Text style={styles.ctaButtonText}>View Plans</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.navItems}>
          {NAV_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.navItem}
              onPress={() => handleNavPress(item.route)}
            >
              <View
                style={[
                  styles.navIconContainer,
                  item.active && styles.navIconContainerActive,
                ]}
              >
                <Text style={styles.navIcon}>{item.icon}</Text>
              </View>
              <Text
                style={[
                  styles.navLabel,
                  item.active && styles.navLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  heroHeadline: {
    fontSize: 44,
    fontWeight: 'bold',
    color: COLORS.heading,
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubline: {
    fontSize: 18,
    color: COLORS.muted,
    textAlign: 'center',
    marginBottom: 32,
  },
  heroButton: {
    borderRadius: RADII.xl,
    overflow: 'hidden',
    ...SHADOWS.button,
  },
  heroButtonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 48,
    alignItems: 'center',
    borderRadius: RADII.xl,
  },
  heroButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.white,
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.teal,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  profileButton: {
    padding: 4,
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.tealBorder,
  },
  profileIconText: {
    fontSize: 20,
  },
  socialProof: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.tealBorder,
  },
  socialProofText: {
    fontSize: 12,
    color: COLORS.teal,
    fontWeight: '500',
  },
  socialDot: {
    color: COLORS.muted,
    marginHorizontal: 8,
  },
  heroCopy: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.white,
  },
  heroCopyText: {
    fontSize: 16,
    color: COLORS.body,
    lineHeight: 24,
    textAlign: 'center',
  },
  bookSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  bookButton: {
    backgroundColor: COLORS.teal,
    paddingVertical: 16,
    borderRadius: RADII.lg,
    alignItems: 'center',
    ...SHADOWS.button,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  dripsSection: {
    paddingTop: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.heading,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  carouselContainer: {
    overflow: 'visible',
  },
  carouselContent: {
    paddingHorizontal: SPACING.lg,
    gap: CARD_SPACING,
  },
  dripCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: RADII.xl,
    borderWidth: 1,
    borderColor: COLORS.tealBorder,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  dripCardActive: {
    borderColor: COLORS.teal,
    borderWidth: 2,
  },
  dripCardContent: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  dripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: 8,
  },
  dripDuration: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: '500',
  },
  eliteBadge: {
    backgroundColor: COLORS.teal,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADII.sm,
  },
  eliteBadgeText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '700',
  },
  dripIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.tealLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  dripIcon: {
    fontSize: 32,
  },
  dripName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.heading,
    marginBottom: 4,
    textAlign: 'center',
  },
  dripTagline: {
    fontSize: 13,
    color: COLORS.muted,
    textAlign: 'center',
  },
  dotIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.tealBorder,
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: COLORS.teal,
    width: 20,
  },
  ctaSection: {
    margin: SPACING.lg,
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: RADII.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.tealBorder,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.heading,
    marginBottom: 4,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: SPACING.lg,
  },
  ctaButton: {
    backgroundColor: COLORS.teal,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADii.lg,
    ...SHADOWS.button,
  },
  ctaButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.tealBorder,
    paddingBottom: 24,
  },
  navItems: {
    flexDirection: 'row',
    paddingTop: SPACING.md,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navIconContainerActive: {
    backgroundColor: COLORS.tealLight,
  },
  navIcon: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 11,
    color: COLORS.muted,
  },
  navLabelActive: {
    color: COLORS.teal,
    fontWeight: '600',
  },
});

const RADii = RADII; // Fix for the typo reference