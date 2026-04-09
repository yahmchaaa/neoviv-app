import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';

interface LoadingAnimationProps {
  size?: number;
  color?: string;
}

export default function LoadingAnimation({ size = 60, color = TEAL }: LoadingAnimationProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.8);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // Scale factor for the drop logo parts based on size
  const scaleFactor = size / 60;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Drop Logo */}
      <View style={[styles.dropContainer, { transform: [{ scale: scaleFactor }] }]}>
        {/* Drop Top - Circle */}
        <View style={[styles.dropTop, { backgroundColor: color }]} />
        {/* Drop Bottom - Triangle */}
        <View
          style={[
            styles.dropBottom,
            {
              borderTopColor: color,
              borderLeftWidth: 18 * scaleFactor,
              borderRightWidth: 18 * scaleFactor,
              borderTopWidth: 27 * scaleFactor,
              marginTop: -7 * scaleFactor,
            },
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropTop: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: TEAL,
  },
  dropBottom: {
    width: 0,
    height: 0,
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderTopWidth: 27,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: TEAL,
  },
});
