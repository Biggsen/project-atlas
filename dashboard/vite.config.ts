import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs'

// Copy data files to public directory
const dataDir = path.resolve(__dirname, '../data/projects')
const publicDataDir = path.resolve(__dirname, './public/projects')

function copyDataFiles() {
  if (existsSync(dataDir)) {
    if (!existsSync(publicDataDir)) {
      mkdirSync(publicDataDir, { recursive: true })
    }
    
    // Copy all JSON files from data/projects to public/projects
    const files = readdirSync(dataDir)
    for (const file of files) {
      if (file.endsWith('.json')) {
        const srcPath = path.join(dataDir, file)
        const destPath = path.join(publicDataDir, file)
        copyFileSync(srcPath, destPath)
      }
    }
  }
}

// Copy files on startup
copyDataFiles()

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    {
      name: 'copy-data-files',
      buildStart() {
        copyDataFiles()
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Serve data files from public directory
    fs: {
      allow: ['..'],
    },
  },
})
