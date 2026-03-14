-- Migration: Clean up analyses table and fix constraints
-- Purpose: Remove unnecessary columns and ensure correct schema

-- Step 1: Drop the old check constraint if it exists (it may be too restrictive)
ALTER TABLE analyses DROP CONSTRAINT IF EXISTS analyses_risk_level_check;

-- Step 2: Remove unnecessary columns (keep only what we need)
ALTER TABLE analyses
DROP COLUMN IF EXISTS confidence,
DROP COLUMN IF EXISTS explanation,
DROP COLUMN IF EXISTS recommendation,
DROP COLUMN IF EXISTS red_flags;

-- Step 3: Add columns back with correct definitions
ALTER TABLE analyses
ADD COLUMN IF NOT EXISTS confidence INTEGER DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 100),
ADD COLUMN IF NOT EXISTS explanation TEXT,
ADD COLUMN IF NOT EXISTS recommendation TEXT,
ADD COLUMN IF NOT EXISTS red_flags JSONB DEFAULT '[]'::jsonb;

-- Step 4: Add or fix risk_level check constraint to allow 'low', 'medium', 'high'
ALTER TABLE analyses
ADD CONSTRAINT analyses_risk_level_check CHECK (risk_level IN ('low', 'medium', 'high'));

-- Step 5: Ensure is_deleted column exists for soft deletes
ALTER TABLE analyses
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

-- Step 6: Ensure timestamp columns exist
ALTER TABLE analyses
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Step 7: Drop any unnecessary columns that might exist
-- Common unnecessary columns to remove:
ALTER TABLE analyses
DROP COLUMN IF EXISTS status,
DROP COLUMN IF EXISTS notes,
DROP COLUMN IF EXISTS tags,
DROP COLUMN IF EXISTS category,
DROP COLUMN IF EXISTS severity,
DROP COLUMN IF EXISTS source,
DROP COLUMN IF EXISTS metadata;

-- Step 8: Create helpful indexes
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_user_deleted ON analyses(user_id, is_deleted);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_risk_level ON analyses(risk_level);

-- Step 9: Verify final schema
-- Run this query to check your table structure:
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'analyses'
-- ORDER BY ordinal_position;
