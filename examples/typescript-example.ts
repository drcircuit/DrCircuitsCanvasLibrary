/**
 * TypeScript Example using DCL
 * This example demonstrates the TypeScript integration with DCL
 */

import dcl, {
    vector,
    color,
    Vector,
    Color,
    AnimationCallback,
    ScreenOptions
} from '../dist/dcl.js';

// Type-safe initialization
const screenOptions: ScreenOptions = {
    width: 800,
    height: 600,
    background: 'black',
    pixelated: false
};

// Animation callback with proper typing
const animate: AnimationCallback = (time: number, deltaTime: number): void => {
    // Clear background
    dcl.background('#000000');

    // Create typed vectors
    const center: Vector = vector.create(dcl.width / 2, dcl.height / 2);
    const offset: Vector = vector.create(
        dcl.cos(time * 0.001) * 100,
        dcl.sin(time * 0.001) * 100
    );

    // Vector operations with type safety
    const position: Vector = center.add(offset);

    // Create typed colors
    const circleColor: Color = color.create(255, 100, 150, 200);
    const strokeColor: Color = color.create(255, 255, 255);

    // Type-safe drawing operations
    dcl.fill(circleColor);
    dcl.stroke(strokeColor, 2);
    dcl.circle(position.x, position.y, 50);

    // Draw with vector parameter (overloaded method)
    const secondPosition: Vector = vector.create(100, 100);
    dcl.circle(secondPosition, 30);

    // Text rendering with type safety
    dcl.fill('#ffffff');
    dcl.text(`Time: ${Math.floor(time)}ms`, 10, 30);
    dcl.text(`FPS: ${Math.round(1000 / deltaTime)}`, 10, 60);

    // Demonstrate vector operations
    const velocity: Vector = vector.create(2, 1);
    const newPosition: Vector = position.add(velocity.mul(deltaTime * 0.01));

    dcl.fill('#ff0000');
    dcl.circle(newPosition, 10);

    // Line drawing with vectors
    dcl.stroke('#00ff00', 1);
    dcl.line(position, newPosition);
};

// Type-safe mouse handling
dcl.MOUSE.onMouseDown((x: number, y: number, button: number) => {
    console.log(`Mouse clicked at (${x}, ${y}) with button ${button}`);

    // Create color at mouse position
    const mouseColor: Color = color.random();
    dcl.fill(mouseColor);
    dcl.circle(x, y, 20);
});

// Type-safe keyboard handling
dcl.KEYB.onKeyDown((key: string) => {
    console.log(`Key pressed: ${key}`);

    if (key === ' ') {
        // Spacebar pressed - change background color
        const randomBg: Color = color.random();
        dcl.background(randomBg);
    }
});

// Math utilities with type safety
const calculateDistance = (p1: Vector, p2: Vector): number => {
    return dcl.dist(p1.x, p1.y, p2.x, p2.y);
};

const mapValue = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
    return dcl.map(value, inMin, inMax, outMin, outMax);
};

// Main execution
async function main(): Promise<void> {
    try {
        // Initialize DCL with type-safe options
        await dcl.init(screenOptions);

        // Setup animation loop
        dcl.setupRun(animate);

        // Start animation
        dcl.playAnimation();

        console.log('DCL TypeScript example initialized successfully!');
        console.log(`Canvas size: ${dcl.width}x${dcl.height}`);
        console.log(`Center: (${dcl.centerX}, ${dcl.centerY})`);

    } catch (error) {
        console.error('Failed to initialize DCL:', error);
    }
}

// Start the application
main();

// Export for module compatibility
export { main };
