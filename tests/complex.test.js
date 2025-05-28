// Complex number tests
import { complex } from '../src/complex.js';
import { assert, assertEqual, assertApproxEqual, runTests } from './test-utils.js';

const complexTests = {
    'complex creation with real and imaginary parts': () => {
        const c = complex(3, 4);
        assertEqual(c.re, 3);
        assertEqual(c.im, 4);
    },
    
    'complex creation with only real part': () => {
        const c = complex(5);
        assertEqual(c.re, 5);
        assertEqual(c.im, 0);
    },
    
    'complex addition': () => {
        const c1 = complex(3, 4);
        const c2 = complex(1, 2);
        const result = c1.add(c2);
        assertEqual(result.re, 4);
        assertEqual(result.im, 6);
    },
    
    'complex subtraction': () => {
        const c1 = complex(5, 7);
        const c2 = complex(2, 3);
        const result = c1.sub(c2);
        assertEqual(result.re, 3);
        assertEqual(result.im, 4);
    },
    
    'complex multiplication': () => {
        const c1 = complex(3, 4);
        const c2 = complex(1, 2);
        const result = c1.mul(c2);
        // (3 + 4i) * (1 + 2i) = 3 + 6i + 4i + 8i² = 3 + 10i - 8 = -5 + 10i
        assertEqual(result.re, -5);
        assertEqual(result.im, 10);
    },
    
    'complex division': () => {
        const c1 = complex(3, 4);
        const c2 = complex(1, 2);
        const result = c1.div(c2);
        // (3 + 4i) / (1 + 2i) = (3 + 4i)(1 - 2i) / (1 + 2i)(1 - 2i)
        // = (3 - 6i + 4i - 8i²) / (1 - 4i²) = (3 - 2i + 8) / (1 + 4) = (11 - 2i) / 5
        assertApproxEqual(result.re, 2.2);
        assertApproxEqual(result.im, -0.4);
    },
    
    'complex magnitude': () => {
        const c = complex(3, 4);
        const mag = c.magnitude();
        assertApproxEqual(mag, 5); // sqrt(3² + 4²) = sqrt(9 + 16) = sqrt(25) = 5
    },
    
    'complex argument (angle)': () => {
        const c = complex(1, 1);
        const arg = c.argument();
        assertApproxEqual(arg, Math.PI / 4); // 45 degrees
    },
    
    'complex conjugate': () => {
        const c = complex(3, 4);
        const conj = c.conjugate();
        assertEqual(conj.re, 3);
        assertEqual(conj.im, -4);
    },
    
    'complex power': () => {
        const c = complex(2, 0);
        const result = c.pow(3);
        assertApproxEqual(result.re, 8);
        assertApproxEqual(result.im, 0, 0.001);
    },
    
    'complex square root': () => {
        const c = complex(4, 0);
        const result = c.sqrt();
        assertApproxEqual(result.re, 2);
        assertApproxEqual(result.im, 0, 0.001);
    },
    
    'complex exponential': () => {
        const c = complex(0, Math.PI);
        const result = c.exp();
        // e^(iπ) = -1 + 0i
        assertApproxEqual(result.re, -1, 0.001);
        assertApproxEqual(result.im, 0, 0.001);
    },
    
    'complex copy creates new instance': () => {
        const c1 = complex(3, 4);
        const c2 = c1.copy();
        assertEqual(c2.re, 3);
        assertEqual(c2.im, 4);
        assert(c1 !== c2, 'Copy should create new instance');
    }
};

export { complexTests };

if (import.meta.url === `file://${process.argv[1]}`) {
    runTests(complexTests, 'Complex Numbers');
}
