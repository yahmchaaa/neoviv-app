import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { signOut } from '../src/services/auth';

const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const BLACK = '#0A0A0A';

const NAV_ITEMS = [
  { icon: '🏠', label: 'Home', route: '/home' },
  { icon: '💧', label: 'Menu', route: '/menu' },
  { icon: '☀️', label: 'Wellness', route: '/wellness' },
  { icon: '📋', label: 'Orders', route: '/orders' },
  { icon: '👤', label: 'Account', active: true, route: '/account' },
];

export default function AccountScreen() {
  const handleNavPress = (route: string) => {
    router.push(route);
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Account</Text>
          <Text style={styles.subtitle}>Manage your profile</Text>
        </View>

        <View style={styles.profileSection}>
          <BlurView intensity={15} tint="dark" style={styles.profileCard}>
            <View style={styles.profileContent}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>👤</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Guest User</Text>
                <Text style={styles.profileEmail}>user@example.com</Text>
              </View>
            </View>
          </BlurView>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <BlurView intensity={10} tint="dark" style={styles.menuItemBlur}>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemIcon}>⚙️</Text>
                <Text style={styles.menuItemText}>Settings</Text>
              </View>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <BlurView intensity={10} tint="dark" style={styles.menuItemBlur}>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemIcon}>📍</Text>
                <Text style={styles.menuItemText}>Addresses</Text>
              </View>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <BlurView intensity={10} tint="dark" style={styles.menuItemBlur}>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemIcon}>💳</Text>
                <Text style={styles.menuItemText}>Payment Methods</Text>
              </View>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <BlurView intensity={10} tint="dark" style={styles.menuItemBlur}>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemIcon}>🔔</Text>
                <Text style={styles.menuItemText}>Notifications</Text>
              </View>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <BlurView intensity={10} tint="dark" style={styles.menuItemBlur}>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemIcon}>❓</Text>
                <Text style={styles.menuItemText}>Help & Support</Text>
              </View>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
            <BlurView intensity={10} tint="dark" style={styles.menuItemBlur}>
              <View style={styles.menuItemContent}>
                <Text style={[styles.menuItemIcon, { color: '#FF6B6B' }]}>🚪</Text>
                <Text style={[styles.menuItemText, { color: '#FF6B6B' }]}>Sign Out</Text>
              </View>
            </BlurView>
          </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#B3B3B3',
    marginTop: 4,
  },
  profileSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  profileCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: TEAL + '33',
  },
  profileContent: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: TEAL + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileEmail: {
    fontSize: 14,
    color: '#B3B3B3',
    marginTop: 4,
  },
  menuSection: {
    paddingHorizontal: 24,
  },
  menuItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItemBlur: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: TEAL + '10',
  },
  menuItemContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#fff',
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
    borderColor: TEAL + '33',
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
    color: '#B3B3B3',
    marginTop: 4,
  },
  navLabelActive: {
    color: TEAL,
    fontWeight: 'bold',
  },
});

