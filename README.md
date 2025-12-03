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

1. **Set up environment variables:**
   ```bash
   export GITHUB_TOKEN=your_token_here
   ```

2. **Configure projects:**
   Edit `config/projects.json` to add your repositories.

3. **Run aggregator:**
   ```bash
   cd aggregator
   npm run dev
   ```

4. **Start dashboard:**
   ```bash
   cd dashboard
   npm run dev
   ```

## Documentation

- [Specification](./spec/project-atlas-spec.md) - Complete system specification
- [Implementation Guide](./spec/implementation.md) - Step-by-step implementation plan

## License

Personal developer tool - see spec for details.

