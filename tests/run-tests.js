#!/usr/bin/env node

/**
 * DCL Test Runner
 * Comprehensive test suite runner for DrCircuitsCanvasLibrary
 * Executes all module tests and provides detailed reporting
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir, writeFile } from 'fs/promises';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const isJsonOutput = args.includes('--json');
const isCoverageMode = args.includes('--coverage');
const outputFile = args.find(arg => arg.startsWith('--output='))?.split('=')[1];

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

// Test results tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let testResults = [];

/**
 * Display formatted output with colors (only if not in JSON mode)
 */
function log(message, color = 'white') {
    if (!isJsonOutput) {
        console.log(colors[color] + message + colors.reset);
    }
}

/**
 * Display test suite header
 */
function displayHeader() {
    if (!isJsonOutput) {
        console.log('\n' + colors.cyan + '='.repeat(60) + colors.reset);
        log('  DCL - DrCircuitsCanvasLibrary Test Suite', 'bright');
        log('  Comprehensive Unit Testing Framework', 'dim');
        console.log(colors.cyan + '='.repeat(60) + colors.reset + '\n');
    }
}

/**
 * Execute a single test file
 */
async function runTestFile(testFile) {
    return new Promise((resolve) => {
        const testPath = join(__dirname, testFile);
        log(`Running ${testFile}...`, 'blue');
        
        const startTime = Date.now();
        const child = spawn('node', [testPath], { stdio: 'pipe' });
        
        let output = '';
        let errorOutput = '';
        
        child.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        child.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        
        child.on('close', (code) => {
            const duration = Date.now() - startTime;
            const result = {
                file: testFile,
                success: code === 0,
                duration,
                output,
                errorOutput
            };
            
            if (code === 0) {
                log(`✓ ${testFile} passed (${duration}ms)`, 'green');
                passedTests++;
            } else {
                log(`✗ ${testFile} failed (${duration}ms)`, 'red');
                failedTests++;
                if (errorOutput) {
                    log(`  Error: ${errorOutput.trim()}`, 'red');
                }
            }
            
            totalTests++;
            testResults.push(result);
            resolve(result);
        });
    });
}

/**
 * Discover all test files in the tests directory
 */
async function discoverTestFiles() {
    try {
        const files = await readdir(__dirname);
        return files
            .filter(file => file.endsWith('.test.js'))
            .sort(); // Run tests in alphabetical order
    } catch (error) {
        log(`Error discovering test files: ${error.message}`, 'red');
        return [];
    }
}

/**
 * Display comprehensive test results summary
 */
function displayResults() {
    if (isJsonOutput) return;
    
    console.log('\n' + colors.yellow + '='.repeat(60) + colors.reset);
    log('  Test Results Summary', 'bright');
    console.log(colors.yellow + '='.repeat(60) + colors.reset);
    
    // Overall statistics
    log(`\nTotal Tests: ${totalTests}`, 'white');
    log(`Passed: ${passedTests}`, passedTests > 0 ? 'green' : 'dim');
    log(`Failed: ${failedTests}`, failedTests > 0 ? 'red' : 'dim');
    
    if (totalTests > 0) {
        const successRate = ((passedTests / totalTests) * 100).toFixed(1);
        log(`Success Rate: ${successRate}%`, successRate === '100.0' ? 'green' : 'yellow');
    }
    
    // Detailed results per test file
    if (testResults.length > 0) {
        log('\nDetailed Results:', 'bright');
        log('-'.repeat(50), 'dim');
        
        testResults.forEach(result => {
            const status = result.success ? colors.green + '✓' : colors.red + '✗';
            const duration = `${result.duration}ms`.padEnd(8);
            log(`${status} ${result.file.padEnd(25)} ${duration}${colors.reset}`);
        });
    }
    
    // Failed tests details
    const failedResults = testResults.filter(r => !r.success);
    if (failedResults.length > 0) {
        log('\nFailed Test Details:', 'red');
        log('-'.repeat(50), 'dim');
        
        failedResults.forEach(result => {
            log(`\n${result.file}:`, 'red');
            if (result.errorOutput) {
                log(result.errorOutput.trim(), 'dim');
            }
            if (result.output) {
                log('Output:', 'yellow');
                log(result.output.trim(), 'dim');
            }
        });
    }
    
    console.log('\n' + colors.yellow + '='.repeat(60) + colors.reset + '\n');
}

/**
 * Calculate and display performance metrics
 */
function displayPerformanceMetrics() {
    if (testResults.length === 0 || isJsonOutput) return;
    
    const totalDuration = testResults.reduce((sum, r) => sum + r.duration, 0);
    const avgDuration = (totalDuration / testResults.length).toFixed(1);
    const fastestTest = testResults.reduce((min, r) => r.duration < min.duration ? r : min);
    const slowestTest = testResults.reduce((max, r) => r.duration > max.duration ? r : max);
    
    log('Performance Metrics:', 'bright');
    log('-'.repeat(30), 'dim');
    log(`Total Duration: ${totalDuration}ms`, 'white');
    log(`Average Duration: ${avgDuration}ms`, 'white');
    log(`Fastest Test: ${fastestTest.file} (${fastestTest.duration}ms)`, 'green');
    log(`Slowest Test: ${slowestTest.file} (${slowestTest.duration}ms)`, 'yellow');
    log('');
}

/**
 * Generate and output JSON test results
 */
async function generateJsonOutput() {
    const totalDuration = testResults.reduce((sum, r) => sum + r.duration, 0);
    const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100) : 0;
    
    const jsonOutput = {
        summary: {
            totalTests,
            passedTests,
            failedTests,
            successRate: parseFloat(successRate.toFixed(1)),
            totalDuration,
            timestamp: new Date().toISOString()
        },
        results: testResults.map(result => ({
            file: result.file,
            success: result.success,
            duration: result.duration,
            error: result.success ? null : result.errorOutput || 'Test failed'
        })),
        performance: testResults.length > 0 ? {
            averageDuration: parseFloat((totalDuration / testResults.length).toFixed(1)),
            fastestTest: testResults.reduce((min, r) => r.duration < min.duration ? r : min),
            slowestTest: testResults.reduce((max, r) => r.duration > max.duration ? r : max)
        } : null
    };
    
    if (outputFile) {
        await writeFile(outputFile, JSON.stringify(jsonOutput, null, 2));
    } else {
        console.log(JSON.stringify(jsonOutput, null, 2));
    }
}

/**
 * Run coverage analysis using c8
 */
async function runCoverageAnalysis() {
    if (!isCoverageMode) return;
    
    log('\nGenerating coverage report...', 'cyan');
    
    return new Promise((resolve) => {
        const c8Process = spawn('node', ['node_modules/c8/bin/c8.js', 'report'], { 
            stdio: 'pipe',
            cwd: join(__dirname, '..')
        });
        
        let output = '';
        let errorOutput = '';
        
        c8Process.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        c8Process.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        
        c8Process.on('close', (code) => {
            if (code === 0) {
                log('Coverage report generated successfully!', 'green');
                if (!isJsonOutput && output) {
                    console.log('\n' + colors.cyan + 'Coverage Summary:' + colors.reset);
                    console.log(output);
                }
            } else {
                log('Coverage report generation failed', 'red');
                if (errorOutput && !isJsonOutput) {
                    log(`Error: ${errorOutput.trim()}`, 'red');
                }
            }
            resolve({ success: code === 0, output, errorOutput });
        });
    });
}

/**
 * Main test runner function
 */
async function runTests() {
    const startTime = Date.now();
    
    displayHeader();
    log('Discovering test files...', 'blue');
    const testFiles = await discoverTestFiles();
    
    if (!isJsonOutput) {
        console.log('Debug: Current directory:', __dirname);
        console.log('Debug: Test files found:', testFiles);
    }
    
    if (testFiles.length === 0) {
        log('No test files found!', 'red');
        process.exit(1);
    }
    
    log(`Found ${testFiles.length} test files\n`, 'green');
      // Run all tests sequentially to avoid conflicts
    for (const testFile of testFiles) {
        await runTestFile(testFile);
    }
    
    const totalDuration = Date.now() - startTime;
    
    // Run coverage analysis if requested
    if (isCoverageMode) {
        await runCoverageAnalysis();
    }
    
    // Generate JSON output if requested
    if (isJsonOutput) {
        await generateJsonOutput();
    } else {
        // Display comprehensive results
        displayResults();
        displayPerformanceMetrics();
        log(`Total execution time: ${totalDuration}ms`, 'cyan');
    }
    
    // Exit with appropriate code
    if (failedTests > 0) {
        if (!isJsonOutput) log('Some tests failed!', 'red');
        process.exit(1);
    } else {
        if (!isJsonOutput) log('All tests passed! 🎉', 'green');
        process.exit(0);
    }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error.message}`, 'red');
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    log(`Unhandled Rejection: ${reason}`, 'red');
    process.exit(1);
});

// Run the test suite
runTests().catch(error => {
    log(`Test runner error: ${error.message}`, 'red');
    process.exit(1);
});
