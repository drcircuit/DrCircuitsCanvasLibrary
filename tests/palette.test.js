/**
 * Tests for palette.js module
 */

import { describe, test, beforeEach } from './test-utils.js';
import { palette } from '../src/palette.js';

describe('Palette Module', () => {
    test('should export palette object with all palettes', () => {
        expect(palette).toBeDefined();
        expect(typeof palette).toBe('object');
        
        expect(palette.fire).toBeDefined();
        expect(palette.rainbow).toBeDefined();
        expect(palette.gray).toBeDefined();
        expect(palette.cga).toBeDefined();
        expect(palette.ega).toBeDefined();
        expect(palette.egadef).toBeDefined();
    });

    describe('EGA Palette', () => {
        test('should have 64 colors', () => {
            expect(palette.ega).toHaveLength(64);
        });

        test('should contain color objects', () => {
            palette.ega.forEach(color => {
                expect(color.isColor).toBe(true);
                expect(typeof color.r).toBe('number');
                expect(typeof color.g).toBe('number');
                expect(typeof color.b).toBe('number');
                expect(typeof color.a).toBe('number');
            });
        });

        test('should start with black', () => {
            const black = palette.ega[0];
            expect(black.r).toBe(0);
            expect(black.g).toBe(0);
            expect(black.b).toBe(0);
            expect(black.a).toBe(1.0);
        });

        test('should end with white', () => {
            const white = palette.ega[63];
            expect(white.r).toBe(0xFF);
            expect(white.g).toBe(0xFF);
            expect(white.b).toBe(0xFF);
            expect(white.a).toBe(1.0);
        });

        test('should have consistent alpha values', () => {
            palette.ega.forEach(color => {
                expect(color.a).toBe(1.0);
            });
        });
    });

    describe('EGA Default Palette', () => {
        test('should have 16 colors', () => {
            expect(palette.egadef).toHaveLength(16);
        });

        test('should be subset of main EGA palette', () => {
            palette.egadef.forEach(color => {
                expect(color.isColor).toBe(true);
                expect(palette.ega).toContain(color);
            });
        });

        test('should start with black', () => {
            const black = palette.egadef[0];
            expect(black.r).toBe(0);
            expect(black.g).toBe(0);
            expect(black.b).toBe(0);
        });

        test('should end with white', () => {
            const white = palette.egadef[15];
            expect(white.r).toBe(0xFF);
            expect(white.g).toBe(0xFF);
            expect(white.b).toBe(0xFF);
        });
    });

    describe('CGA Palette', () => {
        test('should have 16 colors', () => {
            expect(palette.cga).toHaveLength(16);
        });

        test('should contain valid color objects', () => {
            palette.cga.forEach(color => {
                expect(color.isColor).toBe(true);
                expect(color.r).toBeGreaterThanOrEqual(0);
                expect(color.r).toBeLessThanOrEqual(255);
                expect(color.g).toBeGreaterThanOrEqual(0);
                expect(color.g).toBeLessThanOrEqual(255);
                expect(color.b).toBeGreaterThanOrEqual(0);
                expect(color.b).toBeLessThanOrEqual(255);
            });
        });

        test('should start with black', () => {
            const black = palette.cga[0];
            expect(black.r).toBe(0);
            expect(black.g).toBe(0);
            expect(black.b).toBe(0);
        });

        test('should end with white', () => {
            const white = palette.cga[15];
            expect(white.r).toBe(255);
            expect(white.g).toBe(255);
            expect(white.b).toBe(255);
        });

        test('should have characteristic CGA colors', () => {
            // Check for some characteristic CGA colors
            const darkBlue = palette.cga[1];
            expect(darkBlue.r).toBe(0);
            expect(darkBlue.g).toBe(0);
            expect(darkBlue.b).toBe(170);

            const brightRed = palette.cga[12];
            expect(brightRed.r).toBe(255);
            expect(brightRed.g).toBe(85);
            expect(brightRed.b).toBe(85);
        });
    });

    describe('Grayscale Palette', () => {
        test('should have 256 colors', () => {
            expect(palette.gray).toHaveLength(256);
        });

        test('should be grayscale (r = g = b)', () => {
            palette.gray.forEach(color => {
                expect(color.r).toBe(color.g);
                expect(color.g).toBe(color.b);
                expect(color.isColor).toBe(true);
            });
        });

        test('should range from black to white', () => {
            const black = palette.gray[0];
            expect(black.r).toBe(0);
            expect(black.g).toBe(0);
            expect(black.b).toBe(0);

            const white = palette.gray[255];
            expect(white.r).toBe(255);
            expect(white.g).toBe(255);
            expect(white.b).toBe(255);
        });

        test('should have gradual progression', () => {
            for (let i = 0; i < 255; i++) {
                const current = palette.gray[i];
                const next = palette.gray[i + 1];
                expect(next.r).toBe(current.r + 1);
                expect(next.g).toBe(current.g + 1);
                expect(next.b).toBe(current.b + 1);
            }
        });
    });

    describe('Fire Palette', () => {
        test('should have 256 colors', () => {
            expect(palette.fire).toHaveLength(256);
        });

        test('should contain valid color objects', () => {
            palette.fire.forEach(color => {
                expect(color.isColor).toBe(true);
                expect(color.r).toBeGreaterThanOrEqual(0);
                expect(color.r).toBeLessThanOrEqual(255);
                expect(color.g).toBeGreaterThanOrEqual(0);
                expect(color.g).toBeLessThanOrEqual(255);
                expect(color.b).toBeGreaterThanOrEqual(0);
                expect(color.b).toBeLessThanOrEqual(255);
            });
        });

        test('should start with black/dark red', () => {
            const start = palette.fire[0];
            // Should be very dark (close to black)
            expect(start.r + start.g + start.b).toBeLessThan(50);
        });

        test('should progress towards brighter colors', () => {
            const start = palette.fire[0];
            const middle = palette.fire[127];
            const end = palette.fire[255];

            const startBrightness = start.r + start.g + start.b;
            const middleBrightness = middle.r + middle.g + middle.b;
            const endBrightness = end.r + end.g + end.b;

            expect(middleBrightness).toBeGreaterThan(startBrightness);
            expect(endBrightness).toBeGreaterThan(middleBrightness);
        });
    });

    describe('Rainbow Palette', () => {
        test('should have 256 colors', () => {
            expect(palette.rainbow).toHaveLength(256);
        });

        test('should contain valid color objects', () => {
            palette.rainbow.forEach(color => {
                expect(color.isColor).toBe(true);
                expect(color.r).toBeGreaterThanOrEqual(0);
                expect(color.r).toBeLessThanOrEqual(255);
                expect(color.g).toBeGreaterThanOrEqual(0);
                expect(color.g).toBeLessThanOrEqual(255);
                expect(color.b).toBeGreaterThanOrEqual(0);
                expect(color.b).toBeLessThanOrEqual(255);
            });
        });

        test('should have vibrant colors (high saturation)', () => {
            // Rainbow colors should generally be quite vibrant
            // We'll check that most colors have at least one high component
            let vibrantCount = 0;
            palette.rainbow.forEach(color => {
                const maxComponent = Math.max(color.r, color.g, color.b);
                if (maxComponent > 200) {
                    vibrantCount++;
                }
            });
            
            // Most rainbow colors should be vibrant
            expect(vibrantCount).toBeGreaterThan(200);
        });

        test('should cycle through hues', () => {
            // Check that we have variety in colors
            const redish = palette.rainbow.filter(c => c.r > c.g && c.r > c.b).length;
            const greenish = palette.rainbow.filter(c => c.g > c.r && c.g > c.b).length;
            const blueish = palette.rainbow.filter(c => c.b > c.r && c.b > c.g).length;

            // Should have representation of different hues
            expect(redish).toBeGreaterThan(50);
            expect(greenish).toBeGreaterThan(50);
            expect(blueish).toBeGreaterThan(50);
        });
    });

    describe('Palette Usage', () => {
        test('should allow indexing into palettes', () => {
            const firstGray = palette.gray[0];
            const middleGray = palette.gray[128];
            const lastGray = palette.gray[255];

            expect(firstGray.r).toBe(0);
            expect(middleGray.r).toBe(128);
            expect(lastGray.r).toBe(255);
        });

        test('should provide colors that can be used for styling', () => {
            const color = palette.cga[5];
            const style = color.toStyle();
            
            expect(typeof style).toBe('string');
            expect(style).toMatch(/rgba?\(\d+,\s*\d+,\s*\d+/);
        });

        test('should handle palette bounds gracefully', () => {
            // Test that we can access all valid indices
            expect(() => palette.ega[0]).not.toThrow();
            expect(() => palette.ega[63]).not.toThrow();
            expect(() => palette.gray[0]).not.toThrow();
            expect(() => palette.gray[255]).not.toThrow();
        });
    });

    describe('Palette Consistency', () => {
        test('all palettes should contain color objects', () => {
            Object.values(palette).forEach(pal => {
                expect(Array.isArray(pal)).toBe(true);
                pal.forEach(color => {
                    expect(color.isColor).toBe(true);
                });
            });
        });

        test('all colors should have valid RGBA values', () => {
            Object.values(palette).forEach(pal => {
                pal.forEach(color => {
                    expect(color.r).toBeGreaterThanOrEqual(0);
                    expect(color.r).toBeLessThanOrEqual(255);
                    expect(color.g).toBeGreaterThanOrEqual(0);
                    expect(color.g).toBeLessThanOrEqual(255);
                    expect(color.b).toBeGreaterThanOrEqual(0);
                    expect(color.b).toBeLessThanOrEqual(255);
                    expect(color.a).toBeGreaterThanOrEqual(0);
                    expect(color.a).toBeLessThanOrEqual(1);
                });
            });
        });
    });
});
