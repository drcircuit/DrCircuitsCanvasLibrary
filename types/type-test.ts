/**
 * Type validation tests for DCL TypeScript definitions
 * This file tests that all type definitions compile correctly
 */

import dcl, {
    Vector,
    Color,
    Matrix,
    Complex,
    Palette,
    ScreenOptions,
    AnimationCallback,
    KeyboardInput,
    MouseInput,
    Buffer,
    vector,
    color,
    matrix,
    complex,
    palette,
    init,
    setupRun,
    playAnimation,
    background,
    fill,
    stroke,
    rect,
    circle,
    line,
    text,
    PI,
    TWO_PI,
    KEYB,
    MOUSE
} from '../dist/dcl.js';

// Test type compilation - these should not produce TypeScript errors

// Vector type tests
const v1: Vector = vector.create(10, 20);
const v2: Vector = vector.create();
const v3: Vector = v1.add(v2);
const magnitude: number = v1.magnitude();
const normalized: Vector = v1.normalize();
const distance: number = v1.distance(v2);
const angle: number = v1.angle();

// Color type tests
const c1: Color = color.create(255, 100, 50, 200);
const c2: Color = color.fromHex('#ff0000');
const c3: Color = color.random();
const mixed: Color = c1.mix(c2, 0.5);
const hexString: string = c1.toHex();
const rgbString: string = c1.toRgbString();

// Matrix type tests
const m1: Matrix = matrix.identity();
const m2: Matrix = matrix.translation(10, 20);
const m3: Matrix = m1.multiply(m2);
const transformed: Vector = m1.transform(v1);

// Complex type tests
const comp1: Complex = complex.create(3, 4);
const comp2: Complex = complex.fromPolar(5, Math.PI / 4);
const compSum: Complex = comp1.add(comp2);
const compMag: number = comp1.magnitude();

// Palette type tests
const pal: Palette = palette.create([c1, c2, c3]);
const palColor: Color = pal.get(0);
const palSize: number = pal.size();

// Screen options tests
const screenOpts1: ScreenOptions = {
    width: 800,
    height: 600,
    background: c1,
    pixelated: true
};

const screenOpts2: ScreenOptions = {
    canvas: 'myCanvas',
    fullscreen: false,
    alpha: true
};

// Animation callback tests
const animCallback: AnimationCallback = (time: number, deltaTime: number): void => {
    background('#000000');
    fill(c1);
    stroke(c2, 2);
    rect(10, 10, 100, 100);
    circle(v1.x, v1.y, 50);
    line(v1, v2);
    text('Hello TypeScript!', 10, 30);
};

// Input tests
const mouseHandler = (x: number, y: number, button: number): void => {
    console.log(`Mouse: ${x}, ${y}, ${button}`);
};

const keyHandler = (key: string): void => {
    console.log(`Key: ${key}`);
};

// Function signature tests
async function testInit(): Promise<void> {
    // Multiple init overloads
    await init(screenOpts1);
    await init('canvas', 800, 600);
    await init(800, 600);

    // Setup animation
    setupRun(animCallback);
    playAnimation();

    // Input handlers
    MOUSE.onMouseDown(mouseHandler);
    KEYB.onKeyDown(keyHandler);
}

// DCL object tests
function testDCLObject(): void {
    // Math utilities
    const sinValue: number = dcl.sin(PI / 2);
    const cosValue: number = dcl.cos(PI);
    const randomValue: number = dcl.random();
    const mappedValue: number = dcl.map(0.5, 0, 1, 0, 100);

    // Drawing methods with overloads
    dcl.rect(10, 10, 100, 100);
    dcl.rect(v1, v2);
    dcl.circle(50, 50, 25);
    dcl.circle(v1, 25);
    dcl.line(0, 0, 100, 100);
    dcl.line(v1, v2);

    // Properties
    const w: number = dcl.width;
    const h: number = dcl.height;
    const cx: number = dcl.centerX;
    const cy: number = dcl.centerY;
    const center: Vector = dcl.center;

    // Type constructors
    const newVector: Vector = dcl.vector.create(1, 2);
    const newColor: Color = dcl.color.red();
    const newMatrix: Matrix = dcl.matrix.identity();
}

// Named import tests
function testNamedImports(): void {
    background('#ffffff');
    fill('#ff0000');
    stroke('#00ff00', 3);
    rect(0, 0, 50, 50);
    circle(25, 25, 10);
    line(0, 0, 50, 50);
    text('Named imports work!', 10, 10);
}

// Constants tests
function testConstants(): void {
    const pi: number = PI;
    const twoPi: number = TWO_PI;

    // Use constants in calculations
    const angle: number = PI / 4;
    const x: number = dcl.cos(angle) * 50;
    const y: number = dcl.sin(angle) * 50;
}

// Export test function for external validation
export function runTypeTests(): void {
    console.log('All TypeScript type definitions compile successfully!');

    // Test vector operations
    const testVector = vector.create(10, 20);
    console.log(`Vector magnitude: ${testVector.magnitude()}`);

    // Test color operations
    const testColor = color.create(255, 100, 50);
    console.log(`Color hex: ${testColor.toHex()}`);

    // Test matrix operations
    const testMatrix = matrix.rotation(PI / 4);
    const rotatedVector = testMatrix.transform(testVector);
    console.log(`Rotated vector: (${rotatedVector.x}, ${rotatedVector.y})`);
}

// Main test execution
if (typeof window !== 'undefined') {
    // Browser environment
    testInit().then(() => {
        console.log('TypeScript integration test completed successfully!');
    }).catch((error) => {
        console.error('TypeScript integration test failed:', error);
    });
} else {
    // Node environment - just run type validation
    runTypeTests();
}
