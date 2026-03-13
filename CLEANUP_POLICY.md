# Data Cleanup & 24-Hour Retention Policy

## Overview

RedFlag implements a 24-hour data retention policy for all analyses. After 24 hours, analyses and their associated data are automatically deleted from the database.

## Cleanup API Route

**Location**: `/app/api/cleanup/route.ts`

The cleanup route checks for analyses older than 24 hours and deletes them along with associated notifications.

**Endpoint**: `GET /api/cleanup` or `POST /api/cleanup`

**Response**:
```json
{
  "success": true,
  "message": "Cleanup completed successfully",
  "deletedCount": 5,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Setup with cron-job.org

Use the free cron-job.org service to trigger cleanup every hour:

### Step 1: Create cron-job.org Account
1. Go to https://cron-job.org
2. Sign up for a free account
3. Get your API key from dashboard

### Step 2: Create New Cron Job
1. Click **"Create Cronjob"**
2. Fill in the form:
   - **Title**: `RedFlag Cleanup`
   - **URL**: `https://your-domain.com/api/cleanup`
   - **Enable job**: Toggle ON
   - **Execution schedule**: Select "Custom" and enter: `0 * * * *` (runs every hour)

### Step 3: Configure Advanced Settings (Optional Security)

If you set a `CLEANUP_SECRET_KEY` environment variable:

1. Go to **ADVANCED** tab
2. Scroll to **Headers** section
3. Click **ADD** to add a custom header:
   - **Key**: `x-cleanup-secret`
   - **Value**: `your-secret-key-value`

**Note**: Do NOT toggle HTTP authentication - use the custom header method instead.

### Step 4: Save and Verify
1. Click **CREATE CRONJOB**
2. View "Next executions" to confirm schedule
3. Job runs automatically every hour
4. Check execution history in cron-job.org dashboard

## Fast Setup Reference

**URL**: `https://your-domain.com/api/cleanup`  
**Schedule**: `0 * * * *` (Hourly)  
**Method**: GET  
**Authentication**: Optional custom header (see Step 3)

## Environment Variables (Optional)

For added security, add to your `.env.local`:

```env
CLEANUP_SECRET_KEY=your-super-secret-key
```

Then add this header in cron-job.org ADVANCED → Headers:
- **Key**: `x-cleanup-secret`  
- **Value**: `your-super-secret-key`

## Testing the Endpoint

Before setting up cron-job.org, test locally:

```bash
curl http://localhost:3000/api/cleanup
```

With optional secret:
```bash
curl -H "x-cleanup-secret: your-secret" http://localhost:3000/api/cleanup
```

Should return 200 with deletion count.

## Monitoring

**On cron-job.org Dashboard**:
- Click your job to view execution history
- Check HTTP status (200 = success)
- View response time and deleted count
- See next scheduled run times

Alternatively, check your server logs on Vercel for API call logs.

## Troubleshooting

**Cron job shows 404 or 500 error**:
1. Verify URL is correct: `https://your-domain.com/api/cleanup`
2. Check domain name is correct and accessible
3. Ensure API is deployed to production
4. Check server logs for errors

**Cron job returns 401 (if using secret)**:
1. Verify `CLEANUP_SECRET_KEY` is set in environment
2. Check custom header value matches exactly
3. Verify header is added in cron-job.org ADVANCED tab

**Job runs but nothing deletes**:
1. Verify analyses exist and are older than 24 hours
2. Check Supabase RLS policies allow deletions
3. Check server logs for SQL errors

**More debugging**:
1. Make a test API call manually with curl (see Testing section)
2. Check timestamps in database: `SELECT created_at FROM analyses LIMIT 5;`
3. Verify cleanup API is deployed to your production domain

## Future Enhancements

1. **Time Remaining Display**: Show countdown on analysis pages ("Available for 18 more hours")
2. **Pre-deletion Email**: Notify users 1 hour before auto-deletion
3. **Extended Retention**: Allow Pro users to keep analyses for 7 days instead of 24 hours
