/**
 * DCL Performance Benchmarks
 * Performance testing and benchmarking for DCL operations
 */

import { setupTestEnvironment, assertTrue, runTest } from './test-utils.js';
import DCL from '../src/dcl.js';

// Setup test environment
const { document, window } = setupTestEnvironment();
global.document = document;
global.window = window;

/**
 * Benchmark helper function
 */
function benchmark(name, operation, iterations = 1000) {
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
        operation(i);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    const opsPerSecond = (iterations / duration * 1000).toFixed(0);
    
    console.log(`${name}:`);
    console.log(`  Total time: ${duration.toFixed(2)}ms`);
    console.log(`  Operations: ${iterations}`);
    console.log(`  Ops/second: ${opsPerSecond}`);
    console.log(`  Avg per op: ${(duration / iterations).toFixed(4)}ms\n`);
    
    return { duration, opsPerSecond: parseInt(opsPerSecond) };
}

/**
 * Test vector operations performance
 */
function testVectorPerformance() {
    const results = [];
    
    // Vector creation benchmark
    results.push(benchmark('Vector Creation', (i) => {
        DCL.vector(i % 100, (i * 2) % 100);
    }, 10000));
    
    // Vector math operations benchmark
    const v1 = DCL.vector(10, 20);
    const v2 = DCL.vector(5, 15);
    
    results.push(benchmark('Vector Addition', (i) => {
        v1.add(v2);
    }, 5000));
    
    results.push(benchmark('Vector Multiplication', (i) => {
        v1.multiply(2.5);
    }, 5000));
    
    results.push(benchmark('Vector Normalization', (i) => {
        v1.normalize();
    }, 5000));
    
    results.push(benchmark('Vector Magnitude', (i) => {
        v1.magnitude();
    }, 5000));
    
    // Ensure operations complete in reasonable time
    results.forEach(result => {
        assertTrue(result.opsPerSecond > 1000, 'Vector operations should be performant');
    });
}

/**
 * Test drawing operations performance
 */
function testDrawingPerformance() {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);
    
    DCL.init(canvas, { width: 800, height: 600 });
    
    const results = [];
    
    // Rectangle drawing benchmark
    results.push(benchmark('Rectangle Drawing', (i) => {
        const x = i % 750;
        const y = (i * 2) % 550;
        DCL.rect(x, y, 50, 50);
    }, 2000));
    
    // Circle drawing benchmark
    results.push(benchmark('Circle Drawing', (i) => {
        const x = i % 775;
        const y = (i * 3) % 575;
        DCL.circle(x, y, 25);
    }, 2000));
    
    // Line drawing benchmark
    results.push(benchmark('Line Drawing', (i) => {
        const x1 = i % 800;
        const y1 = (i * 2) % 600;
        const x2 = (i + 100) % 800;
        const y2 = (i * 2 + 100) % 600;
        DCL.line(x1, y1, x2, y2);
    }, 2000));
    
    // Color changes benchmark
    results.push(benchmark('Color Changes', (i) => {
        DCL.color(i % 256, (i * 2) % 256, (i * 3) % 256);
    }, 5000));
    
    // Clear operations benchmark
    results.push(benchmark('Clear Operations', (i) => {
        DCL.clear();
    }, 1000));
    
    // Ensure drawing operations are reasonably fast
    results.forEach(result => {
        assertTrue(result.opsPerSecond > 100, 'Drawing operations should be performant');
    });
}

/**
 * Test matrix operations performance
 */
function testMatrixPerformance() {
    const results = [];
    
    // Matrix creation benchmark
    results.push(benchmark('Matrix Creation', (i) => {
        DCL.matrix();
    }, 10000));
    
    // Matrix multiplication benchmark
    const m1 = DCL.matrix();
    const m2 = DCL.matrix();
    m2.translate(10, 20);
    m2.rotate(0.1);
    
    results.push(benchmark('Matrix Multiplication', (i) => {
        m1.multiply(m2);
    }, 5000));
    
    // Matrix transformation benchmark
    const point = DCL.vector(50, 75);
    
    results.push(benchmark('Matrix Transformation', (i) => {
        m1.transform(point);
    }, 5000));
    
    // Matrix inversion benchmark
    results.push(benchmark('Matrix Inversion', (i) => {
        m1.inverse();
    }, 2000));
    
    // Ensure matrix operations are performant
    results.forEach(result => {
        assertTrue(result.opsPerSecond > 500, 'Matrix operations should be performant');
    });
}

/**
 * Test color operations performance
 */
function testColorPerformance() {
    const results = [];
    
    // Color creation benchmark
    results.push(benchmark('RGB Color Creation', (i) => {
        DCL.color(i % 256, (i * 2) % 256, (i * 3) % 256);
    }, 10000));
    
    // HSL color creation benchmark
    results.push(benchmark('HSL Color Creation', (i) => {
        DCL.color().setHSL(i % 360, 0.5, 0.5);
    }, 5000));
    
    // Color interpolation benchmark
    const color1 = DCL.color(255, 0, 0);
    const color2 = DCL.color(0, 255, 0);
    
    results.push(benchmark('Color Interpolation', (i) => {
        color1.lerp(color2, (i % 100) / 100);
    }, 5000));
    
    // Color string conversion benchmark
    results.push(benchmark('Color String Conversion', (i) => {
        const color = DCL.color(i % 256, (i * 2) % 256, (i * 3) % 256);
        color.toString();
    }, 5000));
    
    // Ensure color operations are fast
    results.forEach(result => {
        assertTrue(result.opsPerSecond > 1000, 'Color operations should be performant');
    });
}

/**
 * Test complex number operations performance
 */
function testComplexPerformance() {
    const results = [];
    
    // Complex number creation benchmark
    results.push(benchmark('Complex Creation', (i) => {
        DCL.complex(i % 100, (i * 2) % 100);
    }, 10000));
    
    // Complex arithmetic benchmark
    const c1 = DCL.complex(3, 4);
    const c2 = DCL.complex(1, 2);
    
    results.push(benchmark('Complex Addition', (i) => {
        c1.add(c2);
    }, 5000));
    
    results.push(benchmark('Complex Multiplication', (i) => {
        c1.multiply(c2);
    }, 5000));
    
    results.push(benchmark('Complex Magnitude', (i) => {
        c1.magnitude();
    }, 5000));
    
    results.push(benchmark('Complex Exponential', (i) => {
        c1.exp();
    }, 2000));
    
    // Ensure complex operations are performant
    results.forEach(result => {
        assertTrue(result.opsPerSecond > 500, 'Complex operations should be performant');
    });
}

/**
 * Test sprite operations performance
 */
function testSpritePerformance() {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    document.body.appendChild(canvas);
    
    DCL.init(canvas, { width: 640, height: 480 });
    
    const results = [];
    
    // Sprite creation benchmark
    const spriteData = new Array(32 * 32).fill(0xFF0000FF);
    
    results.push(benchmark('Sprite Creation', (i) => {
        DCL.sprite({
            x: i % 100,
            y: (i * 2) % 100,
            width: 32,
            height: 32,
            frames: [{ name: 'default', data: spriteData }]
        });
    }, 1000));
    
    // Sprite collision detection benchmark
    const sprites = [];
    for (let i = 0; i < 100; i++) {
        sprites.push(DCL.sprite({
            x: Math.random() * 600,
            y: Math.random() * 440,
            width: 32,
            height: 32
        }));
    }
    
    results.push(benchmark('Sprite Collision Detection', (i) => {
        const sprite1 = sprites[i % sprites.length];
        const sprite2 = sprites[(i + 1) % sprites.length];
        sprite1.collidesWith(sprite2);
    }, 2000));
    
    // Sprite drawing benchmark
    const testSprite = sprites[0];
    results.push(benchmark('Sprite Drawing', (i) => {
        testSprite.x = i % 600;
        testSprite.y = (i * 2) % 440;
        testSprite.draw();
    }, 1000));
    
    // Ensure sprite operations are performant
    results.forEach(result => {
        assertTrue(result.opsPerSecond > 50, 'Sprite operations should be performant');
    });
}

/**
 * Test overall system performance with mixed operations
 */
function testMixedOperationsPerformance() {    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    document.body.appendChild(canvas);
    
    DCL.init(canvas, { width: 400, height: 400 });
    
    const result = benchmark('Mixed Operations Stress Test', (i) => {
        // Clear screen
        DCL.clear();
        
        // Vector operations
        const v1 = DCL.vector(i % 400, (i * 2) % 400);
        const v2 = DCL.vector((i + 50) % 400, (i * 3) % 400);
        const v3 = v1.add(v2).normalize();
        
        // Color operations
        const color = DCL.color(i % 256, (i * 2) % 256, (i * 3) % 256);
        DCL.color(color);
        
        // Drawing operations
        DCL.circle(v3.x * 200, v3.y * 200, 10);
        DCL.rect(i % 350, (i * 2) % 350, 50, 50);
        DCL.line(0, i % 400, 400, (i * 3) % 400);
        
        // Matrix operations
        DCL.push();
        DCL.translate(200, 200);
        DCL.rotate(i * 0.01);
        DCL.rect(-25, -25, 50, 50);
        DCL.pop();
    }, 100); // Fewer iterations for complex test
    
    assertTrue(result.opsPerSecond > 10, 'Mixed operations should complete in reasonable time');
    console.log('Mixed operations stress test completed successfully');
}

/**
 * Performance comparison test
 */
function testPerformanceComparison() {
    console.log('=== Performance Comparison ===\n');
    
    const operations = {
        'Vector Math': () => {
            const v1 = DCL.vector(10, 20);
            const v2 = DCL.vector(5, 15);
            return v1.add(v2).magnitude();
        },
        'Color Creation': () => {
            return DCL.color(128, 64, 255);
        },
        'Matrix Transform': () => {
            const m = DCL.matrix();
            m.translate(50, 50);
            m.rotate(0.5);
            return m.transform(DCL.vector(10, 10));
        },
        'Complex Math': () => {
            const c1 = DCL.complex(3, 4);
            const c2 = DCL.complex(1, 2);
            return c1.multiply(c2);
        }
    };
    
    const results = {};
    
    Object.entries(operations).forEach(([name, operation]) => {
        const result = benchmark(name, operation, 5000);
        results[name] = result.opsPerSecond;
    });
    
    // Find fastest and slowest operations
    const sortedResults = Object.entries(results)
        .sort((a, b) => b[1] - a[1]);
    
    console.log('Performance Ranking:');
    sortedResults.forEach(([name, opsPerSecond], index) => {
        console.log(`${index + 1}. ${name}: ${opsPerSecond} ops/sec`);
    });
    
    const fastest = sortedResults[0];
    const slowest = sortedResults[sortedResults.length - 1];
    const ratio = (fastest[1] / slowest[1]).toFixed(1);
    
    console.log(`\nFastest operation is ${ratio}x faster than slowest`);
}

// Run all performance tests
export function runPerformanceTests() {
    console.log('Running DCL Performance Benchmarks...\n');
    
    runTest('Vector Performance', testVectorPerformance);
    runTest('Drawing Performance', testDrawingPerformance);
    runTest('Matrix Performance', testMatrixPerformance);
    runTest('Color Performance', testColorPerformance);
    runTest('Complex Performance', testComplexPerformance);
    runTest('Sprite Performance', testSpritePerformance);
    runTest('Mixed Operations Performance', testMixedOperationsPerformance);
    runTest('Performance Comparison', testPerformanceComparison);
}

// Run tests if this file is executed directly
if (typeof process !== 'undefined' && process.argv[1].endsWith('performance.test.js')) {
    runPerformanceTests();
}
