-- Create analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'url', 'screenshot')),
  content_preview TEXT NOT NULL,
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  red_flags JSONB NOT NULL DEFAULT '[]'::jsonb,
  explanation TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_risk_level ON analyses(risk_level);

-- Enable RLS
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can only read their own analyses
CREATE POLICY "Users can read own analyses"
  ON analyses FOR SELECT
  USING (auth.uid() = user_id);

-- Create RLS policy: Users can only insert their own analyses
CREATE POLICY "Users can insert own analyses"
  ON analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policy: Users can only update their own analyses
CREATE POLICY "Users can update own analyses"
  ON analyses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policy: Users can only delete their own analyses
CREATE POLICY "Users can delete own analyses"
  ON analyses FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- NOTIFICATIONS TABLE AND TRIGGERS
-- ============================================================

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('analysis_started', 'analysis_completed', 'analysis_updated', 'high_risk_detected', 'system_alert')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for notifications table
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_analysis_id ON notifications(analysis_id);

-- Enable RLS on notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can only read their own notifications
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Create RLS policy: Users can only update their own notifications
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policy: Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS FOR AUTOMATIC NOTIFICATIONS
-- ============================================================

-- Function to create notification when analysis is created
CREATE OR REPLACE FUNCTION notify_analysis_started()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, analysis_id, type, title, message, data)
  VALUES (
    NEW.user_id,
    NEW.id,
    'analysis_started',
    'Analysis Started',
    'Your ' || NEW.content_type || ' analysis has been received and is being processed.',
    jsonb_build_object(
      'content_type', NEW.content_type,
      'content_preview', NEW.content_preview
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for analysis created
CREATE TRIGGER analyses_created_notify
AFTER INSERT ON analyses
FOR EACH ROW
EXECUTE FUNCTION notify_analysis_started();

-- Function to create notification when analysis is completed with results
CREATE OR REPLACE FUNCTION notify_analysis_completed()
RETURNS TRIGGER AS $$
BEGIN
  -- Only notify if this is an update that contains risk_score (analysis completed)
  IF OLD.risk_score IS NULL AND NEW.risk_score IS NOT NULL THEN
    INSERT INTO notifications (user_id, analysis_id, type, title, message, data)
    VALUES (
      NEW.user_id,
      NEW.id,
      'analysis_completed',
      'Analysis Complete',
      'Your ' || NEW.content_type || ' analysis is complete. Risk Score: ' || NEW.risk_score || '/100 (' || NEW.risk_level || ')',
      jsonb_build_object(
        'content_type', NEW.content_type,
        'risk_score', NEW.risk_score,
        'risk_level', NEW.risk_level,
        'confidence', NEW.confidence,
        'explanation', NEW.explanation
      )
    );
    
    -- If high risk detected, create additional alert
    IF NEW.risk_score >= 70 THEN
      INSERT INTO notifications (user_id, analysis_id, type, title, message, data)
      VALUES (
        NEW.user_id,
        NEW.id,
        'high_risk_detected',
        '⚠️ High Risk Detected',
        'Your analysis has detected HIGH RISK (' || NEW.risk_score || '/100). Please review the details and recommendations carefully.',
        jsonb_build_object(
          'content_type', NEW.content_type,
          'risk_score', NEW.risk_score,
          'risk_level', NEW.risk_level,
          'recommendation', NEW.recommendation,
          'red_flags', NEW.red_flags
        )
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for analysis completed/updated
CREATE TRIGGER analyses_updated_notify
AFTER UPDATE ON analyses
FOR EACH ROW
EXECUTE FUNCTION notify_analysis_completed();

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_read = TRUE AND OLD.is_read = FALSE THEN
    NEW.read_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set read_at timestamp
CREATE TRIGGER notifications_mark_read
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION mark_notification_read();

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Function to get unread notifications count for a user
CREATE OR REPLACE FUNCTION get_unread_notifications_count(user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM notifications
    WHERE notifications.user_id = get_unread_notifications_count.user_id
    AND is_read = FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark all notifications as read for a user
CREATE OR REPLACE FUNCTION mark_all_notifications_read(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE notifications
  SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
  WHERE notifications.user_id = mark_all_notifications_read.user_id
  AND is_read = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- NOTES FOR IMPLEMENTATION
-- ============================================================
-- This schema includes:
-- 1. notifications table: Stores all user notifications
-- 2. Analysis started trigger: Creates notification when analysis is submitted
-- 3. Analysis completed trigger: Creates notification when AI finishes analysis
-- 4. High risk alert trigger: Creates urgent notification for risk_score >= 70
-- 5. Read tracking: Automatically timestamps when notifications are marked as read
-- 6. Helper functions: Utilities for the app to query notification data
--
-- Usage in frontend:
-- - Query: SELECT * FROM notifications WHERE user_id = current_user_id ORDER BY created_at DESC
-- - Execute: SELECT * FROM get_unread_notifications_count(current_user_id)
-- - Mark read: UPDATE notifications SET is_read = TRUE WHERE id = notification_id
-- - Mark all read: SELECT mark_all_notifications_read(current_user_id)
