# SQL Database Schema - Enhanced with Notifications

## Summary of Updates

### 1. Blog Authors Updated ✅
All 6 blog posts now have **Prince TechTune** as the author:
- How to Spot Phishing Scams
- The Rise of AI-Powered Scams
- Protecting Your Family Online
- Cryptocurrency Investment Fraud
- Secure Password Management
- Mobile Security

---

## Database Schema Overview

### Existing Tables (Verified ✅)

#### `analyses` Table
Stores all user analysis submissions with AI results:
- **id** (UUID): Primary key
- **user_id** (UUID): Foreign key to auth.users, cascades on delete
- **content_type** (TEXT): 'text', 'url', or 'screenshot'
- **content_preview** (TEXT): Preview of analyzed content
- **risk_score** (INTEGER): 0-100 scale
- **risk_level** (TEXT): 'low', 'medium', or 'high'
- **red_flags** (JSONB): Array of detected flags
- **explanation** (TEXT): AI explanation of findings
- **recommendation** (TEXT): Recommended action
- **confidence** (INTEGER): 0-100 confidence percentage
- **created_at** (TIMESTAMP): Auto-set to current time
- **updated_at** (TIMESTAMP): Auto-set to current time

**Indexes:**
- `idx_analyses_user_id` - Fast user lookups
- `idx_analyses_created_at` - Chronological sorting
- `idx_analyses_risk_level` - Filter by risk level

**RLS Policies:**
- ✅ Users can read own analyses only
- ✅ Users can insert own analyses only
- ✅ Users can update own analyses only
- ✅ Users can delete own analyses only

---

### NEW: `notifications` Table

Automatically tracks all user activities and AI completions:

**Columns:**
- **id** (UUID): Primary key
- **user_id** (UUID): Foreign key to auth.users, cascades on delete
- **analysis_id** (UUID): Foreign key to analyses (optional, cascades)
- **type** (TEXT): Notification type (see types below)
- **title** (TEXT): Short notification title
- **message** (TEXT): Full notification message
- **data** (JSONB): Additional structured data (content_type, risk_score, etc.)
- **is_read** (BOOLEAN): Default FALSE - tracks read status
- **created_at** (TIMESTAMP): Auto-set to current time
- **read_at** (TIMESTAMP): Auto-set when marked as read

**Indexes:**
- `idx_notifications_user_id` - Fast user lookups
- `idx_notifications_created_at` - Chronological queries
- `idx_notifications_is_read` - Filter unread notifications
- `idx_notifications_type` - Filter by notification type
- `idx_notifications_analysis_id` - Link to specific analysis

**RLS Policies:**
- ✅ Users can read own notifications only
- ✅ Users can update own notifications only
- ✅ Users can delete own notifications only

---

## Notification Types

The system automatically generates 5 types of notifications:

### 1. `analysis_started`
**When:** User submits content for analysis
**Example:**
```
Title: "Analysis Started"
Message: "Your text analysis has been received and is being processed."
Data: { content_type, content_preview }
```

### 2. `analysis_completed`
**When:** AI finishes analyzing and saves results
**Example:**
```
Title: "Analysis Complete"
Message: "Your url analysis is complete. Risk Score: 45/100 (low)"
Data: { content_type, risk_score, risk_level, confidence, explanation }
```

### 3. `high_risk_detected` (Automatic Alert)
**When:** Analysis completes with risk_score >= 70
**Example:**
```
Title: "⚠️ High Risk Detected"
Message: "Your analysis has detected HIGH RISK (85/100). Please review..."
Data: { content_type, risk_score, risk_level, recommendation, red_flags }
```

### 4. `analysis_updated`
**Reserved for future:** When analysis is manually reviewed/updated

### 5. `system_alert`
**Reserved for future:** For system-level notifications (maintenance, etc.)

---

## Automatic Triggers (PostgreSQL)

### Trigger 1: `analyses_created_notify`
**Fires:** After INSERT on `analyses` table
**Action:** Automatically creates a notification of type `analysis_started`
**Benefits:**
- User immediately knows their submission was received
- No extra code needed in the application

**SQL Query Equivalent:**
```sql
INSERT INTO notifications (user_id, analysis_id, type, title, message, data)
VALUES ($1, $2, 'analysis_started', '...', '...', '...')
```

### Trigger 2: `analyses_updated_notify`
**Fires:** After UPDATE on `analyses` table
**Actions:**
1. Creates `analysis_completed` notification when risk_score is first populated
2. Creates `high_risk_detected` alert if risk_score >= 70
**Benefits:**
- User gets instant notification when AI finishes
- High-risk items trigger urgent alerts automatically
- No polling needed

**SQL Logic:**
```
IF OLD.risk_score IS NULL AND NEW.risk_score IS NOT NULL:
  - Create analysis_completed notification
  - IF NEW.risk_score >= 70:
    - Create high_risk_detected alert notification
```

### Trigger 3: `notifications_mark_read`
**Fires:** Before UPDATE on `notifications` table
**Action:** Auto-sets `read_at` timestamp when `is_read` changes to TRUE
**Benefits:**
- Track exactly when user read notification
- Useful for analytics and user behavior

---

## Helper Functions

### 1. `get_unread_notifications_count(user_id)`
**Purpose:** Get count of unread notifications
**Returns:** INTEGER

**Usage:**
```sql
SELECT get_unread_notifications_count('user-uuid');
-- Returns: 3
```

**Use Case:** Display badge on notification bell icon

### 2. `mark_all_notifications_read(user_id)`
**Purpose:** Mark all notifications as read for a user
**Returns:** void

**Usage:**
```sql
SELECT mark_all_notifications_read('user-uuid');
```

**Use Case:** "Mark all as read" button functionality

---

## Frontend Implementation Guide

### Query Unread Notifications
```sql
SELECT * FROM notifications 
WHERE user_id = auth.uid() 
AND is_read = FALSE
ORDER BY created_at DESC;
```

### Query All Notifications
```sql
SELECT * FROM notifications 
WHERE user_id = auth.uid()
ORDER BY created_at DESC;
```

### Get Unread Count
```sql
SELECT get_unread_notifications_count(auth.uid());
```

### Mark Single Notification as Read
```sql
UPDATE notifications 
SET is_read = TRUE 
WHERE id = 'notification-uuid' 
AND user_id = auth.uid();
```

### Mark All as Read
```sql
SELECT mark_all_notifications_read(auth.uid());
```

---

## Data Consistency & Safety Features

✅ **Cascade Deletes:** 
- Deleting a user deletes all their analyses and notifications
- Deleting an analysis deletes linked notifications

✅ **Type Safety:**
- All text fields restricted to specific valid values
- CHECK constraints enforce valid types

✅ **Security (RLS):**
- Users can ONLY see their own data
- No cross-user data leakage possible
- All queries automatically filtered by user_id

✅ **Performance:**
- Strategic indexes on frequently queried columns
- Composite indexes for common filter combinations
- Optimized for real-time queries

✅ **Data Integrity:**
- Automatic timestamps (created_at, read_at)
- Foreign key constraints prevent orphaned records
- JSONB validation for complex data

---

## Testing Checklist Before Production

Before running in Supabase, verify:

- [ ] Analyses table creates successfully
- [ ] All RLS policies enforce correctly
- [ ] Notifications table creates
- [ ] All triggers fire automatically
- [ ] Mock analysis submission → triggers notification
- [ ] Mock analysis completion → triggers 2 notifications (1 normal + 1 high-risk if score >= 70)
- [ ] Helper functions callable without errors
- [ ] RLS prevents cross-user data access
- [ ] Cascade delete works (deleting user removes all data)

---

## Migration Notes

**No data loss:** All new tables/functions will not affect existing data.

**Triggers are automatic:** Once executed, no additional code changes needed - notifications generate automatically.

**RLS is restrictive:** If queries fail, likely due to RLS. Ensure `auth.uid()` is set in Supabase client.

---

## Next Steps

1. Run this SQL script in Supabase SQL editor
2. All triggers & functions will be active immediately
3. Try creating an analysis to see notifications auto-generate
4. Query notifications table to confirm data flow
5. Then integrate notification UI components into frontend
