// Vector module tests
import { vector } from '../src/vector.js';
import { assert, assertEqual, assertApproxEqual, runTests } from './test-utils.js';

const vectorTests = {
    'vector creation with 2 parameters': () => {
        const v = vector(3, 4);
        assertEqual(v.x, 3);
        assertEqual(v.y, 4);
        assertEqual(v.z, 0); // default z value
    },
    
    'vector creation with 3 parameters': () => {
        const v = vector(1, 2, 3);
        assertEqual(v.x, 1);
        assertEqual(v.y, 2);
        assertEqual(v.z, 3);
    },
    
    'vector addition': () => {
        const v1 = vector(1, 2, 3);
        const v2 = vector(4, 5, 6);
        const result = v1.add(v2);
        assertEqual(result.x, 5);
        assertEqual(result.y, 7);
        assertEqual(result.z, 9);
    },
    
    'vector subtraction': () => {
        const v1 = vector(5, 7, 9);
        const v2 = vector(1, 2, 3);
        const result = v1.sub(v2);
        assertEqual(result.x, 4);
        assertEqual(result.y, 5);
        assertEqual(result.z, 6);
    },
    
    'vector scalar multiplication': () => {
        const v = vector(2, 3, 4);
        const result = v.mul(2);
        assertEqual(result.x, 4);
        assertEqual(result.y, 6);
        assertEqual(result.z, 8);
    },
    
    'vector magnitude': () => {
        const v = vector(3, 4, 0);
        assertApproxEqual(v.magnitude(), 5);
    },
    
    'vector magnitude 3D': () => {
        const v = vector(1, 2, 2);
        assertApproxEqual(v.magnitude(), 3);
    },
    
    'vector normalization': () => {
        const v = vector(3, 4, 0);
        const normalized = v.normalize();
        assertApproxEqual(normalized.magnitude(), 1);
        assertApproxEqual(normalized.x, 0.6);
        assertApproxEqual(normalized.y, 0.8);
    },
    
    'vector dot product': () => {
        const v1 = vector(1, 2, 3);
        const v2 = vector(4, 5, 6);
        const result = v1.dot(v2);
        assertEqual(result, 32); // 1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32
    },
    
    'vector cross product': () => {
        const v1 = vector(1, 0, 0);
        const v2 = vector(0, 1, 0);
        const result = v1.cross(v2);
        assertEqual(result.x, 0);
        assertEqual(result.y, 0);
        assertEqual(result.z, 1);
    },
    
    'vector distance between points': () => {
        const v1 = vector(0, 0, 0);
        const v2 = vector(3, 4, 0);
        const distance = v1.distanceTo(v2);
        assertApproxEqual(distance, 5);
    },
    
    'vector copy creates new instance': () => {
        const v1 = vector(1, 2, 3);
        const v2 = v1.copy();
        assertEqual(v2.x, 1);
        assertEqual(v2.y, 2);
        assertEqual(v2.z, 3);
        assert(v1 !== v2, 'Copy should create new instance');
    }
};

export { vectorTests };

if (import.meta.url === `file://${process.argv[1]}`) {
    runTests(vectorTests, 'Vector');
}
