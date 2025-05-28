/**
 * Tests for shapes.js module
 */

import { describe, test, expect, beforeEach, afterEach, mockFn } from './test-utils.js';
import * as shapes from '../src/shapes.js';

// Destructure the individual functions we need for easier access
const { getCtx, rect, circle, line, text, stroke, fill } = shapes;

describe('Shapes Module', () => {
    let mockCtx;
    let mockDcl;

    beforeEach(() => {
        // Create a comprehensive mock context
        mockCtx = {
            beginPath: mockFn(),
            arc: mockFn(),
            fill: mockFn(),
            stroke: mockFn(),
            moveTo: mockFn(),
            lineTo: mockFn(),
            fillRect: mockFn(),
            strokeRect: mockFn(),
            fillText: mockFn(),
            closePath: mockFn(),
            save: mockFn(),
            restore: mockFn(),
            translate: mockFn(),
            rotate: mockFn(),
            scale: mockFn()
        };

        // Mock dcl object
        mockDcl = {
            renderContext: {
                beginPath: mockFn(),
                arc: mockFn(),
                fill: mockFn(),
                stroke: mockFn(),
                moveTo: mockFn(),
                lineTo: mockFn(),
                fillRect: mockFn(),
                strokeRect: mockFn(),
                fillText: mockFn(),
                closePath: mockFn(),
                save: mockFn(),
                restore: mockFn(),
                translate: mockFn(),
                rotate: mockFn(),
                scale: mockFn()
            },
            rad: mockFn(() => Math.PI * 2)
        };

        // Setup global access to mockDcl
        global.window = { dcl: mockDcl };
    });

    afterEach(() => {
        // Clean up global modifications
        delete global.window;
    });

    describe('getCtx', () => {
        test('should return provided context', () => {
            const result = getCtx(mockCtx);
            expect(result).toBe(mockCtx);
        });

        test('should fallback to global dcl context', () => {
            const result = getCtx();
            expect(result).toBe(mockDcl.renderContext);
        });

        test('should prefer provided context over global', () => {
            const otherCtx = { test: true };
            const result = getCtx(otherCtx);
            expect(result).toBe(otherCtx);
        });
    });

    describe('rect', () => {
        test('should draw basic rectangle', () => {
            rect(10, 20, 100, 50, 'red', null, null, mockCtx);

            expect(mockCtx.fillStyle).toBe('red');
            expect(mockCtx.fillRect).toHaveBeenCalledWith(10, 20, 100, 50);
        });

        test('should use width for height if height not provided', () => {
            rect(10, 20, 100, undefined, 'red', null, null, mockCtx);

            expect(mockCtx.fillRect).toHaveBeenCalledWith(10, 20, 100, 100);
        });

        test('should draw rectangle with stroke', () => {
            rect(10, 20, 100, 50, 'red', 2, 'black', mockCtx);

            expect(mockCtx.fillStyle).toBe('red');
            expect(mockCtx.strokeStyle).toBe('black');
            expect(mockCtx.lineWidth).toBe(2);
            expect(mockCtx.fillRect).toHaveBeenCalledWith(10, 20, 100, 50);
            expect(mockCtx.strokeRect).toHaveBeenCalledWith(10, 20, 100, 50);
        });

        test('should use default stroke color when not provided', () => {
            rect(10, 20, 100, 50, 'red', 2, null, mockCtx);

            expect(mockCtx.strokeStyle).toBe('#000088');
        });

        test('should handle color objects', () => {
            const colorObj = {
                isColor: true,
                toStyle: () => '#ff0000'
            };

            rect(10, 20, 100, 50, colorObj, null, null, mockCtx);

            expect(mockCtx.fillStyle).toBe('#ff0000');
        });

        test('should use default color when none provided', () => {
            rect(10, 20, 100, 50, null, null, null, mockCtx);

            expect(mockCtx.fillStyle).toBe('blue');
        });
    });

    describe('stroke', () => {
        test('should set stroke properties and call stroke', () => {
            stroke('red', 3, mockCtx);

            expect(mockCtx.strokeStyle).toBe('red');
            expect(mockCtx.lineWidth).toBe(3);
            expect(mockCtx.lineJoin).toBe('round');
            expect(mockCtx.lineCap).toBe('round');
            expect(mockCtx.stroke).toHaveBeenCalled();
        });

        test('should handle color objects', () => {
            const colorObj = {
                isColor: true,
                toStyle: () => '#00ff00'
            };

            stroke(colorObj, 2, mockCtx);

            expect(mockCtx.strokeStyle).toBe('#00ff00');
        });

        test('should use default color when none provided', () => {
            stroke(null, 2, mockCtx);

            expect(mockCtx.strokeStyle).toBe('#000088');
        });
    });

    describe('fill', () => {
        test('should set fill style and call fill', () => {
            fill('green', mockCtx);

            expect(mockCtx.fillStyle).toBe('green');
            expect(mockCtx.fill).toHaveBeenCalled();
        });

        test('should handle color objects', () => {
            const colorObj = {
                isColor: true,
                toStyle: () => '#0000ff'
            };

            fill(colorObj, mockCtx);

            expect(mockCtx.fillStyle).toBe('#0000ff');
        });

        test('should use default color when none provided', () => {
            fill(null, mockCtx);

            expect(mockCtx.fillStyle).toBe('blue');
        });
    });

    describe('circle', () => {
        test('should draw basic circle', () => {
            circle(50, 60, 25, 'purple', null, null, mockCtx, mockDcl);

            expect(mockCtx.beginPath).toHaveBeenCalled();
            expect(mockCtx.arc).toHaveBeenCalledWith(50, 60, 25, 0, Math.PI * 2);
            expect(mockCtx.fillStyle).toBe('purple');
            expect(mockCtx.fill).toHaveBeenCalled();
            expect(mockCtx.closePath).toHaveBeenCalled();
        });

        test('should draw circle with stroke', () => {
            circle(50, 60, 25, 'purple', 2, 'black', mockCtx, mockDcl);

            expect(mockCtx.arc).toHaveBeenCalledWith(50, 60, 25, 0, Math.PI * 2);
            expect(mockCtx.fillStyle).toBe('purple');
            expect(mockCtx.strokeStyle).toBe('black');
            expect(mockCtx.lineWidth).toBe(2);
            expect(mockCtx.fill).toHaveBeenCalled();
            expect(mockCtx.stroke).toHaveBeenCalled();
        });

        test('should use dcl.rad when dcl is provided', () => {
            circle(50, 60, 25, 'purple', null, null, mockCtx, mockDcl);

            expect(mockDcl.rad).toHaveBeenCalledWith(360);
        });

        test('should fallback to Math.PI when dcl not provided', () => {
            circle(50, 60, 25, 'purple', null, null, mockCtx);

            expect(mockCtx.arc).toHaveBeenCalledWith(50, 60, 25, 0, Math.PI * 2);
        });
    });

    describe('line', () => {
        test('should draw line between two points', () => {
            line(10, 20, 30, 40, 2, 'red', mockCtx);

            expect(mockCtx.beginPath).toHaveBeenCalled();
            expect(mockCtx.moveTo).toHaveBeenCalledWith(10, 20);
            expect(mockCtx.lineTo).toHaveBeenCalledWith(30, 40);
            expect(mockCtx.strokeStyle).toBe('red');
            expect(mockCtx.lineWidth).toBe(2);
            expect(mockCtx.stroke).toHaveBeenCalled();
            expect(mockCtx.closePath).toHaveBeenCalled();
        });
    });

    describe('text', () => {
        test('should draw basic text', () => {
            text('Hello World', 100, 200, 'black', 'Arial', 16, null, null, mockCtx);

            expect(mockCtx.font).toBe('16px Arial');
            expect(mockCtx.textAlign).toBe('center');
            expect(mockCtx.fillStyle).toBe('black');
            expect(mockCtx.fillText).toHaveBeenCalledWith('Hello World', 100, 200);
        });

        test('should handle text with maxWidth', () => {
            text('Hello World', 100, 200, 'black', 'Arial', 16, 150, null, mockCtx);

            expect(mockCtx.fillText).toHaveBeenCalledWith('Hello World', 100, 200, 150);
        });

        test('should use default values when not provided', () => {
            text('Test', 100, 200, null, null, null, null, null, mockCtx);

            expect(mockCtx.font).toBe('16px Arial');
            expect(mockCtx.textAlign).toBe('center');
            expect(mockCtx.fillStyle).toBe('blue');
        });

        test('should handle custom alignment', () => {
            text('Test', 100, 200, 'red', 'Helvetica', 20, null, 'left', mockCtx);

            expect(mockCtx.font).toBe('20px Helvetica');
            expect(mockCtx.textAlign).toBe('left');
            expect(mockCtx.fillStyle).toBe('red');
        });

        test('should handle color objects', () => {
            const colorObj = {
                isColor: true,
                toStyle: () => '#ff00ff'
            };

            text('Test', 100, 200, colorObj, null, null, null, null, mockCtx);

            expect(mockCtx.fillStyle).toBe('#ff00ff');
        });
    });

    describe('Integration with global dcl', () => {
        test('should use global dcl context when no context provided', () => {
            rect(10, 20, 100, 50, 'red');

            expect(mockDcl.renderContext.fillStyle).toBe('red');
            expect(mockDcl.renderContext.fillRect).toHaveBeenCalledWith(10, 20, 100, 50);
        });
    });
});
