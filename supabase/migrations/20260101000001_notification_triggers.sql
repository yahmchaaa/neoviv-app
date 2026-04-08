-- NEOVIV Notification Triggers
-- This migration creates the functions and triggers to send notifications
-- when order status changes

-- Create table for push tokens (for remote notifications)
CREATE TABLE IF NOT EXISTS public.user_push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  push_token TEXT NOT NULL,
  device_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_push_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage their own push tokens
CREATE POLICY "Users can manage own push tokens" ON public.user_push_tokens
  FOR ALL USING (auth.uid() = user_id);

-- Create function to get push token for a user
CREATE OR REPLACE FUNCTION public.get_push_token(p_user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT push_token FROM public.user_push_tokens WHERE user_id = p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle order status changes and send notifications
CREATE OR REPLACE FUNCTION public.handle_order_status_change()
RETURNS TRIGGER AS $$
DECLARE
  v_push_token TEXT;
  v_user_id UUID;
  v_notification_type TEXT;
  v_title TEXT;
  v_body TEXT;
BEGIN
  -- Only trigger on status change
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Get user ID and push token
  SELECT user_id, push_token INTO v_user_id, v_push_token
  FROM public.orders
  LEFT JOIN public.user_push_tokens ON public.orders.user_id = public.user_push_tokens.user_id
  WHERE public.orders.id = NEW.id;

  -- Determine notification type based on new status
  CASE NEW.status
    WHEN 'confirmed' THEN
      v_notification_type := 'booking_confirmed';
      v_title := 'Booking Confirmed!';
      v_body := 'Your visit has been booked. A clinician will arrive within 60-120 minutes.';
    WHEN 'in_progress' THEN
      v_notification_type := 'clinician_on_the_way';
      v_title := 'Clinician On The Way!';
      v_body := 'Your clinician is on the way to your location.';
    WHEN 'completed' THEN
      v_notification_type := 'visit_complete';
      v_title := 'Visit Complete!';
      v_body := 'Your IV therapy session is complete. We hope you are feeling refreshed!';
    ELSE
      RETURN NEW;
  END CASE;

  -- Log the notification (in production, you would send push notification here)
  INSERT INTO public.notification_logs (user_id, notification_type, title, body, order_id, sent_at)
  VALUES (v_user_id, v_notification_type, v_title, v_body, NEW.id, NOW());

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create notification logs table
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notification logs
CREATE POLICY "Users can view own notification logs" ON public.notification_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Create trigger on orders table
DROP TRIGGER IF EXISTS on_order_status_change ON public.orders;
CREATE TRIGGER on_order_status_change
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.handle_order_status_change();

-- Create function to schedule appointment reminder (1 hour before)
CREATE OR REPLACE FUNCTION public.schedule_appointment_reminder()
RETURNS TRIGGER AS $$
DECLARE
  v_reminder_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Only trigger for scheduled appointments
  IF NEW.scheduled_time IS NOT NULL AND NEW.status = 'pending' THEN
    -- Schedule reminder 1 hour before
    v_reminder_time := NEW.scheduled_time - INTERVAL '1 hour';
    
    -- Only schedule if reminder time is in the future
    IF v_reminder_time > NOW() THEN
      -- In production, you would use a job queue here to schedule the actual notification
      -- For now, we just log it
      INSERT INTO public.notification_logs (user_id, notification_type, title, body, order_id, sent_at)
      VALUES (
        NEW.user_id,
        'appointment_reminder',
        'Appointment Reminder',
        'Your scheduled visit is in 1 hour.',
        NEW.id,
        v_reminder_time
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for scheduling reminders
DROP TRIGGER IF EXISTS on_order_scheduled ON public.orders;
CREATE TRIGGER on_order_scheduled
  AFTER INSERT ON public.orders
  FOR EACH ROW
  WHEN (NEW.scheduled_time IS NOT NULL)
  EXECUTE FUNCTION public.schedule_appointment_reminder();
