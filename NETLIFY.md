# Netlify Deployment Guide

## Quick Deploy

1. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select `eveiljuice/json-to-toon`

2. **Build Settings** (auto-detected from `netlify.toml`)
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

3. **Deploy**
   - Netlify will automatically deploy on every push to `main` branch

## Manual Deploy

```bash
# Build locally
npm run build

# Deploy using Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## Environment Variables

No environment variables required for this project.

## Custom Domain

After deployment, you can add a custom domain in Netlify dashboard:
- Site settings → Domain management → Add custom domain

