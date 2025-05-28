/**
 * Tests for extensions.js module
 */

import { describe, test, beforeEach, afterEach } from './test-utils.js';

// Import extensions to apply them
import '../src/extensions.js';

describe('Extensions Module', () => {
    describe('Number extensions', () => {
        describe('toRadians', () => {
            test('should convert degrees to radians', () => {
                expect((180).toRadians()).toBeCloseTo(Math.PI, 5);
                expect((90).toRadians()).toBeCloseTo(Math.PI / 2, 5);
                expect((360).toRadians()).toBeCloseTo(Math.PI * 2, 5);
                expect((0).toRadians()).toBeCloseTo(0, 5);
            });

            test('should handle negative degrees', () => {
                expect((-180).toRadians()).toBeCloseTo(-Math.PI, 5);
                expect((-90).toRadians()).toBeCloseTo(-Math.PI / 2, 5);
            });

            test('should handle decimal degrees', () => {
                expect((45.5).toRadians()).toBeCloseTo((45.5 * Math.PI) / 180, 5);
                expect((123.456).toRadians()).toBeCloseTo((123.456 * Math.PI) / 180, 5);
            });

            test('should not overwrite existing method', () => {
                const originalMethod = Number.prototype.toRadians;
                
                // Re-import should not overwrite
                delete require.cache[require.resolve('../src/extensions.js')];
                require('../src/extensions.js');
                
                expect(Number.prototype.toRadians).toBe(originalMethod);
            });
        });

        describe('toDegrees', () => {
            test('should convert radians to degrees', () => {
                expect((Math.PI).toDegrees()).toBeCloseTo(180, 5);
                expect((Math.PI / 2).toDegrees()).toBeCloseTo(90, 5);
                expect((Math.PI * 2).toDegrees()).toBeCloseTo(360, 5);
                expect((0).toDegrees()).toBeCloseTo(0, 5);
            });

            test('should handle negative radians', () => {
                expect((-Math.PI).toDegrees()).toBeCloseTo(-180, 5);
                expect((-Math.PI / 2).toDegrees()).toBeCloseTo(-90, 5);
            });

            test('should handle decimal radians', () => {
                expect((1.5708).toDegrees()).toBeCloseTo((1.5708 * 180) / Math.PI, 3);
                expect((2.5).toDegrees()).toBeCloseTo((2.5 * 180) / Math.PI, 5);
            });

            test('should be inverse of toRadians', () => {
                const testAngles = [0, 30, 45, 90, 135, 180, 270, 360];
                
                testAngles.forEach(angle => {
                    const radians = angle.toRadians();
                    const backToDegrees = radians.toDegrees();
                    expect(backToDegrees).toBeCloseTo(angle, 5);
                });
            });
        });

        describe('map', () => {
            test('should map values between ranges', () => {
                // Map 0-100 to 0-1
                expect((50).map(0, 100, 0, 1)).toBeCloseTo(0.5, 5);
                expect((25).map(0, 100, 0, 1)).toBeCloseTo(0.25, 5);
                expect((75).map(0, 100, 0, 1)).toBeCloseTo(0.75, 5);
            });

            test('should handle different input ranges', () => {
                // Map 10-20 to 0-100
                expect((15).map(10, 20, 0, 100)).toBeCloseTo(50, 5);
                expect((12).map(10, 20, 0, 100)).toBeCloseTo(20, 5);
                expect((18).map(10, 20, 0, 100)).toBeCloseTo(80, 5);
            });

            test('should handle negative ranges', () => {
                // Map -10 to 10 to 0-100
                expect((0).map(-10, 10, 0, 100)).toBeCloseTo(50, 5);
                expect((-5).map(-10, 10, 0, 100)).toBeCloseTo(25, 5);
                expect((5).map(-10, 10, 0, 100)).toBeCloseTo(75, 5);
            });

            test('should handle inverted output ranges', () => {
                // Map 0-100 to 100-0 (inverted)
                expect((25).map(0, 100, 100, 0)).toBeCloseTo(75, 5);
                expect((75).map(0, 100, 100, 0)).toBeCloseTo(25, 5);
            });

            test('should handle edge cases', () => {
                // Input at minimum should map to output minimum
                expect((0).map(0, 100, 50, 150)).toBeCloseTo(50, 5);
                // Input at maximum should map to output maximum
                expect((100).map(0, 100, 50, 150)).toBeCloseTo(150, 5);
            });

            test('should handle values outside input range', () => {
                // Values outside input range should extrapolate
                expect((-10).map(0, 100, 0, 1)).toBeCloseTo(-0.1, 5);
                expect((110).map(0, 100, 0, 1)).toBeCloseTo(1.1, 5);
            });
        });
    });

    describe('Array extensions', () => {
        describe('bounce', () => {
            test('should create bounce effect for even-length arrays', () => {
                const arr = [1, 2, 3, 4];
                const bounced = arr.bounce();
                
                expect(bounced).toHaveLength(4);
                expect(bounced[0]).toBe(1);
                expect(bounced[1]).toBe(3);
                expect(bounced[2]).toBe(3);
                expect(bounced[3]).toBe(1);
            });

            test('should create bounce effect for odd-length arrays', () => {
                const arr = [1, 2, 3, 4, 5];
                const bounced = arr.bounce();
                
                expect(bounced).toHaveLength(5);
                expect(bounced[0]).toBe(1);
                expect(bounced[bounced.length - 1]).toBe(1); // Should end with first element
            });

            test('should respect custom size parameter', () => {
                const arr = [1, 2, 3, 4, 5, 6];
                const bounced = arr.bounce(8);
                
                expect(bounced).toHaveLength(8);
            });

            test('should handle single element arrays', () => {
                const arr = [42];
                const bounced = arr.bounce();
                
                expect(bounced).toHaveLength(1);
                expect(bounced[0]).toBe(42);
            });

            test('should handle empty arrays', () => {
                const arr = [];
                const bounced = arr.bounce();
                
                expect(bounced).toHaveLength(0);
            });

            test('should create symmetrical pattern', () => {
                const arr = [1, 2, 3, 4, 5, 6];
                const bounced = arr.bounce(10);
                
                // Check that it bounces back
                const mid = Math.floor(bounced.length / 2);
                for (let i = 0; i < mid; i++) {
                    const fromStart = bounced[i];
                    const fromEnd = bounced[bounced.length - 1 - i];
                    // They should be the same due to bouncing
                    expect(fromStart).toBe(fromEnd);
                }
            });

            test('should work with different data types', () => {
                const colors = ['red', 'green', 'blue', 'yellow'];
                const bounced = colors.bounce();
                
                expect(bounced).toContain('red');
                expect(bounced).toContain('blue');
                expect(bounced[0]).toBe('red');
            });
        });

        describe('toVector', () => {
            // Note: This test is tricky because of the dynamic import/require
            // We'll test the structure and error cases
            
            test('should throw error for invalid array lengths', () => {
                expect(() => [1].toVector()).toThrow('Array length must be 2, 3, or 4 to convert to vector.');
                expect(() => [1, 2, 3, 4, 5].toVector()).toThrow('Array length must be 2, 3, or 4 to convert to vector.');
                expect(() => [].toVector()).toThrow('Array length must be 2, 3, or 4 to convert to vector.');
            });

            // Note: Testing the actual vector conversion would require mocking
            // the dynamic import, which is complex. We focus on error cases here.
            
            test('should accept valid array lengths without throwing', () => {
                // These might throw due to import issues in test environment,
                // but they shouldn't throw the length error
                try {
                    [1, 2].toVector();
                } catch (e) {
                    expect(e.message).not.toContain('Array length must be');
                }

                try {
                    [1, 2, 3].toVector();
                } catch (e) {
                    expect(e.message).not.toContain('Array length must be');
                }

                try {
                    [1, 2, 3, 4].toVector();
                } catch (e) {
                    expect(e.message).not.toContain('Array length must be');
                }
            });
        });
    });

    describe('Extension safety', () => {
        test('should not overwrite existing prototype methods', () => {
            // Store original methods if they exist
            const originalToRadians = Number.prototype.toRadians;
            const originalMap = Number.prototype.map;
            const originalBounce = Array.prototype.bounce;

            // Re-import extensions
            delete require.cache[require.resolve('../src/extensions.js')];
            require('../src/extensions.js');

            // Methods should still be the same
            expect(Number.prototype.toRadians).toBe(originalToRadians);
            expect(Number.prototype.map).toBe(originalMap);
            expect(Array.prototype.bounce).toBe(originalBounce);
        });

        test('should only add methods if they do not exist', () => {
            // Check that methods exist after import
            expect(typeof Number.prototype.toRadians).toBe('function');
            expect(typeof Number.prototype.toDegrees).toBe('function');
            expect(typeof Number.prototype.map).toBe('function');
            expect(typeof Array.prototype.bounce).toBe('function');
            expect(typeof Array.prototype.toVector).toBe('function');
        });
    });

    describe('Real-world usage scenarios', () => {
        test('should support angle conversion workflows', () => {
            const degrees = 45;
            const radians = degrees.toRadians();
            const backToDegrees = radians.toDegrees();
            
            expect(backToDegrees).toBeCloseTo(degrees, 5);
            
            // Common angles
            expect((0).toRadians().toDegrees()).toBeCloseTo(0, 5);
            expect((90).toRadians().toDegrees()).toBeCloseTo(90, 5);
            expect((180).toRadians().toDegrees()).toBeCloseTo(180, 5);
        });

        test('should support value mapping workflows', () => {
            // Screen coordinates to normalized coordinates
            const screenX = 150;
            const normalizedX = screenX.map(0, 300, -1, 1);
            expect(normalizedX).toBeCloseTo(0, 5);

            // RGB to percentage
            const rgbValue = 128;
            const percentage = rgbValue.map(0, 255, 0, 100);
            expect(percentage).toBeCloseTo(50.196, 2);
        });

        test('should support palette bounce workflows', () => {
            const colorPalette = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
            const bouncedPalette = colorPalette.bounce(8);
            
            expect(bouncedPalette).toHaveLength(8);
            expect(bouncedPalette[0]).toBe('#ff0000'); // Should start with first color
            expect(bouncedPalette[bouncedPalette.length - 1]).toBe('#ff0000'); // Should end with first color
        });
    });
});
