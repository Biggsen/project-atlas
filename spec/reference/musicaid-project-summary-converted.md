<!-- PROJECT-MANIFEST:START -->
```json
{
  "schemaVersion": 1,
  "projectId": "musicaid",
  "name": "MusicAid v2",
  "repo": "Biggsen/musicaidv2",
  "visibility": "public",
  "status": "active",
  "domain": "music",
  "type": "webapp",
  "lastUpdated": "2025-01-13",
  "links": {
    "prod": null,
    "staging": null
  },
  "tags": ["music", "webapp", "nuxt", "supabase", "netlify"]
}
```
<!-- PROJECT-MANIFEST:END -->

# MusicAid v2 - Project Summary

## Project Overview

**MusicAid v2** is a comprehensive music production and recording management system built with modern web technologies. It helps artists, producers, and studios track and manage various aspects of music creation and recording workflows.

### Key Features

- User authentication and multi-user collaboration
- Artist, track, and album management
- Workflow system with custom templates
- Audio file upload and management
- Notes system with completion tracking

---

## Tech Stack

- **Frontend/Backend**: Nuxt 3 (full-stack Vue framework with SSR)
- **Database & Auth**: Supabase (PostgreSQL, authentication, real-time capabilities)
- **File Storage**: Cloudflare R2 (S3-compatible object storage)
- **Deployment**: Netlify (single deployment platform)
- **UI Framework**: Nuxt UI v4 (TailwindCSS-based component library)
- **Language**: TypeScript (strict mode enabled)

---

## Current Focus

Post-core development phase. Core features are complete and deployed. Current focus is on security improvements (RLS implementation) and code quality fixes.

---

## Features (Done)

<!-- 
  WORK ITEM TYPE: Features
  
  List completed features and major accomplishments.
  Use checkboxes to mark completed items if desired.
  Items in this section will be tagged as "Features" by the parser.
  The parser will identify TODO items (- [ ] and - [x]) throughout the document.
-->

- [x] Project Setup - Nuxt 3 project with TypeScript, development environment configured
- [x] Supabase Integration - Database schema implemented, authentication configured, 15 migrations completed
- [x] Deployment Setup - Netlify deployment configured, production deployment working
- [x] Artist Management - Full CRUD operations, multi-user collaboration
- [x] Track Management - Full CRUD operations, metadata tracking, workflow stage tracking
- [x] Audio File Management - Upload to Cloudflare R2, display and playback, metadata tracking
- [x] Workflow System - Custom workflow templates, status management, step tracking, visual progress indicators
- [x] Notes System - Track-specific notes and comments, completion tracking, full CRUD operations
- [x] Album Management - Create and manage albums, track organization, metadata management
- [x] User Management - Authentication (login, registration, session management), multi-user collaboration, role-based access control

### Key Pages Implemented

- [x] Homepage with hero and features
- [x] User authentication (login, register)
- [x] Artist listing/dashboard and detail pages
- [x] Track listing with filters and detail pages
- [x] Album listing and detail pages
- [x] Workflow template pages with status and step management
- [x] Status and step listing pages

---

## Features (In Progress)

<!-- 
  WORK ITEM TYPE: Features
  
  List features currently being developed.
  Include estimated completion or progress indicators if helpful.
  Items in this section will be tagged as "Features" by the parser.
-->

_No features currently in active development._

---

## Enhancements

<!-- 
  WORK ITEM TYPE: Enhancements
  
  List improvements and enhancements to existing features.
  These are not new features, but improvements to what already exists.
  Items in this section will be tagged as "Enhancements" by the parser.
-->

### High Priority Enhancements

- [ ] Real-time Collaboration - Real-time updates and live collaboration features (currently deferred because manual refresh is sufficient for the workflow)

### Medium Priority Enhancements

- [ ] UI/UX Enhancements - Loading skeletons, smooth animations, keyboard shortcuts, onboarding flow, dark/light mode toggle
- [ ] Performance Optimizations - Virtual scrolling for large lists, service worker for offline functionality, image optimization, aggressive caching strategies
- [ ] User Experience Features - Bulk operations (select multiple tracks), advanced search and filtering, export functionality, mobile-responsive improvements, accessibility enhancements

### Low Priority Enhancements

- [ ] Developer Experience - Comprehensive error logging, development debugging tools, component documentation, automated testing setup, performance monitoring
- [ ] Analytics & Monitoring - User analytics (privacy-focused), error tracking, performance monitoring, usage statistics dashboard, health check endpoints

---

## Known Issues

<!-- 
  WORK ITEM TYPE: Bugs
  
  Document bugs, problems, or issues that need to be addressed.
  Include severity, affected areas, and workarounds if available.
  Items in this section will be tagged as "Bugs" by the parser.
  
  Alternative section headings: "Active Bugs", "Outstanding Issues", "Bugs"
-->

### Current Bugs

- [ ] Avoid `dark:` utility classes - Should not use any `dark:` classes anywhere in the app. Rely on Nuxt UI components and their built-in styling/theming for dark mode support instead.

---

## Outstanding Tasks

<!-- 
  WORK ITEM TYPE: Tasks
  
  Inbox for uncategorized work items that may later become features or enhancements.
  Can be organized by priority, category, or timeline.
  Items in this section will be tagged as "Tasks" by the parser.
  
  Alternative section headings: "Tasks", "Outstanding Tasks", "Todo"
-->

### High Priority

- [ ] Row Level Security (RLS) Implementation - RLS policies are defined in migrations but currently disabled due to implementation issues. Estimated time: 6-8 hours.
  - Analyze current RLS policies in migrations
  - Identify specific issues that caused RLS to be disabled
  - Document problematic policy patterns (infinite recursion, circular dependencies)
  - Resolve infinite recursion in `user_artists` table policies
  - Fix circular dependency issues between tables
  - Implement proper RLS policies for all tables
  - Enable RLS on all tables
  - Test and validate with RLS enabled
  - Create comprehensive migration file to enable RLS

### Medium Priority

- [ ] Fix buglist items - Remove `dark:` utility classes and use Nuxt UI theming

### Low Priority

- [ ] Polish & Optimization - Estimated time: 6-10 hours. UI/UX enhancements, performance optimizations, developer experience improvements, user experience features, analytics & monitoring

---

## Project Status

**Overall Status**: Post-Core Development  
**Deployment Status**: Deployed to Netlify  
**Core Features**: Complete  
**Security**: RLS needs to be enabled  
**Production Ready**: Pending RLS implementation

### Metrics

- **Database Migrations**: 15 completed
- **Key Components**: 4 (ArtistSelector, AudioUpload, Logo, WorkflowStatus)
- **Key Composables**: 9 (useAlbums, useArtists, useAudio, useAuth, useNotes, useTracks, useWorkflow, useSupabase, useApi)
- **Key Pages**: 15+ pages implemented

---

## Next Steps

### Immediate (Next 1-2 weeks)

1. Implement and enable RLS (Task 07) - Critical for production security
2. Fix buglist items - Remove `dark:` classes

### Short-term (Next 1-3 months)

1. Polish and optimization (Task 06) - Enhance user experience and performance

### Long-term (3+ months)

1. Consider real-time collaboration features when needed

---

## Notes

### Architecture Decisions

- **Nuxt 3**: Full-stack Vue framework with built-in API routes
- **Supabase**: Handles complex backend concerns (database, auth, real-time, storage)
- **TypeScript**: Type safety throughout the application
- **Netlify**: Simple deployment with great developer experience
- **Nuxt UI**: Utility-first styling with built-in component library
- **Cloudflare R2**: Cost-effective S3-compatible storage for audio files

### Cost Estimate

Starting at **$0-20/month**:
- Netlify: Free tier (sufficient for initial deployment)
- Supabase: Free tier (up to 500MB database, 1GB file storage)
- Cloudflare R2: Pay-as-you-go (very affordable for audio storage)

### Known RLS Issues

1. **Infinite Recursion**: The `user_artists` table policies had recursion issues when checking ownership
2. **Circular Dependencies**: Policies referencing `user_artists` while `user_artists` policies reference other tables
3. **Authentication Context**: Ensuring `auth.uid()` is properly available in all policy contexts
4. **Initial Data Access**: New users need to be able to create their first artist and relationship

---

