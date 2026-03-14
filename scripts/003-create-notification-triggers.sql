-- Migration: Drop and recreate notification triggers
-- Purpose: Properly handle notification creation on analysis events

-- Step 1: Drop existing triggers if they exist
DROP TRIGGER IF EXISTS create_notification_on_analysis_insert ON public.analyses;
DROP TRIGGER IF EXISTS delete_notification_on_analysis_delete ON public.analyses;
DROP TRIGGER IF EXISTS notify_analysis_inserted ON public.analyses;
DROP TRIGGER IF EXISTS notify_analysis_deleted ON public.analyses;

-- Step 2: Drop existing trigger functions if they exist
DROP FUNCTION IF EXISTS create_notification_on_analysis_insert();
DROP FUNCTION IF EXISTS delete_notification_on_analysis_delete();
DROP FUNCTION IF EXISTS notify_analysis_inserted_fn();
DROP FUNCTION IF EXISTS notify_analysis_deleted_fn();

-- Step 3: Create trigger function for NEW analysis insertions
CREATE OR REPLACE FUNCTION create_notification_on_analysis_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (
    user_id,
    analysis_id,
    notification_type,
    title,
    message,
    is_read,
    created_at
  )
  VALUES (
    NEW.user_id,
    NEW.id,
    NEW.risk_level,
    CASE
      WHEN NEW.risk_level = 'high' THEN 'High Risk Alert'
      WHEN NEW.risk_level = 'medium' THEN 'Medium Risk Detected'
      WHEN NEW.risk_level = 'low' THEN 'Low Risk Analysis Complete'
      ELSE 'Analysis Complete'
    END,
    CASE
      WHEN NEW.risk_level = 'high' THEN 'Your analysis shows HIGH risk. Please take immediate caution and review the recommendations provided.'
      WHEN NEW.risk_level = 'medium' THEN 'Your analysis shows MEDIUM risk. Exercise caution and review the details before proceeding.'
      WHEN NEW.risk_level = 'low' THEN 'Your analysis shows LOW risk. You can proceed with confidence.'
      ELSE 'Analysis of "' || COALESCE(SUBSTRING(NEW.content_preview, 1, 50), 'content') || '..." is complete.'
    END,
    false,
    CURRENT_TIMESTAMP
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create trigger for analysis INSERT events
CREATE TRIGGER create_notification_on_analysis_insert
AFTER INSERT ON public.analyses
FOR EACH ROW
EXECUTE FUNCTION create_notification_on_analysis_insert();

-- Step 5: Create trigger function for analysis soft deletion
CREATE OR REPLACE FUNCTION delete_notification_on_analysis_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Only handle soft deletes (is_deleted = true)
  IF NEW.is_deleted = true AND OLD.is_deleted = false THEN
    -- Insert a notification about the deletion
    INSERT INTO public.notifications (
      user_id,
      analysis_id,
      notification_type,
      title,
      message,
      is_read,
      created_at
    )
    VALUES (
      NEW.user_id,
      NEW.id,
      'deleted',
      'Analysis Removed',
      'Your analysis of "' || COALESCE(SUBSTRING(NEW.content_preview, 1, 50), 'content') || '..." has been removed.',
      false,
      CURRENT_TIMESTAMP
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Create trigger for analysis UPDATE events (soft delete)
CREATE TRIGGER delete_notification_on_analysis_delete
AFTER UPDATE ON public.analyses
FOR EACH ROW
EXECUTE FUNCTION delete_notification_on_analysis_delete();

-- Step 7: Create indexes for better notification query performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_created
ON public.notifications(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_is_read
ON public.notifications(user_id, is_read);

CREATE INDEX IF NOT EXISTS idx_notifications_analysis_id
ON public.notifications(analysis_id);

-- Step 8: Ensure all necessary columns exist in notifications table
-- (They should already exist from the schema, but this ensures consistency)
ALTER TABLE public.notifications
ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL,
ADD COLUMN IF NOT EXISTS analysis_id uuid,
ADD COLUMN IF NOT EXISTS notification_type character varying NOT NULL,
ADD COLUMN IF NOT EXISTS title character varying NOT NULL,
ADD COLUMN IF NOT EXISTS message text NOT NULL,
ADD COLUMN IF NOT EXISTS is_read boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS read_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP;

-- Step 9: Drop and recreate foreign key constraints
ALTER TABLE public.notifications
DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

ALTER TABLE public.notifications
DROP CONSTRAINT IF EXISTS notifications_analysis_id_fkey;

ALTER TABLE public.notifications
ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.notifications
ADD CONSTRAINT notifications_analysis_id_fkey FOREIGN KEY (analysis_id) REFERENCES public.analyses(id) ON DELETE SET NULL;

-- Step 10: Verify the notification structure
-- Run this query separately to check your table:
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'notifications'
-- ORDER BY ordinal_position;
