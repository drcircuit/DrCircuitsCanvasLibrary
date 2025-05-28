/**
 * Tests for curve.js module
 */

import { describe, test, beforeEach, afterEach, expect, mockFn } from './test-utils.js';
import { curve } from '../src/curve.js';

describe('Curve Module', () => {
    let mockCtx;
    let consoleSpy;
    let originalConsoleError;

    beforeEach(() => {
        mockCtx = {
            beginPath: mockFn(),
            closePath: mockFn(),
            moveTo: mockFn(),
            lineTo: mockFn(),
            fill: mockFn(),
            stroke: mockFn(),
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 0,
            lineJoin: '',
            lineCap: ''
        };

        // Mock global dcl
        global.window = {
            dcl: {
                renderContext: mockCtx
            }
        };

        // Spy on console.error
        originalConsoleError = console.error;
        consoleSpy = mockFn();
        console.error = consoleSpy;
    });afterEach(() => {
        // Restore console.error
        console.error = originalConsoleError;
    });

    describe('start', () => {
        test('should begin path and move to position', () => {
            curve.start(10, 20, mockCtx);

            expect(mockCtx.beginPath).toHaveBeenCalled();
            expect(mockCtx.moveTo).toHaveBeenCalledWith(10, 20);
        });

        test('should use global context when none provided', () => {
            curve.start(15, 25);

            expect(mockCtx.beginPath).toHaveBeenCalled();
            expect(mockCtx.moveTo).toHaveBeenCalledWith(15, 25);
        });
    });

    describe('end', () => {
        test('should close path', () => {
            curve.end(mockCtx);

            expect(mockCtx.closePath).toHaveBeenCalled();
        });

        test('should use global context when none provided', () => {
            curve.end();

            expect(mockCtx.closePath).toHaveBeenCalled();
        });
    });

    describe('vertex', () => {
        test('should add line to position', () => {
            curve.vertex(30, 40, mockCtx);

            expect(mockCtx.lineTo).toHaveBeenCalledWith(30, 40);
        });

        test('should use global context when none provided', () => {
            curve.vertex(35, 45);

            expect(mockCtx.lineTo).toHaveBeenCalledWith(35, 45);
        });
    });

    describe('fill', () => {
        test('should set fill style and fill', () => {
            curve.fill('red', mockCtx);

            expect(mockCtx.fillStyle).toBe('red');
            expect(mockCtx.fill).toHaveBeenCalled();
        });

        test('should handle color objects', () => {
            const colorObj = {
                isColor: true,
                toStyle: () => '#ff0000'
            };

            curve.fill(colorObj, mockCtx);

            expect(mockCtx.fillStyle).toBe('#ff0000');
        });
    });

    describe('stroke', () => {
        test('should set stroke properties and stroke', () => {
            curve.stroke('blue', 3, mockCtx);

            expect(mockCtx.strokeStyle).toBe('blue');
            expect(mockCtx.lineWidth).toBe(3);
            expect(mockCtx.lineJoin).toBe('round');
            expect(mockCtx.lineCap).toBe('round');
            expect(mockCtx.stroke).toHaveBeenCalled();
        });

        test('should handle color objects', () => {
            const colorObj = {
                isColor: true,
                toStyle: () => '#0000ff'
            };

            curve.stroke(colorObj, 2, mockCtx);

            expect(mockCtx.strokeStyle).toBe('#0000ff');
        });
    });

    describe('plot', () => {
        test('should plot points array correctly', () => {
            const points = [
                { x: 10, y: 20 },
                { x: 30, y: 40 },
                { x: 50, y: 60 }
            ];

            curve.plot(points, 'red', 2, 'blue', mockCtx);

            // Should start with first point
            expect(mockCtx.beginPath).toHaveBeenCalled();
            expect(mockCtx.moveTo).toHaveBeenCalledWith(10, 20);

            // Should add vertices for middle points
            expect(mockCtx.lineTo).toHaveBeenCalledWith(30, 40);
            expect(mockCtx.lineTo).toHaveBeenCalledWith(50, 60);

            // Should end and stroke
            expect(mockCtx.closePath).toHaveBeenCalled();
            expect(mockCtx.strokeStyle).toBe('red');
            expect(mockCtx.lineWidth).toBe(2);
            expect(mockCtx.stroke).toHaveBeenCalled();

            // Should fill
            expect(mockCtx.fillStyle).toBe('blue');
            expect(mockCtx.fill).toHaveBeenCalled();
        });

        test('should plot without fill when fillColor not provided', () => {
            const points = [
                { x: 10, y: 20 },
                { x: 30, y: 40 }
            ];

            curve.plot(points, 'red', 2, null, mockCtx);

            expect(mockCtx.stroke).toHaveBeenCalled();
            expect(mockCtx.fill).not.toHaveBeenCalled();
        });

        test('should handle single point', () => {
            const points = [{ x: 10, y: 20 }];

            curve.plot(points, 'red', 2, 'blue', mockCtx);

            expect(mockCtx.moveTo).toHaveBeenCalledWith(10, 20);
            expect(mockCtx.closePath).toHaveBeenCalled();
            expect(mockCtx.stroke).toHaveBeenCalled();
            expect(mockCtx.fill).toHaveBeenCalled();
        });

        test('should handle empty array gracefully', () => {
            const points = [];

            expect(() => {
                curve.plot(points, 'red', 2, 'blue', mockCtx);
            }).not.toThrow();

            // No drawing operations should be called
            expect(mockCtx.beginPath).not.toHaveBeenCalled();
        });

        test('should log error for non-array input', () => {
            curve.plot('not an array', 'red', 2, 'blue', mockCtx);

            expect(consoleSpy).toHaveBeenCalledWith(
                'Error! you must supply an array with coordinates as an argument to this function.'
            );
        });

        test('should log error for object without forEach', () => {
            const notAnArray = { x: 10, y: 20 };

            curve.plot(notAnArray, 'red', 2, 'blue', mockCtx);

            expect(consoleSpy).toHaveBeenCalledWith(
                'Error! you must supply an array with coordinates as an argument to this function.'
            );
        });

        test('should work with points containing extra properties', () => {
            const points = [
                { x: 10, y: 20, z: 30, color: 'red' },
                { x: 40, y: 50, z: 60, color: 'blue' }
            ];

            expect(() => {
                curve.plot(points, 'green', 1, null, mockCtx);
            }).not.toThrow();

            expect(mockCtx.moveTo).toHaveBeenCalledWith(10, 20);
            expect(mockCtx.lineTo).toHaveBeenCalledWith(40, 50);
        });

        test('should use global context when none provided', () => {
            const points = [
                { x: 10, y: 20 },
                { x: 30, y: 40 }
            ];

            curve.plot(points, 'red', 2);

            expect(mockCtx.beginPath).toHaveBeenCalled();
            expect(mockCtx.moveTo).toHaveBeenCalledWith(10, 20);
            expect(mockCtx.lineTo).toHaveBeenCalledWith(30, 40);
        });
    });

    describe('Integration workflow', () => {
        test('should support manual curve drawing workflow', () => {
            // Start curve
            curve.start(0, 0, mockCtx);
            expect(mockCtx.beginPath).toHaveBeenCalled();
            expect(mockCtx.moveTo).toHaveBeenCalledWith(0, 0);

            // Add vertices
            curve.vertex(10, 10, mockCtx);
            curve.vertex(20, 5, mockCtx);
            curve.vertex(30, 15, mockCtx);

            expect(mockCtx.lineTo).toHaveBeenCalledWith(10, 10);
            expect(mockCtx.lineTo).toHaveBeenCalledWith(20, 5);
            expect(mockCtx.lineTo).toHaveBeenCalledWith(30, 15);

            // Fill and stroke
            curve.fill('lightblue', mockCtx);
            curve.stroke('darkblue', 2, mockCtx);

            expect(mockCtx.fillStyle).toBe('lightblue');
            expect(mockCtx.fill).toHaveBeenCalled();
            expect(mockCtx.strokeStyle).toBe('darkblue');
            expect(mockCtx.stroke).toHaveBeenCalled();

            // End curve
            curve.end(mockCtx);
            expect(mockCtx.closePath).toHaveBeenCalled();
        });
    });
});
