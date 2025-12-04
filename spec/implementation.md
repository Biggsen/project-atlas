# Project Atlas – Implementation Guide

This document outlines the step-by-step implementation plan for Project Atlas v1.

---

## 1. Project Structure

```
project-atlas/
├── spec/
│   ├── project-atlas-spec.md
│   ├── implementation.md
│   └── reference/              # 6 reference project files
├── template/
│   └── project-summary-template.md
├── config/
│   └── projects.json
├── data/
│   └── projects/
│       ├── index.json          # Generated
│       └── <projectId>.json    # Generated
├── aggregator/                 # Backend (Node.js/TypeScript)
│   ├── src/
│   │   ├── fetcher.ts
│   │   ├── parser.ts
│   │   ├── aggregator.ts
│   │   ├── validator.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── dashboard/                  # Frontend (Vite + Svelte)
│   ├── src/
│   │   ├── lib/
│   │   ├── components/
│   │   └── App.svelte
│   ├── public/
│   │   └── data/               # Symlink or copy from ../data/projects
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 2. Implementation Phases

### Phase 1: Project Setup & Template Creation
**Goal**: Establish project structure and create the template file

**Tasks**:
1. Initialize project structure (directories)
2. Set up aggregator project (Node.js/TypeScript)
   - Initialize npm/package.json
   - Install dependencies: `@octokit/rest`, `remark`/`marked`, `ajv`, TypeScript
   - Configure TypeScript
3. Set up dashboard project (Vite + Svelte)
   - Initialize Vite + Svelte project
   - Configure build
4. Import 6 reference project summary files into `spec/reference/`
5. Analyze reference files to identify:
   - Common section patterns
   - Structural variations
   - TODO item formats
   - Manifest block patterns
6. Create `template/project-summary-template.md` based on analysis
7. Create initial `config/projects.json` (can start with one test project)

**Deliverable**: Project structure ready, template file created

---

### Phase 2: Backend - Fetcher
**Goal**: Fetch markdown files from GitHub

**Tasks**:
1. Create `aggregator/src/fetcher.ts`
2. Implement GitHub API client using `@octokit/rest`
   - Read `GITHUB_TOKEN` from environment
   - Handle authentication
3. Implement file fetching logic:
   - Parse repo owner/name from config
   - Fetch file content via GitHub API
   - Handle rate limiting
   - Error handling (network failures, file not found)
4. Add logging for fetch operations
5. Test with one project from config

**Deliverable**: Can fetch markdown files from GitHub

---

### Phase 3: Backend - Parser (Manifest)
**Goal**: Extract and validate manifest blocks

**Tasks**:
1. Create `aggregator/src/parser.ts`
2. Implement manifest block extraction:
   - Find `<!-- PROJECT-MANIFEST:START -->` and `<!-- PROJECT-MANIFEST:END -->` markers
   - Extract JSON between markers
   - Handle missing markers (error case)
3. Implement JSON parsing:
   - Parse extracted JSON
   - Handle invalid JSON (error case)
4. Create `aggregator/src/validator.ts`
5. Implement schema validation using `ajv`:
   - Load v1 schema
   - Validate required fields
   - Handle schema versioning (accept v1+, validate v1 fields)
   - Log validation errors
6. Test with reference files

**Deliverable**: Can extract and validate manifest blocks

---

### Phase 4: Backend - Parser (Markdown Sections)
**Goal**: Parse markdown sections in type-agnostic way

**Tasks**:
1. Extend `aggregator/src/parser.ts` with markdown parsing
2. Implement section extraction:
   - Parse markdown structure (headings, lists, paragraphs)
   - Extract sections by heading level
   - Preserve structure (don't force categorization)
3. Implement TODO item identification:
   - Find `- [ ]` (incomplete) and `- [x]` (completed) patterns
   - Track which section they belong to
   - Don't categorize beyond complete/incomplete
4. Decide on JSON output structure for parsed content:
   - How to represent sections (array of objects with heading + content?)
   - How to represent TODOs (separate array or embedded?)
   - Test structure with reference files
5. Combine manifest + parsed sections into single object
6. Test with multiple reference files

**Deliverable**: Can parse markdown sections and combine with manifest

---

### Phase 5: Backend - Aggregator
**Goal**: Process all projects and write JSON files

**Tasks**:
1. Create `aggregator/src/aggregator.ts`
2. Implement main aggregation flow:
   - Load `config/projects.json`
   - For each project: fetch → parse → validate
   - Collect all successfully parsed projects
   - Handle errors (log and continue)
3. Implement file writing:
   - Write `data/projects/index.json` (array of all projects)
   - Write `data/projects/<projectId>.json` (individual files)
   - Ensure directory exists
   - Handle write errors
4. Create `aggregator/src/index.ts` (CLI entry point)
5. Add CLI interface:
   - Command to run aggregation
   - Logging output
   - Exit codes
6. Test end-to-end with multiple projects

**Deliverable**: Complete backend aggregator that produces JSON files

---

### Phase 6: Frontend - Data Loading & Basic UI
**Goal**: Display project data in dashboard

**Tasks**:
1. Set up data access:
   - Configure Vite to serve/copy `data/projects/` files
   - Create data loading utilities
   - Handle missing/invalid JSON files
2. Create basic Svelte components:
   - App shell
   - Project list component
   - Project detail component (basic)
3. Implement global view:
   - Load and display `index.json`
   - Show project cards/list with manifest data
   - Basic styling
4. Test with generated data

**Deliverable**: Basic dashboard showing project list

---

### Phase 7: Frontend - Filtering & Sorting
**Goal**: Add filtering and sorting capabilities

**Tasks**:
1. Implement filters:
   - Domain filter ✅
   - Status filter ✅
   - Visibility filter ✅
   - UI controls (dropdowns) ✅
2. Implement sorting:
   - Last updated ✅
   - Completion % ✅
   - Alphabetical ✅
   - Total work items ✅
   - UI controls (sort dropdown) ✅
3. Add filter/sort state management ✅
4. Update project list to respond to filters/sort ✅
5. Display completion percentage on project cards ✅

**Deliverable**: ✅ Dashboard with working filters and sorting

---

### Phase 8: Frontend - Per-Project View
**Goal**: Detailed view for individual projects

**Tasks**:
1. Implement routing/navigation:
   - Route to individual project view ✅
   - Back to list view ✅
2. Create detailed project view:
   - Display all manifest fields ✅
   - Display parsed markdown sections (organized by heading) ✅
   - Display work items grouped by complete/incomplete ✅
   - Filter work items by type ✅
   - Show staleness indicator (20+ days = stale) ✅
3. Style the detailed view ✅
4. Handle edge cases (no sections, no work items) ✅

**Deliverable**: ✅ Complete per-project view

---

### Phase 9: Frontend - Insights
**Goal**: Cross-project insights and patterns

**Tasks**:
1. Implement insight calculations:
   - Overview statistics (aggregation by type and status) ✅
   - Drift detection (active status but untouched > 20 days) ✅
   - Quick wins (identify small/completable items) ✅
   - High-risk zones (many issues, low progress) ✅
   - Release readiness (based on completion, issues) ✅
   - Cross-project work item aggregation (all features, all bugs, etc.) ✅
2. Create insights UI:
   - Insights dashboard/section ✅
   - Visual indicators ✅
   - Links to relevant projects ✅
   - Toggle to show/hide unified work items view ✅
   - Toggle to show/hide completed items in unified view ✅
3. Test with multiple projects ✅

**Deliverable**: ✅ Insights features working

---

### Phase 10: Polish & Refinement
**Goal**: Improve UX, handle edge cases, documentation

**Tasks**:
1. Error handling improvements:
   - Better error messages in UI ✅
   - Loading states with spinners ✅
   - Empty states for all scenarios ✅
2. UX improvements:
   - Better styling/design ✅
   - Responsive layout (mobile-friendly) ✅
   - Performance optimization ✅
   - Clickable home link in header ✅
3. Edge case handling:
   - Projects with no sections ✅
   - Projects with no work items ✅
   - Missing optional fields ✅
   - Empty section content ✅
4. Documentation:
   - Update README ✅
   - Usage instructions ✅
   - How to add new projects ✅
   - Troubleshooting section ✅

**Deliverable**: ✅ Polished, production-ready v1

---

## 3. Key Technical Decisions

### 3.1 Parsed Markdown JSON Structure
**Decision needed**: How to structure parsed sections in JSON output

**Options**:
```json
{
  "manifest": { /* manifest fields */ },
  "sections": [
    { "heading": "## Features (Done)", "content": "...", "level": 2 },
    { "heading": "## Known Issues", "content": "...", "level": 2 }
  ],
  "todos": [
    { "text": "...", "completed": true, "section": "Features (Done)" },
    { "text": "...", "completed": false, "section": "Enhancements" }
  ]
}
```

**Recommendation**: Start simple, iterate based on dashboard needs.

---

### 3.2 Error Logging
**Decision needed**: Where/how to log errors

**Options**:
- Console logging (simple, good for CLI)
- File logging (better for scheduled runs)
- Structured logging (JSON format)

**Recommendation**: Start with console logging, add file logging if needed.

---

### 3.3 Data Access in Frontend
**Decision needed**: How to serve JSON files to frontend

**Options**:
- Copy files to `dashboard/public/data/` during build
- Symlink `data/projects/` to `dashboard/public/data/`
- Serve via API endpoint (overkill for static files)

**Recommendation**: Copy during aggregator run, or symlink for development.

---

## 4. Testing Strategy

### Backend Testing
- Unit tests for parser (manifest extraction, validation)
- Unit tests for markdown parsing
- Integration tests for full aggregation flow
- Test with reference files

### Frontend Testing
- Component tests for key UI components
- Test data loading and error handling
- Manual testing with various project configurations

---

## 5. Milestones

1. ✅ **Spec Complete** - Specification finalized
2. ✅ **Phase 1 Complete** - Project setup, template created
3. ✅ **Phase 2-5 Complete** - Backend aggregator working
4. ✅ **Phase 6-8 Complete** - Frontend dashboard functional
5. ✅ **Phase 9 Complete** - Insights features working (including cross-project unified render)
6. ✅ **Phase 10 Complete** - v1 ready

---

## 6. Implementation Status

**Status**: ✅ **v1 Complete** - All phases implemented and tested

### Completed Features

- ✅ Backend aggregator with GitHub API integration
- ✅ Markdown parsing with manifest extraction
- ✅ Schema validation
- ✅ Project list view with filtering and sorting
- ✅ Project detail view with work item grouping
- ✅ Insights dashboard with all required features
- ✅ Cross-project unified work items view
- ✅ Responsive design
- ✅ Error handling and edge cases
- ✅ Complete documentation

### Next Steps (Future Enhancements)

Potential v2 features:
- Enhanced parsing (more section types, better TODO extraction)
- Optional cached database (read-only index)
- Historical diffs (manifest snapshots over time)
- Plugin system for custom analytics

---

End of Implementation Guide.

