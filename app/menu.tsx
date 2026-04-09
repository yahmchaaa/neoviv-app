import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

const DRIPS = [
  {
    id: 'restore',
    name: 'Restore',
    price: 199,
    description: 'Essential hydration & wellness reset',
    popular: true,
  },
  {
    id: 'reset',
    name: 'Reset',
    price: 249,
    description: 'Recharge with B-vitamins & amino acids',
    popular: true,
  },
  {
    id: 'recover',
    name: 'Recover',
    price: 279,
    description: 'Post-workout recovery & muscle repair',
    popular: false,
  },
  {
    id: 'recover-plus',
    name: 'Recover+',
    price: 299,
    description: 'Advanced recovery with NAD+ & glutathione',
    popular: true,
  },
  {
    id: 'glow',
    name: 'Glow',
    price: 299,
    description: 'Skin radiance & antioxidant infusion',
    popular: false,
  },
  {
    id: 'myers-restore',
    name: 'Myers Restore',
    price: 329,
    description: 'Classic Myers cocktail formula',
    popular: false,
  },
  {
    id: 'calm',
    name: 'Calm',
    price: 279,
    description: 'Relaxation & stress relief blend',
    popular: false,
  },
  {
    id: 'nad-restore',
    name: 'NAD+ Restore',
    price: 399,
    description: 'Cellular repair & anti-aging powerhouse',
    popular: true,
  },
  {
    id: 'defense',
    name: 'Defense',
    price: 299,
    description: 'Immune support & vitamin C boost',
    popular: false,
  },
];

function AnimatedCard({ item, index, navigation }: { item: typeof DRIPS[0]; index: number; navigation: any }) {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.carouselCard,
        {
          transform: [{ translateX: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Pressable
        style={styles.cardPressable}
        onPress={() => navigation.push({
          pathname: '/book',
          params: {
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
          },
        })}
      >
        {item.popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>MOST POPULAR</Text>
          </View>
        )}
        <Text style={styles.cardPrice}>${item.price}</Text>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <View style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book a Drop</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function MenuCard({ item, index }: { item: typeof DRIPS[0]; index: number }) {
  const slideAnim = useRef(new Animated.Value(80)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: 600 + index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay: 600 + index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.menuCard,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Pressable style={styles.menuCardPressable} onPress={() => {}}>
        <View style={styles.menuCardContent}>
          <View style={styles.menuCardLeft}>
            <Text style={styles.menuCardName}>{item.name}</Text>
            <Text style={styles.menuCardDescription}>{item.description}</Text>
          </View>
          <View style={styles.menuCardRight}>
            <Text style={styles.menuCardPrice}>${item.price}</Text>
            {item.popular && (
              <View style={styles.popularBadgeSmall}>
                <Text style={styles.popularTextSmall}>POPULAR</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function MenuScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;

  const headerSlide = useRef(new Animated.Value(-100)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated Background */}
      <View style={styles.background}>
        <View style={[styles.orb, styles.orb1]} />
        <View style={[styles.orb, styles.orb2]} />
        <View style={[styles.orb, styles.orb3]} />
      </View>

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateX: headerSlide }],
            opacity: headerOpacity,
          },
        ]}
      >
        <Text style={styles.headerTitle}>IV Drop Menu</Text>
        <Pressable style={styles.profileButton}>
          <View style={styles.profileIcon} />
        </Pressable>
      </Animated.View>

      {/* Most Requested Carousel */}
      <View style={styles.carouselSection}>
        <Text style={styles.sectionTitle}>Most Requested</Text>
        <Text style={styles.sectionSubtitle}>Our most booked drops</Text>
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={width * 0.7 + 20}
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {DRIPS.map((item, index) => (
            <AnimatedCard
              key={item.id}
              item={item}
              index={index}
              navigation={router}
            />
          ))}
        </Animated.ScrollView>
        {/* Dot Indicators */}
        <View style={styles.dotContainer}>
          {DRIPS.map((_, index) => {
            const inputRange = [
              (index - 1) * (width * 0.7 + 20),
              index * (width * 0.7 + 20),
              (index + 1) * (width * 0.7 + 20),
            ];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 20, 8],
              extrapolate: 'clamp',
            });
            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity: dotOpacity,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>

      {/* All Drops List */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>All Drops</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.menuList}
        >
          {DRIPS.map((item, index) => (
            <MenuCard key={item.id} item={item} index={index} />
          ))}
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <BlurView intensity={20} tint="dark" style={styles.bottomNav}>
        <View style={styles.navContent}>
          <Pressable style={styles.navItem} onPress={() => router.push('/home')}>
            <View style={styles.navIcon} />
            <Text style={styles.navText}>Home</Text>
          </Pressable>
          <Pressable style={[styles.navItem, styles.navItemActive]}>
            <View style={[styles.navIcon, styles.navIconActive]} />
            <Text style={[styles.navText, styles.navTextActive]}>Menu</Text>
          </Pressable>
          <Pressable style={styles.navItem} onPress={() => router.push('/wellness')}>
            <View style={styles.navIcon} />
            <Text style={styles.navText}>Wellness</Text>
          </Pressable>
          <Pressable style={styles.navItem} onPress={() => router.push('/orders')}>
            <View style={styles.navIcon} />
            <Text style={styles.navText}>Orders</Text>
          </Pressable>
          <Pressable style={styles.navItem} onPress={() => router.push('/account')}>
            <View style={styles.navIcon} />
            <Text style={styles.navText}>Account</Text>
          </Pressable>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
  },
  orb1: {
    width: 300,
    height: 300,
    backgroundColor: '#00B09B',
    top: -100,
    right: -100,
  },
  orb2: {
    width: 200,
    height: 200,
    backgroundColor: '#00D4FF',
    bottom: 200,
    left: -80,
  },
  orb3: {
    width: 150,
    height: 150,
    backgroundColor: '#00B09B',
    bottom: -50,
    right: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#00B09B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00B09B',
  },
  carouselSection: {
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingHorizontal: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#B3B3B3',
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 16,
  },
  carouselContent: {
    paddingHorizontal: 15,
  },
  carouselCard: {
    width: 220,
    marginHorizontal: 10,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#00B09B',
    shadowColor: '#00B09B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  cardPressable: {
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
    padding: 20,
    minHeight: 280,
  },
  popularBadge: {
    backgroundColor: '#00B09B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0A0A0A',
    letterSpacing: 1,
  },
  cardPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#00D4FF',
    marginBottom: 8,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 13,
    color: '#B3B3B3',
    lineHeight: 18,
    marginBottom: 16,
  },
  bookButton: {
    backgroundColor: '#00B09B',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A0A0A',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00B09B',
  },
  menuSection: {
    flex: 1,
    paddingTop: 30,
  },
  menuList: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  menuCard: {
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 176, 155, 0.2)',
    overflow: 'hidden',
  },
  menuCardPressable: {
    backgroundColor: 'rgba(20, 20, 20, 0.7)',
  },
  menuCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  menuCardLeft: {
    flex: 1,
    marginRight: 12,
  },
  menuCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  menuCardDescription: {
    fontSize: 13,
    color: '#B3B3B3',
  },
  menuCardRight: {
    alignItems: 'flex-end',
  },
  menuCardPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00D4FF',
  },
  popularBadgeSmall: {
    backgroundColor: 'rgba(0, 176, 155, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
  },
  popularTextSmall: {
    fontSize: 9,
    fontWeight: '700',
    color: '#00B09B',
    letterSpacing: 0.5,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 30,
    paddingTop: 10,
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  navItemActive: {
    transform: [{ scale: 1.05 }],
  },
  navIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#444',
    marginBottom: 4,
  },
  navIconActive: {
    backgroundColor: '#00B09B',
    shadowColor: '#00B09B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  navText: {
    fontSize: 11,
    color: '#B3B3B3',
  },
  navTextActive: {
    color: '#00B09B',
    fontWeight: '600',
  },
});

