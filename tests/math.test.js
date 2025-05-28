// Math utilities tests
import { 
    floor, ceil, round, abs, sin, cos, tan, atan, atan2, pow, sqrt, min, max, log, exp,
    mod, clamp, fract, lerp, rad, trig
} from '../src/utils.js';
import { assert, assertEqual, assertApproxEqual, runTests } from './test-utils.js';

const mathTests = {
    'floor function': () => {
        assertEqual(floor(4.7), 4);
        assertEqual(floor(-2.3), -3);
        assertEqual(floor(5), 5);
    },
    
    'ceil function': () => {
        assertEqual(ceil(4.1), 5);
        assertEqual(ceil(-2.7), -2);
        assertEqual(ceil(5), 5);
    },
    
    'round function': () => {
        assertEqual(round(4.6), 5);
        assertEqual(round(4.4), 4);
        assertEqual(round(-2.6), -3);
    },
    
    'abs function': () => {
        assertEqual(abs(-5), 5);
        assertEqual(abs(5), 5);
        assertEqual(abs(0), 0);
    },
    
    'trigonometric functions': () => {
        assertApproxEqual(sin(Math.PI / 2), 1);
        assertApproxEqual(cos(0), 1);
        assertApproxEqual(tan(Math.PI / 4), 1);
    },
    
    'inverse trigonometric functions': () => {
        assertApproxEqual(atan(1), Math.PI / 4);
        assertApproxEqual(atan2(1, 1), Math.PI / 4);
    },
    
    'power and square root': () => {
        assertEqual(pow(2, 3), 8);
        assertEqual(sqrt(16), 4);
        assertApproxEqual(sqrt(2), 1.414, 0.001);
    },
    
    'min and max functions': () => {
        assertEqual(min(3, 1, 4, 1, 5), 1);
        assertEqual(max(3, 1, 4, 1, 5), 5);
    },
    
    'logarithm and exponential': () => {
        assertApproxEqual(log(Math.E), 1);
        assertApproxEqual(exp(1), Math.E);
    },
    
    'modulo function': () => {
        assertEqual(mod(7, 3), 1);
        assertEqual(mod(-1, 3), 2); // Should handle negative numbers
        assertEqual(mod(6, 3), 0);
    },
    
    'clamp function': () => {
        assertEqual(clamp(5, 0, 10), 5);
        assertEqual(clamp(-5, 0, 10), 0);
        assertEqual(clamp(15, 0, 10), 10);
    },
    
    'fract function': () => {
        assertApproxEqual(fract(3.14), 0.14);
        assertApproxEqual(fract(-2.7), 0.3);
        assertEqual(fract(5), 0);
    },
    
    'lerp function': () => {
        assertEqual(lerp(0, 10, 0.5), 5);
        assertEqual(lerp(0, 10, 0), 0);
        assertEqual(lerp(0, 10, 1), 10);
        assertEqual(lerp(5, 15, 0.3), 8);
    },
    
    'rad function (degrees to radians)': () => {
        assertApproxEqual(rad(180), Math.PI);
        assertApproxEqual(rad(90), Math.PI / 2);
        assertEqual(rad(0), 0);
    },
    
    'trig function (radians to degrees)': () => {
        assertApproxEqual(trig(Math.PI), 180);
        assertApproxEqual(trig(Math.PI / 2), 90);
        assertEqual(trig(0), 0);
    }
};

export { mathTests };

if (import.meta.url === `file://${process.argv[1]}`) {
    runTests(mathTests, 'Math Utilities');
}
