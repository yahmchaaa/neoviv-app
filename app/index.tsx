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
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { getCurrentUser } from '../src/services/auth';

const { width, height } = Dimensions.get('window');
const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const BLACK = '#0A0A0A';

// Animated tube nodes and connections
const TUBE_NODES = [
  { x: width * 0.2, y: height * 0.3, delay: 0 },
  { x: width * 0.4, y: height * 0.25, delay: 200 },
  { x: width * 0.6, y: height * 0.3, delay: 400 },
  { x: width * 0.8, y: height * 0.25, delay: 600 },
  { x: width * 0.3, y: height * 0.5, delay: 800 },
  { x: width * 0.5, y: height * 0.55, delay: 1000 },
  { x: width * 0.7, y: height * 0.5, delay: 1200 },
  { x: width * 0.4, y: height * 0.75, delay: 1400 },
  { x: width * 0.6, y: height * 0.75, delay: 1600 },
];

const TUBE_CONNECTIONS = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 4, to: 5 },
  { from: 5, to: 6 },
  { from: 4, to: 7 },
  { from: 5, to: 7 },
  { from: 6, to: 8 },
  { from: 7, to: 8 },
];

export default function SplashScreen() {
  // Animation values
  const taglineOpacity = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);

  // Tube animations
  const tubeOpacities = TUBE_NODES.map((_, index) => {
    const opacity = useSharedValue(0);
    return opacity;
  });

  useEffect(() => {
    // Logo animation
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withSequence(
      withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      withTiming(0.95, { duration: 1500, easing: Easing.inOut(Easing.ease) })
    );

    // Tagline fade in after logo
    taglineOpacity.value = withDelay(500, withTiming(1, { duration: 1000 }));

    // Tube pattern animation - sequential lighting up
    TUBE_NODES.forEach((node, index) => {
      setTimeout(() => {
        tubeOpacities[index].value = withRepeat(
          withSequence(
            withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
      }, node.delay);
    });

    // Auth check after 2.5 seconds
    const timer = setTimeout(async () => {
      // Fade out
      logoOpacity.value = withTiming(0, { duration: 300 });
      taglineOpacity.value = withTiming(0, { duration: 300 });

      // Check auth and navigate
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

  const tubeNodeStyles = tubeOpacities.map((opacity, index) => {
    const style = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));
    return style;
  });

  return (
    <View style={styles.container}>
      {/* Animated Tube Pattern Background */}
      <View style={styles.tubeContainer}>
        {/* Connection Lines */}
        {TUBE_CONNECTIONS.map((connection, index) => (
          <View
            key={`connection-${index}`}
            style={[
              styles.connectionLine,
              {
                left: TUBE_NODES[connection.from].x,
                top: TUBE_NODES[connection.from].y,
                width: Math.sqrt(
                  Math.pow(
                    TUBE_NODES[connection.to].x - TUBE_NODES[connection.from].x,
                    2
                  ) +
                    Math.pow(
                      TUBE_NODES[connection.to].y - TUBE_NODES[connection.from].y,
                      2
                    )
                ),
                transform: [
                  {
                    rotate: `${Math.atan2(
                      TUBE_NODES[connection.to].y - TUBE_NODES[connection.from].y,
                      TUBE_NODES[connection.to].x - TUBE_NODES[connection.from].x
                    )}rad`,
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={[TEAL + '60', ELECTRIC_BLUE + '60', TEAL + '60']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        ))}

        {/* Tube Nodes */}
        {TUBE_NODES.map((node, index) => (
          <Animated.View
            key={`node-${index}`}
            style={[
              styles.tubeNode,
              { left: node.x - 8, top: node.y - 8 },
              tubeNodeStyles[index],
            ]}
          >
            <View style={styles.nodeInner}>
              <View style={styles.nodeCore} />
            </View>
          </Animated.View>
        ))}
      </View>

      {/* Logo Container */}
      <View style={styles.logoContainer}>
        {/* NEOVIV Logo */}
        <Animated.View style={[styles.logoWrapper, logoAnimatedStyle]}>
          {/* Drop Logo */}
          <View style={styles.dropLogo}>
            <View style={styles.dropTop} />
            <View style={styles.dropBottom} />
          </View>
        </Animated.View>

        {/* NEOVIV Text */}
        <Text style={styles.logoText}>NEOVIV</Text>

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
  },
  tubeContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  connectionLine: {
    position: 'absolute',
    height: 3,
    borderRadius: 2,
    transformOrigin: 'left center',
    overflow: 'hidden',
  },
  tubeNode: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: TEAL + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: TEAL + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeCore: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: TEAL,
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
  dropTop: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: TEAL,
    marginBottom: -12,
  },
  dropBottom: {
    width: 0,
    height: 0,
    borderLeftWidth: 30,
    borderRightWidth: 30,
    borderTopWidth: 45,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: TEAL,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: TEAL,
    letterSpacing: 12,
    marginTop: 16,
  },
  tagline: {
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 6,
    marginTop: 16,
    fontStyle: 'italic',
  },
});
