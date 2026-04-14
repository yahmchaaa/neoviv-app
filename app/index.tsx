import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { getCurrentUser } from '../src/services/auth';

const { width, height } = Dimensions.get('window');
const TEAL = '#2D8A7D';
const MINT = '#34A853';
const LIGHT_MINT = '#F5F9F9';
const NAVY = '#131B2A';

export default function SplashScreen() {
  const taglineOpacity = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withSequence(
      withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      withTiming(0.95, { duration: 1500, easing: Easing.inOut(Easing.ease) })
    );

    taglineOpacity.value = withDelay(500, withTiming(1, { duration: 1000 }));

    const timer = setTimeout(async () => {
      logoOpacity.value = withTiming(0, { duration: 300 });
      taglineOpacity.value = withTiming(0, { duration: 300 });

      const user = await getCurrentUser();
      if (user) {
        runOnJS(router.replace)('/home');
      } else {
        runOnJS(router.replace)('/login');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      <View style={styles.logoContainer}>
        <Animated.View style={[styles.logoWrapper, logoAnimatedStyle]}>
          <View style={styles.dropLogo}>
            <View style={styles.drop} />
          </View>
        </Animated.View>

        <Text style={styles.logoText}>NEOVIV</Text>

        <Animated.Text style={[styles.tagline, taglineAnimatedStyle]}>
          drops of life
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_MINT,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(45, 138, 125, 0.05)',
  },
  circle1: {
    width: 400,
    height: 400,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 300,
    height: 300,
    bottom: 100,
    left: -150,
  },
  circle3: {
    width: 250,
    height: 250,
    top: 300,
    right: -50,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    marginBottom: 16,
  },
  dropLogo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  drop: {
    width: 60,
    height: 80,
    borderRadius: 30,
    backgroundColor: TEAL,
    borderBottomLeftRadius: 0,
    transform: [{ rotate: '45deg' }],
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: NAVY,
    letterSpacing: 8,
    marginTop: 16,
    fontFamily: 'Playfair Display',
  },
  tagline: {
    fontSize: 18,
    color: '#54837F',
    letterSpacing: 4,
    marginTop: 16,
    fontStyle: 'italic',
  },
});
