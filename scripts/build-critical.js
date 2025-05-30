/**
 * Build script with critical CSS integration
 * File: scripts/build-critical.js
 */
import { execSync } from 'child_process';
import { generateCriticalCSS } from './extract-critical.js';

async function buildWithCritical() {
  try {
    console.log('🏗️ Starting build with critical CSS...');
    
    // 1. Generate critical CSS
    await generateCriticalCSS();
    
    // 2. Run normal Astro build
    console.log('🚀 Building Astro...');
    execSync('astro build', { stdio: 'inherit' });
    
    console.log('✅ Build completed successfully with critical CSS optimization');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildWithCritical();