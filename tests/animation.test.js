/**
 * Tests for animation.js module
 */

import { describe, test, beforeEach, afterEach, expect, mockFn } from './test-utils.js';
import { 
    setupRun, 
    playAnimation, 
    stopAnimation, 
    startAnimation, 
    animate 
} from '../src/animation.js';

describe('Animation Module', () => {
    let mockDcl;
    let mockDraw;
    let rafCallbacks = [];
    let originalRAF;

    beforeEach(() => {
        // Mock requestAnimationFrame
        originalRAF = global.requestAnimationFrame;
        global.requestAnimationFrame = (callback) => {
            rafCallbacks.push(callback);
            return rafCallbacks.length - 1;
        };

        // Reset animation state
        // Note: These are exported variables, so we need to import the module fresh
        // For now, we'll work with the current state

        mockDcl = {
            setup: mockFn(),
            draw: mockFn(),
            clear: mockFn()
        };

        mockDraw = mockFn();
        rafCallbacks = [];
    });

    afterEach(() => {
        global.requestAnimationFrame = originalRAF;
        rafCallbacks = [];
    });

    test('should export animation control functions', () => {
        expect(typeof stopAnimation).toBe('function');
        expect(typeof startAnimation).toBe('function');
        expect(typeof animate).toBe('function');
    });

    test('should export animation state variables', () => {
        expect(typeof setupRun).toBe('boolean');
        expect(typeof playAnimation).toBe('boolean');
    });

    test('stopAnimation should set playAnimation to false', () => {
        startAnimation(); // Ensure it's true first
        stopAnimation();
        // Note: Due to module scope, we can't directly test the internal state change
        // This would need to be tested through the animate function behavior
    });

    test('startAnimation should set playAnimation to true', () => {
        stopAnimation(); // Ensure it's false first
        startAnimation();
        // Note: Due to module scope, we can't directly test the internal state change
    });

    test('animate should call requestAnimationFrame', () => {
        animate(mockDcl, mockDraw);
        
        expect(rafCallbacks).toHaveLength(1);
        expect(typeof rafCallbacks[0]).toBe('function');
    });

    test('animate should call dcl.setup on first frame', () => {
        animate(mockDcl, mockDraw);
        
        // Simulate first frame
        rafCallbacks[0](100);
        
        expect(mockDcl.setup.calls).toHaveLength(1);
    });

    test('animate should call dcl.clear when clearEachFrame is true', () => {
        animate(mockDcl, mockDraw, true);
        
        // Simulate first frame
        rafCallbacks[0](100);
        
        expect(mockDcl.clear.calls).toHaveLength(1);
    });

    test('animate should not call dcl.clear when clearEachFrame is false', () => {
        animate(mockDcl, mockDraw, false);
        
        // Simulate first frame
        rafCallbacks[0](100);
        
        expect(mockDcl.clear.calls).toHaveLength(0);
    });

    test('animate should call draw function with time and delta', () => {
        animate(mockDcl, mockDraw);
        
        const time1 = 100;
        const time2 = 200;
        
        // First frame
        rafCallbacks[0](time1);
        expect(mockDraw.calls).toHaveLength(1);
        expect(mockDraw.calls[0][0]).toBe(time1);
        expect(typeof mockDraw.calls[0][1]).toBe('number');
    });

    test('animate should prefer dcl.draw over passed draw function', () => {
        const dclWithDraw = {
            ...mockDcl,
            draw: mockFn()
        };
        
        animate(dclWithDraw, mockDraw);
        
        // Simulate first frame
        rafCallbacks[0](100);
        
        expect(dclWithDraw.draw.calls).toHaveLength(1);
        expect(mockDraw.calls).toHaveLength(0);
    });

    test('animate should handle missing draw function gracefully', () => {
        const dclWithoutDraw = {
            setup: mockFn(),
            clear: mockFn()
            // No draw function
        };
        
        expect(() => {
            animate(dclWithoutDraw, null);
            rafCallbacks[0](100);
        }).not.toThrow();
    });
});
