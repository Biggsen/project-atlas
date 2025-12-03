# Project Atlas – Specification (v1)

## 1. Overview
Project Atlas is a read-only Project Intelligence Layer that aggregates structured data from multiple GitHub repositories. Each repository contains a project summary file following a strict manifest schema. Project Atlas fetches, parses, and exposes this information through a unified dashboard and JSON API. No data is created or modified by the app; all truth lives in the repos.

---

## 2. Core Principles
1. **Repos are the source of truth**  
   Project Atlas never writes to repos and never stores canonical data.

2. **Read-only intelligence**  
   The app surfaces insights, but does not manage tasks or introduce its own task layer.

3. **Strict manifest contract**  
   Every project summary file includes a machine-readable JSON manifest between special markers.

4. **Zero drift**  
   AI can regenerate summaries often; the manifest block prevents structure loss.

5. **Insight, not task management**  
   The dashboard highlights status, focus, drift, progress, and cross-project patterns.

---

## 3. Repository Project File Structure

Each repo includes a file such as:
- `tasks/project-summary.md`
- `docs/project-summary.md`
- Or similarly named

### 3.1 Manifest Block
Found at the top of the file:

````md
<!-- PROJECT-MANIFEST:START -->
```json
{
  "schemaVersion": 1,
  "projectId": "vz-price-guide-v2",
  "name": "VZ Price Guide v2",
  "repo": "Biggsen/vz-price-guide-v2",
  "visibility": "public",
  "status": "active",
  "domain": "minecraft",
  "lastUpdated": "2025-01-15",
  "overallCompletion": 0.85,
  "links": {
    "prod": "https://example.com",
    "staging": null
  },
  "tags": ["webapp", "minecraft", "price-guide"]
}
```
<!-- PROJECT-MANIFEST:END -->
````

### 3.2 Semi-Structured Sections
These sections follow predictable headings:

```
## Project Overview
## Tech Stack
## Current Focus
## Features (Done)
## Features (In Progress)
## Enhancements
## Known Issues
```

The app may optionally parse:
- `- [ ]` TODO items  
- `- [x]` completed items  

But this input is informational only.

---

## 4. Project Atlas Architecture

### 4.1 Components
- **Fetcher**  
  Pulls raw markdown files from GitHub using raw URLs or GitHub API.

- **Parser**  
  Extracts the manifest block, validates it, and optionally parses structured sections.

- **Aggregator**  
  Compiles all manifests into:
  - `/data/projects/index.json`
  - `/data/projects/<projectId>.json`

- **Dashboard UI**  
  Read-only interface showing cross-project insights.

- **Optional Cache Layer (No DB required initially)**  
  Local storage of computed manifest JSON files.

---

## 5. Manifest Schema (v1)

```json
{
  "schemaVersion": 1,
  "projectId": "string",
  "name": "string",
  "repo": "string",
  "visibility": "public|staged|private",
  "status": "active|mvp|paused|archived",
  "domain": "minecraft|webapp|tool|other",
  "lastUpdated": "ISO date string",
  "overallCompletion": "number (0-1)",
  "links": {
    "prod": "string|null",
    "staging": "string|null"
  },
  "tags": ["string"]
}
```

Future schema versions can expand with backward compatibility.

---

## 6. Aggregator Flow

1. Load config of repos + paths (`config/projects.json`)
2. For each project:
   - Fetch file from GitHub
   - Locate manifest start/end markers
   - Parse JSON
   - Validate against schema
   - Store result in memory
3. Write output files:
   - Combined index: array of all manifests
   - Per-project manifest JSON files
4. UI reads aggregated files

The system regenerates everything on demand or via scheduled/GitHub Action runs.

---

## 7. Dashboard Features (Read-Only)

### 7.1 Global View
- List of all projects
- Filters:
  - domain
  - status
  - visibility
- Sorting:
  - last updated
  - completion %
  - alphabetical

### 7.2 Per-Project View
- Manifest details
- Parsed features/issues (optional)
- GitHub links to edit real files
- Staleness indicator (time since last update)

### 7.3 Insights
- Drift detection (active but untouched)
- Quick wins (small items across repos)
- High-risk zones (many issues, low progress)
- Release readiness

---

## 8. Config Example (`config/projects.json`)

```json
[
  {
    "projectId": "vz-price-guide-v2",
    "repo": "Biggsen/vz-price-guide-v2",
    "path": "tasks/vz-price-guide-project-summary.md"
  },
  {
    "projectId": "musicaid",
    "repo": "Biggsen/musicaidv2",
    "path": "tasks/musicaid-project-summary.md"
  }
]
```

---

## 9. Non-Goals (To Avoid To-Do-App Creep)
- No task creation
- No editing project data
- No writing back to repos
- No Kanban boards
- No reminders or notifications
- No concept of “assigned to”, “due dates”, etc.

This is intentionally a read-only intelligence layer.

---

## 10. Roadmap (Minimal)
- v1: Fetch → Parse → Aggregate → Display
- v2: Optional parsing of structured sections
- v3: Optional cached DB (read-only index)
- v4: Historical diffs (manifest snapshots over time)
- v5: Plugin system for custom analytics

---

## 11. License & Ownership
This is a strictly personal developer tool.  
All data is sourced from private or public repos you own.  
No external dependencies on proprietary task systems.

---

End of Spec v1.
