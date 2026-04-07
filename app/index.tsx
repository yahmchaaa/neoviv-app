import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');
const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const BLACK = '#0A0A0A';

export default function SplashScreen() {
  // Animation values
  const logoScale = useSharedValue(0.8);
  const logoRotate = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const dropOpacity = useSharedValue(1);
  const lightBeamOpacity = useSharedValue(0);
  const gridOpacity = useSharedValue(0.3);
  
  // Orb animations
  const orb1Y = useSharedValue(0);
  const orb1X = useSharedValue(0);
  const orb2Y = useSharedValue(0);
  const orb2X = useSharedValue(0);
  const orb3Y = useSharedValue(0);
  const orb3X = useSharedValue(0);
  const orb4Y = useSharedValue(0);
  const orb4X = useSharedValue(0);

  useEffect(() => {
    // Logo pulse and rotate animation
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    logoRotate.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );

    // Tagline fade in
    taglineOpacity.value = withDelay(500, withTiming(1, { duration: 1000 }));

    // Light beam sweep
    lightBeamOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Grid pulse
    gridOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.2, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

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

    orb4Y.value = withRepeat(
      withSequence(
        withTiming(25, { duration: 4500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-25, { duration: 4500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    orb4X.value = withRepeat(
      withSequence(
        withTiming(-35, { duration: 5500, easing: Easing.inOut(Easing.ease) }),
        withTiming(35, { duration: 5500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Navigate to login after 2.5 seconds
    const timer = setTimeout(() => {
      dropOpacity.value = withTiming(0, { duration: 500 });
      taglineOpacity.value = withTiming(0, { duration: 500 }, () => {
        runOnJS(router.replace)('/login');
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
    opacity: dropOpacity.value,
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const orb1Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: orb1Y.value },
      { translateX: orb1X.value },
    ],
  }));

  const orb2Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: orb2Y.value },
      { translateX: orb2X.value },
    ],
  }));

  const orb3Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: orb3Y.value },
      { translateX: orb3X.value },
    ],
  }));

  const orb4Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: orb4Y.value },
      { translateX: orb4X.value },
    ],
  }));

  const lightBeamStyle = useAnimatedStyle(() => ({
    opacity: lightBeamOpacity.value,
  }));

  const gridStyle = useAnimatedStyle(() => ({
    opacity: gridOpacity.value,
  }));

  // Grid lines
  const gridLines = [];
  const gridSpacing = 60;
  for (let i = 0; i < width / gridSpacing + 1; i++) {
    gridLines.push(
      <View
        key={`v-${i}`}
        style={[
          styles.gridLineVertical,
          { left: i * gridSpacing },
        ]}
      />
    );
  }
  for (let i = 0; i < height / gridSpacing + 1; i++) {
    gridLines.push(
      <View
        key={`h-${i}`}
        style={[
          styles.gridLineHorizontal,
          { top: i * gridSpacing },
        ]}
      />
    );
  }

  // Hexagons
  const hexagons = [];
  const hexPositions = [
    { x: 50, y: 100, size: 40, delay: 0 },
    { x: width - 80, y: 150, size: 30, delay: 500 },
    { x: 100, y: height - 200, size: 35, delay: 1000 },
    { x: width - 60, y: height - 150, size: 25, delay: 1500 },
    { x: width / 2 - 150, y: 80, size: 20, delay: 2000 },
    { x: width / 2 + 120, y: height - 100, size: 28, delay: 2500 },
  ];

  return (
    <View style={styles.container}>
      {/* Grid Background */}
      <Animated.View style={[styles.gridContainer, gridStyle]}>
        {gridLines}
      </Animated.View>

      {/* Hexagons */}
      {hexPositions.map((hex, index) => (
        <View
          key={index}
          style={[
            styles.hexagon,
            {
              left: hex.x,
              top: hex.y,
              width: hex.size,
              height: hex.size,
              borderColor: TEAL + '40',
            },
          ]}
        />
      ))}

      {/* Floating Orbs */}
      <Animated.View style={[styles.orb, styles.orb1, orb1Style]}>
        <LinearGradient
          colors={[TEAL + '60', ELECTRIC_BLUE + '30']}
          style={styles.orbGradient}
        />
      </Animated.View>

      <Animated.View style={[styles.orb, styles.orb2, orb2Style]}>
        <LinearGradient
          colors={[ELECTRIC_BLUE + '50', TEAL + '30']}
          style={styles.orbGradient}
        />
      </Animated.View>

      <Animated.View style={[styles.orb, styles.orb3, orb3Style]}>
        <LinearGradient
          colors={[TEAL + '50', ELECTRIC_BLUE + '20']}
          style={styles.orbGradient}
        />
      </Animated.View>

      <Animated.View style={[styles.orb, styles.orb4, orb4Style]}>
        <LinearGradient
          colors={[ELECTRIC_BLUE + '40', TEAL + '25']}
          style={styles.orbGradient}
        />
      </Animated.View>

      {/* Light Beam Sweep */}
      <Animated.View style={[styles.lightBeam, lightBeamStyle]}>
        <LinearGradient
          colors={['transparent', TEAL + '30', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.lightBeamGradient}
        />
      </Animated.View>

      {/* Logo Container */}
      <View style={styles.logoContainer}>
        <Animated.View style={[styles.logoWrapper, logoAnimatedStyle]}>
          {/* Drop Logo */}
          <View style={styles.dropLogo}>
            <View style={styles.dropTop} />
            <View style={styles.dropBottom} />
          </View>
        </Animated.View>

        {/* NEOVIV Text */}
        <Text style={styles.logoText}>neoviv</Text>

        {/* Tagline */}
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
    backgroundColor: BLACK,
    overflow: 'hidden',
  },
  gridContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLineVertical: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: TEAL + '20',
  },
  gridLineHorizontal: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: TEAL + '20',
  },
  hexagon: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
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
    width: 200,
    height: 200,
    top: -50,
    left: -50,
  },
  orb2: {
    width: 180,
    height: 180,
    bottom: 100,
    right: -60,
  },
  orb3: {
    width: 150,
    height: 150,
    top: height / 2,
    left: -40,
  },
  orb4: {
    width: 120,
    height: 120,
    top: 150,
    right: -30,
  },
  lightBeam: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
    left: '50%',
    marginLeft: -50,
  },
  lightBeamGradient: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    marginBottom: 20,
  },
  dropLogo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropTop: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: TEAL,
    marginBottom: -15,
  },
  dropBottom: {
    width: 0,
    height: 0,
    borderLeftWidth: 35,
    borderRightWidth: 35,
    borderTopWidth: 50,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: TEAL,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: TEAL,
    letterSpacing: 12,
    marginTop: 10,
  },
  tagline: {
    fontSize: 18,
    color: ELECTRIC_BLUE,
    letterSpacing: 6,
    marginTop: 15,
    fontStyle: 'italic',
  },
});
