# Project Atlas - Refresh API Specification

## Overview

Add a backend API server that allows the frontend dashboard to trigger data aggregation on-demand via a single "Refresh Data" button. This enables users to update project data without manually running the aggregator CLI.

## Goals

1. Provide a simple API endpoint to trigger aggregation
2. Allow frontend to request fresh data updates
3. Automatically serve updated data files to frontend
4. Maintain read-only architecture (no data modification)

## Architecture

### Components

1. **API Server** (Express.js)
   - Runs alongside or integrated with aggregator
   - Exposes REST endpoint for triggering aggregation
   - Handles file copying after aggregation completes

2. **Frontend Integration**
   - "Refresh Data" button in dashboard
   - API call to trigger aggregation
   - Loading state during aggregation
   - Automatic data reload when complete

3. **File Management**
   - Aggregator writes to `data/projects/`
   - API copies files to `dashboard/public/projects/` after aggregation
   - Frontend reads from `public/projects/` (existing behavior)

## API Specification

### Endpoint: `POST /api/aggregate`

Triggers a full aggregation run.

**Request:**
```http
POST /api/aggregate
Content-Type: application/json
```

**Response (Success):**
```json
{
  "success": true,
  "projectsProcessed": 7,
  "projectsSucceeded": 7,
  "projectsFailed": 0,
  "errors": [],
  "duration": 3.2
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Failed to load config: ...",
  "duration": 0.1
}
```

**Response (Partial Success):**
```json
{
  "success": true,
  "projectsProcessed": 7,
  "projectsSucceeded": 6,
  "projectsFailed": 1,
  "errors": [
    {
      "projectId": "example-project",
      "error": "Failed to fetch file: Not found"
    }
  ],
  "duration": 2.8
}
```

### Endpoint: `GET /api/aggregate/status`

Check if aggregation is currently running.

**Response:**
```json
{
  "running": false,
  "lastRun": "2025-12-04T10:30:00Z",
  "lastDuration": 3.2,
  "lastSuccess": true
}
```

## Implementation Details

### Backend Server Structure

```
aggregator/
├── src/
│   ├── server.ts          # Express server
│   ├── aggregator.ts      # Existing aggregation logic
│   └── ...
└── package.json           # Add express dependency
```

### Server Features

1. **Express Server**
   - Single endpoint: `POST /api/aggregate`
   - Optional status endpoint: `GET /api/aggregate/status`
   - CORS enabled for frontend access
   - Error handling and logging

2. **Aggregation Integration**
   - Calls existing `runAggregation()` function
   - Captures console output/logs
   - Returns structured response with results

3. **File Copying**
   - After aggregation completes, copy files from `data/projects/` to `dashboard/public/projects/`
   - Ensure directory exists
   - Handle copy errors gracefully

4. **Concurrency Control**
   - Prevent multiple simultaneous aggregation runs
   - Return error if aggregation already in progress
   - Track running state

### Frontend Integration

1. **Refresh Button**
   - Location: Dashboard header or Insights view
   - Shows loading state during aggregation
   - Disabled while aggregation is running

2. **API Client**
   - Function in `dashboard/src/lib/api.ts`
   - `triggerAggregation(): Promise<AggregationResponse>`
   - Error handling and user feedback

3. **Data Reload**
   - After successful aggregation, reload project data
   - Show success/error toast notifications
   - Update UI with fresh data

### Error Handling

- Network errors: Show user-friendly message
- Aggregation errors: Display which projects failed
- Timeout handling: Set reasonable timeout (e.g., 60 seconds)
- Concurrent request prevention: Show "already running" message

## Deployment Considerations

### Requirements

1. **Hosting Platform**
   - Must support Node.js runtime (not static-only)
   - Options: Vercel (serverless), Netlify Functions, Railway, Render, etc.
   - Cannot use GitHub Pages (static-only)

2. **File System**
   - Platform must support file writing
   - Persistent filesystem preferred
   - Alternative: Use cloud storage (S3) or return files via API

3. **Environment Variables**
   - `GITHUB_TOKEN` must be configured in deployment
   - Backend needs access to token

4. **CORS Configuration**
   - If frontend/backend on different domains, configure CORS
   - Allow frontend origin in CORS headers

5. **Build Process**
   - Backend server needs to be built and deployed
   - Frontend build may need to include API endpoint URL
   - Consider environment-based API URLs

### Deployment Architecture Options

#### Option 1: Monorepo Deployment (Same Platform)
- Deploy both frontend and backend together
- Backend serves API and static files
- Single deployment, simpler CORS

#### Option 2: Separate Deployments
- Frontend: Static hosting (Vercel, Netlify)
- Backend: Serverless functions or separate service
- Requires CORS configuration
- More complex but more flexible

#### Option 3: Backend-Only with File Serving
- Backend serves both API and static frontend files
- Single deployment
- Simpler architecture

## Security Considerations

1. **API Protection**
   - Consider rate limiting (prevent abuse)
   - Optional: Add authentication for production
   - Validate requests

2. **GitHub Token**
   - Store securely in environment variables
   - Never expose in client-side code
   - Use server-side only

3. **File Access**
   - Ensure proper file permissions
   - Validate file paths (prevent directory traversal)

## Performance Considerations

1. **Aggregation Time**
   - May take 10-30 seconds depending on project count
   - Show progress indicator
   - Consider timeout limits

2. **Concurrent Requests**
   - Prevent multiple simultaneous runs
   - Queue requests or return "already running" status

3. **Caching**
   - Frontend can cache data until refresh
   - Backend doesn't need to cache (always fresh from GitHub)

## Testing

1. **Unit Tests**
   - API endpoint responses
   - Error handling
   - File copying logic

2. **Integration Tests**
   - Full aggregation flow via API
   - Frontend button interaction
   - Data reload after aggregation

3. **Manual Testing**
   - Test with multiple projects
   - Test error scenarios
   - Test concurrent request handling

## Future Enhancements

- WebSocket support for real-time progress updates
- Partial aggregation (refresh single project)
- Scheduled aggregation via API
- Aggregation history/logs
- Webhook support for GitHub events

---

## Implementation Checklist

- [ ] Create Express server in aggregator
- [ ] Add POST /api/aggregate endpoint
- [ ] Integrate with existing runAggregation function
- [ ] Implement file copying after aggregation
- [ ] Add CORS configuration
- [ ] Add error handling and logging
- [ ] Add concurrency control
- [ ] Create frontend API client function
- [ ] Add "Refresh Data" button to dashboard
- [ ] Implement loading states
- [ ] Add success/error notifications
- [ ] Implement data reload after refresh
- [ ] Add status endpoint (optional)
- [ ] Update deployment documentation
- [ ] Test end-to-end flow

