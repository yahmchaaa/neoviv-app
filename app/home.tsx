import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from '../src/services/auth';
import { router } from 'expo-router';

const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const BLACK = '#0A0A0A';

export default function HomeScreen() {
  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[BLACK, TEAL + '20', BLACK]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.logo}>NEOVIV</Text>
          <Text style={styles.tagline}>drops of life</Text>

          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>🎉 Successfully Logged In!</Text>
            <Text style={styles.statusText}>
              Your account is connected to Supabase.
            </Text>
          </View>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LinearGradient
              colors={[TEAL + '80', ELECTRIC_BLUE + '80']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  welcomeText: {
    fontSize: 18,
    color: '#888',
    marginBottom: 8,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: TEAL,
    letterSpacing: 8,
  },
  tagline: {
    fontSize: 16,
    color: ELECTRIC_BLUE,
    letterSpacing: 4,
    marginTop: 8,
    fontStyle: 'italic',
    marginBottom: 48,
  },
  statusCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: TEAL + '30',
    marginBottom: 32,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  signOutButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
