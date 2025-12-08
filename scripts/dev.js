/**
 * Enhanced Development Server Script
 *
 * Simple wrapper to start the Astro development server.
 * FontAwesome fonts removed - using inline SVG icons.
 */

import { execSync } from 'child_process';

/**
 * Start the development server
 */
async function startDevServer() {
    try {
        console.log('🚀 Starting development server...');
        execSync('astro dev', { stdio: 'inherit' });
    } catch (error) {
        console.error('Error starting development server:', error);
        process.exit(1);
    }
}

// Run the main function
startDevServer();
