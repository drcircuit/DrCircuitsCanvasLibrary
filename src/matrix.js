import { cos, sin, atan2, pow } from './utils.js';
import { vector } from './vector.js';

// First, let's declare the matrix function properly
export function matrix(m) {
    return fmatrix(m);
}

// Then define fmatrix as before
function fmatrix(m) {
    m = m || [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
    return {
        m: m,
        isMatrix: true,
        mul: function (matrixB) {
            let a = m;
            let b = matrixB.m;
            let nm = [];
            for (let r = 0; r < a.length; r++) {
                let row = [];
                for (let c = 0; c < b[0].length; c++) {
                    let n = 0;
                    for (let br = 0; br < b.length; br++) {
                        n += a[r][br] * b[br][c];
                    }
                    row.push(n);
                }
                nm.push(row);
            }
            return matrix(nm);
        },
        quickInverse: function () {
            let nm = matrix();
            let right = vector(m[0][0], m[0][1], m[0][2], m[0][3]);
            let up = vector(m[1][0], m[1][1], m[1][2], m[1][3]);
            let forward = vector(m[2][0], m[2][1], m[2][2], m[2][3]);
            let pos = vector(m[3][0], m[3][1], m[3][2], m[3][3]);
            nm.m[0][0] = right.x;
            nm.m[0][1] = up.x;
            nm.m[0][2] = forward.x;
            nm.m[0][3] = 0;
            nm.m[1][0] = right.y;
            nm.m[1][1] = up.y;
            nm.m[1][2] = forward.y;
            nm.m[1][3] = 0;
            nm.m[2][0] = right.z;
            nm.m[2][1] = up.z;
            nm.m[2][2] = forward.z;
            nm.m[2][3] = 0;
            nm.m[3][0] = -right.x * pos.x - right.y * pos.y - right.z * pos.z;
            nm.m[3][1] = -up.x * pos.x - up.y * pos.y - up.z * pos.z;
            nm.m[3][2] = -forward.x * pos.x - forward.y * pos.y - forward.z * pos.z;
            nm.m[3][3] = 1;
            return nm;
        },
        // Add scale method to the instance
        scale: function (sx, sy, sz) {
            let scaleMatrix = matrix.scale(sx, sy, sz);
            return this.mul(scaleMatrix);
        },
        // Add rotate method to the instance
        rotate: function (axis, deg) {
            let rotationMatrix;
            if (axis === 'x') {
                rotationMatrix = matrix.rotation.x(deg);
            } else if (axis === 'y') {
                rotationMatrix = matrix.rotation.y(deg);
            } else if (axis === 'z') {
                rotationMatrix = matrix.rotation.z(deg);
            } else {
                throw new Error('Invalid rotation axis. Use "x", "y", or "z".');
            }
            return this.mul(rotationMatrix);
        },
        // Add translate method to the instance
        translate: function (x, y, z) {
            let translationMatrix = matrix.translation(x, y, z);
            return this.mul(translationMatrix);
        },
        // Add projection as an instance method
        projection: function (fov, aspect, znear, zfar) {
            let projectionMatrix = matrix.projection(fov, aspect, znear, zfar);
            return this.mul(projectionMatrix);
        },
        // Add pointAt as an instance method
        pointAt: function (eye, target, up) {
            let pointAtMatrix = matrix.pointAt(eye, target, up);
            return this.mul(pointAtMatrix);
        }
    };
}

matrix.rotation = {
    x: function (deg) {
        let theta = deg * (Math.PI / 180);
        let m = matrix();
        m.m[0][0] = 1;
        m.m[1][1] = cos(theta);
        m.m[1][2] = -sin(theta);
        m.m[2][1] = sin(theta);
        m.m[2][2] = cos(theta);
        m.m[3][3] = 1;
        return m;
    },
    y: function (deg) {
        let theta = deg * (Math.PI / 180);
        let m = matrix();
        m.m[0][0] = cos(theta);
        m.m[0][2] = sin(theta);
        m.m[1][1] = 1;
        m.m[2][0] = -sin(theta);
        m.m[2][2] = cos(theta);
        m.m[3][3] = 1;
        return m;
    },
    z: function (deg) {
        let theta = deg * (Math.PI / 180);
        let m = matrix();
        m.m[0][1] = -sin(theta);
        m.m[0][0] = cos(theta);
        m.m[1][0] = sin(theta);
        m.m[1][1] = cos(theta);
        m.m[2][2] = 1;
        m.m[3][3] = 1;
        return m;
    }
};

matrix.projection = function (fov, aspect, znear, zfar) {
    let fovrad = 1 / Math.tan((fov / 2) * (Math.PI / 180));
    let m = matrix();
    m.m[0][0] = aspect * fovrad;
    m.m[1][1] = fovrad;
    m.m[2][2] = zfar / (zfar - znear);
    m.m[3][2] = (-zfar * znear) / (zfar - znear);
    m.m[2][3] = 1;
    m.m[3][3] = 0;
    return m;
};

matrix.pointAt = function (eye, target, up) {
    let forward = target.sub(eye);
    let a = forward.mul(up.dot(forward));
    let newUp = a.sub(up).norm();
    let newRight = forward.cross(newUp);
    let m = matrix();
    m.m[0][0] = newRight.x;
    m.m[0][1] = newRight.y;
    m.m[0][2] = newRight.z;
    m.m[1][0] = newUp.x;
    m.m[1][1] = newUp.y;
    m.m[1][2] = newUp.z;
    m.m[2][0] = forward.x;
    m.m[2][1] = forward.y;
    m.m[2][2] = forward.z;
    m.m[3][0] = eye.x;
    m.m[3][1] = eye.y;
    m.m[3][2] = eye.z;
    m.m[3][3] = 1;
    return m;
};

matrix.translation = function (x, y, z) {
    let m = matrix();
    m.m[3][0] = x;
    m.m[3][1] = y;
    m.m[3][2] = z;
    return m;
};

matrix.scale = function (sx, sy, sz) {
    let m = matrix();
    m.m[0][0] = sx;
    m.m[1][1] = sy;
    m.m[2][2] = sz;
    return m;
}

matrix.create = function (m) {
    if (m && m.isMatrix) return m;
    return fmatrix(m);
};
