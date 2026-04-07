import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';

const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const BLACK = '#0A0A0A';

const DRIPS = [
  { id: '1', name: 'Hydration Basics', price: 199, desc: 'Essential fluids & electrolytes' },
  { id: '2', name: 'Energy Boost', price: 249, desc: 'B-Complex, B12 & amino acids' },
  { id: '3', name: 'Immunity Shield', price: 299, desc: 'Vitamin C, Zinc & Glutathione' },
  { id: '4', name: 'NAD+', price: 399, desc: 'Cellular repair & anti-aging' },
];

const NAV_ITEMS = [
  { icon: '🏠', label: 'Home', route: '/home' },
  { icon: '💧', label: 'Menu', active: true, route: '/menu' },
  { icon: '☀️', label: 'Wellness', route: '/wellness' },
  { icon: '📋', label: 'Orders', route: '/orders' },
  { icon: '👤', label: 'Account', route: '/account' },
];

export default function MenuScreen() {
  const handleNavPress = (route: string) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>IV Drip Menu</Text>
          <Text style={styles.subtitle}>Choose your treatment</Text>
        </View>

        <View style={styles.dripList}>
          {DRIPS.map((drip) => (
            <TouchableOpacity key={drip.id} style={styles.dripCard}>
              <BlurView intensity={15} tint="dark" style={styles.dripCardBlur}>
                <LinearGradient
                  colors={[TEAL + '20', ELECTRIC_BLUE + '10']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.dripGradient}
                >
                  <View style={styles.dripIcon}>
                    <Text style={styles.dripIconText}>💧</Text>
                  </View>
                  <View style={styles.dripContent}>
                    <Text style={styles.dripName}>{drip.name}</Text>
                    <Text style={styles.dripDesc}>{drip.desc}</Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.dripPrice}>${drip.price}</Text>
                  </View>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

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
                <Text style={[styles.navLabel, item.active && styles.navLabelActive]}>
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
    backgroundColor: BLACK,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#B3B3B3',
    marginTop: 4,
  },
  dripList: {
    paddingHorizontal: 24,
  },
  dripCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  dripCardBlur: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: TEAL + '20',
  },
  dripGradient: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  dripIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: TEAL + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dripIconText: {
    fontSize: 28,
  },
  dripContent: {
    flex: 1,
    marginLeft: 16,
  },
  dripName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  dripDesc: {
    fontSize: 12,
    color: '#B3B3B3',
    marginTop: 4,
  },
  priceContainer: {
    backgroundColor: TEAL + '30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  dripPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TEAL,
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
});
