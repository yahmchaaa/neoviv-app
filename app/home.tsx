import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
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
} from 'react-native-reanimated';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');
const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const BLACK = '#0A0A0A';

const DRIPS = [
  { id: '1', name: 'Hydration Basics', price: 199, desc: 'Essential fluids & electrolytes', color: TEAL },
  { id: '2', name: 'Energy Boost', price: 249, desc: 'B-Complex, B12 & amino acids', color: ELECTRIC_BLUE },
  { id: '3', name: 'Immunity Shield', price: 299, desc: 'Vitamin C, Zinc & Glutathione', color: '#4CAF50' },
  { id: '4', name: 'NAD+', price: 399, desc: 'Cellular repair & anti-aging', color: '#9C27B0' },
];

const NAV_ITEMS = [
  { icon: '🏠', label: 'Home', active: true, route: '/home' },
  { icon: '💧', label: 'Menu', active: false, route: '/menu' },
  { icon: '☀️', label: 'Wellness', active: false, route: '/wellness' },
  { icon: '📋', label: 'Orders', active: false, route: '/orders' },
  { icon: '👤', label: 'Account', active: false, route: '/account' },
];

export default function HomeScreen() {
  // Orb animations
  const orb1Y = useSharedValue(0);
  const orb1X = useSharedValue(0);
  const orb2Y = useSharedValue(0);
  const orb2X = useSharedValue(0);
  const orb3Y = useSharedValue(0);
  const orb3X = useSharedValue(0);
  const gridOpacity = useSharedValue(0.3);

  useEffect(() => {
    // Floating orbs animations
    orb1Y.value = withRepeat(
      withSequence(
        withTiming(-30, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(30, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    orb1X.value = withRepeat(
      withSequence(
        withTiming(25, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-25, { duration: 5000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    orb2Y.value = withRepeat(
      withSequence(
        withTiming(25, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-25, { duration: 3500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    orb2X.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 4500, easing: Easing.inOut(Easing.ease) }),
        withTiming(20, { duration: 4500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    orb3Y.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 4500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-20, { duration: 4500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    orb3X.value = withRepeat(
      withSequence(
        withTiming(30, { duration: 5500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-30, { duration: 5500, easing: Easing.inOut(Easing.ease) })
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
    opacity: gridOpacity.value,
  }));

  const handleNavPress = (route: string) => {
    if (route !== '/home') {
      router.push(route);
    }
  };

  return (
    <View style={styles.container}>
      {/* Grid Background */}
      <Animated.View style={[styles.gridContainer, gridStyle]}>
        {[...Array(Math.ceil(width / 60) + 1)].map((_, i) => (
          <View key={`v-${i}`} style={[styles.gridLineVertical, { left: i * 60 }]} />
        ))}
        {[...Array(Math.ceil(height / 60) + 1)].map((_, i) => (
          <View key={`h-${i}`} style={[styles.gridLineHorizontal, { top: i * 60 }]} />
        ))}
      </Animated.View>

      {/* Floating Orbs */}
      <Animated.View style={[styles.orb, styles.orb1, orb1Style]}>
        <LinearGradient colors={[TEAL + '40', ELECTRIC_BLUE + '20']} style={styles.orbGradient} />
      </Animated.View>
      <Animated.View style={[styles.orb, styles.orb2, orb2Style]}>
        <LinearGradient colors={[ELECTRIC_BLUE + '30', TEAL + '20']} style={styles.orbGradient} />
      </Animated.View>
      <Animated.View style={[styles.orb, styles.orb3, orb3Style]}>
        <LinearGradient colors={[TEAL + '30', ELECTRIC_BLUE + '20']} style={styles.orbGradient} />
      </Animated.View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileIcon}>
              <Text style={styles.profileIconText}>👤</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* My Drips Section */}
        <View style={styles.myDripsSection}>
          <BlurView intensity={20} tint="dark" style={styles.glassCard}>
            <View style={styles.cardContent}>
              <Text style={styles.sectionTitle}>My Drips</Text>
              <Text style={styles.sectionSubtitle}>Ready for hydration?</Text>
              <Text style={styles.sectionSubtitle}>Let us help</Text>

              <TouchableOpacity style={styles.bookButton}>
                <LinearGradient
                  colors={[TEAL, ELECTRIC_BLUE]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.bookButtonGradient}
                >
                  <Text style={styles.bookButtonText}>Book a Drip</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>

        {/* Most Requested Section */}
        <View style={styles.mostRequestedSection}>
          <Text style={styles.mostRequestedTitle}>Most Requested</Text>
          <Text style={styles.mostRequestedSubtitle}>Our most booked drips</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dripCardsContainer}
          >
            {DRIPS.map((drip) => (
              <TouchableOpacity key={drip.id} style={styles.dripCard}>
                <BlurView intensity={15} tint="dark" style={styles.dripCardBlur}>
                  <View style={styles.dripCardContent}>
                    <View style={[styles.priceBadge, { backgroundColor: drip.color + '30' }]}>
                      <Text style={[styles.priceText, { color: drip.color }]}>${drip.price}</Text>
                    </View>
                    <View style={styles.dripIconContainer}>
                      <Text style={styles.dripIcon}>💧</Text>
                    </View>
                    <Text style={styles.dripDesc}>{drip.desc}</Text>
                    <Text style={styles.dripName}>{drip.name}</Text>
                  </View>
                </BlurView>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom spacing for nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <BlurView intensity={20} tint="dark" style={styles.bottomNavBlur}>
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
                {item.active && <View style={styles.activeGlow} />}
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
    backgroundColor: BLACK,
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
    top: height / 2,
    right: -50,
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
    color: '#fff',
  },
  profileButton: {
    padding: 4,
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: TEAL + '30',
    borderWidth: 2,
    borderColor: TEAL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    fontSize: 20,
  },
  myDripsSection: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  glassCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: TEAL + '30',
  },
  cardContent: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 4,
  },
  bookButton: {
    marginTop: 20,
    borderRadius: 14,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mostRequestedSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  mostRequestedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  mostRequestedSubtitle: {
    fontSize: 14,
    color: '#B3B3B3',
    marginBottom: 20,
  },
  dripCardsContainer: {
    paddingRight: 24,
  },
  dripCard: {
    width: 160,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  dripCardBlur: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: TEAL + '20',
  },
  dripCardContent: {
    padding: 16,
    alignItems: 'center',
  },
  priceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  dripIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: TEAL + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  dripIcon: {
    fontSize: 28,
  },
  dripDesc: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  dripName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  bottomNavBlur: {
    borderRadius: 24,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIconContainerActive: {
    backgroundColor: TEAL + '30',
  },
  navIcon: {
    fontSize: 22,
  },
  navLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  navLabelActive: {
    color: TEAL,
    fontWeight: 'bold',
  },
  activeGlow: {
    position: 'absolute',
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: TEAL,
    shadowColor: TEAL,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
});
