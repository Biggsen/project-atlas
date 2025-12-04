# Export All Function

## Overview
Create a function that exports all project data into a single file format suitable for dropping into ChatGPT for review/analysis.

## Requirements
- Generate a single file containing all project data
- Format should be readable by ChatGPT (likely markdown or structured text)
- Include all relevant project information:
  - Manifest data
  - Work items (organized by type)
  - Sections content
  - Summary statistics
- Should be easy to copy/paste or download

## Implementation Options

### Option 1: CLI Command in Aggregator
Add a new command to the aggregator:
```bash
npm run export-all
```
Generates a markdown file with all project data.

### Option 2: Dashboard Export Button
Add an export button in the dashboard that generates and downloads the file.

### Option 3: Both
Implement both CLI and UI options.

## Output Format
Consider markdown format with:
- Project summaries
- All work items organized by type
- Completion statistics
- Cross-project insights summary

## File Location
- CLI: Output to `data/export-all-projects.md` or similar
- Dashboard: Download as file

## Use Cases
- Share project status with AI for analysis
- Create backup/snapshot of all project data
- Generate reports for stakeholders

