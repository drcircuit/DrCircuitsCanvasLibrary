/**
 * Enhanced DCL Test Utilities
 * Comprehensive testing utilities for DrCircuitsCanvasLibrary with DOM mocking
 */

import { JSDOM } from 'jsdom';

// Mock performance.now for benchmarking
if (typeof global.performance === 'undefined') {
    global.performance = {
        now: () => Date.now()
    };
}

/**
 * Setup test environment with jsdom
 */
export function setupTestEnvironment() {
    const canvasProto = {
        getContext: function() {
            return {
                beginPath: () => {},
                arc: () => {},
                fill: () => {},
                stroke: () => {},
                moveTo: () => {},
                lineTo: () => {},
                rect: () => {},
                clearRect: () => {},
                fillRect: () => {},
                strokeRect: () => {},
                closePath: () => {},
                save: () => {},
                restore: () => {},
                translate: () => {},
                rotate: () => {},
                scale: () => {},
                fillText: () => {},
                strokeText: () => {},
                drawImage: () => {},
                createPattern: () => {},
                createLinearGradient: () => {},
                createRadialGradient: () => {}
            };
        }
    };
    
    const document = {
        createElement: (type) => {
            if (type.toLowerCase() === 'canvas') {
                return {
                    ...canvasProto,
                    width: 300,
                    height: 150,
                    style: {}
                };
            }
            return { style: {} };
        }
    };
    
    const window = {
        document,
        requestAnimationFrame: (callback) => setTimeout(() => callback(Date.now()), 16),
        cancelAnimationFrame: (id) => clearTimeout(id)
    };
    
    return { document, window };
}

/**
 * Test framework functions
 */

// Test state
let currentTestSuite = '';
let testResults = [];
let totalTests = 0;
let passedTests = 0;

/**
 * Describe a test suite (Jest-like API)
 */
export function describe(suiteName, suiteFunction) {
    currentTestSuite = suiteName;
    console.log(`\n=== ${suiteName} ===`);
    suiteFunction();
    return { suiteName, testResults: [...testResults] };
}

/**
 * Individual test function (Jest-like API)
 */
export function test(testName, testFunction) {
    return it(testName, testFunction);
}

/**
 * Individual test function (Mocha-like API)
 */
export function it(testName, testFunction) {
    totalTests++;
    try {
        testFunction();
        console.log(`✓ ${testName}`);
        passedTests++;
        testResults.push({ name: testName, passed: true, error: null });
        return true;
    } catch (error) {
        console.log(`✗ ${testName}: ${error.message}`);
        testResults.push({ name: testName, passed: false, error: error.message });
        return false;
    }
}

/**
 * Setup function run before each test
 */
export function beforeEach(setupFunction) {
    // Store setup function to be called before each test
    // In a simple implementation, we'll just call it immediately
    setupFunction();
}

/**
 * Cleanup function run after each test
 */
export function afterEach(cleanupFunction) {
    // Store cleanup function to be called after each test
    // In a simple implementation, we'll just call it immediately
    cleanupFunction();
}

/**
 * Setup function run before all tests in a suite
 */
export function beforeAll(setupFunction) {
    setupFunction();
}

/**
 * Cleanup function run after all tests in a suite
 */
export function afterAll(cleanupFunction) {
    cleanupFunction();
}

/**
 * Assertion functions
 */
export function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, but got ${actual}`);
    }
}

export function assertTrue(condition, message) {
    if (!condition) {
        throw new Error(message || 'Expected condition to be true');
    }
}

export function assertFalse(condition, message) {
    if (condition) {
        throw new Error(message || 'Expected condition to be false');
    }
}

export function assertApproximately(actual, expected, tolerance = 0.0001, message) {
    const diff = Math.abs(actual - expected);
    if (diff > tolerance) {
        throw new Error(message || `Expected ${actual} to be approximately ${expected} (tolerance: ${tolerance})`);
    }
}

export function assertThrows(fn, message) {
    try {
        fn();
        throw new Error(message || 'Expected function to throw an error');
    } catch (error) {
        if (error.message === (message || 'Expected function to throw an error')) {
            throw error;
        }
        // Function threw as expected
    }
}

export function assertArrayEqual(actual, expected, message) {
    if (!Array.isArray(actual) || !Array.isArray(expected)) {
        throw new Error(message || 'Both values must be arrays');
    }
    if (actual.length !== expected.length) {
        throw new Error(message || `Array lengths differ: ${actual.length} vs ${expected.length}`);
    }
    for (let i = 0; i < actual.length; i++) {
        if (actual[i] !== expected[i]) {
            throw new Error(message || `Arrays differ at index ${i}: ${actual[i]} vs ${expected[i]}`);
        }
    }
}

export function assertObjectEqual(actual, expected, message) {
    const actualKeys = Object.keys(actual).sort();
    const expectedKeys = Object.keys(expected).sort();
    
    if (actualKeys.length !== expectedKeys.length) {
        throw new Error(message || `Object key counts differ: ${actualKeys.length} vs ${expectedKeys.length}`);
    }
    
    for (let i = 0; i < actualKeys.length; i++) {
        if (actualKeys[i] !== expectedKeys[i]) {
            throw new Error(message || `Object keys differ: ${actualKeys[i]} vs ${expectedKeys[i]}`);
        }
    }
    
    for (const key of actualKeys) {
        if (actual[key] !== expected[key]) {
            throw new Error(message || `Object values differ at key '${key}': ${actual[key]} vs ${expected[key]}`);
        }
    }
}

/**
 * Simple test runner
 */
export function runTest(testName, testFunction) {
    totalTests++;
    try {
        testFunction();
        console.log(`✓ ${testName}`);
        passedTests++;
        return true;
    } catch (error) {
        console.log(`✗ ${testName}: ${error.message}`);
        return false;
    }
}

/**
 * Get test results summary
 */
export function getTestResults() {
    return {
        total: totalTests,
        passed: passedTests,
        failed: totalTests - passedTests,
        successRate: totalTests > 0 ? (passedTests / totalTests * 100).toFixed(1) : 0,
        results: [...testResults]
    };
}

/**
 * Reset test state
 */
export function resetTestState() {
    currentTestSuite = '';
    testResults = [];
    totalTests = 0;
    passedTests = 0;
}

// Jest-like expect function
export function expect(actual) {
    return {
        toBe: (expected) => assertEqual(actual, expected),
        toEqual: (expected) => assertEqual(actual, expected),
        toBeTruthy: () => assertTrue(actual),
        toBeFalsy: () => assertFalse(actual),
        toBeCloseTo: (expected, precision = 2) => {
            const tolerance = Math.pow(10, -precision) / 2;
            assertApproximately(actual, expected, tolerance);
        },
        toThrow: () => assertThrows(actual),
        toBeInstanceOf: (expectedClass) => {
            if (!(actual instanceof expectedClass)) {
                throw new Error(`Expected ${actual} to be instance of ${expectedClass.name}`);
            }
        },
        toHaveLength: (expectedLength) => {
            if (actual.length !== expectedLength) {
                throw new Error(`Expected length ${expectedLength}, but got ${actual.length}`);
            }
        },
        toContain: (expectedItem) => {
            if (!actual.includes(expectedItem)) {
                throw new Error(`Expected ${actual} to contain ${expectedItem}`);
            }
        },
        toHaveBeenCalled: () => {
            if (!actual.calls || actual.calls.length === 0) {
                throw new Error(`Expected mock function to have been called, but it was not called`);
            }
        },
        toHaveBeenCalledWith: (...expectedArgs) => {
            if (!actual.calls || actual.calls.length === 0) {
                throw new Error(`Expected mock function to have been called with ${JSON.stringify(expectedArgs)}, but it was not called`);
            }
            
            const lastCall = actual.calls[actual.calls.length - 1];
            for (let i = 0; i < expectedArgs.length; i++) {
                if (lastCall[i] !== expectedArgs[i]) {
                    throw new Error(`Expected mock function to have been called with ${JSON.stringify(expectedArgs)}, but was called with ${JSON.stringify(lastCall)}`);
                }
            }
        },
        not: {
            toBe: (expected) => {
                if (actual === expected) {
                    throw new Error(`Expected not to be ${expected}`);
                }
            },
            toEqual: (expected) => {
                if (actual === expected) {
                    throw new Error(`Expected not to equal ${expected}`);
                }
            },
            toHaveBeenCalled: () => {
                if (actual.calls && actual.calls.length > 0) {
                    throw new Error(`Expected mock function not to have been called, but it was called ${actual.calls.length} times`);
                }
            }
        }
    };
}

// Custom assertions for mock functions
export function expectMockFnToHaveBeenCalled(mockFn, message) {
    if (mockFn.calls.length === 0) {
        throw new Error(message || `Expected mock function to have been called, but it was not called`);
    }
}

export function expectMockFnToHaveBeenCalledWith(mockFn, ...expectedArgs) {
    if (mockFn.calls.length === 0) {
        throw new Error(`Expected mock function to have been called with ${JSON.stringify(expectedArgs)}, but it was not called`);
    }
    
    const lastCall = mockFn.calls[mockFn.calls.length - 1];
    for (let i = 0; i < expectedArgs.length; i++) {
        if (lastCall[i] !== expectedArgs[i]) {
            throw new Error(`Expected mock function to have been called with ${JSON.stringify(expectedArgs)}, but was called with ${JSON.stringify(lastCall)}`);
        }
    }
}

export function expectMockFnNotToHaveBeenCalled(mockFn) {
    if (mockFn.calls.length > 0) {
        throw new Error(`Expected mock function not to have been called, but it was called ${mockFn.calls.length} times`);
    }
}

// Mock function for Jest compatibility
export function mockFn(implementation) {
    const calls = [];
    const instances = [];
    const results = [];
    
    const fn = function(...args) {
        calls.push(args);
        instances.push(this);
        
        let result;
        try {
            if (fn.implementation) {
                result = fn.implementation.apply(this, args);
            } else {
                result = fn.mockReturnValue;
            }
            results.push({ type: 'return', value: result });
            return result;
        } catch (error) {
            results.push({ type: 'throw', value: error });
            throw error;
        }
    };
    
    // Mock function properties
    fn.calls = calls;
    fn.instances = instances;
    fn.results = results;
    fn.mockReturnValue = undefined;
    fn.mockReturnValueOnce = function(value) {
        fn.mockReturnValue = value;
        return fn;
    };
    fn.mockImplementation = function(implementation) {
        fn.implementation = implementation;
        return fn;
    };
    fn.mockReset = function() {
        calls.length = 0;
        instances.length = 0;
        results.length = 0;
        return fn;
    };
    fn.mockClear = function() {
        return fn.mockReset();
    };
    
    // Set initial implementation if provided
    if (implementation) {
        fn.mockImplementation(implementation);
    }
    
    return fn;
}

// Global jest mock for compatibility
export const jest = {
    fn: (implementation) => mockFn(implementation),
    clearAllMocks: () => {
        // In a real implementation, this would clear all created mocks
        console.log('jest.clearAllMocks() called');
    },
    resetAllMocks: () => {
        // In a real implementation, this would reset all created mocks
        console.log('jest.resetAllMocks() called');
    }
};

// Legacy runTests function for backward compatibility
export function runTests() {
    // This function exists for import compatibility
    // The actual test running is handled by the individual describe/test structure
    console.log('runTests called - using describe/test structure instead');
}

// Legacy support for existing tests
export function setupDOM() {
    return setupTestEnvironment();
}

export function assert(condition, message) {
    return assertTrue(condition, message);
}

export function assertNotEqual(actual, unexpected, message) {
    if (actual === unexpected) {
        throw new Error(message || `Expected not ${unexpected}, got ${actual}`);
    }
}

export function assertApproxEqual(actual, expected, tolerance = 0.001, message) {
    return assertApproximately(actual, expected, tolerance, message);
}
