<!-- PROJECT-MANIFEST:START -->
```json
{
  "schemaVersion": 1,
  "projectId": "region-forge",
  "name": "MC Region Maker",
  "repo": "Biggsen/region-forge",
  "visibility": "public",
  "status": "mvp",
  "domain": "minecraft",
  "type": "webapp",
  "lastUpdated": "2024-12-31",
  "links": {
    "prod": null,
    "staging": null
  },
  "tags": ["minecraft", "webapp", "react", "vercel"]
}
```
<!-- PROJECT-MANIFEST:END -->

# MC Region Maker - Project Summary

## Project Overview

**MC Region Maker** is a professional browser-based tool for defining and managing polygonal exploration regions over Minecraft biome map images. Draw regions directly on the map, manage complex configurations, and export WorldGuard-style region data.

### Key Features

- Draw polygonal regions on Minecraft biome maps
- Multi-dimension support (Overworld, Nether, End)
- WorldGuard-compatible YAML export
- Project management with embedded map images
- Village management and plugin configuration generators

---

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Context API with custom hooks
- **Canvas Rendering**: HTML5 Canvas API
- **Hosting**: Vercel (production)
- **Map Generator**: External microservice (Puppeteer-based) on Railway
- **Image Proxy**: Express server (port 3002) for CORS-free image loading

---

## Current Focus

MVP is complete and deployed to production. Focus is on bug fixes and security improvements.

---

## Features (Done)

<!-- 
  WORK ITEM TYPE: Features
  
  List completed features and major accomplishments.
  Use checkboxes to mark completed items if desired.
  Items in this section will be tagged as "Features" by the parser.
  The parser will identify TODO items (- [ ] and - [x]) throughout the document.
-->

### Core Functionality

- [x] Map Loading - Generate maps from seeds or load from URLs via integrated microservice
- [x] Region Drawing - Draw polygonal regions by clicking points on the map
- [x] Coordinate System - Automatic conversion between image pixels and Minecraft world coordinates
- [x] Grid Overlay - Optional chunk grid (16×16 blocks) for precise alignment
- [x] Region Editing - Comprehensive editing tools (move, resize, split, warp, simplify)
- [x] YAML Export - Generate WorldGuard-compatible region configurations
- [x] Project Management - Save and load complete projects with embedded map images
- [x] Region Search - Quick search and filter regions by name
- [x] Village Management - Import villages from CSV and assign to regions
- [x] Plugin Generators - Generate configurations for Achievements, Events, and LevelledMobs
- [x] Custom Markers - Place and manage custom markers on the map
- [x] Multi-Dimension Support - Work with Overworld, Nether, and End maps
- [x] Region Statistics - Calculate region areas and display center points

### UI/UX

- [x] Tab-Based Interface - Organized Map → Regions → Export workflow
- [x] Dark Theme - Modern, professional interface
- [x] Real-Time Updates - Live preview of region YAML as you edit
- [x] Auto-Save - Automatic persistence of regions and map state
- [x] Responsive Design - Works across different screen sizes
- [x] Image Validation - Square dimension validation, size limits (250x250 to 2000x2000)
- [x] Loading States - Async map generation with progress indicators
- [x] Error Handling - Clear error messages and user feedback
- [x] Basic zoom controls - Mouse wheel zoom, space+drag pan
- [x] Zoom to region - Zoom to selected region bounds
- [x] Region search/filter in sidebar
- [x] Bulk delete - Delete all regions implemented

### Security

- [x] SSRF Protection - Image proxy validates URLs, blocks private IPs, DNS resolution
- [x] CORS Restrictions - Environment-based origin whitelist
- [x] Content Security Policy - CSP headers configured in Vercel
- [x] Rate Limiting - Implemented on image proxy endpoints
- [x] Error Sanitization - Production-safe error messages
- [x] Image dimension validation

### Bug Fixes

- [x] Region Creation Without Map - "Create New Region" button disabled when no map is loaded, with clear messaging

---

## Features (In Progress)

<!-- 
  WORK ITEM TYPE: Features
  
  List features currently being developed.
  Include estimated completion or progress indicators if helpful.
  Items in this section will be tagged as "Features" by the parser.
-->

_No features currently in active development. MVP is complete._

---

## Enhancements

<!-- 
  WORK ITEM TYPE: Enhancements
  
  List improvements and enhancements to existing features.
  These are not new features, but improvements to what already exists.
  Items in this section will be tagged as "Enhancements" by the parser.
-->

### High Priority Enhancements

- [ ] Enhanced Drawing Tools - Chunk snapping for precise region boundaries, rectangle drawing tool, circle drawing tool, undo/redo functionality, delete individual points while drawing
- [ ] Improved UI/UX - Zoom to fit (automatically fit map to canvas on load), mini-map for navigation, keyboard shortcuts, bulk region operations (duplicate, merge)

### Medium Priority Enhancements

- [ ] Advanced Features - Region templates/presets, region categories/tags, region descriptions/notes, region validation (check for overlapping regions), region perimeter calculation
- [ ] Performance & Technical - Comprehensive error handling across all operations, optimize canvas rendering for large maps, add unit tests, add integration tests

### Low Priority Enhancements

- [ ] User Experience - Onboarding system (step-by-step guides, tutorials, tooltips), keyboard navigation support, screen reader compatibility, high contrast mode, colorblind-friendly UI, mobile responsiveness improvements
- [ ] File Upload Functionality - Drag & drop file upload for local images (nice-to-have, not MVP requirement), file validation (PNG, JPG format), display upload progress/loading state, handle upload errors gracefully. Note: URL loading and seed generation cover all essential use cases. File upload depends on user accounts feature.

---

## Known Issues

<!-- 
  WORK ITEM TYPE: Bugs
  
  Document bugs, problems, or issues that need to be addressed.
  Include severity, affected areas, and workarounds if available.
  Items in this section will be tagged as "Bugs" by the parser.
  
  Alternative section headings: "Active Bugs", "Outstanding Issues", "Bugs"
-->

### Medium Priority Bugs

- [ ] World Size Slider for Nether and End Dimensions - The Nether and End dimensions should have world size slider controls, similar to the Overworld dimension. Currently, world size slider may only be available for Overworld dimension. Affected components: World size controls (likely `WorldSizeHeading.tsx` or related components), dimension selection/world type management (likely `useWorldType.ts` or related hooks).

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

- [ ] Complete file upload validation - Missing file size limits (10MB), missing MIME type validation for JSON imports, missing JSON parsing limits/timeouts
- [ ] Add missing security headers - Missing site-wide headers: X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy
- [ ] Improve frontend URL validation - Still uses simple string checks (`startsWith('http')`), should use `URL` constructor with proper hostname validation
- [ ] Implement logging utility - No structured logging system exists, console.log still used throughout codebase, should implement environment-based logging utility

### Medium Priority

- [ ] User Accounts Implementation - Authentication system (email/password, OAuth future), cloud storage for projects, image upload capability, project sharing via links, multi-device synchronization, user profiles and settings. Implementation phases: Core Authentication (2-3 weeks), Cloud Project Storage (2-3 weeks), Image Upload (1-2 weeks), Project Sharing (1 week), Enhanced Features (2 weeks)

### Low Priority / Future

- [ ] Onboarding System - Step-by-step guides, tutorials, tooltips
- [ ] Comprehensive Testing - Unit tests, integration tests, cross-browser testing
- [ ] Performance Optimization - Canvas rendering optimization, large map handling
- [ ] Additional Polish - UI refinements, accessibility improvements

---

## Project Status

**Overall Status**: MVP Complete and Deployed  
**Production Ready**: Yes, fully functional  
**Last Major Update**: December 2024

### Metrics

- **Framework**: React 18 + TypeScript
- **Storage**: localStorage for persistence
- **Export Formats**: WorldGuard YAML, complete project JSON
- **MVP Status**: Complete and deployed
- **Technical Debt**: Minimal - well-organized codebase
- **Security**: Critical vulnerabilities addressed, some medium-priority items remain

---

## Next Steps

### Immediate (Bug Fixes)

1. Add world size slider for Nether and End dimensions

### Short Term (Security & Polish)

1. Complete file upload validation
2. Add missing security headers
3. Improve frontend URL validation
4. Implement logging utility

### Medium Term (Features)

1. Enhanced drawing tools (chunk snapping, rectangle/circle tools)
2. UI improvements (zoom to fit, mini-map, keyboard shortcuts)
3. File upload functionality (requires user accounts)

### Long Term (Major Features)

1. User accounts implementation
2. Cloud storage and project sharing
3. Onboarding system
4. Comprehensive testing suite

---

## Notes

### Architecture

- **Frontend**: Client-side React application
- **Storage**: localStorage for persistence
- **Export Formats**: WorldGuard YAML, complete project JSON

### Security Status

**Partially Implemented:**
- Image dimension validation exists
- `X-Content-Type-Options` set in proxy-image.js responses

**Missing:**
- File size limits (10MB)
- MIME type validation for JSON imports
- JSON parsing limits/timeouts
- Site-wide security headers (X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy)
- Proper frontend URL validation
- Structured logging system

### Future Considerations

- User accounts feature will enable file upload functionality
- Backend service (Express.js/Fastify) needed for user accounts
- Database (PostgreSQL) needed for user accounts
- File storage (AWS S3 or similar) needed for user accounts
- Email service needed for user verification and password reset

---

