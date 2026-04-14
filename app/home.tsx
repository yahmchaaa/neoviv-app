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
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  useAnimatedRef,
} from 'react-native-reanimated';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const TEAL = '#2D8A7D';
const NAVY = '#131B2A';
const MINT_GREEN = '#34A853';
const LIGHT_MINT = '#F5F9F9';
const TEXT_SECONDARY = '#54837F';
const WHITE = '#FFFFFF';

// All 12 correct drips from neoviv.life
const DRIPS = [
  { id: '1', name: "Myers' Cocktail", price: 249, duration: '45-60 min', desc: 'The classic revival' },
  { id: '2', name: 'Immunity Boost', price: 199, duration: '45 min', desc: 'Fortress mode' },
  { id: '3', name: 'Hydration', price: 149, duration: '30-45 min', desc: 'Pure cellular refresh' },
  { id: '4', name: 'Energy & Vitality', price: 179, duration: '45 min', desc: 'Power up' },
  { id: '5', name: 'NAD+', price: 599, duration: '2-4 hrs', desc: 'Cellular longevity' },
  { id: '6', name: 'Glutathione', price: 149, duration: '30 min', desc: 'Master antioxidant' },
  { id: '7', name: 'Beauty Glow', price: 189, duration: '45 min', desc: 'Radiance from within' },
  { id: '8', name: 'Recovery', price: 229, duration: '45-60 min', desc: 'Bounce back faster' },
  { id: '9', name: 'Hangover Relief', price: 199, duration: '45 min', desc: 'Back to life — fast' },
  { id: '10', name: 'Weight Loss', price: 229, duration: '45 min', desc: 'Ignite your metabolism' },
  { id: '11', name: 'Anti-Aging', price: 299, duration: '60-90 min', desc: 'Turn back the clock' },
  { id: '12', name: 'Migraine Relief', price: 249, duration: '30-45 min', desc: 'Relief in 20 minutes' },
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

  useEffect(() => {
    // Animation setup
  }, []);

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
          router.push({
            pathname: '/book',
            params: {
              id: item.id,
              name: item.name,
              price: item.price,
              description: item.desc,
            },
          });
        }}
      >
        <View style={[styles.dripCard, isActive && styles.dripCardActive]}>
          <BlurView intensity={isActive ? 25 : 15} tint="light" style={styles.dripCardBlur}>
            <View style={styles.dripContent}>
              <View style={styles.dripHeader}>
                <Text style={styles.dripDuration}>{item.duration}</Text>
              </View>

              <View style={styles.dripIconContainer}>
                <Text style={styles.dripIcon}>💧</Text>
              </View>

              <Text style={styles.dripName}>{item.name}</Text>
              <Text style={styles.dripDesc}>{item.desc}</Text>

              <View style={styles.dripFooter}>
                <Text style={styles.dripPrice}>${item.price}</Text>
              </View>
            </View>
          </BlurView>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose Your Drip</Text>
        <Text style={styles.headerSubtitle}>Select the IV infusion that fits your needs</Text>
      </View>

      {/* Drip Carousel */}
      <Animated.FlatList
        ref={scrollRef}
        data={DRIPS}
        renderItem={renderDripCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContent}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {DRIPS.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === activeIndex && styles.dotActive]}
          />
        ))}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {NAV_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.navItem}
            onPress={() => handleNavPress(item.route)}
          >
            <Text style={[styles.navIcon, item.active && styles.navIconActive]}>
              {item.icon}
            </Text>
            <Text style={[styles.navLabel, item.active && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_MINT,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: NAVY,
    marginBottom: 8,
    fontFamily: 'Playfair Display',
  },
  headerSubtitle: {
    fontSize: 16,
    color: TEXT_SECONDARY,
  },
  carouselContent: {
    paddingHorizontal: (width - CARD_WIDTH) / 2,
    paddingVertical: 20,
  },
  dripCard: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_SPACING / 2,
    borderRadius: 20,
    backgroundColor: WHITE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  dripCardActive: {
    transform: [{ scale: 1.05 }],
    shadowOpacity: 0.2,
  },
  dripCardBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  dripContent: {
    padding: 24,
    minHeight: 280,
  },
  dripHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  dripDuration: {
    fontSize: 12,
    fontWeight: '600',
    color: TEAL,
    backgroundColor: 'rgba(45, 138, 125, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dripIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dripIcon: {
    fontSize: 48,
  },
  dripName: {
    fontSize: 22,
    fontWeight: '700',
    color: NAVY,
    textAlign: 'center',
    marginBottom: 8,
  },
  dripDesc: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  dripFooter: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  dripPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: TEAL,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(45, 138, 125, 0.2)',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: TEAL,
    width: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: 'rgba(45, 138, 125, 0.1)',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.5,
  },
  navIconActive: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  navLabelActive: {
    color: TEAL,
    fontWeight: '600',
  },
});
