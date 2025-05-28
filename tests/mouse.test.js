/**
 * Tests for mouse.js module
 */

import { describe, test, beforeEach } from './test-utils.js';
import { MOUSE } from '../src/mouse.js';

describe('Mouse Module', () => {
    beforeEach(() => {
        // Reset mouse state before each test
        MOUSE.pos = null;
        MOUSE.clickLeft = false;
        MOUSE.clickRight = false;
    });

    describe('MOUSE state object', () => {
        test('should have initial state', () => {
            expect(MOUSE.pos).toBe(null);
            expect(MOUSE.clickLeft).toBe(false);
            expect(MOUSE.clickRight).toBe(false);
        });

        test('should allow position updates', () => {
            MOUSE.pos = { x: 100, y: 200 };

            expect(MOUSE.pos.x).toBe(100);
            expect(MOUSE.pos.y).toBe(200);
        });

        test('should allow click state updates', () => {
            MOUSE.clickLeft = true;
            MOUSE.clickRight = true;

            expect(MOUSE.clickLeft).toBe(true);
            expect(MOUSE.clickRight).toBe(true);
        });

        test('should maintain state independence', () => {
            MOUSE.clickLeft = true;
            MOUSE.clickRight = false;

            expect(MOUSE.clickLeft).toBe(true);
            expect(MOUSE.clickRight).toBe(false);
        });
    });

    describe('reset method', () => {
        test('should reset click states', () => {
            // Set click states
            MOUSE.clickLeft = true;
            MOUSE.clickRight = true;

            // Reset
            MOUSE.reset();

            expect(MOUSE.clickLeft).toBe(false);
            expect(MOUSE.clickRight).toBe(false);
        });

        test('should not affect position', () => {
            const position = { x: 150, y: 250 };
            MOUSE.pos = position;
            MOUSE.clickLeft = true;
            MOUSE.clickRight = true;

            MOUSE.reset();

            expect(MOUSE.pos).toBe(position);
            expect(MOUSE.clickLeft).toBe(false);
            expect(MOUSE.clickRight).toBe(false);
        });

        test('should be callable multiple times safely', () => {
            MOUSE.clickLeft = true;
            MOUSE.clickRight = true;

            MOUSE.reset();
            MOUSE.reset();
            MOUSE.reset();

            expect(MOUSE.clickLeft).toBe(false);
            expect(MOUSE.clickRight).toBe(false);
        });

        test('should work when already reset', () => {
            // Start with clean state
            expect(MOUSE.clickLeft).toBe(false);
            expect(MOUSE.clickRight).toBe(false);

            // Reset should not throw or cause issues
            expect(() => MOUSE.reset()).not.toThrow();

            expect(MOUSE.clickLeft).toBe(false);
            expect(MOUSE.clickRight).toBe(false);
        });
    });

    describe('position handling', () => {
        test('should support vector-like position objects', () => {
            MOUSE.pos = { x: 50, y: 75 };

            expect(MOUSE.pos.x).toBe(50);
            expect(MOUSE.pos.y).toBe(75);
        });

        test('should support position updates', () => {
            MOUSE.pos = { x: 0, y: 0 };
            
            MOUSE.pos.x = 300;
            MOUSE.pos.y = 400;

            expect(MOUSE.pos.x).toBe(300);
            expect(MOUSE.pos.y).toBe(400);
        });

        test('should handle null position gracefully', () => {
            MOUSE.pos = null;

            expect(MOUSE.pos).toBe(null);
            
            // Setting position from null should work
            MOUSE.pos = { x: 10, y: 20 };
            expect(MOUSE.pos.x).toBe(10);
            expect(MOUSE.pos.y).toBe(20);
        });

        test('should support negative coordinates', () => {
            MOUSE.pos = { x: -50, y: -100 };

            expect(MOUSE.pos.x).toBe(-50);
            expect(MOUSE.pos.y).toBe(-100);
        });

        test('should support floating point coordinates', () => {
            MOUSE.pos = { x: 123.45, y: 678.90 };

            expect(MOUSE.pos.x).toBeCloseTo(123.45, 2);
            expect(MOUSE.pos.y).toBeCloseTo(678.90, 2);
        });
    });

    describe('click state handling', () => {
        test('should support independent click states', () => {
            MOUSE.clickLeft = true;
            expect(MOUSE.clickLeft).toBe(true);
            expect(MOUSE.clickRight).toBe(false);

            MOUSE.clickRight = true;
            expect(MOUSE.clickLeft).toBe(true);
            expect(MOUSE.clickRight).toBe(true);

            MOUSE.clickLeft = false;
            expect(MOUSE.clickLeft).toBe(false);
            expect(MOUSE.clickRight).toBe(true);
        });

        test('should support both buttons pressed simultaneously', () => {
            MOUSE.clickLeft = true;
            MOUSE.clickRight = true;

            expect(MOUSE.clickLeft).toBe(true);
            expect(MOUSE.clickRight).toBe(true);

            const bothPressed = MOUSE.clickLeft && MOUSE.clickRight;
            expect(bothPressed).toBe(true);
        });

        test('should detect no buttons pressed', () => {
            MOUSE.clickLeft = false;
            MOUSE.clickRight = false;

            const nonePressed = !MOUSE.clickLeft && !MOUSE.clickRight;
            expect(nonePressed).toBe(true);
        });
    });

    describe('integration scenarios', () => {
        test('should support typical mouse interaction workflow', () => {
            // Mouse moves to position
            MOUSE.pos = { x: 100, y: 150 };
            expect(MOUSE.pos.x).toBe(100);
            expect(MOUSE.pos.y).toBe(150);

            // Left mouse button pressed
            MOUSE.clickLeft = true;
            expect(MOUSE.clickLeft).toBe(true);

            // Mouse drags to new position
            MOUSE.pos.x = 200;
            MOUSE.pos.y = 250;
            expect(MOUSE.pos.x).toBe(200);
            expect(MOUSE.pos.y).toBe(250);
            expect(MOUSE.clickLeft).toBe(true); // Still pressed

            // Mouse button released
            MOUSE.reset();
            expect(MOUSE.clickLeft).toBe(false);
            expect(MOUSE.pos.x).toBe(200); // Position unchanged
            expect(MOUSE.pos.y).toBe(250);
        });

        test('should support context menu scenarios', () => {
            MOUSE.pos = { x: 300, y: 400 };
            MOUSE.clickRight = true;

            expect(MOUSE.pos.x).toBe(300);
            expect(MOUSE.pos.y).toBe(400);
            expect(MOUSE.clickRight).toBe(true);
            expect(MOUSE.clickLeft).toBe(false);
        });

        test('should support hover detection', () => {
            // Position within a hypothetical button area
            const buttonArea = { x: 50, y: 50, width: 100, height: 40 };
            MOUSE.pos = { x: 75, y: 65 };

            const isHovering = 
                MOUSE.pos &&
                MOUSE.pos.x >= buttonArea.x &&
                MOUSE.pos.x <= buttonArea.x + buttonArea.width &&
                MOUSE.pos.y >= buttonArea.y &&
                MOUSE.pos.y <= buttonArea.y + buttonArea.height;

            expect(isHovering).toBe(true);

            // Move outside button area
            MOUSE.pos.x = 200;
            const isStillHovering = 
                MOUSE.pos &&
                MOUSE.pos.x >= buttonArea.x &&
                MOUSE.pos.x <= buttonArea.x + buttonArea.width &&
                MOUSE.pos.y >= buttonArea.y &&
                MOUSE.pos.y <= buttonArea.y + buttonArea.height;

            expect(isStillHovering).toBe(false);
        });

        test('should support click detection within area', () => {
            const clickArea = { x: 0, y: 0, width: 200, height: 200 };
            
            MOUSE.pos = { x: 100, y: 100 };
            MOUSE.clickLeft = true;

            const isClickInArea = 
                MOUSE.clickLeft &&
                MOUSE.pos &&
                MOUSE.pos.x >= clickArea.x &&
                MOUSE.pos.x <= clickArea.x + clickArea.width &&
                MOUSE.pos.y >= clickArea.y &&
                MOUSE.pos.y <= clickArea.y + clickArea.height;

            expect(isClickInArea).toBe(true);
        });
    });

    describe('edge cases', () => {
        test('should handle undefined position properties', () => {
            MOUSE.pos = {};

            expect(MOUSE.pos.x).toBeUndefined();
            expect(MOUSE.pos.y).toBeUndefined();

            // Should be able to set them
            MOUSE.pos.x = 50;
            MOUSE.pos.y = 100;

            expect(MOUSE.pos.x).toBe(50);
            expect(MOUSE.pos.y).toBe(100);
        });

        test('should handle rapid state changes', () => {
            for (let i = 0; i < 10; i++) {
                MOUSE.clickLeft = i % 2 === 0;
                MOUSE.clickRight = i % 3 === 0;
                MOUSE.pos = { x: i * 10, y: i * 20 };
            }

            // Final state should be i=9
            expect(MOUSE.clickLeft).toBe(false); // 9 % 2 !== 0
            expect(MOUSE.clickRight).toBe(true); // 9 % 3 === 0
            expect(MOUSE.pos.x).toBe(90);
            expect(MOUSE.pos.y).toBe(180);
        });
    });
});
