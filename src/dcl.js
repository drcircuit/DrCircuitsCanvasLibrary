/**
 * Created by Espen on 03.03.2017.
 */

import {
    floor, ceil, round, abs, sin, cos, tan, atan, atan2, pow, sqrt, min, max, log, exp,
    mod, clamp, fract, lerp, rad, trig
} from './utils.js';
import { vector } from './vector.js';
import { color, RED, MAGENTA, YELLOW, GREEN, CYAN, BLUE, TRANS, BLACK, WHITE, GRAY } from './color.js';
import { matrix } from './matrix.js';
import './extensions.js';
import { palette } from './palette.js';
import { KEYB, KEYS } from './keyboard.js';
import { MOUSE } from './mouse.js';
import { complex } from './complex.js';
import { createSprite, sprite } from './sprite.js';
import * as shapes from './shapes.js';
import { curve } from './curve.js';
import { createBuffer, setupScreen } from './buffer.js';
import { getCtx, attachGlobals } from './legacy.js';
import {
    setupRun,
    playAnimation,
    stopAnimation,
    startAnimation,
    animate
} from './animation.js';

const dcl = {};

// init function to setup setup and draw methods from the global context of the user
// Can accept either individual parameters or a single config object
dcl.init = function (setup, draw, config) {
    // Handle different parameter patterns:
    // init(setup, draw, screenConfig)
    // init(setup, config) where config includes draw
    // init(config) where config includes setup and draw
    
    let screenOptions = null;
    
    // If first parameter is an object and no other params, treat it as full config
    if (typeof setup === 'object' && setup !== null && arguments.length === 1) {
        const fullConfig = setup;
        setup = fullConfig.setup;
        draw = fullConfig.draw;
        screenOptions = fullConfig.screen || fullConfig;
    }
    // If second parameter is an object and no third param, check if it's config with draw
    else if (typeof draw === 'object' && draw !== null && arguments.length === 2) {
        const configWithDraw = draw;
        if (configWithDraw.draw) {
            screenOptions = configWithDraw.screen || configWithDraw;
            draw = configWithDraw.draw;
        } else {
            screenOptions = configWithDraw;
            draw = undefined;
        }
    }
    // Standard three-parameter call
    else if (config && typeof config === 'object') {
        screenOptions = config;
    }

    // Set up the setup function
    if (typeof setup === 'function') {
        dcl.setup = setup;
    } else if (typeof window !== 'undefined' && typeof window.setup === 'function') {
        dcl.setup = window.setup;
    }

    // Set up the draw function
    if (typeof draw === 'function') {
        dcl.draw = draw;
    } else if (typeof window !== 'undefined' && typeof window.draw === 'function') {
        dcl.draw = window.draw;
    }    // Call setupScreen if options are provided
    if (screenOptions && typeof screenOptions === 'object') {
        dcl.screen = setupScreen(
            dcl, 
            screenOptions.width,
            screenOptions.height,
            screenOptions.keepSquare,
            screenOptions.gridScale,
            screenOptions.parent,
            screenOptions.positioning
        );
    }

    // Ensure the setup and draw methods are defined, provide no-op defaults
    if (typeof dcl.setup !== 'function') {
        dcl.setup = function() {}; // Default no-op setup
    }
    if (typeof dcl.draw !== 'function') {
        dcl.draw = function() {}; // Default no-op draw
    }
};


// Assign math and utility functions
Object.assign(dcl, {
    floor, ceil, round, abs, sin, cos, tan, atan, atan2, pow, sqrt, min, max, log, exp,
    mod, clamp, fract, lerp, rad, trig
});

// Core types and modules
dcl.vector = vector;
dcl.matrix = matrix;
dcl.complex = complex;
dcl.color = color;
dcl.palette = palette;
dcl.KEYB = KEYB;
dcl.KEYS = KEYS;
dcl.MOUSE = MOUSE;

// Shapes and drawing
dcl.rect = shapes.rect;
dcl.circle = shapes.circle;
dcl.line = shapes.line;
dcl.fill = shapes.fill;
dcl.stroke = shapes.stroke;
dcl.text = shapes.text;
dcl.getCtx = getCtx;

// Sprite
dcl.sprite = sprite;
dcl.createSprite = createSprite;

// Curve
dcl.curve = curve;

// Buffer/screen
dcl.createBuffer = function(width, height) {
    return createBuffer(width, height, dcl);
};

dcl.setupScreen = function(width, height, keepSquare, gridScale, parent) {
    return setupScreen(dcl, width, height, keepSquare, gridScale, parent);
};

// Animation
dcl.setupRun = setupRun;
dcl.playAnimation = playAnimation;
dcl.stopAnimation = stopAnimation;
dcl.startAnimation = startAnimation;
dcl.animate = function() { // Removed unused 't' parameter, corrected arguments to imported animate
    // The imported animate function from animation.js has signature:
    // animate(dclInstance, drawFunction, clearEachFrameOption)
    // It internally calls dclInstance.setup() and then (dclInstance.draw || drawFunction).
    animate(dcl, dcl.draw, dcl.clearEachFrame);
};

// Random
dcl.random = function (min, max) {
    if (min === undefined) return Math.random();
    if (max === undefined) return Math.random() * min;
    return Math.random() * (max - min) + min;
};
dcl.randomi = function (min, max) {
    if (min === undefined) return Math.floor(Math.random()); // Should likely be 0 or 1, or error
    if (max === undefined) return Math.floor(Math.random() * min);
    return Math.floor(dcl.random(min, max));
};

// Clear
dcl.clear = function (colorValue, ctx) {
    ctx = dcl.getCtx(ctx);
    if (!ctx) return;
    if (colorValue !== undefined) {
        let styleColor = colorValue;
        if (colorValue && typeof colorValue.isColor !== 'undefined' && colorValue.isColor) {
            styleColor = colorValue.toStyle();
        }
        ctx.fillStyle = styleColor;
        ctx.fillRect(0, 0, dcl.screen.width, dcl.screen.height);
    } else {
        ctx.clearRect(0, 0, dcl.screen.width, dcl.screen.height);
    }
};

// Constants
dcl.const = {
    phi: (1 + Math.sqrt(5)) / 2,
    iphi: 2 / (1 + Math.sqrt(5)),
    pi: Math.PI,
    e: Math.E,
    r2: Math.sqrt(2),
    ir2: 1 / Math.sqrt(2)
};

// Math Constants to be exported/global
const PI = Math.PI;
const E = Math.E;
const TAU = PI * 2;

// Aliases for global/ES export
const random = dcl.random;
const randomi = dcl.randomi;
const text = shapes.text; // Direct alias from shapes module
const rect = shapes.rect;
const circle = shapes.circle;
const line = shapes.line;
const fill = shapes.fill;
const stroke = shapes.stroke;


// Legacy/UMD/global for browser
// These will be available on the window object
attachGlobals(dcl, {
    // Colors
    RED, MAGENTA, YELLOW, GREEN, CYAN, BLUE, TRANS, BLACK, WHITE, GRAY,
    // Math constants
    PI, E, TAU,
    // Input
    KEYS, MOUSE, KEYB,
    // Core types/factories
    matrix, color, vector, palette, complex,
    // Math utils (already top-level imports)
    floor, ceil, round, abs, sin, cos, tan, atan, atan2, pow, sqrt, min, max, log, exp,
    mod, clamp, fract, lerp, rad, trig,
    // Random functions (using aliases)
    random, randomi,
    // Sprite
    createSprite, sprite,
    // Modules (full objects)
    shapes, // The entire shapes module
    curve,  // The entire curve module
    // Buffer/Screen
    createBuffer, setupScreen,
    // Legacy
    getCtx,
    // Specific shape functions (using aliases)
    text, rect, circle, line, fill, stroke,
    // Animation functions (already top-level imports)
    setupRun, playAnimation, stopAnimation, startAnimation, animate
});

export default dcl;

// Named ES exports
export {
    // Math utils
    floor, ceil, round, abs, sin, cos, tan, atan, atan2, pow, sqrt, min, max, log, exp,
    mod, clamp, fract, lerp, rad, trig,
    // Colors
    RED, MAGENTA, YELLOW, GREEN, CYAN, BLUE, TRANS, BLACK, WHITE, GRAY,
    // Core types/factories
    color, matrix, vector, palette, complex,
    // Input
    KEYB, KEYS, MOUSE,
    // Math constants
    PI, E, TAU,
    // Random functions (exported aliases)
    random, randomi,
    // Sprite
    createSprite, sprite,
    // Modules (full objects)
    shapes,
    curve,
    // Buffer/Screen
    createBuffer, setupScreen,
    // Legacy
    getCtx,
    // Specific shape functions (exported aliases)
    text, rect, circle, line, fill, stroke,
    // Animation functions
    setupRun, playAnimation, stopAnimation, startAnimation, animate
};

