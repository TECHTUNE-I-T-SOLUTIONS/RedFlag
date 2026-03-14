-- Migration: Add missing columns to analyses table
-- Purpose: Add confidence and other missing columns required by the analyze API

-- Add confidence column if it doesn't exist
ALTER TABLE analyses
ADD COLUMN IF NOT EXISTS confidence INTEGER DEFAULT 0;

-- Add explanation column if it doesn't exist
ALTER TABLE analyses
ADD COLUMN IF NOT EXISTS explanation TEXT;

-- Add recommendation column if it doesn't exist
ALTER TABLE analyses
ADD COLUMN IF NOT EXISTS recommendation TEXT;

-- Add red_flags column if it doesn't exist (if not already present)
ALTER TABLE analyses
ADD COLUMN IF NOT EXISTS red_flags JSONB;

-- Ensure is_deleted column exists (soft delete support)
ALTER TABLE analyses
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

-- Create index on user_id and is_deleted for faster queries
CREATE INDEX IF NOT EXISTS idx_analyses_user_id_deleted 
ON analyses(user_id, is_deleted);

-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_analyses_created_at 
ON analyses(created_at DESC);

-- Optional: Set default timestamps if they don't exist
ALTER TABLE analyses
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
