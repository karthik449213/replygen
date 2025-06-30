#!/usr/bin/env node

// Build script for frontend-only deployment
import { build } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildFrontend() {
  try {
    console.log('Building frontend for production...');
    
    await build({
      root: resolve(__dirname, 'client'),
      build: {
        outDir: resolve(__dirname, 'dist/public'),
        emptyOutDir: true,
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
    });
    
    console.log('Frontend build completed successfully!');
    console.log('Output directory: dist/public');
  } catch (error) {
    console.error('Frontend build failed:', error);
    process.exit(1);
  }
}

buildFrontend();