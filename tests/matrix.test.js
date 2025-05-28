/**
 * Tests for matrix.js module
 */

import { describe, test, beforeEach } from './test-utils.js';
import { matrix } from '../src/matrix.js';
import { vector } from '../src/vector.js';

describe('Matrix Module', () => {
    test('should create identity matrix by default', () => {
        const m = matrix();
        
        expect(m.isMatrix).toBe(true);
        expect(m.m).toEqual([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]);
    });

    test('should create matrix with custom values', () => {
        const customMatrix = [
            [2, 0, 0, 0],
            [0, 3, 0, 0],
            [0, 0, 4, 0],
            [0, 0, 0, 1]
        ];
        
        const m = matrix(customMatrix);
        
        expect(m.m).toEqual(customMatrix);
    });

    test('should multiply matrices correctly', () => {
        // Create two transformation matrices
        const m1 = matrix([
            [2, 0, 0, 0],
            [0, 2, 0, 0],
            [0, 0, 2, 0],
            [0, 0, 0, 1]
        ]);
        
        const m2 = matrix([
            [1, 0, 0, 1],
            [0, 1, 0, 2],
            [0, 0, 1, 3],
            [0, 0, 0, 1]
        ]);
        
        const result = m1.mul(m2);
        
        expect(result.m).toEqual([
            [2, 0, 0, 2],
            [0, 2, 0, 4],
            [0, 0, 2, 6],
            [0, 0, 0, 1]
        ]);
    });

    test('should multiply identity matrix correctly', () => {
        const m1 = matrix();
        const m2 = matrix([
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, 16]
        ]);
        
        const result = m1.mul(m2);
        
        expect(result.m).toEqual(m2.m);
    });

    test('should compute quick inverse correctly', () => {
        // Create a simple transformation matrix
        const m = matrix([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [5, 10, 15, 1]  // Translation
        ]);
        
        const inverse = m.quickInverse();
        
        // The translation should be negated
        expect(inverse.m[3][0]).toBeCloseTo(-5, 5);
        expect(inverse.m[3][1]).toBeCloseTo(-10, 5);
        expect(inverse.m[3][2]).toBeCloseTo(-15, 5);
        expect(inverse.m[3][3]).toBe(1);
    });

    describe('Rotation Matrices', () => {
        test('should create X rotation matrix', () => {
            const rotX = matrix.rotation.x(90);
            
            expect(rotX.m[0][0]).toBeCloseTo(1, 5);
            expect(rotX.m[1][1]).toBeCloseTo(0, 5); // cos(90°) = 0
            expect(rotX.m[1][2]).toBeCloseTo(-1, 5); // -sin(90°) = -1
            expect(rotX.m[2][1]).toBeCloseTo(1, 5); // sin(90°) = 1
            expect(rotX.m[2][2]).toBeCloseTo(0, 5); // cos(90°) = 0
        });

        test('should create Y rotation matrix', () => {
            const rotY = matrix.rotation.y(90);
            
            expect(rotY.m[0][0]).toBeCloseTo(0, 5); // cos(90°) = 0
            expect(rotY.m[0][2]).toBeCloseTo(1, 5); // sin(90°) = 1
            expect(rotY.m[1][1]).toBeCloseTo(1, 5);
            expect(rotY.m[2][0]).toBeCloseTo(-1, 5); // -sin(90°) = -1
            expect(rotY.m[2][2]).toBeCloseTo(0, 5); // cos(90°) = 0
        });

        test('should create Z rotation matrix', () => {
            const rotZ = matrix.rotation.z(90);
            
            expect(rotZ.m[0][0]).toBeCloseTo(0, 5); // cos(90°) = 0
            expect(rotZ.m[0][1]).toBeCloseTo(-1, 5); // -sin(90°) = -1
            expect(rotZ.m[1][0]).toBeCloseTo(1, 5); // sin(90°) = 1
            expect(rotZ.m[1][1]).toBeCloseTo(0, 5); // cos(90°) = 0
            expect(rotZ.m[2][2]).toBeCloseTo(1, 5);
        });

        test('should create identity matrix for 0 degree rotation', () => {
            const rotX = matrix.rotation.x(0);
            const rotY = matrix.rotation.y(0);
            const rotZ = matrix.rotation.z(0);
            
            const identity = matrix();
            
            expect(rotX.m).toEqual(identity.m);
            expect(rotY.m).toEqual(identity.m);
            expect(rotZ.m).toEqual(identity.m);
        });
    });

    describe('Projection Matrix', () => {
        test('should create projection matrix', () => {
            const fov = 90;
            const aspect = 16/9;
            const znear = 0.1;
            const zfar = 1000;
            
            const proj = matrix.projection(fov, aspect, znear, zfar);
            
            expect(proj.m[0][0]).toBeGreaterThan(0); // aspect * fovrad
            expect(proj.m[1][1]).toBeGreaterThan(0); // fovrad
            expect(proj.m[2][2]).toBeGreaterThan(0); // zfar / (zfar - znear)
            expect(proj.m[3][2]).toBeLessThan(0); // (-zfar * znear) / (zfar - znear)
            expect(proj.m[2][3]).toBe(1);
            expect(proj.m[3][3]).toBe(0);
        });

        test('should handle different aspect ratios', () => {
            const proj1 = matrix.projection(90, 1, 0.1, 1000);
            const proj2 = matrix.projection(90, 2, 0.1, 1000);
            
            expect(proj2.m[0][0]).toBeCloseTo(proj1.m[0][0] * 2, 5);
        });
    });

    describe('Point At Matrix', () => {
        test('should create point-at matrix', () => {
            const eye = vector(0, 0, 0);
            const target = vector(0, 0, 1);
            const up = vector(0, 1, 0);
            
            const pointAt = matrix.pointAt(eye, target, up);
            
            expect(pointAt.m[3][0]).toBe(0); // eye.x
            expect(pointAt.m[3][1]).toBe(0); // eye.y
            expect(pointAt.m[3][2]).toBe(0); // eye.z
            expect(pointAt.m[3][3]).toBe(1);
        });

        test('should handle different eye positions', () => {
            const eye = vector(5, 10, 15);
            const target = vector(0, 0, 0);
            const up = vector(0, 1, 0);
            
            const pointAt = matrix.pointAt(eye, target, up);
            
            expect(pointAt.m[3][0]).toBe(5);
            expect(pointAt.m[3][1]).toBe(10);
            expect(pointAt.m[3][2]).toBe(15);
        });
    });

    describe('Translation Matrix', () => {
        test('should create translation matrix', () => {
            const trans = matrix.translation(5, 10, 15);
            
            expect(trans.m[3][0]).toBe(5);
            expect(trans.m[3][1]).toBe(10);
            expect(trans.m[3][2]).toBe(15);
            expect(trans.m[3][3]).toBe(1);
            
            // Other elements should be identity
            expect(trans.m[0][0]).toBe(1);
            expect(trans.m[1][1]).toBe(1);
            expect(trans.m[2][2]).toBe(1);
            expect(trans.m[0][1]).toBe(0);
            expect(trans.m[0][2]).toBe(0);
        });

        test('should create identity for zero translation', () => {
            const trans = matrix.translation(0, 0, 0);
            const identity = matrix();
            
            expect(trans.m).toEqual(identity.m);
        });
    });

    describe('Matrix Combinations', () => {
        test('should combine rotation and translation correctly', () => {
            const rotation = matrix.rotation.z(90);
            const translation = matrix.translation(10, 0, 0);
            
            const combined = rotation.mul(translation);
            
            // Should have both rotation and translation effects
            expect(combined.m[3][0]).toBe(10); // Translation preserved
            expect(combined.m[0][0]).toBeCloseTo(0, 5); // Rotation preserved
            expect(combined.m[0][1]).toBeCloseTo(-1, 5);
        });

        test('should chain multiple transformations', () => {
            const rotX = matrix.rotation.x(45);
            const rotY = matrix.rotation.y(45);
            const trans = matrix.translation(1, 2, 3);
            
            const combined = rotX.mul(rotY).mul(trans);
            
            expect(combined.isMatrix).toBe(true);
            expect(combined.m[3][0]).toBe(1);
            expect(combined.m[3][1]).toBe(2);
            expect(combined.m[3][2]).toBe(3);
        });
    });
});
