# TypeScript Support for DrCircuitsCanvasLibrary

This directory contains comprehensive TypeScript type definitions for the DrCircuitsCanvasLibrary (DCL), providing full type safety and IntelliSense support for TypeScript developers.

## 📦 Installation & Setup

### NPM Package Installation
```bash
npm install drcircuitscanvaslibrary
```

The package includes TypeScript definitions automatically. No additional `@types` package is needed.

### Manual Setup
If you're using the library from source:

1. Ensure the `types/dcl.d.ts` file is included in your project
2. Your `tsconfig.json` should include DOM types:
```json
{
  "compilerOptions": {
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

## 🚀 Usage Examples

### Basic Setup with TypeScript

```typescript
import dcl, { vector, color, Vector, Color, ScreenOptions } from 'drcircuitscanvaslibrary';

// Type-safe screen configuration
const options: ScreenOptions = {
  width: 800,
  height: 600,
  background: '#000000',
  pixelated: false
};

// Initialize with proper typing
await dcl.init(options);
```

### Vector Operations

```typescript
import { vector, Vector } from 'drcircuitscanvaslibrary';

// Create vectors with type safety
const position: Vector = vector.create(100, 200);
const velocity: Vector = vector.create(2, -1);

// All vector methods are fully typed
const newPosition: Vector = position.add(velocity);
const distance: number = position.distance(newPosition);
const normalized: Vector = velocity.normalize();
const magnitude: number = velocity.magnitude();

// Chaining operations
const result: Vector = position
  .add(velocity)
  .mul(2)
  .normalize()
  .mul(50);
```

### Color Management

```typescript
import { color, Color } from 'drcircuitscanvaslibrary';

// Create colors with full type support
const red: Color = color.create(255, 0, 0, 255);
const blue: Color = color.fromHex('#0000FF');
const randomColor: Color = color.random();

// Color operations
const mixed: Color = red.mix(blue, 0.5);
const lighter: Color = red.lighten(0.2);
const rgbString: string = red.toRgbString();
```

### Animation with Type Safety

```typescript
import dcl, { AnimationCallback } from 'drcircuitscanvaslibrary';

const animate: AnimationCallback = (time: number, deltaTime: number): void => {
  // Clear background
  dcl.background('#000');
  
  // Type-safe drawing
  dcl.fill('#ff0000');
  dcl.circle(100, 100, 50);
  
  // Text with proper typing
  dcl.text(`FPS: ${Math.round(1000 / deltaTime)}`, 10, 30);
};

dcl.setupRun(animate);
dcl.playAnimation();
```

### Input Handling

```typescript
import dcl, { MouseInput, KeyboardInput } from 'drcircuitscanvaslibrary';

// Mouse events with proper typing
dcl.MOUSE.onMouseDown((x: number, y: number, button: number) => {
  console.log(`Clicked at (${x}, ${y}) with button ${button}`);
});

// Keyboard events
dcl.KEYB.onKeyDown((key: string) => {
  if (key === dcl.KEYB.SPACE) {
    console.log('Spacebar pressed!');
  }
});
```

## 🔧 Available Types

### Core Interfaces

- **`Vector`** - 2D vector with 40+ mathematical operations
- **`Color`** - RGBA color with manipulation methods
- **`Matrix`** - 2D transformation matrix
- **`Complex`** - Complex number representation
- **`Palette`** - Color palette management

### Configuration Types

- **`ScreenOptions`** - Screen/canvas initialization options
- **`FrameRateOptions`** - Animation frame rate settings
- **`Buffer`** - Off-screen rendering buffer

### Drawing Types

- **`TextAlign`** - Text alignment options
- **`TextBaseline`** - Text baseline options
- **`LineCap`** - Line cap styles
- **`LineJoin`** - Line join styles
- **`BlendMode`** - Canvas blend modes

### Callback Types

- **`AnimationCallback`** - Animation loop function signature

### Input Types

- **`KeyboardInput`** - Keyboard state and event handling
- **`MouseInput`** - Mouse state and event handling

## 📖 Import Patterns

### Default Import (Recommended)
```typescript
import dcl from 'drcircuitscanvaslibrary';

await dcl.init({ width: 800, height: 600 });
dcl.circle(100, 100, 50);
```

### Named Imports
```typescript
import { 
  init, 
  circle, 
  vector, 
  color,
  setupRun,
  playAnimation 
} from 'drcircuitscanvaslibrary';

await init({ width: 800, height: 600 });
circle(100, 100, 50);
```

### Mixed Imports
```typescript
import dcl, { 
  Vector, 
  Color, 
  vector, 
  color,
  ScreenOptions 
} from 'drcircuitscanvaslibrary';

const options: ScreenOptions = { width: 800, height: 600 };
await dcl.init(options);

const pos: Vector = vector.create(100, 100);
const col: Color = color.red();
```

## 🎯 IntelliSense Features

When using TypeScript-enabled editors (VS Code, WebStorm, etc.), you'll get:

- **Auto-completion** for all DCL methods and properties
- **Parameter hints** showing expected types and optional parameters
- **Type checking** to catch errors at compile time
- **Method overloads** showing multiple ways to call functions
- **Documentation** on hover for methods and interfaces
- **Go to definition** for types and methods

## 🔍 Method Overloads

Many DCL functions support multiple calling patterns:

```typescript
// Circle drawing overloads
dcl.circle(x: number, y: number, radius: number): void;
dcl.circle(center: Vector, radius: number): void;

// Line drawing overloads
dcl.line(x1: number, y1: number, x2: number, y2: number): void;
dcl.line(start: Vector, end: Vector): void;

// Rectangle drawing overloads
dcl.rect(x: number, y: number, width: number, height: number): void;
dcl.rect(position: Vector, size: Vector): void;

// Initialization overloads
dcl.init(options: ScreenOptions): Promise<void>;
dcl.init(canvas: HTMLCanvasElement | string, width?: number, height?: number): Promise<void>;
dcl.init(width: number, height: number): Promise<void>;
```

## 🧪 Testing TypeScript Integration

The `examples/typescript-example.ts` file demonstrates comprehensive usage of the TypeScript definitions. To test:

1. Install TypeScript: `npm install -g typescript`
2. Compile the example: `tsc examples/typescript-example.ts`
3. Run the compiled output in a browser with the DCL library

## 🛠️ Development

The type definitions are located in `types/dcl.d.ts` and cover:

- All DCL public API methods (100+ functions)
- Vector operations (40+ methods)
- Color manipulation (20+ methods)
- Matrix transformations
- Input handling systems
- Animation and timing utilities
- Drawing and graphics functions
- Mathematical utilities and constants

## 📝 Contributing

When adding new features to DCL:

1. Update the corresponding interface in `types/dcl.d.ts`
2. Add method overloads if the function supports multiple call patterns
3. Include JSDoc comments for better IntelliSense
4. Test with the TypeScript example to ensure compatibility

## 🆘 Troubleshooting

### Common Issues

**"Cannot find module 'drcircuitscanvaslibrary'"**
- Ensure the package is installed: `npm install drcircuitscanvaslibrary`
- Check your `tsconfig.json` has proper module resolution

**"Property does not exist on type"**
- Verify you're using the latest version of the type definitions
- Check if you're importing the correct types

**"Type 'X' is not assignable to type 'Y'"**
- Review the method signature in the type definitions
- Ensure you're passing the correct parameter types

### Getting Help

- Check the examples in the `examples/` directory
- Review the type definitions in `types/dcl.d.ts`
- File issues on the GitHub repository for type-related problems
