/**
 * Tests for keyboard.js module
 */

import { describe, test } from './test-utils.js';
import { KEYS, KEYB } from '../src/keyboard.js';

describe('Keyboard Module', () => {
    describe('KEYS constants', () => {
        test('should export arrow keys', () => {
            expect(KEYS.LEFT).toBe(37);
            expect(KEYS.UP).toBe(38);
            expect(KEYS.RIGHT).toBe(39);
            expect(KEYS.DOWN).toBe(40);
        });

        test('should export modifier keys', () => {
            expect(KEYS.CONTROL).toBe(17);
            expect(KEYS.ALT).toBe(18);
            expect(KEYS.SHIFT).toBe(16);
            expect(KEYS.ESCAPE).toBe(27);
        });

        test('should export number keys', () => {
            expect(KEYS.ZERO).toBe(48);
            expect(KEYS.ONE).toBe(49);
            expect(KEYS.TWO).toBe(50);
            expect(KEYS.THREE).toBe(51);
            expect(KEYS.FOUR).toBe(52);
            expect(KEYS.FIVE).toBe(53);
            expect(KEYS.SIX).toBe(54);
            expect(KEYS.SEVEN).toBe(55);
            expect(KEYS.EIGHT).toBe(56);
            expect(KEYS.NINE).toBe(57);
        });

        test('should export letter keys', () => {
            expect(KEYS.A).toBe(65);
            expect(KEYS.S).toBe(83);
            expect(KEYS.D).toBe(68);
            expect(KEYS.F).toBe(70);
            expect(KEYS.Q).toBe(81);
            expect(KEYS.W).toBe(87);
            expect(KEYS.E).toBe(69);
            expect(KEYS.R).toBe(82);
            expect(KEYS.Z).toBe(90);
            expect(KEYS.X).toBe(88);
            expect(KEYS.C).toBe(67);
            expect(KEYS.V).toBe(86);
        });

        test('should export numpad keys', () => {
            expect(KEYS.NZERO).toBe(96);
            expect(KEYS.NONE).toBe(97);
            expect(KEYS.NTWO).toBe(98);
            expect(KEYS.NTHREE).toBe(99);
            expect(KEYS.NFOUR).toBe(100);
            expect(KEYS.NFIVE).toBe(101);
            expect(KEYS.NSIX).toBe(102);
            expect(KEYS.NSEVEN).toBe(103);
            expect(KEYS.NEIGHT).toBe(104);
            expect(KEYS.NNINE).toBe(105);
        });

        test('should export numpad operators', () => {
            expect(KEYS.NMINUS).toBe(109);
            expect(KEYS.NPLUS).toBe(107);
            expect(KEYS.NSTAR).toBe(108);
            expect(KEYS.NDIV).toBe(111);
            expect(KEYS.NCOMMA).toBe(110);
        });

        test('should export special keys', () => {
            expect(KEYS.SPACE).toBe(32);
            expect(KEYS.ENTER).toBe(13);
            expect(KEYS.WIN).toBe(91);
            expect(KEYS.WINCTX).toBe(92);
            expect(KEYS.PIPE).toBe(220);
            expect(KEYS.BACKSLASH).toBe(219);
        });

        test('should have unique key codes', () => {
            const keyCodes = Object.values(KEYS);
            const uniqueKeyCodes = new Set(keyCodes);
            
            expect(uniqueKeyCodes.size).toBe(keyCodes.length);
        });

        test('should have all key codes as numbers', () => {
            Object.values(KEYS).forEach(keyCode => {
                expect(typeof keyCode).toBe('number');
                expect(keyCode).toBeGreaterThan(0);
                expect(keyCode).toBeLessThan(256);
            });
        });
    });

    describe('KEYB state object', () => {
        test('should have initial state', () => {
            expect(KEYB.keyPressed).toBe(-1);
            expect(KEYB.ctrlPressed).toBe(false);
            expect(KEYB.altPressed).toBe(false);
            expect(KEYB.shiftPressed).toBe(false);
        });

        test('should allow state modification', () => {
            KEYB.keyPressed = KEYS.SPACE;
            KEYB.ctrlPressed = true;
            KEYB.altPressed = true;
            KEYB.shiftPressed = true;

            expect(KEYB.keyPressed).toBe(KEYS.SPACE);
            expect(KEYB.ctrlPressed).toBe(true);
            expect(KEYB.altPressed).toBe(true);
            expect(KEYB.shiftPressed).toBe(true);

            // Reset for other tests
            KEYB.keyPressed = -1;
            KEYB.ctrlPressed = false;
            KEYB.altPressed = false;
            KEYB.shiftPressed = false;
        });

        test('should maintain state across modifications', () => {
            const originalState = {
                keyPressed: KEYB.keyPressed,
                ctrlPressed: KEYB.ctrlPressed,
                altPressed: KEYB.altPressed,
                shiftPressed: KEYB.shiftPressed
            };

            // Modify state
            KEYB.keyPressed = KEYS.A;
            KEYB.ctrlPressed = true;

            expect(KEYB.keyPressed).toBe(KEYS.A);
            expect(KEYB.ctrlPressed).toBe(true);
            expect(KEYB.altPressed).toBe(originalState.altPressed);
            expect(KEYB.shiftPressed).toBe(originalState.shiftPressed);

            // Reset
            Object.assign(KEYB, originalState);
        });
    });

    describe('Key code validation', () => {
        test('should have correct arrow key codes', () => {
            // These are standard browser key codes
            expect(KEYS.LEFT).toBe(37);
            expect(KEYS.UP).toBe(38);
            expect(KEYS.RIGHT).toBe(39);
            expect(KEYS.DOWN).toBe(40);
        });

        test('should have correct letter key codes', () => {
            // A-Z should be 65-90
            expect(KEYS.A).toBe(65);
            expect(KEYS.Z).toBe(90);
            
            // Check some specific letters
            expect(KEYS.W).toBe(87); // Commonly used for movement
            expect(KEYS.S).toBe(83); // Commonly used for movement
        });

        test('should have correct number key codes', () => {
            // 0-9 should be 48-57
            expect(KEYS.ZERO).toBe(48);
            expect(KEYS.NINE).toBe(57);
        });

        test('should have correct modifier key codes', () => {
            expect(KEYS.SHIFT).toBe(16);
            expect(KEYS.CONTROL).toBe(17);
            expect(KEYS.ALT).toBe(18);
        });

        test('should have correct special key codes', () => {
            expect(KEYS.SPACE).toBe(32);
            expect(KEYS.ENTER).toBe(13);
            expect(KEYS.ESCAPE).toBe(27);
        });
    });

    describe('Integration scenarios', () => {
        test('should support common gaming key combinations', () => {
            // WASD movement
            expect(KEYS.W).toBeDefined();
            expect(KEYS.A).toBeDefined();
            expect(KEYS.S).toBeDefined();
            expect(KEYS.D).toBeDefined();

            // Arrow keys
            expect(KEYS.UP).toBeDefined();
            expect(KEYS.DOWN).toBeDefined();
            expect(KEYS.LEFT).toBeDefined();
            expect(KEYS.RIGHT).toBeDefined();

            // Common action keys
            expect(KEYS.SPACE).toBeDefined();
            expect(KEYS.ENTER).toBeDefined();
            expect(KEYS.ESCAPE).toBeDefined();
        });

        test('should support modifier key detection', () => {
            // Simulate key combination state
            KEYB.keyPressed = KEYS.C;
            KEYB.ctrlPressed = true;

            expect(KEYB.keyPressed).toBe(KEYS.C);
            expect(KEYB.ctrlPressed).toBe(true);

            // This would represent Ctrl+C
            const isCtrlC = KEYB.keyPressed === KEYS.C && KEYB.ctrlPressed;
            expect(isCtrlC).toBe(true);

            // Reset
            KEYB.keyPressed = -1;
            KEYB.ctrlPressed = false;
        });

        test('should support multiple modifier keys', () => {
            KEYB.keyPressed = KEYS.A;
            KEYB.ctrlPressed = true;
            KEYB.shiftPressed = true;
            KEYB.altPressed = true;

            const hasAllModifiers = 
                KEYB.ctrlPressed && 
                KEYB.shiftPressed && 
                KEYB.altPressed;

            expect(hasAllModifiers).toBe(true);

            // Reset
            KEYB.keyPressed = -1;
            KEYB.ctrlPressed = false;
            KEYB.shiftPressed = false;
            KEYB.altPressed = false;
        });
    });
});
