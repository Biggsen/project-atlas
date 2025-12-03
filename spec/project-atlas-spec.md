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

Each repo includes a project summary file following the naming pattern:
- `[project-name]-project-summary.md`

Examples:
- `tasks/vz-price-guide-project-summary.md`
- `tasks/musicaid-project-summary.md`

The exact path and filename are specified in `config/projects.json` (see section 10).

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
  "type": "webapp",
  "lastUpdated": "2025-01-15",
  "links": {
    "prod": "https://example.com",
    "staging": null
  },
  "tags": ["webapp", "minecraft", "price-guide"]
}
```
<!-- PROJECT-MANIFEST:END -->
````

### 3.2 Work Item Types
Project summary files use a structured approach with four defined work item types. The template enforces this structure, ensuring consistent organization across all projects.

**Work Item Types:**
1. **Features** - New functionality being built or completed
   - Sections: `## Features (Done)`, `## Features (In Progress)`, etc.
2. **Enhancements** - Improvements to existing features
   - Sections: `## Enhancements`, `## Outstanding Enhancements`, etc.
3. **Bugs** - Problems and issues that need to be fixed
   - Sections: `## Known Issues`, `## Active Bugs`, `## Outstanding Issues`, etc.
4. **Tasks** - Inbox for uncategorized work items that may later become features or enhancements
   - Sections: `## Outstanding Tasks`, `## Tasks`, etc.

**Parser Behavior:**
- Extracts items from these sections and tags them with their type based on the section heading
- Identifies TODO items (`- [ ]` incomplete, `- [x]` completed) within any section
- Preserves markdown structure (lists, paragraphs, etc.)
- No inference needed - items are tagged by the section they appear in

The template provides the standard structure, and project files should follow this structure when created or regenerated.

### 3.3 Template File
A template file (`template/project-summary-template.md`) will be provided as a reference for the exact structure required by Project Atlas. This template includes:

- Complete manifest block with all required fields and examples
- Standard section structure with all four work item types (Features, Enhancements, Bugs, Tasks)
- Example section headings and structure
- TODO item format examples
- Comments explaining each part and work item type

This template serves as the canonical reference for migrating existing project files to match the Atlas structure. Each repo should follow this template when creating or regenerating their project summary file to ensure consistent structure and proper work item typing.

**Reference Files**: During template creation, 6 existing project summary files were imported into this project as reference material. These reference files were analyzed to identify common patterns, structural variations, and standardization needs, ensuring the template accurately reflects real-world project file structures.

---

## 4. Project Atlas Architecture

### 4.1 Components
- **Fetcher**  
  Pulls raw markdown files from GitHub using raw URLs or GitHub API.

- **Parser**  
  Extracts the manifest block, validates it against the schema, and parses markdown sections. Items are extracted from standard sections (Features, Enhancements, Bugs, Tasks) and tagged with their work item type based on the section heading.

- **Aggregator**  
  Compiles all manifests and writes JSON files to disk:
  - `data/projects/index.json` - Combined array of all project manifests
  - `data/projects/<projectId>.json` - Individual project manifest files
  
  Files are written relative to the project root. No database required.

- **Dashboard UI**  
  Read-only interface that reads the generated JSON files from `data/projects/` to display cross-project insights.

---

## 5. Tech Stack

### 5.1 Backend (Aggregator)
- **Runtime**: Node.js with TypeScript
- **GitHub API**: `@octokit/rest`
- **Markdown Parsing**: `remark` or `marked`
- **JSON Schema Validation**: `ajv` or similar
- **CLI**: Command-line tool that runs on-demand or via scheduled tasks

### 5.2 Frontend (Dashboard)
- **Framework**: Svelte
- **Build Tool**: Vite
- **Data Source**: Reads static JSON files from `data/projects/`
- **No Backend Required**: Pure client-side application

---

## 6. Configuration

### 6.1 GitHub Authentication
Project Atlas requires a GitHub Personal Access Token to fetch project summary files.

**Setup:**
1. Create a token with `repo` scope (for private repos) or no scope needed (for public repos only)
2. Store the token in an environment variable: `GITHUB_TOKEN`
3. The app reads this token at runtime for all GitHub API requests

**Rate Limits:**
- Authenticated requests: 5,000 requests/hour
- Unauthenticated: 60 requests/hour

---

## 7. Manifest Schema (v1)

```json
{
  "schemaVersion": 1,
  "projectId": "string",
  "name": "string",
  "repo": "string",
  "visibility": "public|staging|private",
  "status": "active|mvp|paused|archived",
  "domain": "music|minecraft|management|other",
  "type": "webapp|microservice|tool|cli|library|other",
  "lastUpdated": "ISO date string",
  "links": {
    "prod": "string|null",
    "staging": "string|null"
  },
  "tags": ["string"]
}
```

### 7.1 Schema Versioning
The system uses forward-compatible schema versioning:

- **Current supported version**: v1
- **Higher versions**: Manifests with `schemaVersion > 1` are accepted if they include all required v1 fields
- **Validation**: Only v1 required fields are validated; additional fields in higher versions are preserved but ignored
- **Backward compatibility**: Future schema versions must include all v1 fields to maintain compatibility

This allows repos to adopt newer schema versions while older versions of Project Atlas continue to function.

---

## 8. Aggregator Flow

1. Load config of repos + paths (`config/projects.json`)
2. For each project:
   - Fetch file from GitHub
   - Locate manifest start/end markers
   - Parse manifest JSON
   - Validate manifest against schema
   - Parse markdown sections and extract work items (Features, Enhancements, Bugs, Tasks)
   - Tag items with their type based on section headings
   - Combine manifest + parsed sections
   - Store result in memory
3. Write JSON files to disk (`data/projects/` directory):
   - `index.json`: Array containing all successfully parsed projects (manifest + parsed content)
   - `<projectId>.json`: Individual project file with manifest + parsed content
4. Dashboard UI reads the generated JSON files from `data/projects/`

The system regenerates all files on demand or via scheduled/GitHub Action runs. Files are overwritten on each aggregation run.

### 8.1 Error Handling
When errors occur during fetching or parsing, the system follows a **log and continue** strategy:

- **Missing manifest blocks**: Log error with project ID, skip project, continue processing others
- **Invalid JSON**: Log parsing error with project ID, skip project, continue processing others
- **Schema validation failures**: Log validation errors with project ID, skip project, continue processing others
- **Network failures**: Log network error with project ID, skip project, continue processing others
- **Repo/file not found**: Log not found error with project ID, skip project, continue processing others

All errors are logged with sufficient context (project ID, repo, path, error type) for debugging. The aggregation process completes successfully even if some projects fail, producing output files with only the successfully parsed projects.

---

## 9. Dashboard Features (Read-Only)

### 9.1 Global View
- List of all projects
- Filters:
  - domain (field/area: music, minecraft, management, etc.)
  - type (technical architecture: webapp, microservice, tool, etc.)
  - status
  - visibility
- Sorting:
  - last updated
  - alphabetical

### 9.2 Per-Project View
- Manifest details
- Work items organized by type (Features, Enhancements, Bugs, Tasks)
- TODO items identified across all sections (completed and incomplete)
- GitHub links to edit real files
- Staleness indicator: Shows time since `lastUpdated`. Projects with `lastUpdated` older than 20 days are considered stale.

### 9.3 Insights
- Drift detection (active but untouched)
- Quick wins (small items across repos)
- High-risk zones (many bugs, low progress)
- Cross-project work item aggregation (all features, all bugs, etc.)
- Release readiness

---

## 10. Config Example (`config/projects.json`)

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

## 11. Non-Goals (To Avoid To-Do-App Creep)
- No task creation
- No editing project data
- No writing back to repos
- No Kanban boards
- No reminders or notifications
- No concept of “assigned to”, “due dates”, etc.

This is intentionally a read-only intelligence layer.

---

## 12. Roadmap (Minimal)
- v1: Fetch → Parse manifest + structured sections → Aggregate → Display
- v2: Enhanced parsing (more section types, better TODO extraction)
- v3: Optional cached DB (read-only index)
- v4: Historical diffs (manifest snapshots over time)
- v5: Plugin system for custom analytics

---

## 13. License & Ownership
This is a strictly personal developer tool.  
All data is sourced from private or public repos you own.  
No external dependencies on proprietary task systems.

---

End of Spec v1.
