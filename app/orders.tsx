import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const STATUSES = [
  { id: 'requested', label: 'Requested', icon: '📝' },
  { id: 'confirmed', label: 'Confirmed', icon: '✅' },
  { id: 'en_route', label: 'En Route', icon: '🚗' },
  { id: 'arrived', label: 'Arrived', icon: '🏥' },
];

const CURRENT_STATUS = 'en_route'; // This would come from the API in real app

const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    dripName: 'Reset',
    dripPrice: 249,
    clinicianName: 'Dr. Sarah Mitchell',
    eta: 25,
    status: 'en_route',
    date: 'Today',
    location: 'Home',
  },
];

function StatusStep({ status, index, isActive, isCompleted }: { status: typeof STATUSES[0]; index: number; isActive: boolean; isCompleted: boolean }) {
  return (
    <View style={styles.statusStep}>
      <View
        style={[
          styles.statusIconContainer,
          isActive && styles.statusIconContainerActive,
          isCompleted && styles.statusIconContainerCompleted,
        ]}
      >
        <Text style={styles.statusIcon}>{status.icon}</Text>
      </View>
      <Text
        style={[
          styles.statusLabel,
          isActive && styles.statusLabelActive,
          isCompleted && styles.statusLabelCompleted,
        ]}
      >
        {status.label}
      </Text>
      {index < STATUSES.length - 1 && (
        <View
          style={[
            styles.statusLine,
            isCompleted && styles.statusLineCompleted,
          ]}
        />
      )}
    </View>
  );
}

function ActiveOrderCard({ order }: { order: typeof MOCK_ORDERS[0] }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.activeOrderCard}>
      <BlurView intensity={20} tint="dark" style={styles.activeOrderBlur}>
        <View style={styles.activeOrderHeader}>
          <View style={styles.liveIndicator}>
            <Animated.View style={[styles.liveDot, { transform: [{ scale: pulseAnim }] }]} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <Text style={styles.orderId}>{order.id}</Text>
        </View>

        <View style={styles.activeOrderContent}>
          <View style={styles.dripInfo}>
            <Text style={styles.dripName}>{order.dripName}</Text>
            <Text style={styles.dripPrice}>${order.dripPrice}</Text>
          </View>
          <View style={styles.etaContainer}>
            <Text style={styles.etaLabel}>Arriving in</Text>
            <Text style={styles.etaValue}>{order.eta}</Text>
            <Text style={styles.etaUnit}>min</Text>
          </View>
        </View>

        <View style={styles.clinicianRow}>
          <View style={styles.clinicianAvatar}>
            <Text style={styles.clinicianAvatarText}>👨‍⚕️</Text>
          </View>
          <View style={styles.clinicianInfo}>
            <Text style={styles.clinicianName}>{order.clinicianName}</Text>
            <Text style={styles.clinicianSubtext}>Your clinician</Text>
          </View>
          <Pressable style={styles.messageButton}>
            <Text style={styles.messageButtonText}>💬</Text>
          </Pressable>
        </View>
      </BlurView>
    </View>
  );
}

function PastOrderCard({ order }: { order: { id: string; dripName: string; dripPrice: number; date: string; status: string } }) {
  return (
    <View style={styles.pastOrderCard}>
      <Pressable style={styles.pastOrderPressable}>
        <View style={styles.pastOrderContent}>
          <View style={styles.pastOrderLeft}>
            <Text style={styles.pastOrderName}>{order.dripName}</Text>
            <Text style={styles.pastOrderDate}>{order.date}</Text>
          </View>
          <View style={styles.pastOrderRight}>
            <Text style={styles.pastOrderPrice}>${order.dripPrice}</Text>
            <View style={[styles.statusBadge, styles[`statusBadge_${order.status}` as keyof typeof styles]]}>
              <Text style={styles.statusBadgeText}>{order.status}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

export default function OrdersScreen() {
  const router = useRouter();
  const [activeStatus, setActiveStatus] = useState('en_route');

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

  const getStatusIndex = (status: string) => {
    return STATUSES.findIndex((s) => s.id === status);
  };

  const currentIndex = getStatusIndex(activeStatus);

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
        <Text style={styles.headerTitle}>Orders</Text>
        <Pressable style={styles.profileButton}>
          <View style={styles.profileIcon} />
        </Pressable>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status Tracker */}
        <View style={styles.statusTracker}>
          <View style={styles.statusRow}>
            {STATUSES.map((status, index) => {
              const isCompleted = index < currentIndex;
              const isActive = index === currentIndex;
              return (
                <StatusStep
                  key={status.id}
                  status={status}
                  index={index}
                  isActive={isActive}
                  isCompleted={isCompleted}
                />
              );
            })}
          </View>
        </View>

        {/* Active Order */}
        <View style={styles.activeOrderSection}>
          <Text style={styles.sectionTitle}>Active Order</Text>
          <ActiveOrderCard order={MOCK_ORDERS[0]} />
        </View>

        {/* Past Orders */}
        <View style={styles.pastOrdersSection}>
          <Text style={styles.sectionTitle}>Past Orders</Text>
          <PastOrderCard
            order={{
              id: 'ORD-000',
              dripName: 'Hydration Basics',
              dripPrice: 199,
              date: 'Mar 15, 2026',
              status: 'completed',
            }}
          />
          <PastOrderCard
            order={{
              id: 'ORD-000',
              dripName: 'NAD+ Restore',
              dripPrice: 399,
              date: 'Mar 10, 2026',
              status: 'completed',
            }}
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BlurView intensity={20} tint="dark" style={styles.bottomNav}>
        <View style={styles.navContent}>
          <Pressable style={styles.navItem} onPress={() => router.push('/home')}>
            <View style={styles.navIcon} />
            <Text style={styles.navText}>Home</Text>
          </Pressable>
          <Pressable style={styles.navItem} onPress={() => router.push('/menu')}>
            <View style={styles.navIcon} />
            <Text style={styles.navText}>Menu</Text>
          </Pressable>
          <Pressable style={styles.navItem} onPress={() => router.push('/wellness')}>
            <View style={styles.navIcon} />
            <Text style={styles.navText}>Wellness</Text>
          </Pressable>
          <Pressable style={[styles.navItem, styles.navItemActive]}>
            <View style={[styles.navIcon, styles.navIconActive]} />
            <Text style={[styles.navText, styles.navTextActive]}>Orders</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
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
  statusTracker: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusStep: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  statusIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 8,
  },
  statusIconContainerActive: {
    backgroundColor: 'rgba(0, 176, 155, 0.2)',
    borderColor: '#00B09B',
    shadowColor: '#00B09B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  statusIconContainerCompleted: {
    backgroundColor: '#00B09B',
    borderColor: '#00B09B',
  },
  statusIcon: {
    fontSize: 20,
  },
  statusLabel: {
    fontSize: 11,
    color: '#B3B3B3',
    textAlign: 'center',
  },
  statusLabelActive: {
    color: '#00B09B',
    fontWeight: '600',
  },
  statusLabelCompleted: {
    color: '#00B09B',
  },
  statusLine: {
    position: 'absolute',
    top: 22,
    left: '60%',
    right: '-40%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusLineCompleted: {
    backgroundColor: '#00B09B',
  },
  activeOrderSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  activeOrderCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 176, 155, 0.3)',
  },
  activeOrderBlur: {
    padding: 20,
  },
  activeOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    marginRight: 6,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  orderId: {
    fontSize: 12,
    color: '#B3B3B3',
  },
  activeOrderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dripInfo: {
    flex: 1,
  },
  dripName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dripPrice: {
    fontSize: 14,
    color: '#00D4FF',
    fontWeight: '600',
  },
  etaContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 176, 155, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  etaLabel: {
    fontSize: 11,
    color: '#B3B3B3',
    marginBottom: 2,
  },
  etaValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#00B09B',
  },
  etaUnit: {
    fontSize: 12,
    color: '#B3B3B3',
  },
  clinicianRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 12,
  },
  clinicianAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 176, 155, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clinicianAvatarText: {
    fontSize: 22,
  },
  clinicianInfo: {
    flex: 1,
    marginLeft: 12,
  },
  clinicianName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  clinicianSubtext: {
    fontSize: 12,
    color: '#B3B3B3',
    marginTop: 2,
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 176, 155, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageButtonText: {
    fontSize: 20,
  },
  pastOrdersSection: {
    paddingHorizontal: 20,
  },
  pastOrderCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
    overflow: 'hidden',
  },
  pastOrderPressable: {
    backgroundColor: 'rgba(20, 20, 20, 0.7)',
  },
  pastOrderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  pastOrderLeft: {
    flex: 1,
  },
  pastOrderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  pastOrderDate: {
    fontSize: 12,
    color: '#B3B3B3',
  },
  pastOrderRight: {
    alignItems: 'flex-end',
  },
  pastOrderPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00D4FF',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadge_completed: {
    backgroundColor: 'rgba(0, 176, 155, 0.2)',
  },
  statusBadge_cancelled: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#00B09B',
    textTransform: 'uppercase',
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
