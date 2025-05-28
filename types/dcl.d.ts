/**
 * TypeScript definitions for DrCircuitsCanvasLibrary (DCL)
 * A small library to make it easier to draw on HTML5 canvases
 */

// ============================================================================
// Core Type Definitions
// ============================================================================

/** 2D Vector with comprehensive mathematical operations */
export interface Vector {
    x: number;
    y: number;

    // Basic arithmetic operations
    add(vector: Vector): Vector;
    add(x: number, y: number): Vector;
    sub(vector: Vector): Vector;
    sub(x: number, y: number): Vector;
    mul(scalar: number): Vector;
    mul(vector: Vector): Vector;
    div(scalar: number): Vector;
    div(vector: Vector): Vector;

    // Mathematical operations
    dot(vector: Vector): number;
    cross(vector: Vector): number;
    normalize(): Vector;
    magnitude(): number;
    magSq(): number;
    distance(vector: Vector): number;
    distanceSq(vector: Vector): number;
    lerp(vector: Vector, t: number): Vector;

    // Trigonometric operations
    angle(): number;
    angleBetween(vector: Vector): number;
    rotate(angle: number): Vector;
    heading(): number;

    // Utility operations
    copy(): Vector;
    set(x: number, y: number): Vector;
    set(vector: Vector): Vector;
    limit(max: number): Vector;
    setMag(magnitude: number): Vector;
    clone(): Vector;
    toString(): string;

    // Swizzling operations
    xx(): Vector;
    xy(): Vector;
    yx(): Vector;
    yy(): Vector;

    // Static creation methods
    static create(x?: number, y?: number): Vector;
    static fromAngle(angle: number, magnitude?: number): Vector;
    static random(): Vector;
    static zero(): Vector;
    static one(): Vector;
    static up(): Vector;
    static down(): Vector;
    static left(): Vector;
    static right(): Vector;
}

/** Color representation with RGBA values */
export interface Color {
    r: number;
    g: number;
    b: number;
    a?: number;

    // Color manipulation
    copy(): Color;
    clone(): Color;
    toString(): string;
    toHex(): string;
    toRgbString(): string;
    toRgbaString(): string;

    // Color operations
    lerp(color: Color, t: number): Color;
    mix(color: Color, ratio?: number): Color;
    lighten(amount: number): Color;
    darken(amount: number): Color;
    saturate(amount: number): Color;
    desaturate(amount: number): Color;

    // Static creation methods
    static create(r: number, g: number, b: number, a?: number): Color;
    static fromHex(hex: string): Color;
    static fromHsl(h: number, s: number, l: number, a?: number): Color;
    static random(): Color;
    static white(): Color;
    static black(): Color;
    static red(): Color;
    static green(): Color;
    static blue(): Color;
    static yellow(): Color;
    static cyan(): Color;
    static magenta(): Color;
    static transparent(): Color;
}

/** 2D Transformation Matrix */
export interface Matrix {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;

    // Matrix operations
    multiply(matrix: Matrix): Matrix;
    translate(x: number, y: number): Matrix;
    scale(x: number, y: number): Matrix;
    rotate(angle: number): Matrix;
    skew(x: number, y: number): Matrix;
    invert(): Matrix;
    determinant(): number;
    copy(): Matrix;
    clone(): Matrix;
    reset(): Matrix;
    identity(): Matrix;
    transform(vector: Vector): Vector;

    // Static methods
    static identity(): Matrix;
    static create(): Matrix;
    static translation(x: number, y: number): Matrix;
    static scaling(x: number, y: number): Matrix;
    static rotation(angle: number): Matrix;
}

/** Complex number representation */
export interface Complex {
    real: number;
    imag: number;

    add(complex: Complex): Complex;
    sub(complex: Complex): Complex;
    mul(complex: Complex): Complex;
    div(complex: Complex): Complex;
    magnitude(): number;
    phase(): number;
    conjugate(): Complex;
    copy(): Complex;
    clone(): Complex;
    toString(): string;

    static create(real: number, imag: number): Complex;
    static fromPolar(magnitude: number, phase: number): Complex;
}

/** Color palette for managing multiple colors */
export interface Palette {
    colors: Color[];

    add(color: Color): Palette;
    get(index: number): Color;
    set(index: number, color: Color): Palette;
    size(): number;
    clear(): Palette;
    copy(): Palette;
    clone(): Palette;

    static create(colors?: Color[]): Palette;
}

// ============================================================================
// Input System Types
// ============================================================================

/** Keyboard input constants and state */
export interface KeyboardInput {
    // Key state
    isPressed(key: string): boolean;
    isReleased(key: string): boolean;
    isDown(key: string): boolean;

    // Event handlers
    onKeyDown(callback: (key: string) => void): void;
    onKeyUp(callback: (key: string) => void): void;

    // Key constants
    readonly SPACE: string;
    readonly ENTER: string;
    readonly ESCAPE: string;
    readonly TAB: string;
    readonly SHIFT: string;
    readonly CTRL: string;
    readonly ALT: string;
    readonly ARROW_UP: string;
    readonly ARROW_DOWN: string;
    readonly ARROW_LEFT: string;
    readonly ARROW_RIGHT: string;
    readonly BACKSPACE: string;
    readonly DELETE: string;
    // ... more key constants
}

/** Mouse input state and events */
export interface MouseInput {
    x: number;
    y: number;
    button: number;

    // Mouse state
    isPressed(button?: number): boolean;
    isReleased(button?: number): boolean;
    isDown(button?: number): boolean;

    // Event handlers
    onMouseDown(callback: (x: number, y: number, button: number) => void): void;
    onMouseUp(callback: (x: number, y: number, button: number) => void): void;
    onMouseMove(callback: (x: number, y: number) => void): void;
    onMouseWheel(callback: (delta: number) => void): void;

    // Button constants
    readonly LEFT: number;
    readonly MIDDLE: number;
    readonly RIGHT: number;
}

// ============================================================================
// Screen and Buffer Types
// ============================================================================

/** Screen configuration options */
export interface ScreenOptions {
    width?: number;
    height?: number;
    canvas?: HTMLCanvasElement | string;
    fullscreen?: boolean;
    pixelated?: boolean;
    background?: Color | string;
    contextType?: '2d' | 'webgl' | 'webgl2';
    alpha?: boolean;
    antialias?: boolean;
    depth?: boolean;
    stencil?: boolean;
    preserveDrawingBuffer?: boolean;
}

/** Buffer for off-screen rendering */
export interface Buffer {
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    clear(color?: Color | string): void;
    resize(width: number, height: number): void;
    getImageData(): ImageData;
    putImageData(imageData: ImageData, x?: number, y?: number): void;
    toBlob(): Promise<Blob>;
    toDataURL(type?: string, quality?: number): string;
}

// ============================================================================
// Animation and Timing Types
// ============================================================================

/** Animation callback function */
export type AnimationCallback = (time: number, deltaTime: number) => void;

/** Frame rate limiter options */
export interface FrameRateOptions {
    fps?: number;
    vsync?: boolean;
}

// ============================================================================
// Drawing and Graphics Types
// ============================================================================

/** Text alignment options */
export type TextAlign = 'left' | 'center' | 'right' | 'start' | 'end';
export type TextBaseline = 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';

/** Line cap styles */
export type LineCap = 'butt' | 'round' | 'square';

/** Line join styles */
export type LineJoin = 'miter' | 'round' | 'bevel';

/** Blend modes */
export type BlendMode = 'source-over' | 'source-in' | 'source-out' | 'source-atop' |
    'destination-over' | 'destination-in' | 'destination-out' | 'destination-atop' |
    'lighter' | 'copy' | 'xor' | 'multiply' | 'screen' | 'overlay' |
    'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' |
    'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' |
    'color' | 'luminosity';

/** Gradient definition */
export interface Gradient {
    addColorStop(offset: number, color: Color | string): void;
}

/** Linear gradient */
export interface LinearGradient extends Gradient {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

/** Radial gradient */
export interface RadialGradient extends Gradient {
    x1: number;
    y1: number;
    r1: number;
    x2: number;
    y2: number;
    r2: number;
}

// ============================================================================
// Main DCL Interface
// ============================================================================

/** Main DCL library interface */
export interface DCL {
    // Version information
    readonly version: string;

    // Core initialization
    init(options?: ScreenOptions): Promise<void>;
    init(canvas: HTMLCanvasElement | string, width?: number, height?: number): Promise<void>;
    init(width: number, height: number): Promise<void>;

    // Screen and context management
    setupScreen(options: ScreenOptions): void;
    createBuffer(width: number, height: number): Buffer;
    getContext(): CanvasRenderingContext2D;
    getCanvas(): HTMLCanvasElement;
    resize(width: number, height: number): void;

    // Animation and timing
    setupRun(callback: AnimationCallback): void;
    playAnimation(): void;
    stopAnimation(): void;
    pauseAnimation(): void;
    resumeAnimation(): void;
    setFrameRate(fps: number): void;
    getFrameRate(): number;
    getDeltaTime(): number;
    getTime(): number;

    // Drawing functions
    background(color: Color | string): void;
    clear(color?: Color | string): void;
    fill(color: Color | string): void;
    noFill(): void;
    stroke(color: Color | string, width?: number): void;
    noStroke(): void;
    strokeWeight(weight: number): void;

    // Shape drawing
    rect(x: number, y: number, width: number, height: number): void;
    rect(position: Vector, size: Vector): void;
    circle(x: number, y: number, radius: number): void;
    circle(center: Vector, radius: number): void;
    ellipse(x: number, y: number, width: number, height: number): void;
    ellipse(center: Vector, size: Vector): void;
    line(x1: number, y1: number, x2: number, y2: number): void;
    line(start: Vector, end: Vector): void;
    point(x: number, y: number): void;
    point(position: Vector): void;
    triangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void;
    triangle(p1: Vector, p2: Vector, p3: Vector): void;
    quad(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): void;
    quad(p1: Vector, p2: Vector, p3: Vector, p4: Vector): void;

    // Path drawing
    beginPath(): void;
    closePath(): void;
    moveTo(x: number, y: number): void;
    moveTo(position: Vector): void;
    lineTo(x: number, y: number): void;
    lineTo(position: Vector): void;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;

    // Text rendering
    text(text: string, x: number, y: number): void;
    text(text: string, position: Vector): void;
    textAlign(align: TextAlign): void;
    textBaseline(baseline: TextBaseline): void;
    font(font: string): void;
    fontSize(size: number): void;
    textWidth(text: string): number;
    textMetrics(text: string): TextMetrics;

    // Transformations
    save(): void;
    restore(): void;
    translate(x: number, y: number): void;
    translate(vector: Vector): void;
    rotate(angle: number): void;
    scale(x: number, y: number): void;
    scale(scale: number): void;
    scale(scale: Vector): void;
    transform(matrix: Matrix): void;
    setTransform(matrix: Matrix): void;
    resetTransform(): void;

    // Style and appearance
    lineCap(cap: LineCap): void;
    lineJoin(join: LineJoin): void;
    miterLimit(limit: number): void;
    globalAlpha(alpha: number): void;
    globalCompositeOperation(operation: BlendMode): void;

    // Gradients and patterns
    createLinearGradient(x1: number, y1: number, x2: number, y2: number): LinearGradient;
    createRadialGradient(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): RadialGradient;
    createPattern(image: HTMLImageElement | HTMLCanvasElement, repetition: string): CanvasPattern;

    // Image handling
    loadImage(src: string): Promise<HTMLImageElement>;
    drawImage(image: HTMLImageElement, x: number, y: number): void;
    drawImage(image: HTMLImageElement, x: number, y: number, width: number, height: number): void;
    drawImage(image: HTMLImageElement, sx: number, sy: number, sWidth: number, sHeight: number,
        dx: number, dy: number, dWidth: number, dHeight: number): void;

    // Mathematical utilities
    readonly floor: (value: number) => number;
    readonly ceil: (value: number) => number;
    readonly round: (value: number) => number;
    readonly abs: (value: number) => number;
    readonly min: (a: number, b: number) => number;
    readonly max: (a: number, b: number) => number;
    readonly sin: (angle: number) => number;
    readonly cos: (angle: number) => number;
    readonly tan: (angle: number) => number;
    readonly asin: (value: number) => number;
    readonly acos: (value: number) => number;
    readonly atan: (value: number) => number;
    readonly atan2: (y: number, x: number) => number;
    readonly sqrt: (value: number) => number;
    readonly pow: (base: number, exponent: number) => number;
    readonly exp: (value: number) => number;
    readonly log: (value: number) => number;
    readonly random: () => number;
    readonly randomRange: (min: number, max: number) => number;
    readonly randomInt: (min: number, max: number) => number;
    readonly map: (value: number, start1: number, stop1: number, start2: number, stop2: number) => number;
    readonly lerp: (start: number, stop: number, amt: number) => number;
    readonly constrain: (value: number, min: number, max: number) => number;
    readonly norm: (value: number, start: number, stop: number) => number;
    readonly dist: (x1: number, y1: number, x2: number, y2: number) => number;
    readonly mag: (x: number, y: number) => number;
    readonly radians: (degrees: number) => number;
    readonly degrees: (radians: number) => number;

    // Constants
    readonly PI: number;
    readonly TWO_PI: number;
    readonly HALF_PI: number;
    readonly QUARTER_PI: number;
    readonly TAU: number;

    // Type constructors
    vector: typeof Vector;
    color: typeof Color;
    matrix: typeof Matrix;
    complex: typeof Complex;
    palette: typeof Palette;

    // Input systems
    readonly KEYB: KeyboardInput;
    readonly KEYS: KeyboardInput; // Alias for KEYB
    readonly MOUSE: MouseInput;

    // Screen properties
    readonly width: number;
    readonly height: number;
    readonly centerX: number;
    readonly centerY: number;
    readonly center: Vector;
}

// ============================================================================
// Function Exports (for named imports)
// ============================================================================

// Core functions
export function init(options?: ScreenOptions): Promise<void>;
export function init(canvas: HTMLCanvasElement | string, width?: number, height?: number): Promise<void>;
export function init(width: number, height: number): Promise<void>;

// Animation
export function setupRun(callback: AnimationCallback): void;
export function playAnimation(): void;
export function stopAnimation(): void;
export function pauseAnimation(): void;
export function resumeAnimation(): void;

// Drawing
export function background(color: Color | string): void;
export function clear(color?: Color | string): void;
export function fill(color: Color | string): void;
export function noFill(): void;
export function stroke(color: Color | string, width?: number): void;
export function noStroke(): void;
export function rect(x: number, y: number, width: number, height: number): void;
export function circle(x: number, y: number, radius: number): void;
export function line(x1: number, y1: number, x2: number, y2: number): void;
export function text(text: string, x: number, y: number): void;

// Math utilities
export const floor: (value: number) => number;
export const ceil: (value: number) => number;
export const round: (value: number) => number;
export const abs: (value: number) => number;
export const sin: (angle: number) => number;
export const cos: (angle: number) => number;
export const random: () => number;
export const map: (value: number, start1: number, stop1: number, start2: number, stop2: number) => number;
export const lerp: (start: number, stop: number, amt: number) => number;

// Constants
export const PI: number;
export const TWO_PI: number;
export const HALF_PI: number;

// Type constructors
export const vector: typeof Vector;
export const color: typeof Color;
export const matrix: typeof Matrix;

// Input
export const KEYB: KeyboardInput;
export const KEYS: KeyboardInput;
export const MOUSE: MouseInput;

// Default export
declare const dcl: DCL;
export default dcl;
