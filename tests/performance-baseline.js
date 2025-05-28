/**
 * Performance Baseline Management System
 * Establishes and maintains performance regression testing baselines
 */

import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { PerformanceBenchmark } from './performance-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASELINES_FILE = join(__dirname, 'performance-baselines.json');

export class PerformanceBaselineManager {
    constructor() {
        this.baselines = null;
    }

    /**
     * Load existing baselines from file
     */
    async loadBaselines() {
        try {
            const data = await readFile(BASELINES_FILE, 'utf-8');
            this.baselines = JSON.parse(data);
            return this.baselines;
        } catch (error) {
            console.log('📝 No existing baselines found, creating new baseline file');
            this.baselines = this.createDefaultBaselines();
            await this.saveBaselines();
            return this.baselines;
        }
    }

    /**
     * Create default baseline structure
     */
    createDefaultBaselines() {
        return {
            version: "1.0.0",
            baselines: {
                color: {
                    creation: { mean: null, p95: null, stdDev: null, threshold: 0.1 },
                    conversion: { mean: null, p95: null, stdDev: null, threshold: 0.05 }
                },
                vector: {
                    creation: { mean: null, p95: null, stdDev: null, threshold: 0.02 },
                    operations: { mean: null, p95: null, stdDev: null, threshold: 0.05 }
                },
                shapes: {
                    drawing: { mean: null, p95: null, stdDev: null, threshold: 1.0 }
                },
                animation: {
                    frame_processing: { mean: null, p95: null, stdDev: null, threshold: 16.67 }
                },
                matrix: {
                    operations: { mean: null, p95: null, stdDev: null, threshold: 0.1 }
                }
            },
            metadata: {
                lastUpdated: null,
                nodeVersion: process.version,
                platform: process.platform,
                environment: "test"
            }
        };
    }

    /**
     * Save baselines to file
     */
    async saveBaselines() {
        this.baselines.metadata.lastUpdated = new Date().toISOString();
        this.baselines.metadata.nodeVersion = process.version;
        this.baselines.metadata.platform = process.platform;
        
        await writeFile(BASELINES_FILE, JSON.stringify(this.baselines, null, 2), 'utf-8');
        console.log('💾 Performance baselines saved');
    }

    /**
     * Update baseline for a specific test
     */
    updateBaseline(category, testName, stats) {
        if (!this.baselines.baselines[category]) {
            this.baselines.baselines[category] = {};
        }
        
        if (!this.baselines.baselines[category][testName]) {
            this.baselines.baselines[category][testName] = { threshold: 1.0 };
        }

        this.baselines.baselines[category][testName].mean = stats.mean;
        this.baselines.baselines[category][testName].p95 = stats.p95;
        this.baselines.baselines[category][testName].stdDev = stats.stdDev;
        
        console.log(`📊 Updated baseline for ${category}.${testName}:`);
        console.log(`   Mean: ${stats.mean.toFixed(4)}ms`);
        console.log(`   P95:  ${stats.p95.toFixed(4)}ms`);
    }

    /**
     * Compare current performance against baseline
     */
    compareAgainstBaseline(category, testName, stats) {
        const baseline = this.baselines.baselines[category]?.[testName];
        
        if (!baseline || baseline.mean === null) {
            console.log(`⚠️  No baseline found for ${category}.${testName} - establishing baseline`);
            this.updateBaseline(category, testName, stats);
            return { status: 'new_baseline', regression: false };
        }

        const regression = this.calculateRegression(baseline, stats);
        
        if (regression.isRegression) {
            console.log(`🔴 Performance regression detected in ${category}.${testName}:`);
            console.log(`   Current: ${stats.mean.toFixed(4)}ms (was ${baseline.mean.toFixed(4)}ms)`);
            console.log(`   Degradation: ${regression.degradationPercent.toFixed(1)}%`);
            console.log(`   Threshold: ${(baseline.threshold * 100).toFixed(1)}%`);
        } else {
            console.log(`✅ Performance maintained for ${category}.${testName}:`);
            console.log(`   Current: ${stats.mean.toFixed(4)}ms vs baseline ${baseline.mean.toFixed(4)}ms`);
            
            if (regression.isImprovement) {
                console.log(`   🚀 Performance improved by ${Math.abs(regression.degradationPercent).toFixed(1)}%`);
            }
        }

        return {
            status: regression.isRegression ? 'regression' : 'pass',
            regression: regression.isRegression,
            improvement: regression.isImprovement,
            degradationPercent: regression.degradationPercent,
            baseline: baseline,
            current: stats
        };
    }

    /**
     * Calculate performance regression metrics
     */
    calculateRegression(baseline, current) {
        const degradation = (current.mean - baseline.mean) / baseline.mean;
        const degradationPercent = degradation * 100;
        
        const isRegression = degradation > baseline.threshold;
        const isImprovement = degradation < -0.05; // 5% improvement
        
        return {
            degradation,
            degradationPercent,
            isRegression,
            isImprovement
        };
    }

    /**
     * Run a performance test with baseline comparison
     */
    async runBaselineTest(category, testName, testFunction, options = {}) {
        const benchmark = new PerformanceBenchmark(
            `${category}.${testName}`,
            { iterations: options.iterations || 1000 }
        );
        
        const stats = await benchmark.run(testFunction);
        const comparison = this.compareAgainstBaseline(category, testName, stats);
        
        return {
            stats,
            comparison,
            category,
            testName
        };
    }

    /**
     * Establish baselines for all performance tests
     */
    async establishAllBaselines() {
        console.log('🎯 Establishing performance baselines...');
        await this.loadBaselines();
        
        // Import test modules dynamically
        const { setupTestEnvironment } = await import('./test-utils.js');
        const { document, window } = setupTestEnvironment();
        global.document = document;
        global.window = window;
        
        // Import DCL modules
        const { color } = await import('../src/color.js');
        const { vector } = await import('../src/vector.js');
        const shapes = await import('../src/shapes.js');  // Import the entire shapes module
        const { matrix } = await import('../src/matrix.js');
        
        console.log('\n🎨 Color operations baseline...');
        await this.runBaselineTest('color', 'creation', () => {
            for (let i = 0; i < 100; i++) {
                color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
            }
        });        await this.runBaselineTest('color', 'conversion', () => {
            const c = color(128, 128, 128);
            const target = color(255, 255, 255);
            for (let i = 0; i < 50; i++) {
                c.toStyle();
                c.lerp(target, 0.5);
            }
        });
        
        await this.runBaselineTest('color', 'static_methods', () => {
            for (let i = 0; i < 50; i++) {
                color.fromHSL(i % 360, 0.5, 0.5);
                color.fromHex('#ff00ff');
                color.fromHSB(i % 360, 0.5, 0.8);
            }
        });
        
        console.log('\n📐 Vector operations baseline...');
        await this.runBaselineTest('vector', 'creation', () => {
            for (let i = 0; i < 100; i++) {
                vector(Math.random() * 100, Math.random() * 100);
            }
        });
          await this.runBaselineTest('vector', 'operations', () => {
            const v1 = vector(1, 2);
            const v2 = vector(3, 4);
            for (let i = 0; i < 50; i++) {
                v1.add(v2);
                v1.norm();
                v1.mag();
            }
        });
        
        console.log('\n🔲 Shape drawing baseline...');
        await this.runBaselineTest('shapes', 'drawing', () => {
            const canvas = document.createElement('canvas');
            canvas.width = 200; 
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            console.log('Debug: Canvas context:', ctx);
            // check if beginPath is available
            if (!ctx || typeof ctx.beginPath !== 'function') {
                throw new Error('Canvas 2D context is not available or does not support beginPath');
            }
            if (!ctx) {
                throw new Error('Failed to get canvas 2D context');
            }
            console.log('BeginPath is available:', typeof ctx.beginPath === 'function');
            // Run the benchmark with a valid context
            for (let i = 0; i < 20; i++) {
                // The context should be passed as first parameter
                shapes.circle(50, 50, 25,1,1,"green",ctx);
                shapes.rect(ctx, 10, 10, 80, 80,1,"red",ctx);
            }
        });
        
        console.log('\n🧮 Matrix operations baseline...');
        await this.runBaselineTest('matrix', 'operations', () => {
            const m1 = matrix();
            for (let i = 0; i < 50; i++) {
                m1.scale(1.1, 1.1);
                m1.rotate('y', 0.1);  // Fixed: Added 'y' as the rotation axis
                m1.translate(1, 1);
            }
        });
        
        await this.saveBaselines();
        console.log('\n🎉 All baselines established successfully!');
        
        return this.baselines;
    }

    /**
     * Generate performance report
     */
    generateReport() {
        if (!this.baselines) return null;
        
        const report = {
            timestamp: new Date().toISOString(),
            metadata: this.baselines.metadata,
            summary: {
                totalTests: 0,
                establishedBaselines: 0,
                avgThreshold: 0
            },
            baselines: this.baselines.baselines
        };
        
        // Calculate summary statistics
        Object.keys(this.baselines.baselines).forEach(category => {
            Object.keys(this.baselines.baselines[category]).forEach(testName => {
                const baseline = this.baselines.baselines[category][testName];
                report.summary.totalTests++;
                if (baseline.mean !== null) {
                    report.summary.establishedBaselines++;
                }
                report.summary.avgThreshold += baseline.threshold || 0;
            });
        });
        
        report.summary.avgThreshold /= report.summary.totalTests;
        
        return report;
    }
}

// CLI interface for baseline management
const currentModuleUrl = import.meta.url;
const runAsScript = process.argv[1] && currentModuleUrl.endsWith(process.argv[1].replace(/\\/g, '/'));

console.log('Debug: currentModuleUrl =', currentModuleUrl);
console.log('Debug: process.argv[1] =', process.argv[1]);
console.log('Debug: runAsScript =', runAsScript);

if (runAsScript || process.argv[1]?.includes('performance-baseline')) {
    console.log('🚀 Starting performance baseline manager...');
    console.log('Command:', process.argv[2]);
    
    const manager = new PerformanceBaselineManager();
    const command = process.argv[2];
    
    try {
        switch (command) {
            case 'establish':
                console.log('📊 Establishing baselines...');
                await manager.establishAllBaselines();
                break;
            case 'report':
                console.log('📋 Generating report...');
                await manager.loadBaselines();
                const report = manager.generateReport();
                console.log(JSON.stringify(report, null, 2));
                break;
            default:
                console.log('Usage: node performance-baseline.js [establish|report]');
                break;
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    }
}

export default PerformanceBaselineManager;
