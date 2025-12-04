# Project Atlas

A read-only Project Intelligence Layer that aggregates structured data from multiple GitHub repositories.

## Overview

Project Atlas fetches, parses, and exposes project information from GitHub repositories through a unified dashboard. Each repository contains a project summary file following a strict manifest schema.

## Project Structure

```
project-atlas/
├── aggregator/      # Backend (Node.js/TypeScript)
├── dashboard/       # Frontend (Vite + Svelte)
├── config/          # Configuration files
├── data/            # Generated JSON data files
├── spec/            # Specifications and documentation
└── template/        # Project summary template
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- GitHub Personal Access Token with `repo` scope (for private repos)

### Setup

1. **Install dependencies:**
   ```bash
   # Install aggregator dependencies
   cd aggregator
   npm install

   # Install dashboard dependencies
   cd ../dashboard
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # On Unix/Mac
   export GITHUB_TOKEN=your_token_here

   # On Windows (PowerShell)
   $env:GITHUB_TOKEN="your_token_here"
   ```

3. **Configure projects:**
   Edit `config/projects.json` to add your repositories. See [Adding New Projects](#adding-new-projects) below.

4. **Run aggregator:**
   ```bash
   cd aggregator
   npm run dev
   ```
   This fetches project summary files from GitHub and generates JSON data files in `data/projects/`.

5. **Start dashboard:**
   ```bash
   cd dashboard
   npm run dev
   ```
   The dashboard will be available at `http://localhost:5173` (or the port shown in the terminal).

## Adding New Projects

To add a new project to Project Atlas:

1. **Ensure your repository has a project summary file:**
   - The file should follow the naming pattern: `[project-name]-project-summary.md`
   - It must include a manifest block with required fields (see `template/project-summary-template.md`)

2. **Add project to configuration:**
   Edit `config/projects.json` and add a new entry:
   ```json
   {
     "projectId": "your-project-id",
     "repo": "username/repo-name",
     "path": "path/to/project-summary.md"
   }
   ```

3. **Run the aggregator:**
   ```bash
   cd aggregator
   npm run dev
   ```

4. **Refresh the dashboard:**
   The new project will appear in the dashboard after the aggregator completes.

## Usage

### Dashboard Features

- **Projects View**: Browse all projects with filtering and sorting options
  - Filter by: domain, type, status, visibility
  - Sort by: name, last updated, total work items, completion percentage
  - Click any project card to view details

- **Insights View**: Cross-project intelligence and patterns
  - **Drift Detection**: Active projects that haven't been updated in 20+ days
  - **Quick Wins**: Projects with few remaining items (≤5) and good progress (≥50%)
  - **High-Risk Zones**: Projects with many bugs (≥3) and low completion (<70%)
  - **Release Ready**: Projects with high completion (≥80%) and few bugs (<3)
  - **Aggregation**: Overview statistics across all projects

- **Project Detail View**: Detailed information for individual projects
  - Manifest details (status, domain, type, links, tags)
  - Work items organized by type (Features, Enhancements, Bugs, Tasks)
  - Work items grouped by completion status
  - Full markdown sections from the project summary

### Updating Project Data

To refresh project data after changes in repositories:

1. Run the aggregator again:
   ```bash
   cd aggregator
   npm run dev
   ```

2. Refresh the dashboard in your browser

The aggregator will fetch the latest project summary files and regenerate all JSON data files.

## Project Structure

```
project-atlas/
├── aggregator/          # Backend (Node.js/TypeScript)
│   ├── src/
│   │   ├── fetcher.ts   # GitHub API client
│   │   ├── parser.ts    # Markdown & manifest parser
│   │   ├── validator.ts # Schema validation
│   │   ├── aggregator.ts # Main aggregation logic
│   │   └── index.ts      # CLI entry point
│   └── package.json
├── dashboard/           # Frontend (Vite + Svelte)
│   ├── src/
│   │   ├── lib/
│   │   │   ├── ProjectList.svelte  # Project list view
│   │   │   ├── ProjectView.svelte # Project detail view
│   │   │   ├── Insights.svelte    # Insights dashboard
│   │   │   ├── api.ts              # Data loading utilities
│   │   │   └── insights.ts         # Insight calculations
│   │   └── App.svelte
│   └── package.json
├── config/
│   └── projects.json    # Project configuration
├── data/
│   └── projects/        # Generated JSON files (gitignored)
│       ├── index.json
│       └── <projectId>.json
├── spec/                # Specifications and documentation
└── template/            # Project summary template
```

## Troubleshooting

### Dashboard shows "Failed to Load Projects"

- Ensure the aggregator has been run successfully
- Check that `data/projects/index.json` exists
- Verify the data files are accessible (check browser console for errors)

### Aggregator fails to fetch files

- Verify your `GITHUB_TOKEN` is set correctly
- Check that the token has the `repo` scope (for private repos)
- Ensure the repository paths in `config/projects.json` are correct
- Check GitHub API rate limits (authenticated: 5,000 requests/hour)

### Projects not appearing in dashboard

- Run the aggregator to regenerate data files
- Check for errors in the aggregator output
- Verify project summary files exist in the specified repositories
- Ensure manifest blocks are valid JSON

## Documentation

- [Specification](./spec/project-atlas-spec.md) - Complete system specification
- [Implementation Guide](./spec/implementation.md) - Step-by-step implementation plan
- [Project Summary Template](./template/project-summary-template.md) - Template for project summary files

## License

Personal developer tool - see spec for details.

