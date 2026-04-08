import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Notification types
export type NotificationType =
  | 'booking_confirmed'
  | 'clinician_on_the_way'
  | 'clinician_arrived'
  | 'appointment_reminder'
  | 'visit_complete';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
}

// Get notification content based on type
export const getNotificationContent = (type: NotificationType, data?: any): NotificationPayload => {
  switch (type) {
    case 'booking_confirmed':
      return {
        title: '✅ Booking Confirmed!',
        body: `Your visit has been booked for ${data?.location || 'your location'}. A clinician will arrive within 60-120 minutes.`,
        data: { type: 'booking_confirmed', orderId: data?.orderId },
      };
    case 'clinician_on_the_way':
      return {
        title: '🚗 Clinician On The Way!',
        body: `${data?.clinicianName || 'Your clinician'} is on the way to your location. ETA: ${data?.eta || '15-20'} minutes.`,
        data: { type: 'clinician_on_the_way', orderId: data?.orderId, eta: data?.eta },
      };
    case 'clinician_arrived':
      return {
        title: '👨‍⚕️ Clinician Has Arrived!',
        body: `${data?.clinicianName || 'Your clinician'} has arrived at your location. Get ready for your treatment!`,
        data: { type: 'clinician_arrived', orderId: data?.orderId },
      };
    case 'appointment_reminder':
      return {
        title: '⏰ Appointment Reminder',
        body: `Your scheduled visit is in 1 hour at ${data?.location || 'your location'}. Make sure you're ready!`,
        data: { type: 'appointment_reminder', orderId: data?.orderId },
      };
    case 'visit_complete':
      return {
        title: '✨ Visit Complete!',
        body: `Your IV therapy session is complete. We hope you're feeling refreshed! Rate your experience in the app.`,
        data: { type: 'visit_complete', orderId: data?.orderId },
      };
    default:
      return {
        title: 'NEOVIV',
        body: 'You have a new notification',
        data: { type },
      };
  }
};

// Request notification permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permission for push notifications not granted');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('neoviv', {
      name: 'NEOVIV Notifications',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#00B09B',
      sound: 'default',
    });
  }

  return true;
};

// Send local notification
export const sendLocalNotification = async (
  type: NotificationType,
  data?: any
): Promise<void> => {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  const content = getNotificationContent(type, data);

  await Notifications.scheduleNotificationAsync({
    content,
    trigger: null, // Send immediately
  });
};

// Schedule a notification for a specific time
export const scheduleNotification = async (
  type: NotificationType,
  triggerTime: Date,
  data?: any
): Promise<string | null> => {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return null;

  const content = getNotificationContent(type, data);

  const identifier = await Notifications.scheduleNotificationAsync({
    content,
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerTime,
    },
  });

  return identifier;
};

// Cancel a scheduled notification
export const cancelScheduledNotification = async (identifier: string): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync(identifier);
};

// Cancel all scheduled notifications
export const cancelAllScheduledNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

// Get push token for sending remote notifications
export const getPushToken = async (): Promise<string | null> => {
  try {
    if (!Device.isDevice) return null;

    await requestNotificationPermissions();

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PROJECT_ID,
    });

    return tokenData.data;
  } catch (error) {
    console.log('Error getting push token:', error);
    return null;
  }
};

// Add notification listener
export const addNotificationReceivedListener = (
  callback: (notification: Notifications.Notification) => void
): Notifications.EventSubscription => {
  return Notifications.addNotificationReceivedListener(callback);
};

// Add notification response listener
export const addNotificationResponseListener = (
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.EventSubscription => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

// Handle notification response (when user taps on notification)
export const handleNotificationResponse = (
  response: Notifications.NotificationResponse
): void => {
  const data = response.notification.request.content.data;

  switch (data?.type) {
    case 'booking_confirmed':
      router.push('/orders');
      break;
    case 'clinician_on_the_way':
    case 'clinician_arrived':
      router.push('/confirmation');
      break;
    case 'appointment_reminder':
      router.push('/confirmation');
      break;
    case 'visit_complete':
      router.push('/home');
      break;
    default:
      router.push('/home');
      break;
  }
};

// Schedule appointment reminder (1 hour before)
export const scheduleAppointmentReminder = async (orderId: string, scheduledTime: Date): Promise<string | null> => {
  // Schedule reminder 1 hour before
  const reminderTime = new Date(scheduledTime.getTime() - 60 * 60 * 1000);

  // Only schedule if reminder time is in the future
  if (reminderTime.getTime() > Date.now()) {
    return await scheduleNotification('appointment_reminder', reminderTime, { orderId });
  }

  return null;
};

// Store push token in Supabase for sending remote notifications later
export const storePushToken = async (userId: string, token: string): Promise<void> => {
  try {
    await supabase.from('user_push_tokens').upsert({
      user_id: userId,
      push_token: token,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.log('Error storing push token:', error);
  }
};
