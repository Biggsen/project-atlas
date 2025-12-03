<!-- PROJECT-MANIFEST:START -->
```json
{
  "schemaVersion": 1,
  "projectId": "mc-map-generator",
  "name": "MC Map Generator",
  "repo": "Biggsen/mc-map-generator",
  "visibility": "public",
  "status": "mvp",
  "domain": "minecraft",
  "type": "microservice",
  "lastUpdated": "2024-12-31",
  "links": {
    "prod": "https://mc-map-generator-production.up.railway.app",
    "staging": null
  },
  "tags": ["minecraft", "microservice", "puppeteer", "railway"]
}
```
<!-- PROJECT-MANIFEST:END -->

# MC Map Generator - Project Summary

## Project Overview

**MC Map Generator** is a standalone microservice that generates high-quality Minecraft biome maps from seeds using Puppeteer automation. The service automates the process of taking screenshots from mcseedmap.net and processes them into optimized PNG images.

### Key Features

- Generates biome maps from Minecraft seeds
- Supports all three dimensions (overworld, nether, end)
- Configurable world sizes (2k-16k)
- Concurrent job processing (max 3 simultaneous)
- Async job processing with status polling

---

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Automation**: Puppeteer
- **Image Processing**: Sharp
- **Module System**: ES Modules
- **Deployment**: Railway

### Key Dependencies

- express: ^4.18.0
- puppeteer: ^24.0.0
- sharp: ^0.33.0
- cors: ^2.8.5
- dotenv: ^16.0.0

### Core Components

```
src/
├── server.js          # Express API server with job management
├── screenshot.js      # Puppeteer automation and image processing
├── storage.js          # File storage utilities
└── utils.js           # Helper functions (validation, logging, etc.)
```

---

## Current Focus

Currently in MVP phase - core functionality is complete and deployed. Focus is on production stability and documentation improvements.

---

## Features (Done)

<!-- 
  WORK ITEM TYPE: Features
  
  List completed features and major accomplishments.
  Use checkboxes to mark completed items if desired.
  Items in this section will be tagged as "Features" by the parser.
  The parser will identify TODO items (- [ ] and - [x]) throughout the document.
-->

- [x] Express API server with full endpoint implementation
- [x] Puppeteer automation for map generation
- [x] Image processing (crop, resize) with Sharp
- [x] Support for all 3 dimensions (overworld, nether, end)
- [x] Configurable world sizes (2k-16k)
- [x] Concurrent job handling (max 3 simultaneous)
- [x] Job status tracking (in-memory Map)
- [x] Error handling and logging
- [x] Health check and monitoring endpoints
- [x] Railway deployment configuration
- [x] CORS support
- [x] Input validation
- [x] Structured logging
- [x] Static file serving for generated images
- [x] Ephemeral file storage (local filesystem)

### API Endpoints

- [x] POST `/api/generate` - Creates async map generation job
- [x] GET `/api/status/:jobId` - Poll endpoint for job completion
- [x] GET `/api/health` - Service health status
- [x] GET `/api/stats` - Service statistics
- [x] POST `/api/cleanup` - Manual cleanup of old completed jobs

### Documentation

- [x] README.md - Quick start and overview
- [x] docs/API.md - Complete API documentation
- [x] spec/mc-map-generator-service-spec.md - Technical specification

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

- [ ] Automated file cleanup - Scheduled cleanup job (cron or interval) with configurable retention period
- [ ] Advanced monitoring - Metrics collection (request rates, success/failure rates), performance monitoring, memory usage tracking

### Medium Priority Enhancements

- [ ] Caching strategies - Cache frequently requested seeds to reduce redundant map generations
- [ ] Performance optimization - Load testing, memory usage optimization, browser resource management improvements
- [ ] Enhanced error recovery - Automatic retry mechanisms, better error categorization

### Low Priority Enhancements

- [ ] 16k world size optimization
- [ ] Production monitoring improvements
- [ ] Integration with monitoring services

---

## Known Issues

<!-- 
  WORK ITEM TYPE: Bugs
  
  Document bugs, problems, or issues that need to be addressed.
  Include severity, affected areas, and workarounds if available.
  Items in this section will be tagged as "Bugs" by the parser.
  
  Alternative section headings: "Active Bugs", "Outstanding Issues", "Bugs"
-->

_No active bugs at this time._

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

- [ ] Testing Suite - Jest and Supertest dependencies exist, but no tests written. Required: Unit tests for API endpoints, integration tests for screenshot generation, error handling tests, input validation tests
- [ ] Deployment Documentation - Create `docs/DEPLOYMENT.md` with Railway deployment steps, environment configuration guide, monitoring setup, troubleshooting guide

### Medium Priority

- [ ] Persistent Storage - AWS S3 integration for image storage (currently using ephemeral local storage, images lost on Railway deployments)

### Future Considerations

- [ ] Redis for job tracking at scale
- [ ] Database for job history and analytics
- [ ] CDN for image delivery
- [ ] Rate limiting per user/IP
- [ ] Authentication/authorization if needed

---

## Project Status

**Overall Status**: MVP Complete, Production Ready  
**Last Major Update**: December 2024

### Metrics

- **Total Source Files**: 4 core modules
- **Lines of Code**: ~800+ (estimated)
- **API Endpoints**: 5
- **Supported Dimensions**: 3 (overworld, nether, end)
- **Supported World Sizes**: 15 (2k-16k)
- **Concurrent Jobs**: 3 maximum
- **Generation Time**: 30-60 seconds
- **Test Coverage**: 0% (no tests implemented)

### Success Metrics

- ✅ Generate maps from any valid seed
- ✅ Support all three dimensions
- ✅ Return high-quality 1000x1000 images
- ✅ Handle 3+ concurrent requests
- ✅ Deploy to Railway successfully
- ✅ 95%+ uptime target
- ✅ <60 second generation time

---

## Next Steps

### Immediate (Next 1-2 weeks)

1. Write Test Suite - Critical for maintaining code quality
2. Create Deployment Guide - Document deployment process

### Short-term (Next 1-3 months)

1. Implement Persistent Storage - Move to S3 for production reliability
2. Add Automated Cleanup - Prevent storage issues
3. Enhance Monitoring - Better production visibility

### Long-term (3+ months)

1. Performance optimization and load testing
2. Advanced features (Redis, database, CDN)
3. Rate limiting and authentication if needed

---

## Notes

### Design Decisions

1. **Ephemeral Storage**: Chosen for MVP simplicity, acceptable trade-off
2. **In-Memory Job Tracking**: Simple for MVP, may need Redis for scale
3. **Puppeteer**: Reliable but resource-intensive, requires careful management
4. **Async Job Processing**: Returns immediately, improves UX

### Technical Challenges

- Puppeteer browser management and resource cleanup
- Image processing and cropping accuracy
- Handling dynamic web page interactions
- Concurrent job resource management

### Code Quality

**Strengths:**
- Clean, modular architecture
- Comprehensive error handling
- Structured logging
- Input validation
- Well-documented API
- ES6+ modern JavaScript

**Areas for Improvement:**
- No automated tests
- Missing deployment documentation
- Ephemeral storage (acceptable for MVP)
- No automated cleanup
- Limited monitoring/metrics

---

