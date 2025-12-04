<!-- PROJECT-MANIFEST:START -->
```json
{
  "schemaVersion": 1,
  "projectId": "project-atlas",
  "name": "Project Atlas",
  "repo": "Biggsen/project-atlas",
  "visibility": "private",
  "status": "active",
  "domain": "management",
  "type": "tool",
  "lastUpdated": "2025-12-04",
  "links": {
    "prod": null,
    "staging": null
  },
  "tags": ["tool", "typescript", "svelte", "project-management", "github", "dashboard"]
}
```
<!-- PROJECT-MANIFEST:END -->

# Project Atlas - Project Summary

## Project Overview

**Project Atlas** is a read-only Project Intelligence Layer that aggregates structured data from multiple GitHub repositories through a unified dashboard. It fetches, parses, and exposes project information from repositories that contain project summary files following a strict manifest schema. The system provides cross-project insights, filtering, sorting, and a unified view of all work items across projects.

### Key Features

- Aggregates project data from multiple GitHub repositories
- Unified dashboard with filtering and sorting capabilities
- Cross-project insights (drift detection, quick wins, high-risk zones, release readiness)
- Unified work items view across all projects
- Per-project detailed views with work item organization
- Read-only intelligence layer (never modifies source repos)

---

## Tech Stack

- **Backend**: Node.js with TypeScript
- **Frontend**: Svelte 5 with Vite
- **GitHub API**: @octokit/rest
- **Markdown Parsing**: remark
- **Schema Validation**: ajv
- **Build Tool**: Vite
- **Deployment**: Not yet deployed

### Key Dependencies

- **Aggregator**: @octokit/rest, remark, ajv, dotenv
- **Dashboard**: svelte, marked (for markdown rendering)

---

## Current Focus

Project Atlas v1 is complete. Current focus is on deployment and additional utility features:
- Implement Refresh API for on-demand data updates
- Deploy dashboard to hosting platform (depends on Refresh API)
- Create export-all function for ChatGPT review
- Documentation and usage guides

---

## Features (Done)

- [x] Backend aggregator with GitHub API integration
- [x] Markdown parsing with manifest block extraction
- [x] Schema validation for project manifests
- [x] Project list view with filtering (domain, type, status, visibility)
- [x] Project list view with sorting (name, last updated, work items, completion %)
- [x] Per-project detailed view with manifest display
- [x] Work items organized by type (Features, Enhancements, Bugs, Tasks)
- [x] Work items grouped by completion status (Incomplete/Completed)
- [x] Insights dashboard with overview statistics
- [x] Drift detection (active projects untouched >20 days)
- [x] Quick wins identification (≤5 incomplete items, ≥50% complete)
- [x] High-risk zones (≥3 bugs, <70% completion)
- [x] Release readiness (≥80% completion, <3 bugs)
- [x] Cross-project unified work items view
- [x] Responsive design for mobile devices
- [x] Error handling and empty states
- [x] Edge case handling (no sections, no work items, missing fields)
- [x] Completion percentage calculation and display
- [x] Staleness indicators (20+ days since update)
- [x] Clickable home navigation
- [x] Cross-project unified work items view with "Show done" toggle
- [x] Refresh API specification created

### Detailed Completed Features

#### Backend Aggregator
- GitHub API client with authentication
- File fetching from GitHub repositories
- Manifest block extraction and validation
- Markdown parsing with section extraction
- Work item identification and typing
- JSON file generation (index.json and individual project files)
- Error handling with log-and-continue strategy

#### Frontend Dashboard
- Project list with card-based UI
- Advanced filtering and sorting
- Project detail view with full manifest display
- Work items organized by type and completion status
- Insights dashboard with multiple insight types
- Cross-project unified work items view with toggle
- Responsive layout for all screen sizes
- Loading states and error messages

---

## Outstanding Tasks

### High Priority

- [ ] Implement Refresh API (see `spec/refresh-api-spec.md`)
  - Create Express server with POST /api/aggregate endpoint
  - Add file copying after aggregation
  - Add frontend "Refresh Data" button
  - Implement loading states and error handling
- [ ] Deploy app to hosting platform (depends on Refresh API - see `tasks/deploy-app.md`)
  - Must support Node.js runtime (Vercel, Netlify Functions, Railway, etc.)
  - Configure environment variables and CORS
- [ ] Create export-all function for generating single file with all project data (for ChatGPT review)

### Medium Priority

- [ ] Add export functionality to dashboard UI
- [ ] Performance optimization for large project sets
- [ ] Add unit tests for aggregator
- [ ] Add component tests for dashboard
- [ ] Set up automated aggregation runs (GitHub Actions, cron) - optional if Refresh API works well

### Low Priority / Future

- [ ] Enhanced parsing (more section types, better TODO extraction)
- [ ] Optional cached database (read-only index)
- [ ] Historical diffs (manifest snapshots over time)
- [ ] Plugin system for custom analytics
- [ ] Dark mode support
- [ ] Keyboard shortcuts
- [ ] Advanced search functionality

---

## Project Status

**Overall Status**: Active (v1 Complete)  
**Completion**: ~95% (v1 feature complete, deployment pending)  
**Last Major Update**: January 2025

### Metrics

- **Total Projects Tracked**: 6
- **Backend Modules**: 5 (fetcher, parser, validator, aggregator, index)
- **Frontend Components**: 4 (App, ProjectList, ProjectView, Insights)
- **Specification**: Complete
- **Documentation**: Complete

---

## Next Steps

### Immediate (Next 1-2 weeks)

1. Implement Refresh API feature
   - Backend Express server with aggregation endpoint
   - Frontend refresh button and data reload
   - File copying and error handling
2. Deploy dashboard to hosting platform (after Refresh API)
   - Choose platform supporting Node.js
   - Configure build and environment variables
3. Implement export-all function (CLI and/or UI)
4. Test deployment and Refresh API in production

### Short-term (Next 1-3 months)

1. Set up automated aggregation (GitHub Actions)
2. Add testing infrastructure
3. Performance optimization
4. Add export button to dashboard

### Long-term (3+ months)

1. Enhanced parsing capabilities
2. Historical tracking and diffs
3. Plugin system for custom analytics
4. Optional database backend

---

## Notes

- **Architecture Decision**: Chose static JSON files over database for simplicity and portability. All data is regenerated on each aggregation run.
- **Design Philosophy**: Read-only intelligence layer - never modifies source repositories. All truth lives in the repos.
- **Manifest Schema**: Uses forward-compatible versioning. Higher schema versions accepted if they include all v1 fields.
- **Work Item Types**: Four defined types (Features, Enhancements, Bugs, Tasks) tagged by section heading - no inference needed.
- **Refresh API**: Specification created for on-demand data updates via frontend button. Requires backend API server and affects deployment platform requirements (must support Node.js).
- **Future Consideration**: May add database backend for performance with large project sets, but current static file approach works well for moderate scale.

---

