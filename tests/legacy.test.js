/**
 * Tests for legacy.js module
 */

import { describe, test, beforeEach, expect, mockFn } from './test-utils.js';
import { getCtx, attachGlobals } from '../src/legacy.js';

describe('Legacy Module', () => {
    let mockCtx;
    let mockDcl;

    beforeEach(() => {
        mockCtx = {            fillStyle: '',
            strokeStyle: '',
            fillRect: mockFn(),
            strokeRect: mockFn()
        };

        mockDcl = {
            renderContext: mockCtx
        };

        // Clean up global state
        if (typeof globalThis !== 'undefined') {
            delete globalThis.dcl;
        }
        if (typeof window !== 'undefined') {
            delete window.dcl;
        }
    });

    describe('getCtx', () => {
        test('should return provided context when given', () => {
            const providedCtx = { test: true };
            const result = getCtx(providedCtx);
            
            expect(result).toBe(providedCtx);
        });

        test('should return dcl renderContext when no context provided', () => {
            // Mock global window.dcl
            global.window = {
                dcl: mockDcl
            };

            const result = getCtx();
            
            expect(result).toBe(mockCtx);
        });

        test('should return undefined when no context and no global dcl', () => {
            global.window = {};
            
            const result = getCtx();
            
            expect(result).toBeUndefined();
        });

        test('should prefer provided context over global dcl', () => {
            const providedCtx = { provided: true };
            global.window = {
                dcl: mockDcl
            };

            const result = getCtx(providedCtx);
            
            expect(result).toBe(providedCtx);
            expect(result).not.toBe(mockCtx);
        });

        test('should handle null context gracefully', () => {
            global.window = {
                dcl: mockDcl
            };

            const result = getCtx(null);
            
            expect(result).toBe(mockCtx);
        });

        test('should handle undefined context gracefully', () => {
            global.window = {
                dcl: mockDcl
            };

            const result = getCtx(undefined);
            
            expect(result).toBe(mockCtx);
        });

        test('should handle missing window.dcl.renderContext', () => {
            global.window = {
                dcl: {}
            };

            const result = getCtx();
            
            expect(result).toBeUndefined();
        });
    });

    describe('attachGlobals', () => {
        test('should attach dcl to globalThis', () => {
            const dclInstance = { test: 'dcl' };
            
            attachGlobals(dclInstance);
            
            expect(globalThis.dcl).toBe(dclInstance);
        });

        test('should attach constants to globalThis', () => {
            const dclInstance = { test: 'dcl' };
            const constants = {
                CONSTANT1: 'value1',
                CONSTANT2: 42,
                CONSTANT3: { nested: 'object' }
            };
            
            attachGlobals(dclInstance, constants);
            
            expect(globalThis.dcl).toBe(dclInstance);
            expect(globalThis.CONSTANT1).toBe('value1');
            expect(globalThis.CONSTANT2).toBe(42);
            expect(globalThis.CONSTANT3).toBe(constants.CONSTANT3);
        });

        test('should handle empty constants object', () => {
            const dclInstance = { test: 'dcl' };
            
            expect(() => {
                attachGlobals(dclInstance, {});
            }).not.toThrow();
            
            expect(globalThis.dcl).toBe(dclInstance);
        });

        test('should handle null constants', () => {
            const dclInstance = { test: 'dcl' };
            
            expect(() => {
                attachGlobals(dclInstance, null);
            }).not.toThrow();
            
            expect(globalThis.dcl).toBe(dclInstance);
        });

        test('should handle undefined constants', () => {
            const dclInstance = { test: 'dcl' };
            
            expect(() => {
                attachGlobals(dclInstance);
            }).not.toThrow();
            
            expect(globalThis.dcl).toBe(dclInstance);
        });

        test('should overwrite existing globals', () => {
            const firstDcl = { version: 1 };
            const secondDcl = { version: 2 };
            
            attachGlobals(firstDcl);
            expect(globalThis.dcl).toBe(firstDcl);
            
            attachGlobals(secondDcl);
            expect(globalThis.dcl).toBe(secondDcl);
        });

        test('should handle complex constants', () => {
            const dclInstance = { test: 'dcl' };
            const constants = {
                COLORS: {
                    RED: '#ff0000',
                    GREEN: '#00ff00',
                    BLUE: '#0000ff'
                },
                KEYS: {
                    ARROW_UP: 38,
                    ARROW_DOWN: 40
                },
                config: {
                    debug: true,
                    version: '1.0.0'
                }
            };
            
            attachGlobals(dclInstance, constants);
            
            expect(globalThis.COLORS.RED).toBe('#ff0000');
            expect(globalThis.KEYS.ARROW_UP).toBe(38);
            expect(globalThis.config.debug).toBe(true);
        });

        test('should handle functions as constants', () => {
            const dclInstance = { test: 'dcl' };
            const helperFunction = mockFn();
            const constants = {
                helper: helperFunction,
                calculate: (a, b) => a + b
            };
            
            attachGlobals(dclInstance, constants);
            
            expect(globalThis.helper).toBe(helperFunction);
            expect(typeof globalThis.calculate).toBe('function');
            expect(globalThis.calculate(2, 3)).toBe(5);
        });

        test('should handle string keys with special characters', () => {
            const dclInstance = { test: 'dcl' };
            const constants = {
                'special-key': 'special value',
                'key_with_underscore': 'underscore value',
                'CamelCaseKey': 'camel case value'
            };
            
            attachGlobals(dclInstance, constants);
            
            expect(globalThis['special-key']).toBe('special value');
            expect(globalThis['key_with_underscore']).toBe('underscore value');
            expect(globalThis['CamelCaseKey']).toBe('camel case value');
        });
    });

    describe('Legacy compatibility', () => {
        test('should support legacy global access pattern', () => {
            const dclInstance = {                renderContext: mockCtx,
                version: '1.0.0',
                init: mockFn()
            };
            
            attachGlobals(dclInstance);
            
            // Should be able to access dcl globally
            expect(globalThis.dcl).toBe(dclInstance);
            expect(globalThis.dcl.renderContext).toBe(mockCtx);
            
            // getCtx should work with global dcl
            global.window = { dcl: globalThis.dcl };
            const ctx = getCtx();
            expect(ctx).toBe(mockCtx);
        });

        test('should support legacy constants pattern', () => {
            const dclInstance = { test: 'dcl' };
            const legacyConstants = {
                PI: Math.PI,
                TWO_PI: Math.PI * 2,
                HALF_PI: Math.PI / 2,
                rad: (degrees) => degrees * Math.PI / 180,
                deg: (radians) => radians * 180 / Math.PI
            };
            
            attachGlobals(dclInstance, legacyConstants);
            
            expect(globalThis.PI).toBe(Math.PI);
            expect(globalThis.TWO_PI).toBe(Math.PI * 2);
            expect(typeof globalThis.rad).toBe('function');
            expect(globalThis.rad(180)).toBeCloseTo(Math.PI, 5);
        });

        test('should support mixed dcl and constants access', () => {            const dclInstance = {
                circle: mockFn(),
                rect: mockFn(),
                clear: mockFn()
            };
            const constants = {
                RED: '#ff0000',
                GREEN: '#00ff00',
                createVector: mockFn()
            };
            
            attachGlobals(dclInstance, constants);
            
            // Should be able to access both dcl methods and constants globally
            expect(typeof globalThis.dcl.circle).toBe('function');
            expect(globalThis.RED).toBe('#ff0000');
            expect(typeof globalThis.createVector).toBe('function');
        });
    });

    describe('Error handling', () => {
        test('should handle null dcl instance', () => {
            expect(() => {
                attachGlobals(null);
            }).not.toThrow();
            
            expect(globalThis.dcl).toBe(null);
        });

        test('should handle undefined dcl instance', () => {
            expect(() => {
                attachGlobals(undefined);
            }).not.toThrow();
            
            expect(globalThis.dcl).toBe(undefined);
        });

        test('should handle missing globalThis gracefully', () => {
            // Temporarily remove globalThis
            const originalGlobalThis = globalThis;
            delete global.globalThis;
            
            expect(() => {
                attachGlobals({ test: 'dcl' });
            }).not.toThrow();
            
            // Restore globalThis
            global.globalThis = originalGlobalThis;
        });
    });

    describe('Environment compatibility', () => {
        test('should work in environments with globalThis', () => {
            expect(typeof globalThis).toBe('object');
            
            const dclInstance = { env: 'globalThis' };
            attachGlobals(dclInstance);
            
            expect(globalThis.dcl).toBe(dclInstance);
        });

        test('should handle environments without window object', () => {
            const originalWindow = global.window;
            delete global.window;
            
            const result = getCtx();
            
            expect(result).toBeUndefined();
            
            // Restore window
            global.window = originalWindow;
        });
    });
});
