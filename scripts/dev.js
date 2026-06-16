/**
 * Starts the Astro development server.
 */
import { execSync } from 'child_process';

try {
    console.log('🚀 Starting development server...');
    execSync('astro dev', { stdio: 'inherit' });
} catch (error) {
    console.error('Error starting development server:', error);
    process.exit(1);
}
