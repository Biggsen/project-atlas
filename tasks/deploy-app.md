# Deploy App

## Overview
Deploy Project Atlas dashboard to a hosting service for public/private access.

## Requirements
- Choose hosting platform (Vercel, Netlify, GitHub Pages, etc.)
- Configure build process
- Set up data file serving (ensure `data/projects/` files are accessible)
- Configure environment variables if needed
- Set up CI/CD for automatic deployments
- Update aggregator to run on schedule (GitHub Actions, cron, etc.)

## Considerations
- Dashboard is a static Svelte app that reads JSON files
- Need to ensure `data/projects/` directory is copied/served correctly
- May need to configure Vite build to include data files in public directory
- Consider setting up automated aggregation runs that update data files

## Steps
1. Choose hosting platform
2. Configure build settings
3. Set up data file serving
4. Deploy initial version
5. Set up automated aggregation (if needed)
6. Test deployment
7. Document deployment process

