/**
 * DCL Performance Benchmark Utility
 * Comprehensive performance testing and benchmarking for graphics operations
 */

import { setupTestEnvironment } from './test-utils.js';

// Setup test environment
const { document, window } = setupTestEnvironment();
global.document = document;
global.window = window;

/**
 * Performance test runner with statistical analysis
 */
export class PerformanceBenchmark {
    constructor(name, options = {}) {
        this.name = name;
        this.iterations = options.iterations || 1000;
        this.warmupIterations = options.warmup || 100;
        this.results = [];
        this.stats = null;
    }

    /**
     * Run a performance benchmark
     */
    async run(testFunction) {
        console.log(`🏃 Running benchmark: ${this.name}`);
        console.log(`📊 Iterations: ${this.iterations} (warmup: ${this.warmupIterations})`);
        
        // Warmup phase
        console.log('🔥 Warming up...');
        for (let i = 0; i < this.warmupIterations; i++) {
            await testFunction();
        }
        
        // Measurement phase
        console.log('📏 Measuring performance...');
        this.results = [];
        
        for (let i = 0; i < this.iterations; i++) {
            const startTime = performance.now();
            await testFunction();
            const endTime = performance.now();
            this.results.push(endTime - startTime);
            
            // Progress indicator
            if (i % Math.floor(this.iterations / 10) === 0) {
                process.stdout.write('.');
            }
        }
        
        console.log('\n');
        
        // Calculate statistics
        this.calculateStatistics();
        this.displayResults();
        
        return this.stats;
    }

    /**
     * Calculate statistical metrics
     */
    calculateStatistics() {
        const sorted = [...this.results].sort((a, b) => a - b);
        const sum = this.results.reduce((a, b) => a + b, 0);
        
        this.stats = {
            min: Math.min(...this.results),
            max: Math.max(...this.results),
            mean: sum / this.results.length,
            median: sorted[Math.floor(sorted.length / 2)],
            p95: sorted[Math.floor(sorted.length * 0.95)],
            p99: sorted[Math.floor(sorted.length * 0.99)],
            stdDev: this.calculateStandardDeviation(),
            total: sum,
            iterations: this.results.length
        };
    }

    /**
     * Calculate standard deviation
     */
    calculateStandardDeviation() {
        const mean = this.stats?.mean || this.results.reduce((a, b) => a + b, 0) / this.results.length;
        const squaredDiffs = this.results.map(value => Math.pow(value - mean, 2));
        const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
        return Math.sqrt(avgSquaredDiff);
    }

    /**
     * Display benchmark results
     */
    displayResults() {
        console.log(`\n📈 Benchmark Results: ${this.name}`);
        console.log('=' .repeat(50));
        console.log(`Mean:     ${this.stats.mean.toFixed(4)} ms`);
        console.log(`Median:   ${this.stats.median.toFixed(4)} ms`);
        console.log(`Min:      ${this.stats.min.toFixed(4)} ms`);
        console.log(`Max:      ${this.stats.max.toFixed(4)} ms`);
        console.log(`P95:      ${this.stats.p95.toFixed(4)} ms`);
        console.log(`P99:      ${this.stats.p99.toFixed(4)} ms`);
        console.log(`Std Dev:  ${this.stats.stdDev.toFixed(4)} ms`);
        console.log(`Total:    ${this.stats.total.toFixed(4)} ms`);
        console.log(`Ops/sec:  ${(1000 / this.stats.mean).toFixed(0)}`);
        
        // Performance rating
        this.displayPerformanceRating();
    }

    /**
     * Display performance rating based on results
     */
    displayPerformanceRating() {
        const opsPerSecond = 1000 / this.stats.mean;
        let rating, emoji;
        
        if (opsPerSecond > 10000) {
            rating = 'Excellent';
            emoji = '🚀';
        } else if (opsPerSecond > 5000) {
            rating = 'Very Good';
            emoji = '⚡';
        } else if (opsPerSecond > 1000) {
            rating = 'Good';
            emoji = '👍';
        } else if (opsPerSecond > 100) {
            rating = 'Fair';
            emoji = '⚠️';
        } else {
            rating = 'Needs Optimization';
            emoji = '🐌';
        }
        
        console.log(`\n${emoji} Performance Rating: ${rating}`);
    }
}

/**
 * Memory usage tracker
 */
export class MemoryTracker {
    constructor(name) {
        this.name = name;
        this.snapshots = [];
    }

    snapshot(label = '') {
        if (typeof process !== 'undefined' && process.memoryUsage) {
            const memory = process.memoryUsage();
            this.snapshots.push({
                label,
                timestamp: Date.now(),
                rss: memory.rss,
                heapTotal: memory.heapTotal,
                heapUsed: memory.heapUsed,
                external: memory.external
            });
        }
    }

    report() {
        if (this.snapshots.length === 0) {
            console.log('📊 No memory snapshots available');
            return;
        }

        console.log(`\n🧠 Memory Usage Report: ${this.name}`);
        console.log('=' .repeat(60));
        
        this.snapshots.forEach((snapshot, index) => {
            const rss = (snapshot.rss / 1024 / 1024).toFixed(2);
            const heapUsed = (snapshot.heapUsed / 1024 / 1024).toFixed(2);
            const heapTotal = (snapshot.heapTotal / 1024 / 1024).toFixed(2);
            
            console.log(`${index + 1}. ${snapshot.label || 'Snapshot'}`);
            console.log(`   RSS: ${rss} MB, Heap: ${heapUsed}/${heapTotal} MB`);
        });

        // Calculate differences
        if (this.snapshots.length > 1) {
            const first = this.snapshots[0];
            const last = this.snapshots[this.snapshots.length - 1];
            const diff = {
                rss: ((last.rss - first.rss) / 1024 / 1024).toFixed(2),
                heapUsed: ((last.heapUsed - first.heapUsed) / 1024 / 1024).toFixed(2)
            };
            
            console.log(`\n📈 Memory Delta: RSS: ${diff.rss} MB, Heap: ${diff.heapUsed} MB`);
        }
    }
}

/**
 * Graphics-specific benchmarks
 */
export class GraphicsBenchmarks {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.ctx = this.canvas.getContext('2d');
    }

    /**
     * Benchmark basic drawing operations
     */
    async benchmarkBasicDrawing() {
        const benchmark = new PerformanceBenchmark('Basic Drawing Operations', {
            iterations: 10000
        });

        return await benchmark.run(() => {
            this.ctx.fillStyle = '#ff0000';
            this.ctx.fillRect(10, 10, 100, 100);
            this.ctx.strokeStyle = '#00ff00';
            this.ctx.strokeRect(20, 20, 80, 80);
        });
    }

    /**
     * Benchmark path operations
     */
    async benchmarkPathOperations() {
        const benchmark = new PerformanceBenchmark('Path Operations', {
            iterations: 5000
        });

        return await benchmark.run(() => {
            this.ctx.beginPath();
            this.ctx.moveTo(100, 100);
            this.ctx.lineTo(200, 150);
            this.ctx.quadraticCurveTo(250, 100, 300, 150);
            this.ctx.stroke();
        });
    }

    /**
     * Benchmark text rendering
     */
    async benchmarkTextRendering() {
        const benchmark = new PerformanceBenchmark('Text Rendering', {
            iterations: 5000
        });

        return await benchmark.run(() => {
            this.ctx.font = '16px Arial';
            this.ctx.fillStyle = '#000000';
            this.ctx.fillText('Hello, World!', 100, 100);
        });
    }

    /**
     * Benchmark complex shapes
     */
    async benchmarkComplexShapes() {
        const benchmark = new PerformanceBenchmark('Complex Shapes', {
            iterations: 1000
        });

        return await benchmark.run(() => {
            // Draw a complex star shape
            this.ctx.beginPath();
            for (let i = 0; i < 10; i++) {
                const angle = (i / 10) * Math.PI * 2;
                const radius = i % 2 === 0 ? 50 : 25;
                const x = 400 + Math.cos(angle) * radius;
                const y = 300 + Math.sin(angle) * radius;
                
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.closePath();
            this.ctx.fill();
        });
    }

    /**
     * Run all graphics benchmarks
     */
    async runAllBenchmarks() {
        console.log('🎨 Starting Graphics Performance Benchmarks');
        console.log('=' .repeat(60));

        const results = {};
        
        results.basicDrawing = await this.benchmarkBasicDrawing();
        results.pathOperations = await this.benchmarkPathOperations();
        results.textRendering = await this.benchmarkTextRendering();
        results.complexShapes = await this.benchmarkComplexShapes();

        console.log('\n🏆 Benchmark Summary');
        console.log('=' .repeat(40));
        
        Object.entries(results).forEach(([name, stats]) => {
            const opsPerSec = (1000 / stats.mean).toFixed(0);
            console.log(`${name}: ${opsPerSec} ops/sec (${stats.mean.toFixed(2)}ms avg)`);
        });

        return results;
    }
}

/**
 * Regression testing - compare performance against baseline
 */
export class RegressionTester {
    constructor(baselineFile = './performance-baseline.json') {
        this.baselineFile = baselineFile;
        this.baseline = null;
    }

    async loadBaseline() {
        try {
            const data = await import(this.baselineFile, { assert: { type: 'json' } });
            this.baseline = data.default;
            console.log('📚 Loaded performance baseline');
        } catch (error) {
            console.log('⚠️ No baseline found, creating new baseline');
            this.baseline = null;
        }
    }

    async saveBaseline(results) {
        try {
            const fs = await import('fs');
            await fs.promises.writeFile(
                this.baselineFile, 
                JSON.stringify(results, null, 2)
            );
            console.log(`💾 Saved performance baseline to ${this.baselineFile}`);
        } catch (error) {
            console.log(`❌ Failed to save baseline: ${error.message}`);
        }
    }

    compareWithBaseline(current, testName) {
        if (!this.baseline || !this.baseline[testName]) {
            console.log(`📊 ${testName}: No baseline available`);
            return null;
        }

        const baseline = this.baseline[testName];
        const regression = ((current.mean - baseline.mean) / baseline.mean) * 100;
        
        console.log(`\n📊 Regression Analysis: ${testName}`);
        console.log(`Baseline: ${baseline.mean.toFixed(2)}ms`);
        console.log(`Current:  ${current.mean.toFixed(2)}ms`);
        
        if (Math.abs(regression) < 5) {
            console.log(`✅ Performance stable (${regression.toFixed(1)}% change)`);
        } else if (regression > 5) {
            console.log(`⚠️ Performance regression detected (${regression.toFixed(1)}% slower)`);
        } else {
            console.log(`🚀 Performance improvement detected (${Math.abs(regression).toFixed(1)}% faster)`);
        }        return regression;
    }
}
