# [DrCircuitsCanvasLibrary](https://drcircuit.github.io/DrCircuitsCanvasLibrary/) click to view examples live

**A lightweight, performance-focused HTML5 Canvas library for creative coding and graphics programming**

DrCircuitsCanvasLibrary (DCL) is a minimalist canvas library designed for developers who want powerful graphics capabilities without the overhead. Perfect for creative coding, games, data visualization, and interactive graphics applications.

## 🎯 Why Choose DCL Over P5.js?

While [P5.js](https://p5js.org/) is an excellent library for creative coding, DCL offers distinct advantages for certain use cases:

### **🚀 Performance & Size**
- **Lightweight**: DCL is significantly smaller (~50KB vs P5.js ~1.2MB), meaning faster load times
- **Zero abstraction overhead**: Direct canvas API access with convenient helpers, not a complete abstraction layer
- **Optimized for real-time graphics**: Built with performance in mind for smooth animations and complex scenes

### **🔧 Professional Development Focus**
- **Vanilla JavaScript**: Pure ES6 modules with no framework dependencies
- **TypeScript-friendly**: Clean APIs that work seamlessly with TypeScript projects
- **Production-ready**: Minimal runtime overhead makes it suitable for production web applications

### **🎮 Game Development Optimized**
- **Built-in input handling**: Mouse and keyboard input systems ready out of the box
- **Performance monitoring**: Built-in benchmarking and performance testing utilities
- **Memory efficient**: Designed for long-running applications without memory leaks

### **📐 Advanced Mathematics**
- **Comprehensive vector math**: Full 2D/3D vector operations with swizzling (`vector.xy`, `vector.xyz`)
- **Matrix transformations**: Complete matrix math for complex 2D/3D transformations
- **Complex numbers**: Built-in complex number support for advanced graphics algorithms
- **3D projection**: Easy 3D-to-2D projection system for pseudo-3D graphics

### **🎨 Fine-Grained Control**
- **Direct canvas access**: Full control over the rendering context when needed
- **Modular design**: Import only the features you need (tree-shaking friendly)
- **Custom rendering**: Easy integration with WebGL or other rendering technologies

## 📈 When to Choose DCL vs P5.js

**Choose DCL when:**
- Building performance-critical applications (games, real-time visualizations)
- Working on production web apps where bundle size matters
- Need advanced vector/matrix math capabilities
- Want direct canvas control with convenient helpers
- Building interactive applications with complex input handling
- Prefer functional programming patterns over object-oriented abstractions

**Choose P5.js when:**
- Learning creative coding or programming fundamentals
- Rapid prototyping and sketching ideas
- Educational contexts or workshops
- Need extensive community examples and tutorials
- Want the largest possible ecosystem of add-ons and libraries
- Prefer a more beginner-friendly, art-focused API

## 🛠️ Built for Modern JavaScript

DCL embraces modern JavaScript practices with ES6 modules, clean functional APIs, and excellent developer experience. It's designed to feel natural in modern build systems and works seamlessly with frameworks like React, Vue, or vanilla JavaScript applications.

## 🚀 Quick Start

### Installation
```bash
npm install --save drcircuitscanvaslibrary
```

### Basic Usage
```javascript
import dcl from 'drcircuitscanvaslibrary';

function setup() {
    // Initialize your scene - called once
    dcl.screen.setBgColor('darkblue');
}

function draw(timestamp, deltaTime) {
    // Animation loop - called every frame
    dcl.clear();
    
    // Draw a spinning circle
    const angle = timestamp * 0.01;
    const x = dcl.screen.width / 2 + Math.cos(angle) * 100;
    const y = dcl.screen.height / 2 + Math.sin(angle) * 100;
    
    dcl.circle(x, y, 20, dcl.color.RED);
}

// Initialize and start the animation
dcl.init(setup, draw, {
    width: 800,
    height: 600,
    parent: document.getElementById('canvas-container')
});

dcl.animate();
```

### Advanced Configuration
### Advanced Configuration
```javascript
// Legacy pattern (still supported)
(function(){
    let scr;
  
    function setup() {
        scr = dcl.setupScreen(window.innerWidth, window.innerHeight);
        scr.setBgColor('darkblue');
        document.body.style.backgroundColor = 'darkblue';      
    }
    function draw(t, dt){
       // your drawing and update logic here..
    }
    dcl.init(setup, draw);
    dcl.animate();
})();
```

## ✨ Core Features

### **🎨 Drawing & Shapes**
- Basic shapes: rectangles, circles, lines, text
- Advanced curve system with Bézier curves and path plotting
- Color system with palette support (fire, rainbow, etc.)
- Fill and stroke operations with transparency

### **📐 Vector Mathematics**
- 2D/3D/4D vector operations with full swizzling support
- Vector transformations: rotation, scaling, translation
- 3D projection for pseudo-3D graphics
- Cross product, dot product, normalization, reflection

### **🔢 Matrix & Complex Math**
- Complete 2D/3D transformation matrices
- Complex number arithmetic for advanced algorithms
- Built-in mathematical constants (π, φ, e, √2)
- Comprehensive math utilities (lerp, clamp, trigonometry)

### **🎮 Input & Interaction**
- Mouse tracking with position and button states
- Keyboard input with key press/release detection
- Event-driven input system for responsive interactions

### **⚡ Performance & Animation**
- Smooth 60fps animation loop with delta time
- Performance benchmarking and baseline establishment
- Memory-efficient rendering pipeline
- Optional frame clearing for creative effects

### **🛠️ Developer Experience**
- Comprehensive test suite with 95%+ coverage
- **🎯 Full TypeScript support with IntelliSense** 
- Modular architecture - import what you need
- Extensive examples and documentation

## 📝 TypeScript Support

DCL includes comprehensive TypeScript definitions for a superior development experience:

```typescript
import dcl, { vector, color, Vector, Color, ScreenOptions } from 'drcircuitscanvaslibrary';

// Type-safe initialization
const options: ScreenOptions = {
  width: 800,
  height: 600,
  background: '#000000'
};

await dcl.init(options);

// Fully typed vector operations
const position: Vector = vector.create(100, 200);
const velocity: Vector = vector.create(2, -1);
const newPosition: Vector = position.add(velocity.mul(deltaTime));

// Type-safe color management
const primaryColor: Color = color.create(255, 100, 50, 200);
const mixedColor: Color = primaryColor.mix(color.blue(), 0.5);

// IntelliSense for all 100+ DCL methods
dcl.fill(primaryColor);
dcl.circle(position, 50);
```

**Features:**
- 🎯 **100+ typed methods** with IntelliSense support
- 🔍 **Method overloads** for flexible function calls  
- 📐 **Vector/Matrix/Color interfaces** with 40+ mathematical operations
- 🎮 **Input system typing** for mouse and keyboard events
- 📚 **Comprehensive documentation** with examples

See [`types/README.md`](types/README.md) for complete TypeScript integration guide.

## 🔧 Flexible Initialization API

DCL provides multiple initialization patterns to suit different coding styles and project needs:

**New: Enhanced Init API with Screen Configuration**
```javascript
// Traditional approach - separate functions with screen config
dcl.init(setup, draw, {
    width: 800,
    height: 600,
    keepSquare: false,
    gridScale: 1,
    parent: document.getElementById('canvas-container')
});

// Config object with draw function
dcl.init(setup, {
    draw: draw,
    width: 800,
    height: 600,
    parent: document.getElementById('canvas-container')
});

// Full configuration object
dcl.init({
    setup: function() {
        // setup code here
    },
    draw: function(t, dt) {
        // drawing code here
    },
    screen: {  // or just put screen properties at top level
        width: 800,
        height: 600,
        keepSquare: false,
        gridScale: 1,
        parent: document.getElementById('canvas-container')
    }
});
```

## 🎯 Live Examples

Explore these interactive examples to see DCL's capabilities in action:

# Examples:
* [🎲 Spinning Cube](/examples/cube.html) - 3D wireframe cube with matrix transformations
* [📈 Curve System](/examples/curve.html) - Dynamic curve plotting and Bézier paths  
* [⚫ Dodecahedron](/examples/dodecahedron.html) - Complex 3D polyhedron with multi-axis rotation
* [🔺 Dual Tetrahedron](/examples/dualtetrahedron.html) - Intersecting 3D shapes demo
* [⌨️ Keyboard Input](/examples/keyboard.html) - Real-time keyboard-controlled movement
* [🖱️ Mouse Interaction](/examples/mouse.html) - Mouse tracking and click detection
* [🎨 Shape Gallery](/examples/shapes.html) - Random shapes with colors and animations
* [📐 Tetrahedron](/examples/tetrahedron.html) - 3D tetrahedron with projection system
* [🔺 Triangle 3D](/examples/triangle.html) - Basic 3D triangle transformation

# setupScreen function
setupScreen: function (width, height, keepSquare, gridScale, parent, positioning)

## Parameters:
* width: The width of your canvas
* height: The height of your canvas
* keepSquare: This will create a square canvas
* gridScale: Create a grid based coordinate system, where the scale is number of square pixels in one grid unit.
* parent: DOM element to append the canvas to (defaults to document.body if not provided)
* positioning: Canvas positioning mode - 'block' for contained block element, 'absolute' for absolute positioning (default)

## return object:
This method returns an object with the following:
* ctx: 2d rendering context
* width: the width of the canvas
* height: the height of the canvas
* cols: the number of columns in your grid
* rows: the number of rows in your grid
* setBgColor: function(color): sets the background color of the canvas
* randomSpot: function(): retrieves a random spot from the grid, returns a vector x, y

# dcl.init function
dcl.init: function(setup, draw, config) | function(setup, config) | function(config)

The init function has multiple signatures to provide flexibility in how you set up your DCL application:

## Three-parameter signature:
```javascript
dcl.init(setupFunction, drawFunction, screenConfig)
```

## Two-parameter signatures:
```javascript
// Setup function + config with draw
dcl.init(setupFunction, {
    draw: drawFunction,
    width: 800,
    height: 600,
    parent: containerElement
})
```

## Single-parameter signature (full config):
```javascript
dcl.init({
    setup: setupFunction,
    draw: drawFunction,
    screen: {  // or put screen properties at top level
        width: 800,
        height: 600,
        keepSquare: false,
        gridScale: 1,
        parent: containerElement
    }
})
```

## Screen Configuration Options:
* width: Canvas width in pixels
* height: Canvas height in pixels  
* keepSquare: Boolean - forces canvas to be square
* gridScale: Number of pixels per grid unit for coordinate system
* parent: DOM element to append canvas to (defaults to document.body)
* positioning: Canvas positioning mode - 'block' for contained block element, 'absolute' for absolute positioning (default)

# dcl.random function
dcl.random: function(min, max)
## Parameters:
* min: the minimum desired number of the random range.
& max: the maximum desired number of the random range.

## return object:
This method returns a random integer between the given min / max values passed to the function.

# dcl.rect function
dcl.rect: function(x, y, width, height, color, lineWidth, lineColor, ctx)

## Parameters:
* x: the x position of the upper left corner of the rectangle
* y: the y position of the upper left corner of the rectangle
* width: the width of the rectangle
* height: the height of the rectangle, if 0 or no value is provided, a square with a side length equal to the "width" parameter will be drawn
* color: the fill color of the rectangle, defaults to "blue" if no input is given.
* lineWidth: The width of the stroke around the perimeter : optional
* lineColor: The color of the stroke around the perimeter, defaults to "#000088" if no input is given : optional
* ctx: The canvas context to draw the circle on : optional.

## void
This method draws a rectangle based on the given parameters.

# dcl.circle function
dcl.circle: function(x, y, radius, color, lineWidth, lineColor, ctx)

## Parameters:

* x: the x position of the center of the circle
* y: the y position of the center of the circle
* radius: the radius of the circle
* color: the fill color of the circle, defaults to "blue" if no input is given.
* lineWidth: The width of the stroke around the perimeter : optional
* lineColor: The color of the stroke around the perimeter, defaults to "#000088" if no input is given : optional
* ctx: The canvas context to draw the circle on : optional.

## void
This method draws a circle based on the given parameters.

# dcl.line function
dcl.line: function(x, y, dx, dy, lineWidth, lineColor, ctx)

## Parameters:
* x: the x position of the start of the line
* y: the y position of the start of the line
* dx: the x position of the end of the line
* dy: the y position of the end of the line
* lineWidth: The width of the stroke around the perimeter : optional
* lineColor: The color of the stroke around the perimeter, defaults to "#000088" if no input is given : optional
* ctx: The canvas context to draw the line on : optional.

## void
This method draws a line based on the given parameters.

# dcl.animate function
This function starts the render loop.

---

## 📚 Additional Resources

- **[Live Examples](https://drcircuit.github.io/DrCircuitsCanvasLibrary/)** - Interactive demonstrations
- **[GitHub Repository](https://github.com/drcircuit/DrCircuitsCanvasLibrary)** - Source code and issues
- **[npm Package](https://www.npmjs.com/package/drcircuitscanvaslibrary)** - Installation and versions

## 🤝 Contributing

DCL is open source under the CC-BY-4.0 license. Contributions, issues, and feature requests are welcome!

## 📈 Performance

DCL includes built-in performance monitoring and maintains comprehensive test coverage (95%+) to ensure reliability and performance in production applications.

**Built with ❤️ by [Espen Sande Larsen](https://github.com/drcircuit) (Working Class Hacker)**

