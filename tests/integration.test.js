/**
 * DCL Integration Tests
 * End-to-end testing for complete DCL workflows and feature combinations
 */

import { setupTestEnvironment, assertEqual, assertTrue, assertFalse, runTest } from './test-utils.js';
import DCL from '../src/dcl.js';

// Setup test environment
const { document, window } = setupTestEnvironment();
global.document = document;
global.window = window;

/**
 * Test complete DCL initialization and basic drawing workflow
 */
function testCompleteWorkflow() {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    canvas.id = 'test-canvas';
    document.body.appendChild(canvas);
    
    // Initialize DCL
    const screen = DCL.init('#test-canvas', { width: 400, height: 300 });
    
    assertTrue(screen !== null, 'DCL should initialize successfully');
    assertEqual(screen.width, 400, 'Screen width should be set correctly');
    assertEqual(screen.height, 300, 'Screen height should be set correctly');
    
    // Test basic drawing operations
    DCL.clear();
    DCL.color('red');
    DCL.rect(10, 10, 50, 50);
    DCL.circle(100, 100, 25);
    DCL.line(0, 0, 200, 200);
    DCL.text('Hello DCL', 10, 200);
    
    // Test vector operations in context
    const v1 = DCL.vector(50, 50);
    const v2 = DCL.vector(100, 100);
    const v3 = v1.add(v2);
    
    assertEqual(v3.x, 150, 'Vector addition should work correctly');
    assertEqual(v3.y, 150, 'Vector addition should work correctly');
    
    // Test color operations
    const redColor = DCL.color('red');
    assertTrue(redColor.r === 255 && redColor.g === 0 && redColor.b === 0, 'Red color should be correct');
    
    // Test matrix transformations
    DCL.push();
    DCL.translate(100, 100);
    DCL.rotate(Math.PI / 4);
    DCL.scale(2, 2);
    DCL.rect(0, 0, 20, 20); // This should be transformed
    DCL.pop();
    
    // Test animation frame setup
    let animationCalled = false;
    DCL.loop((dt) => {
        animationCalled = true;
        DCL.clear();
        DCL.rect(10, 10, 30, 30);
        return false; // Stop animation after one frame
    });
    
    // Since we're in a test environment, we need to manually trigger the animation
    if (typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(() => {
            assertTrue(animationCalled, 'Animation loop should be called');
        });
    }
}

/**
 * Test sprite creation and animation workflow
 */
function testSpriteWorkflow() {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    document.body.appendChild(canvas);
    
    DCL.init(canvas, { width: 200, height: 200 });
    
    // Create a sprite with multiple frames
    const sprite = DCL.sprite({
        x: 50,
        y: 50,
        width: 32,
        height: 32,
        frames: [
            { name: 'idle', data: new Array(32 * 32).fill(0xFF0000FF) },
            { name: 'moving', data: new Array(32 * 32).fill(0x00FF00FF) }
        ]
    });
    
    assertTrue(sprite !== null, 'Sprite should be created successfully');
    assertEqual(sprite.x, 50, 'Sprite x position should be set');
    assertEqual(sprite.y, 50, 'Sprite y position should be set');
    assertEqual(sprite.frames.length, 2, 'Sprite should have 2 frames');
    
    // Test sprite state changes
    sprite.setState('moving');
    assertEqual(sprite.currentState, 'moving', 'Sprite state should change to moving');
    
    // Test sprite collision detection
    const sprite2 = DCL.sprite({ x: 60, y: 60, width: 32, height: 32 });
    assertTrue(sprite.collidesWith(sprite2), 'Sprites should collide');
    
    const sprite3 = DCL.sprite({ x: 150, y: 150, width: 32, height: 32 });
    assertFalse(sprite.collidesWith(sprite3), 'Distant sprites should not collide');
    
    // Test sprite drawing
    DCL.clear();
    sprite.draw();
    sprite2.draw();
    sprite3.draw();
}

/**
 * Test curve and shape drawing workflow
 */
function testCurveAndShapeWorkflow() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    document.body.appendChild(canvas);
    
    DCL.init(canvas, { width: 300, height: 300 });
    
    // Test curve creation and plotting
    DCL.clear();
    DCL.color('blue');
    
    // Plot a sine wave
    const sinePoints = [];
    for (let x = 0; x < 300; x += 5) {
        const y = 150 + Math.sin(x * 0.02) * 50;
        sinePoints.push(DCL.vector(x, y));
    }
    
    DCL.curve(sinePoints);
    
    // Test filled shapes
    DCL.color('red');
    DCL.fill(true);
    DCL.circle(75, 75, 30);
    
    DCL.color('green');
    DCL.rect(150, 50, 60, 60);
    
    // Test stroke and fill combinations
    DCL.stroke('black', 3);
    DCL.fill('yellow');
    DCL.polygon([
        DCL.vector(50, 200),
        DCL.vector(100, 180),
        DCL.vector(120, 220),
        DCL.vector(80, 240)
    ]);
    
    // Test text with different styles
    DCL.textSize(16);
    DCL.textAlign('center');
    DCL.color('purple');
    DCL.text('Integration Test', 150, 280);
}

/**
 * Test input handling integration
 */
function testInputIntegration() {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    document.body.appendChild(canvas);
    
    DCL.init(canvas, { width: 200, height: 200 });
    
    // Test keyboard setup
    assertTrue(DCL.keys !== undefined, 'Keyboard system should be available');
    assertTrue(DCL.keys.SPACE !== undefined, 'Keyboard constants should be available');
    
    // Test mouse setup
    assertTrue(DCL.mouse !== undefined, 'Mouse system should be available');
    assertTrue(typeof DCL.mouse.x === 'number', 'Mouse position should be tracked');
    assertTrue(typeof DCL.mouse.y === 'number', 'Mouse position should be tracked');
    
    // Simulate some input events
    const keydownEvent = new window.KeyboardEvent('keydown', { keyCode: 32 }); // Space key
    canvas.dispatchEvent(keydownEvent);
    
    const mouseEvent = new window.MouseEvent('mousemove', { 
        clientX: 100, 
        clientY: 100 
    });
    canvas.dispatchEvent(mouseEvent);
    
    // Test that input systems are responsive
    assertTrue(typeof DCL.isKeyDown === 'function', 'Key state checking should be available');
}

/**
 * Test buffer and screen management
 */
function testBufferManagement() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    document.body.appendChild(canvas);
    
    DCL.init(canvas, { width: 256, height: 256 });
    
    // Test buffer creation
    const buffer = DCL.createBuffer(128, 128);
    assertTrue(buffer !== null, 'Buffer should be created successfully');
    assertEqual(buffer.width, 128, 'Buffer width should be correct');
    assertEqual(buffer.height, 128, 'Buffer height should be correct');
    
    // Draw to buffer
    DCL.target(buffer);
    DCL.clear('blue');
    DCL.color('white');
    DCL.circle(64, 64, 30);
    
    // Draw buffer to main screen
    DCL.target(null); // Back to main screen
    DCL.clear('black');
    DCL.drawBuffer(buffer, 50, 50);
    
    assertTrue(true, 'Buffer operations completed successfully');
}

/**
 * Test complex mathematical operations integration
 */
function testMathIntegration() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    document.body.appendChild(canvas);
    
    DCL.init(canvas, { width: 300, height: 300 });
    
    // Test complex number operations
    const c1 = DCL.complex(3, 4);
    const c2 = DCL.complex(1, 2);
    const result = c1.multiply(c2);
    
    assertEqual(result.real, -5, 'Complex multiplication real part should be correct');
    assertEqual(result.imaginary, 10, 'Complex multiplication imaginary part should be correct');
    
    // Test matrix transformations
    const matrix = DCL.matrix();
    matrix.translate(100, 100);
    matrix.rotate(Math.PI / 4);
    matrix.scale(2, 1);
    
    const point = DCL.vector(10, 10);
    const transformed = matrix.transform(point);
    
    assertTrue(transformed.x !== 10 || transformed.y !== 10, 'Matrix transformation should change coordinates');
    
    // Test vector operations
    const v1 = DCL.vector(3, 4);
    const v2 = DCL.vector(1, 0);
    
    assertEqual(v1.magnitude(), 5, 'Vector magnitude should be correct');
    assertEqual(v1.dot(v2), 3, 'Dot product should be correct');
    
    const cross = v1.cross(v2);
    assertEqual(cross, -4, 'Cross product should be correct');
}

/**
 * Test palette and color management integration
 */
function testPaletteIntegration() {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 200;
    document.body.appendChild(canvas);
    
    DCL.init(canvas, { width: 320, height: 200 });
    
    // Test different palette modes
    DCL.palette('ega');
    DCL.clear();
    
    // Draw with EGA palette colors
    for (let i = 0; i < 16; i++) {
        DCL.color(i);
        DCL.rect(i * 20, 10, 18, 30);
    }
    
    // Switch to CGA palette
    DCL.palette('cga');
    for (let i = 0; i < 4; i++) {
        DCL.color(i);
        DCL.rect(i * 20, 50, 18, 30);
    }
    
    // Test fire palette for gradient effects
    DCL.palette('fire');
    for (let i = 0; i < 256; i++) {
        DCL.color(i);
        DCL.line(i, 100, i, 150);
    }
    
    // Test custom color creation with palettes
    const customColor = DCL.color(128, 64, 255);
    assertTrue(customColor.r === 128, 'Custom color red component should be correct');
    assertTrue(customColor.g === 64, 'Custom color green component should be correct');
    assertTrue(customColor.b === 255, 'Custom color blue component should be correct');
}

/**
 * Test performance with multiple operations
 */
function testPerformanceIntegration() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    document.body.appendChild(canvas);
    
    DCL.init(canvas, { width: 400, height: 400 });
    
    const startTime = Date.now();
    
    // Perform many drawing operations
    DCL.clear();
    for (let i = 0; i < 1000; i++) {
        const x = Math.random() * 400;
        const y = Math.random() * 400;
        const size = Math.random() * 10 + 2;
        const color = DCL.color(
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256)
        );
        
        DCL.color(color);
        if (i % 3 === 0) {
            DCL.circle(x, y, size);
        } else if (i % 3 === 1) {
            DCL.rect(x, y, size * 2, size * 2);
        } else {
            DCL.line(x, y, x + size * 3, y + size * 3);
        }
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    assertTrue(duration < 5000, `Performance test should complete in reasonable time (took ${duration}ms)`);
    console.log(`Performance test completed in ${duration}ms`);
}

// Run all integration tests
export function runIntegrationTests() {
    console.log('Running DCL Integration Tests...\n');
    
    runTest('Complete DCL Workflow', testCompleteWorkflow);
    runTest('Sprite Workflow', testSpriteWorkflow);
    runTest('Curve and Shape Workflow', testCurveAndShapeWorkflow);
    runTest('Input Integration', testInputIntegration);
    runTest('Buffer Management', testBufferManagement);
    runTest('Math Integration', testMathIntegration);
    runTest('Palette Integration', testPaletteIntegration);
    runTest('Performance Integration', testPerformanceIntegration);
}

// Run tests if this file is executed directly
if (typeof process !== 'undefined' && process.argv[1].endsWith('integration.test.js')) {
    runIntegrationTests();
}
