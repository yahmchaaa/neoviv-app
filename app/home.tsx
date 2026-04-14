import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useAnimatedRef,
  scrollTo,
} from 'react-native-reanimated';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');
const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const LIGHT_MINT = '#F5F9F9';

const DRIPS = [
  { id: '1', name: 'Hydration Basics', price: 199, desc: 'Essential fluids & electrolytes' },
  { id: '2', name: 'Energy Boost', price: 249, desc: 'B-Complex, B12 & amino acids' },
  { id: '3', name: 'Immunity Shield', price: 299, desc: 'Vitamin C, Zinc & Glutathione' },
  { id: '4', name: 'NAD+', price: 399, desc: 'Cellular repair & anti-aging' },
];

const NAV_ITEMS = [
  { icon: '🏠', label: 'Home', active: true, route: '/home' },
  { icon: '💧', label: 'Menu', active: false, route: '/menu' },
  { icon: '☀️', label: 'Wellness', active: false, route: '/wellness' },
  { icon: '📋', label: 'Orders', active: false, route: '/orders' },
  { icon: '👤', label: 'Account', active: false, route: '/account' },
];

const CARD_WIDTH = width * 0.7;
const CARD_SPACING = 16;

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useAnimatedRef<Animated.FlatList>();
  
  // Orb animations
  const orb1Y = useSharedValue(0);
  const orb1X = useSharedValue(0);
  const orb2Y = useSharedValue(0);
  const orb2X = useSharedValue(0);
  const orb3Y = useSharedValue(0);
  const orb3X = useSharedValue(0);
  const gridOpacity = useSharedValue(0.3);
  const lightBeamOpacity = useSharedValue(0);

  useEffect(() => {
    // Floating orbs animations
    orb1Y.value = withRepeat(
      withSequence(
        withTiming(-40, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(40, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    orb1X.value = withRepeat(
      withSequence(
        withTiming(30, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-30, { duration: 5000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    orb2Y.value = withRepeat(
      withSequence(
        withTiming(35, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-35, { duration: 3500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    orb2X.value = withRepeat(
      withSequence(
        withTiming(-25, { duration: 4500, easing: Easing.inOut(Easing.ease) }),
        withTiming(25, { duration: 4500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    orb3Y.value = withRepeat(
      withSequence(
        withTiming(30, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-30, { duration: 5000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    orb3X.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-20, { duration: 6000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    gridOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.2, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    lightBeamOpacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const orb1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: orb1Y.value }, { translateX: orb1X.value }],
  }));

  const orb2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: orb2Y.value }, { translateX: orb2X.value }],
  }));

  const orb3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: orb3Y.value }, { translateX: orb3X.value }],
  }));

  const gridStyle = useAnimatedStyle(() => ({
    opacity: gridStyle.value,
  }));

  const lightBeamStyle = useAnimatedStyle(() => ({
    opacity: lightBeamOpacity.value,
  }));

  const handleNavPress = (route: string) => {
    if (route !== '/home') {
      router.push(route);
    }
  };

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
        activeOpacity={0.7}
        onPress={() => {
          scrollRef.current?.scrollToIndex({ index });
        }}
      >
        <View style={[styles.dripCard, isActive && styles.dripCardActive]}>
          <BlurView intensity={isActive ? 25 : 15} tint="light" style={styles.dripCardBlur}>
            <LinearGradient
              colors={isActive ? [TEAL + '40', ELECTRIC_BLUE + '20'] : ['#FFFFFF', '#FFFFFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.dripGradient}
            >
              <View style={styles.dripHeader}>
                <View style={[styles.dripBadge, isActive && styles.dripBadgeActive]}>
                  <Text style={[styles.dripPrice, isActive && styles.dripPriceActive]}>
                    ${item.price}
                  </Text>
                </View>
              </View>

              <View style={styles.dripIconContainer}>
                <Text style={styles.dripIcon}>💧</Text>
              </View>

              <Text style={styles.dripName}>{item.name}</Text>
              <Text style={styles.dripDesc}>{item.desc}</Text>
            </LinearGradient>
          </BlurView>
          {isActive && (
            <View style={styles.activeGlow} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Grid Background */}
      <Animated.View style={[styles.gridContainer, { opacity: 0.3 }]}>
        {[...Array(Math.ceil(width / 60) + 1)].map((_, i) => (
          <View key={`v-${i}`} style={[styles.gridLineVertical, { left: i * 60 }]} />
        ))}
        {[...Array(Math.ceil(height / 60) + 1)].map((_, i) => (
          <View key={`h-${i}`} style={[styles.gridLineHorizontal, { top: i * 60 }]} />
        ))}
      </Animated.View>

      {/* Floating Orbs */}
      <Animated.View style={[styles.orb, styles.orb1, orb1Style]}>
        <LinearGradient colors={[TEAL + '50', ELECTRIC_BLUE + '30']} style={styles.orbGradient} />
      </Animated.View>
      <Animated.View style={[styles.orb, styles.orb2, orb2Style]}>
        <LinearGradient colors={[ELECTRIC_BLUE + '40', TEAL + '20']} style={styles.orbGradient} />
      </Animated.View>
      <Animated.View style={[styles.orb, styles.orb3, orb3Style]}>
        <LinearGradient colors={[TEAL + '40', ELECTRIC_BLUE + '20']} style={styles.orbGradient} />
      </Animated.View>

      {/* Light Beam */}
      <Animated.View style={[styles.lightBeam, lightBeamStyle]}>
        <LinearGradient
          colors={['transparent', TEAL + '40', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Hexagons */}
      <View style={[styles.hexagon, { top: 100, left: 30 }]} />
      <View style={[styles.hexagon, { top: 200, right: 40 }]} />
      <View style={[styles.hexagon, { bottom: 300, left: 50 }]} />

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileIcon}>
              <Text style={styles.profileIconText}>👤</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Book a Visit Section */}
        <View style={styles.bookSection}>
          <Text style={styles.sectionTitle}>Book a Visit</Text>
          
          <View style={styles.bookOptions}>
            {/* Now Option */}
            <TouchableOpacity 
              style={styles.bookOption}
              onPress={() => router.push('/book')}
            >
              <BlurView intensity={20} tint="light" style={styles.bookOptionBlur}>
                <View style={styles.bookOptionContent}>
                  <View style={styles.bookOptionIcon}>
                    <Text style={styles.bookOptionEmoji}>🚨</Text>
                  </View>
                  <Text style={styles.bookOptionTitle}>Now</Text>
                  <Text style={styles.bookOptionSubtitle}>Clinician arrives{'\n'}in 60-120 min</Text>
                </View>
                <View style={styles.tealGlow} />
              </BlurView>
            </TouchableOpacity>

            {/* Schedule Option */}
            <TouchableOpacity 
              style={styles.bookOption}
              onPress={() => router.push('/book')}
            >
              <BlurView intensity={20} tint="light" style={styles.bookOptionBlur}>
                <View style={styles.bookOptionContent}>
                  <View style={styles.bookOptionIcon}>
                    <Text style={styles.bookOptionEmoji}>📅</Text>
                  </View>
                  <Text style={styles.bookOptionTitle}>Schedule</Text>
                  <Text style={styles.bookOptionSubtitle}>Pick your{'\n'}time slot</Text>
                </View>
                <View style={styles.tealGlow} />
              </BlurView>
            </TouchableOpacity>
          </View>
        </View>

        {/* Most Requested Section */}
        <View style={styles.mostRequestedSection}>
          <Text style={styles.sectionTitle}>Most Requested</Text>
          
          <View style={styles.carouselContainer}>
            <Animated.FlatList
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
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <BlurView intensity={25} tint="light" style={styles.bottomNavBlur}>
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
                  {item.active && <View style={styles.activeGlowDot} />}
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
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_MINT,
  },
  gridContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLineVertical: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: TEAL + '15',
  },
  gridLineHorizontal: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: TEAL + '15',
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
    width: 280,
    height: 280,
    top: -100,
    right: -80,
  },
  orb2: {
    width: 220,
    height: 220,
    bottom: 250,
    left: -70,
  },
  orb3: {
    width: 200,
    height: 200,
    top: height * 0.4,
    right: -50,
  },
  lightBeam: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 80,
    left: '30%',
  },
  hexagon: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: TEAL + '30',
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
  },
  scrollView: {
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
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#131B2A',
  },
  profileButton: {
    padding: 4,
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: TEAL + '25',
    borderWidth: 2,
    borderColor: TEAL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    fontSize: 22,
  },
  bookSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#131B2A',
    marginBottom: 16,
  },
  bookOptions: {
    flexDirection: 'row',
    gap: 16,
  },
  bookOption: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  bookOptionBlur: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: TEAL + '20',
    overflow: 'hidden',
  },
  bookOptionContent: {
    padding: 20,
    alignItems: 'center',
  },
  bookOptionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: TEAL + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookOptionEmoji: {
    fontSize: 28,
  },
  bookOptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#131B2A',
    marginBottom: 4,
  },
  bookOptionSubtitle: {
    fontSize: 12,
    color: '#B3B3B3',
    textAlign: 'center',
  },
  tealGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: TEAL,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  mostRequestedSection: {
    paddingHorizontal: 24,
  },
  carouselContainer: {
    marginHorizontal: -24,
  },
  carouselContent: {
    paddingHorizontal: 24,
  },
  dripCard: {
    width: CARD_WIDTH,
    marginRight: CARD_SPACING,
    borderRadius: 24,
    overflow: 'visible',
  },
  dripCardActive: {
    transform: [{ scale: 1.05 }],
  },
  dripCardBlur: {
    borderRadius: 24,
    borderWidth: 2,
    borderColor: TEAL + '20',
    overflow: 'hidden',
  },
  dripGradient: {
    padding: 24,
    alignItems: 'center',
    borderRadius: 24,
  },
  dripHeader: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  dripBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  dripBadgeActive: {
    backgroundColor: TEAL + '30',
  },
  dripPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#B3B3B3',
  },
  dripPriceActive: {
    color: TEAL,
  },
  dripIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: TEAL + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  dripIcon: {
    fontSize: 36,
  },
  dripName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#131B2A',
    marginBottom: 4,
  },
  dripDesc: {
    fontSize: 13,
    color: '#B3B3B3',
    textAlign: 'center',
  },
  activeGlow: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: TEAL,
    borderRadius: 2,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  dotIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: TEAL + '30',
  },
  dotActive: {
    backgroundColor: TEAL,
    width: 24,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  bottomNavBlur: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: TEAL + '20',
  },
  navItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
  },
  navItem: {
    alignItems: 'center',
    position: 'relative',
  },
  navIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIconContainerActive: {
    backgroundColor: TEAL + '30',
  },
  navIcon: {
    fontSize: 24,
  },
  navLabel: {
    fontSize: 11,
    color: '#B3B3B3',
    marginTop: 4,
  },
  navLabelActive: {
    color: TEAL,
    fontWeight: 'bold',
  },
  activeGlowDot: {
    position: 'absolute',
    bottom: 0,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: TEAL,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
});
