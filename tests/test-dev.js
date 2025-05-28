#!/usr/bin/env node

/**
 * DCL Test Development Helper
 * Interactive test development and debugging utilities
 */

import { spawn } from 'child_process';
import { readdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(colors[color] + message + colors.reset);
}

/**
 * Watch for file changes and re-run specific tests
 */
async function watchTests(testPattern = '') {
    log('🔍 Starting test watcher...', 'cyan');
    log('Press Ctrl+C to stop watching', 'yellow');
    
    let isRunning = false;
    
    const runTests = async () => {
        if (isRunning) return;
        isRunning = true;
        
        log('\n🔄 Running tests...', 'blue');
        
        const command = testPattern 
            ? `node tests/run-tests.js --pattern=${testPattern}`
            : 'npm test';
            
        const child = spawn('node', ['tests/run-tests.js'], {
            stdio: 'inherit',
            cwd: join(__dirname, '..')
        });
        
        child.on('close', (code) => {
            if (code === 0) {
                log('✅ Tests passed!', 'green');
            } else {
                log('❌ Tests failed!', 'red');
            }
            isRunning = false;
        });
    };
    
    // Initial run
    await runTests();
    
    // Set up file watching (simplified version)
    setInterval(async () => {
        // In a real implementation, this would use fs.watch
        // For now, we'll just run tests every 5 seconds when files change
    }, 5000);
}

/**
 * Generate test template for a new module
 */
async function generateTestTemplate(moduleName) {
    const template = `/**
 * Tests for ${moduleName}.js module
 */

import { describe, test, expect, beforeEach } from './test-utils.js';
import { /* Import your module exports here */ } from '../src/${moduleName}.js';

describe('${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} Module', () => {
    beforeEach(() => {
        // Setup before each test
        // Reset any global state, mocks, etc.
    });

    describe('Basic functionality', () => {
        test('should be defined', () => {
            // Add your basic existence tests here
            expect(true).toBe(true); // Replace with actual test
        });

        test('should handle valid input', () => {
            // Test normal operation
            expect(true).toBe(true); // Replace with actual test
        });

        test('should handle edge cases', () => {
            // Test boundary conditions
            expect(true).toBe(true); // Replace with actual test
        });

        test('should handle invalid input gracefully', () => {
            // Test error conditions
            expect(true).toBe(true); // Replace with actual test
        });
    });

    describe('Advanced functionality', () => {
        test('should perform complex operations', () => {
            // Test more complex scenarios
            expect(true).toBe(true); // Replace with actual test
        });

        test('should integrate with other modules', () => {
            // Test integration points
            expect(true).toBe(true); // Replace with actual test
        });
    });

    describe('Performance', () => {
        test('should perform within acceptable time limits', () => {
            const startTime = performance.now();
            
            // Your performance test here
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(100); // Adjust threshold as needed
        });
    });
});
`;

    const testPath = join(__dirname, `${moduleName}.test.js`);
    
    try {
        await import('fs').then(fs => 
            fs.promises.writeFile(testPath, template)
        );
        log(`✅ Test template created: ${testPath}`, 'green');
        log('📝 Don\'t forget to update the imports and add actual tests!', 'yellow');
    } catch (error) {
        log(`❌ Error creating test template: ${error.message}`, 'red');
    }
}

/**
 * Analyze test coverage and suggest improvements
 */
async function analyzeCoverage() {
    log('📊 Analyzing test coverage...', 'cyan');
    
    try {
        const { readFile } = await import('fs/promises');
        const coverageData = JSON.parse(
            await readFile(join(__dirname, '..', 'coverage', 'coverage-final.json'), 'utf-8')
        );
        
        const files = Object.keys(coverageData);
        const lowCoverageFiles = [];
        
        for (const file of files) {
            const coverage = coverageData[file];
            const functionCoverage = (coverage.f && Object.keys(coverage.f).length > 0) 
                ? Object.values(coverage.f).filter(count => count > 0).length / Object.keys(coverage.f).length * 100
                : 100;
                
            if (functionCoverage < 50) {
                lowCoverageFiles.push({
                    file: file.replace(process.cwd() + '\\', ''),
                    functionCoverage: functionCoverage.toFixed(1)
                });
            }
        }
        
        log(`📈 Found ${files.length} files in coverage report`, 'green');
        
        if (lowCoverageFiles.length > 0) {
            log('\n📈 Files with low function coverage (<50%):', 'yellow');
            lowCoverageFiles.forEach(item => {
                log(`  • ${item.file}: ${item.functionCoverage}%`, 'red');
            });
            log('\n💡 Consider adding more tests for these files', 'blue');
        } else {
            log('🎉 All files have good function coverage!', 'green');
        }
        
    } catch (error) {
        log(`❌ Error analyzing coverage: ${error.message}`, 'red');
        log('💡 Run tests with coverage first: npm run test:coverage', 'yellow');
    }
}

/**
 * Run tests for a specific module
 */
async function runSingleTest(testFile) {
    log(`🧪 Running test: ${testFile}`, 'cyan');
    
    const testPath = join(__dirname, testFile.endsWith('.test.js') ? testFile : `${testFile}.test.js`);
    
    const child = spawn('node', [testPath], {
        stdio: 'inherit',
        cwd: __dirname
    });
    
    return new Promise((resolve) => {
        child.on('close', (code) => {
            if (code === 0) {
                log(`✅ ${testFile} passed!`, 'green');
            } else {
                log(`❌ ${testFile} failed!`, 'red');
            }
            resolve(code === 0);
        });
    });
}

/**
 * Main CLI interface
 */
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
        case 'watch':
            await watchTests(args[1]);
            break;
            
        case 'generate':
            if (!args[1]) {
                log('❌ Please provide a module name: node test-dev.js generate <module-name>', 'red');
                process.exit(1);
            }
            await generateTestTemplate(args[1]);
            break;
            
        case 'analyze':
            await analyzeCoverage();
            break;
            
        case 'run':
            if (!args[1]) {
                log('❌ Please provide a test file: node test-dev.js run <test-file>', 'red');
                process.exit(1);
            }
            await runSingleTest(args[1]);
            break;
            
        case 'help':
        default:
            log('🧪 DCL Test Development Helper', 'cyan');
            log('\nAvailable commands:', 'bright');
            log('  watch [pattern]     - Watch files and re-run tests automatically', 'blue');
            log('  generate <module>   - Generate test template for a new module', 'blue');
            log('  analyze            - Analyze coverage and suggest improvements', 'blue');
            log('  run <test-file>    - Run a specific test file', 'blue');
            log('  help               - Show this help message', 'blue');
            log('\nExamples:', 'bright');
            log('  node test-dev.js watch', 'yellow');
            log('  node test-dev.js generate newmodule', 'yellow');
            log('  node test-dev.js analyze', 'yellow');
            log('  node test-dev.js run color.test.js', 'yellow');
            break;
    }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    log(`💥 Uncaught Exception: ${error.message}`, 'red');
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    log(`💥 Unhandled Rejection: ${reason}`, 'red');
    process.exit(1);
});

// Run the CLI
main().catch(error => {
    log(`💥 Error: ${error.message}`, 'red');
    process.exit(1);
});
