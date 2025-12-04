# Deployment Guide - GitHub Pages

This guide explains how to deploy Project Atlas dashboard to GitHub Pages.

## Prerequisites

1. GitHub repository with GitHub Pages enabled
2. GitHub Actions enabled for the repository
3. For private repositories: A GitHub Personal Access Token (PAT) with `repo` scope

## Setup Steps

### 1. Enable GitHub Pages

1. Go to your repository settings on GitHub
2. Navigate to **Pages** in the left sidebar
3. Under **Source**, select **GitHub Actions**
4. Save the settings

### 2. Configure GitHub Token (if needed)

For **private repositories**, you need to add a Personal Access Token:

1. Create a PAT with `repo` scope: https://github.com/settings/tokens
2. Go to repository **Settings** → **Secrets and variables** → **Actions**
3. Add a new secret named `GITHUB_TOKEN_PAT` with your PAT value

**Note**: 
- For **public repositories**, the default `GITHUB_TOKEN` provided by GitHub Actions should work
- For **private repositories**, add `GITHUB_TOKEN_PAT` secret - the workflow will use it if available, otherwise falls back to the default token

### 3. Deploy

The deployment happens automatically when you push to the `master` branch, or you can trigger it manually:

1. Go to **Actions** tab in your repository
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow**

## How It Works

The GitHub Actions workflow:

1. **Runs the aggregator** - Fetches project data from GitHub repositories
2. **Builds the dashboard** - Compiles the Svelte app with the latest data
3. **Deploys to GitHub Pages** - Publishes the built files

## Updating Data

To update the project data:

1. Push changes to the `master` branch (or trigger the workflow manually)
2. The workflow will automatically:
   - Run the aggregator to fetch fresh data
   - Build the dashboard with the new data
   - Deploy to GitHub Pages

## Customization

### Changing the Base Path

If your repository name is different, update the base path in `dashboard/vite.config.ts`:

```typescript
base: process.env.GITHUB_PAGES ? '/your-repo-name/' : '/',
```

### Manual Deployment

To deploy manually without GitHub Actions:

```bash
# 1. Run aggregator
cd aggregator
npm install
export GITHUB_TOKEN=your_token_here
npm run start

# 2. Build dashboard
cd ../dashboard
npm install
GITHUB_PAGES=true npm run build

# 3. Deploy the dist folder to GitHub Pages
# (Use gh-pages package or GitHub CLI)
```

## Troubleshooting

### Build fails with "Failed to load projects"

- Ensure the aggregator step completed successfully
- Check that `data/projects/index.json` exists after the aggregator runs
- Verify the GITHUB_TOKEN has the correct permissions

### 404 errors on GitHub Pages

- Verify the base path in `vite.config.ts` matches your repository name
- Check that GitHub Pages is configured to use GitHub Actions as the source
- Ensure the workflow completed successfully

### Rate limit errors

- GitHub API has rate limits (5,000 requests/hour for authenticated users)
- If you hit limits, wait an hour or use a PAT with higher limits

