import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

const TEAL = '#00B09B';
const ELECTRIC_BLUE = '#00D4FF';
const BLACK = '#0A0A0A';

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

export default function LoadingModal({ visible, message = 'Loading...' }: LoadingModalProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.8);

  React.useEffect(() => {
    if (visible) {
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
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <BlurView intensity={30} tint="dark" style={styles.blur}>
          <Animated.View style={[styles.content, animatedStyle]}>
            {/* Teal Drop Logo */}
            <View style={styles.dropContainer}>
              <View style={styles.dropTop} />
              <View style={styles.dropBottom} />
            </View>
            <Text style={styles.message}>{message}</Text>
          </Animated.View>
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  blur: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: TEAL + '40',
  },
  content: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  dropContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dropTop: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: TEAL,
  },
  dropBottom: {
    width: 0,
    height: 0,
    borderLeftWidth: 24,
    borderRightWidth: 24,
    borderTopWidth: 36,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: TEAL,
    marginTop: -12,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
  },
});
