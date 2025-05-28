(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.dcl = {}));
})(this, (function (exports) { 'use strict';

    // Number prototype extensions

    if (!Number.prototype.toRadians) {
        Number.prototype.toRadians = function () {
            return this.valueOf() * (Math.PI / 180);
        };
    }

    if (!Number.prototype.toDegrees) {
        Number.prototype.toDegrees = function () {
            return this.valueOf() * (180 / Math.PI);
        };
    }

    if (!Number.prototype.map) {
        Number.prototype.map = function (inputScaleMin, inputScaleMax, outputScaleMin, outputScaleMax) {
            return (this.valueOf() - inputScaleMin) * (outputScaleMax - outputScaleMin) / (inputScaleMax - inputScaleMin) + outputScaleMin;
        };
    }

    // Array prototype extensions
    // Create a new array that creates a new array that goes to a midpoint, then bounces back towards the first entry. Size, can be given, midpoint and skip step is calculated based on the array. Primarily used for palettes and color gradients.
    if (!Array.prototype.bounce) {
        Array.prototype.bounce = function (size) {
            if (size === undefined) size = this.length;
            let mid = Math.floor(size / 2);
            let step = Math.floor(this.length / mid);
            let result = [];
            for (let i = 0; i < mid; i++) {
                result.push(this[i * step]);
            }
            for (let i = mid - 1; i >= 0; i--) {
                result.push(this[i * step]);
            }
            return result.slice(0, size);
        };
    }

    // Create vector from array
    if (!Array.prototype.toVector) {
        Array.prototype.toVector = function () {
            // Dynamically require vector only when needed
            const { vector } = require('./vector.js'); // For CommonJS
            // OR for ESM:
            // const vector = (await import('./vector.js')).vector;
            if (this.length === 2) {
                return vector(this[0], this[1]);
            } else if (this.length === 3) {
                return vector(this[0], this[1], this[2]);
            } else if (this.length === 4) {
                return vector(this[0], this[1], this[2], this[3]);
            }
            throw new Error("Array length must be 2, 3, or 4 to convert to vector.");
        };
    }

    const floor = Math.floor;
    const ceil = Math.ceil;
    const round = Math.round;
    const abs = Math.abs;
    const sin = Math.sin;
    const cos = Math.cos;
    const tan = Math.tan;
    const atan = Math.atan;
    const atan2 = Math.atan2;
    const pow = Math.pow;
    const sqrt = Math.sqrt;
    const min = Math.min;
    const max = Math.max;
    const log = Math.log;
    const exp = Math.exp;

    const mod = (n, m) => n - floor(n / m) * m;
    const clamp = (n, mn, mx) => min(max(n, mn), mx);
    const fract = n => n - floor(n);
    const lerp = (a, b, t) => a + (b - a) * t;

    const rad = deg => deg.toRadians();

    function trig$1(deg) {
        const r = rad(deg);
        const c = Math.cos(r);
        const s = Math.sin(r);
        return {
            rad: r,
            cos: c,
            sin: s,
            transform: (a, b) => ({ a: a * c - b * s, b: a * s + b * c })
        };
    }

    // src/vector.js


    // Main vector factory (copied from dcl.vector)
    function vector(x, y, z, w) {
        x = x || 0;
        y = y || 0;
        z = z || 0;
        w = w === undefined || w === null ? 1 : w;

        function magsqr() {
            return x * x + y * y + z * z + w * w;
        }

        function mag() {
            return Math.sqrt(magsqr());
        }

        return {
            x: x,
            y: y,
            z: z,
            w: w,
            collidesWith: function (vector, threshold) {
                return Math.abs(x - vector.x) <= threshold && Math.abs(y - vector.y) <= threshold && Math.abs(z - vector.z) <= threshold;
            },
            rotateX: function (angle) {
                var tv = trig(angle).transform(y, z);
                return vector(x, tv.a, tv.b);
            },
            rotateY: function (angle) {
                var tv = trig(angle).transform(x, z);
                return vector(tv.a, y, tv.b);
            },
            rotateZ: function (angle) {
                var tv = trig(angle).transform(x, y);
                return vector(tv.a, tv.b, z);
            },
            project: function (width, height, fov, distance) {
                var factor = fov / (distance + z);
                var nx = x * factor + width / 2;
                var ny = y * factor + height / 2;
                return vector(nx, ny, z, 0);
            },
            reflect: function (normal) {
                var d = vector(x, y, z, w);
                var n = normal.norm();
                var dot = n.dot(d);
                var r = d.sub(n.smul(2 * dot));
                return r;
            },
            add: function (vx, vy, vz, vw) {
                if (vx && vx.isVector) {
                    return vector(x + vx.x, y + vx.y, z + vx.z, w + vx.w);
                }
                vx = vx || 0;
                vy = vy || 0;
                vz = vz || 0;
                vw = vw || 0;
                return vector(x + vx, y + vy, z + vz, w + vw);
            },
            sub: function (vx, vy, vz, vw) {
                if (vx && vx.isVector) {
                    return vector(x - vx.x, y - vx.y, z - vx.z, w - vx.w);
                }
                vx = vx || 0;
                vy = vy || 0;
                vz = vz || 0;
                vw = vw || 0;
                return vector(x - vx, y - vy, z - vz, w - vw);
            },
            smul: function (n) {
                n = n || 0;
                return vector(x * n, y * n, z * n, w * n);
            },
            div: function (n) {
                n = n || 1;
                return vector(x / n, y / n, z / n, w / n);
            },
            min: function (v) {
                return vector(min(x, v.x), min(y, v.y), min(z, v.z), min(w, v.w));
            },
            max: function (v) {
                return vector(max(x, v.x), max(y, v.y), max(z, v.z), max(w, v.w));
            },
            abs: function (){
                return vector(abs(x), abs(y), abs(z), abs(w));
            },
            fract: function(){
                return vector(fract(x), fract(y), fract(z), fract(w));
            },
            mix: function(v, f){
                return vector(lerp(x, v.x, f), lerp(y, v.y, f), lerp(z, v.z, f), lerp(w, v.w, f));
            },
            mul: function (vx, vy, vz, vw) {
                if (vx && vx.isVector) {
                    return vector(x * vx.x, y * vx.y, z * vx.z, w * vx.w);
                }
                vx = vx || 0;
                vy = vy || 0;
                vz = vz || 0;
                vw = vw || 1;
                return vector(x * vx, y * vy, z * vz, w * vw);
            },
            matrixmul: function (m) {
                let nx = x * m.m[0][0] + y * m.m[1][0] + z * m.m[2][0] + w * m.m[3][0];
                let ny = x * m.m[0][1] + y * m.m[1][1] + z * m.m[2][1] + w * m.m[3][1];
                let nz = x * m.m[0][2] + y * m.m[1][2] + z * m.m[2][2] + w * m.m[3][2];
                let nw = x * m.m[0][3] + y * m.m[1][3] + z * m.m[2][3] + w * m.m[3][3];

                if(nw !== 0){
                    nx /= nw;
                    ny /= nw;
                    nz /= nw;   
                }
                return vector(nx, ny, nz, nw);
            },
            dot: function (v) {
                return x * v.x + y * v.y + z * v.z;
            },
            cross: function (v) {
                var vx = y * v.z - z * v.y;
                var vy = z * v.x - x * v.z;
                var vz = x * v.y - y * v.x;

                return vector(vx, vy, vz, 0);
            },
            mag: mag,
            dist: function (v) {
                var d = vector(x, y, z, w).sub(v);
                return d.mag();
            },
            norm: function () {
                return vector(x, y, z, w).div(mag());
            },
            normal: function(v){
                return vector(x,y,z,w).cross(v).norm();
            },
            floor: function () {
                return vector(floor(x), floor(y), floor(z), floor(w));
            },
            ceil: function () {
                return vector(ceil(x), ceil(y), ceil(z), ceil(w));
            },
            round: function () {
                return vector(round(x), round(y), round(z), round(w));
            },
            cos: function () {
                return vector(cos(x), cos(y), cos(z), cos(w));
            },
            sin: function () {
                return vector(sin(x), sin(y), sin(z), sin(w));
            },
            yxz: function () {
                return vector(y, x, z, w);
            },
            zxy: function () {
                return vector(z, x, y, w);
            },
            xzy: function () {
                return vector(x, z, y, w);
            },
            yzx: function () {
                return vector(y, z, x, w);
            },
            zyx: function () {
                return vector(z, y, x, w);
            },
            xyz: function () {
                return vector(x, y, z, w);
            },
            xy: function () {
                return vector(x, y);
            },
            xz: function () {
                return vector(x, z);
            },
            yz: function () {
                return vector(y, z);
            },
            yx: function () {
                return vector(y, x);
            },
            zx: function () {
                return vector(z, x);
            },
            zy: function () {
                return vector(z, y);
            },
            xxy: function () {
                return vector(x, x, y);
            },
            xxz: function () {
                return vector(x, x, z);
            },
            yyx: function () {
                return vector(y, y, x);
            },
            yyz: function () {
                return vector(y, y, z);
            },
            zzx: function () {
                return vector(z, z, x);
            },
            zzy: function () {
                return vector(z, z, y);
            },
            xxx: function () {
                return vector(x, x, x);
            },
            yyy: function () {
                return vector(y, y, y);
            },
            zzz: function () {
                return vector(z, z, z);
            },
            xyx: function () {
                return vector(x, y, x);
            },
            xzx: function () {
                return vector(x, z, x);
            },
            yxy: function () {
                return vector(y, x, y);
            },
            yzy: function () {
                return vector(y, z, y);
            },
            zxz: function () {
                return vector(z, x, z);
            },
            zyz: function () {
                return vector(z, y, z);
            },
            xyy: function () {
                return vector(x, y, y);
            },
            xzz: function () {
                return vector(x, z, z);
            },
            yxx: function () {
                return vector(y, x, x);
            },
            yzz: function () {
                return vector(y, z, z);
            },
            zxx: function () {
                return vector(z, x, x);
            },
            zyy: function () {
                return vector(z, y, y);
            },
            magsqr: magsqr,
            isVector: true
        };
    }

    function trig(deg) {
        var r = rad(deg);
        var c = cos(r);
        var s = sin(r);
        return {
            rad: r,
            cos: c,
            sin: s,
            transform: function (a, b) {
                return { a: a * c - b * s, b: a * s + b * c };
            }
        };
    }

    function color(red, green, blue, alpha = 1.0) {
        red = Math.round(red);
        green = Math.round(green);
        blue = Math.round(blue);    return {
            r: red,
            g: green,
            b: blue,
            a: alpha,
            toStyle: function () {
                return "rgba(" + red + "," + green + "," + blue + "," + alpha.toFixed(2) + ")";
            },
            isColor: true,
            lerp: function (color2, t) {
                let nr = Math.round(lerp(red, color2.r, t));
                let ng = Math.round(lerp(green, color2.g, t));
                let nb = Math.round(lerp(blue, color2.b, t));
                let na = lerp(alpha, color2.a, t);
                return color(nr, ng, nb, na);
            },
            copy: function() {
                return color(red, green, blue, alpha);
            }
        };
    }

    color.hue2rgb = function (p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };

    color.fromHSL = function (h, s, l) {
        h = h % 360;
        s = Math.max(0, Math.min(1, s));
        l = Math.max(0, Math.min(1, l));
        let c = (1 - Math.abs(2 * l - 1)) * s;
        let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        let m = l - c / 2;
        let r1 = 0, g1 = 0, b1 = 0;
        if (h < 60)      { r1 = c; g1 = x; b1 = 0; }
        else if (h < 120){ r1 = x; g1 = c; b1 = 0; }
        else if (h < 180){ r1 = 0; g1 = c; b1 = x; }
        else if (h < 240){ r1 = 0; g1 = x; b1 = c; }
        else if (h < 300){ r1 = x; g1 = 0; b1 = c; }
        else             { r1 = c; g1 = 0; b1 = x; }
        return color(
            Math.round((r1 + m) * 255),
            Math.round((g1 + m) * 255),
            Math.round((b1 + m) * 255),
            1.0
        );
    };

    color.fromHSB = function (hue, saturation, brightness) {
        hue = hue / 360;
        let r, g, b;
        if (brightness === 0) {
            r = g = b = brightness;
        } else {
            let q = brightness < 0.5 ? brightness * (1 + saturation) : brightness + saturation - brightness * saturation;
            let p = 2 * brightness - q;
            r = color.hue2rgb(p, q, hue + 1 / 3);
            g = color.hue2rgb(p, q, hue);
            b = color.hue2rgb(p, q, hue - 1 / 3);
        }
        return color(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
    };

    color.fromHex = function (hex) {
        if (hex.startsWith('#')) hex = hex.slice(1);
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }
        if (hex.length !== 6) throw new Error('Invalid hex color format');
        let r = parseInt(hex.slice(0, 2), 16);
        let g = parseInt(hex.slice(2, 4), 16);
        let b = parseInt(hex.slice(4, 6), 16);
        return color(r, g, b);
    };

    // Color constants
    const RED     = color(255, 0, 0);
    const MAGENTA = color(255, 0, 255);
    const YELLOW  = color(255, 255, 0);
    const GREEN   = color(0, 255, 0);
    const CYAN    = color(0, 255, 255);
    const BLUE    = color(0, 0, 255);
    const TRANS   = color(0, 0, 0, 0);
    const BLACK   = color(0, 0, 0);
    const WHITE   = color(255, 255, 255);
    const GRAY    = color(128, 128, 128);

    // First, let's declare the matrix function properly
    function matrix(m) {
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
    };

    matrix.create = function (m) {
        if (m && m.isMatrix) return m;
        return fmatrix(m);
    };

    // EGA 64-color palette (6-bit RGB)
    const ega = [
        color(0, 0, 0, 1.0), color(0, 0, 0xAA, 1.0), color(0, 0xAA, 0, 1.0), color(0, 0xAA, 0xAA, 1.0),
        color(0xAA, 0, 0, 1.0), color(0xAA, 0, 0xAA, 1.0), color(0xAA, 0xAA, 0, 1.0), color(0xAA, 0xAA, 0xAA, 1.0),
        color(0, 0, 0x55, 1.0), color(0, 0, 0xFF, 1.0), color(0, 0xAA, 0x55, 1.0), color(0, 0xAA, 0xFF, 1.0),
        color(0xAA, 0, 0x55, 1.0), color(0xAA, 0, 0xFF, 1.0), color(0xAA, 0xAA, 0x55, 1.0), color(0xAA, 0xAA, 0xFF, 1.0),
        color(0, 0x55, 0, 1.0), color(0, 0x55, 0xAA, 1.0), color(0, 0xFF, 0, 1.0), color(0, 0xFF, 0xAA, 1.0),
        color(0xAA, 0x55, 0, 1.0), color(0xAA, 0x55, 0xAA, 1.0), color(0xAA, 0xFF, 0, 1.0), color(0xAA, 0xFF, 0xAA, 1.0),
        color(0, 0x55, 0x55, 1.0), color(0, 0x55, 0xFF, 1.0), color(0, 0xFF, 0x55, 1.0), color(0, 0xFF, 0xFF, 1.0),
        color(0xAA, 0x55, 0x55, 1.0), color(0xAA, 0x55, 0xFF, 1.0), color(0xAA, 0xFF, 0x55, 1.0), color(0xAA, 0xFF, 0xFF, 1.0),
        color(0x55, 0, 0, 1.0), color(0x55, 0, 0xAA, 1.0), color(0x55, 0xAA, 0, 1.0), color(0x55, 0xAA, 0xAA, 1.0),
        color(0xFF, 0, 0, 1.0), color(0xFF, 0, 0xAA, 1.0), color(0xFF, 0xAA, 0, 1.0), color(0xFF, 0xAA, 0xAA, 1.0),
        color(0x55, 0, 0x55, 1.0), color(0x55, 0, 0xFF, 1.0), color(0x55, 0xAA, 0x55, 1.0), color(0x55, 0xAA, 0xFF, 1.0),
        color(0xFF, 0, 0x55, 1.0), color(0xFF, 0, 0xFF, 1.0), color(0xFF, 0xAA, 0x55, 1.0), color(0xFF, 0xAA, 0xFF, 1.0),
        color(0x55, 0x55, 0, 1.0), color(0x55, 0x55, 0xAA, 1.0), color(0x55, 0xFF, 0, 1.0), color(0x55, 0xFF, 0xAA, 1.0),
        color(0xFF, 0x55, 0, 1.0), color(0xFF, 0x55, 0xAA, 1.0), color(0xFF, 0xFF, 0, 1.0), color(0xFF, 0xFF, 0xAA, 1.0),
        color(0x55, 0x55, 0x55, 1.0), color(0x55, 0x55, 0xFF, 1.0), color(0x55, 0xFF, 0x55, 1.0), color(0x55, 0xFF, 0xFF, 1.0),
        color(0xFF, 0x55, 0x55, 1.0), color(0xFF, 0x55, 0xFF, 1.0), color(0xFF, 0xFF, 0x55, 1.0), color(0xFF, 0xFF, 0xFF, 1.0)
    ];

    // Default 16-color EGA palette
    const egadef = [
        ega[0], ega[1], ega[2], ega[3], ega[4], ega[5], ega[0x14], ega[7],
        ega[0x38], ega[0x39], ega[0x3A], ega[0x3B], ega[0x3C], ega[0x3D], ega[0x3E], ega[0x3F]
    ];

    // CGA palette
    const cga = [
        color(0, 0, 0, 1.0), color(0, 0, 170, 1.0), color(0, 170, 0, 1.0), color(0, 170, 170, 1.0),
        color(170, 0, 0, 1.0), color(170, 0, 170, 1.0), color(170, 85, 0, 1.0), color(170, 170, 170, 1.0),
        color(85, 85, 85, 1.0), color(85, 85, 255, 1.0), color(85, 255, 85, 1.0), color(85, 255, 255, 1.0),
        color(255, 85, 85, 1.0), color(255, 85, 255, 1.0), color(255, 255, 85, 1.0), color(255, 255, 255, 1.0)
    ];

    // Grayscale palette
    const gray = [];
    for (let i = 0; i < 256; i++) {
        gray.push(color(i, i, i));
    }

    // Fire palette (red to yellow)
    const fire = [];
    for (let i = 0; i < 256; i++) {
        let l = i / 255;
        let h = (i / 255) * 85; // 0 deg to 85 deg in HSL space is red to yellow
        fire.push(color.fromHSL(h, 1, l));
    }


    // Rainbow palette generating a smooth gradient
    const rainbow = [];

    for (let i = 0; i < 256; i++) {
        let h = i.map(0, 255, 0, 360); // 0–360 covers the full wheel and cycles smoothly
        rainbow.push(color.fromHSL(h, 1, .5));
    }

    const palette = {
        fire,
        rainbow,
        gray,
        cga,
        ega,
        egadef
    };

    const KEYS = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SPACE: 32,
        CONTROL: 17,
        ALT: 18,
        SHIFT: 16,
        WIN: 91,
        WINCTX: 92,
        ESCAPE: 27,
        PIPE: 220,
        ONE: 49,
        TWO: 50,
        THREE: 51,
        FOUR: 52,
        FIVE: 53,
        SIX: 54,
        SEVEN: 55,
        EIGHT: 56,
        NINE: 57,
        ZERO: 48,
        BACKSLASH: 219,
        A: 65,
        S: 83,
        D: 68,
        F: 70,
        Q: 81,
        W: 87,
        E: 69,
        R: 82,
        Z: 90,
        X: 88,
        C: 67,
        V: 86,
        NONE: 97,
        NTWO: 98,
        NTHREE: 99,
        NFOUR: 100,
        NFIVE: 101,
        NSIX: 102,
        NSEVEN: 103,
        NEIGHT: 104,
        NNINE: 105,
        NZERO: 96,
        NMINUS: 109,
        NPLUS: 107,
        NSTAR: 108,
        NDIV: 111,
        NCOMMA: 110,
        ENTER: 13
    };

    const KEYB = {
        keyPressed: -1,
        ctrlPressed: false,
        altPressed: false,
        shiftPressed: false
    };

    const MOUSE = {
        pos: null,
        clickLeft: false,
        clickRight: false
    };



    MOUSE.reset = function () {
        MOUSE.clickLeft = false;
        MOUSE.clickRight = false;
    };

    function complex(re, im) {
        let mod = sqrt(re * re + im * im);
        let arg = atan2(im, re);

        return {
            re: re,
            im: im,
            isComplex: true,
            add: function (c) {
                if (!c.isComplex) return complex(re + c, im);
                return complex(re + c.re, im + c.im);
            },
            sub: function (c) {
                if (!c.isComplex) return complex(re - c, im);
                return complex(re - c.re, im - c.im);
            },
            mul: function (c) {
                if (!c.isComplex) return complex(re * c, im * c);
                return complex(re * c.re - im * c.im, re * c.im + im * c.re);
            },
            div: function (c) {
                if (c === 0) return complex(Infinity, -Infinity);
                if (!c.isComplex) return complex(re / c, im / c);
                let a = complex(re, im);
                let bcon = c.con();
                a = a.mul(bcon);
                let b = c.mul(bcon);
                return a.div(b.re);
            },
            arg: arg,
            mod: mod,
            con: function () {
                return complex(re, -im);
            },
            pow: function (e) {
                let the = e * arg;
                let mode = pow(mod, e);
                let r = mode * cos(the);
                let i = mode * sin(the);
                return complex(r, i);
            }
        };
    }

    function createSprite(sheet, x, y, w, h) {
        return {
            isSprite: true,
            img: sheet,
            pos: vector(x, y),
            width: w,
            height: h
        };
    }

    function sprite(spriteSheet, pos, width, height) {
        let states = [];
        let buffer = document.createElement("canvas");
        buffer.width = spriteSheet.width;
        buffer.height = spriteSheet.height;
        let p = pos;
        let c = buffer.getContext("2d");
        c.drawImage(spriteSheet, 0, 0);

        function getBbox(sprite) {
            return { x: sprite.pos.x, y: sprite.pos.y, w: sprite.width, h: sprite.height };
        }

        function boundingBoxCollision(a, b) {
            return ((a.x + a.width) >= b.x) &&
                (a.x <= (b.x + b.w)) &&
                ((a.y + a.height) >= b.height) &&
                (a.y <= (b.y + b.height));
        }

        return {
            add: function (state, x, y) {
                states[state] = {
                    state: state,
                    pos: vector(x, y)
                };
            },
            draw(state, ctx) {
                let sprite = states[state];
                if (sprite) {
                    ctx.drawImage(spriteSheet, sprite.pos.x, sprite.pos.y, width, height, p.x, p.y, width, height);
                }
            },
            pos: p,
            width: width,
            height: height,
            collidesWith: function (b) {
                return boundingBoxCollision({ x: p.x, y: p.y}, getBbox(b));
            }
        };
    }

    // All shape and drawing primitives for dcl

    function getCtx$1(ctx) {
        return ctx || (window.dcl && window.dcl.renderContext);
    }

    function rect$1(x, y, width, height, color, lineWidth, lineColor, ctx, dcl) {
        ctx = getCtx$1(ctx);
        height = height || width;
        if (color && color.isColor) color = color.toStyle();
        if (lineColor && lineColor.isColor) lineColor = lineColor.toStyle();
        ctx.fillStyle = color || "blue";
        ctx.fillRect(x, y, width, height);
        if (lineWidth) {
            lineColor = lineColor || "#000088";
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = lineWidth;
            ctx.strokeRect(x, y, width, height);
        }
    }

    function stroke$1(color, lineWidth, ctx, dcl) {
        color = color || "blue";
        if (color.isColor) color = color.toStyle();
        ctx = getCtx$1(ctx);
        ctx.lineWidth = lineWidth;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = color || "#000088";
        ctx.stroke();
    }

    function fill$1(color, ctx, dcl) {
        color = color || "blue";
        if (color.isColor) color = color.toStyle();
        ctx = getCtx$1(ctx);
        ctx.fillStyle = color;
        ctx.fill();
    }

    function circle$1(x, y, radius, color, lineWidth, lineColor, ctx, dcl) {
        ctx = getCtx$1(ctx);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, (dcl ? dcl.rad(360) : Math.PI * 2));
        fill$1(color, ctx);
        if (lineWidth) {
            stroke$1(lineColor, lineWidth, ctx);
        }
        ctx.closePath();
    }

    function line$1(x, y, dx, dy, lineWidth, lineColor, ctx, dcl) {
        ctx = getCtx$1(ctx);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(dx, dy);
        stroke$1(lineColor, lineWidth, ctx);
        ctx.closePath();
    }

    function text$1(text, x, y, color, font, size, maxWidth, align, ctx, dcl) {
        ctx = getCtx$1(ctx);
        align = align || "center";
        color = color || "blue";
        color = color.isColor ? color.toStyle() : color;
        let style = (size || 16) + "px " + (font || "Arial");
        ctx.font = style;
        ctx.textAlign = align;
        ctx.fillStyle = color;
        if (maxWidth) {
            ctx.fillText(text, x, y, maxWidth);
        } else {
            ctx.fillText(text, x, y);
        }
    }

    var shapes = /*#__PURE__*/Object.freeze({
        __proto__: null,
        circle: circle$1,
        fill: fill$1,
        getCtx: getCtx$1,
        line: line$1,
        rect: rect$1,
        stroke: stroke$1,
        text: text$1
    });

    const curve = {
        start: function (x, y, ctx) {
            ctx = getCtx$1(ctx);
            ctx.beginPath();
            ctx.moveTo(x, y);
        },
        end: function (ctx) {
            ctx = getCtx$1(ctx);
            ctx.closePath();
        },
        vertex: function (x, y, ctx) {
            ctx = getCtx$1(ctx);
            ctx.lineTo(x, y);
        },
        fill: function (color, ctx) {
            ctx = getCtx$1(ctx);
            fill$1(color, ctx);
        },
        stroke: function (color, width, ctx) {
            ctx = getCtx$1(ctx);
            stroke$1(color, width, ctx);
        },
        plot: function (points, lineColor, lineWidth, fillColor, ctx) {
            if (!points.forEach) {
                console.error("Error! you must supply an array with coordinates as an argument to this function.");
                return;
            }
            points.forEach((p, i, a) => {
                if (i === 0) {
                    curve.start(p.x, p.y, ctx);
                } else if (i === a.length - 1) {
                    curve.vertex(p.x, p.y, ctx);
                    curve.end(ctx);
                    curve.stroke(lineColor, lineWidth, ctx);
                    if (fillColor) {
                        curve.fill(fillColor, ctx);
                    }
                } else {
                    curve.vertex(p.x, p.y, ctx);
                }
            });
        }
    };

    function createBuffer(width, height, dcl) {
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext("2d");
        return {
            canvas: canvas,
            buffer: ctx,
            capture: function () {
                return ctx.getImageData(0, 0, width, height);
            },
            clear: function (color) {
                dcl.clear(color, ctx);
            },
            paint: function (imageData, x = 0, y = 0) {
                ctx.putImageData(imageData, x, y);
            }
        }
    }

    function setupScreen(dcl, width, height, keepSquare, gridScale, parent, positioning) {
        function setCanvasSize(canvas, width, height, keepSquare) {
            canvas.width = width || window.innerWidth;
            canvas.height = height || window.innerHeight;
            if (keepSquare) {
                if (canvas.width < canvas.height) {
                    canvas.height = canvas.width;
                } else {
                    canvas.width = canvas.height;
                }
            }
        }
        function setCanvasStyle(canvas, width, height, positioning) {
            canvas.style.padding = 0;
            
            // Set positioning based on configuration
            if (positioning === 'block' || positioning === 'contained') {
                // Position as block element within container
                canvas.style.position = 'static';
                canvas.style.display = 'block';
                canvas.style.margin = '0 auto';
                canvas.style.maxWidth = '100%';
                canvas.style.height = 'auto';
            } else {
                // Default absolute positioning (legacy behavior)
                canvas.style.margin = 'auto';
                canvas.style.position = 'absolute';
                canvas.style.top = 0;
                canvas.style.left = 0;
                canvas.style.right = 0;
                canvas.style.bottom = 0;
                canvas.style.width = width;
                canvas.style.height = height;
            }
        }
        function createGrid(gridScale, canvas) {
            var cols, rows;
            if (gridScale) {
                cols = Math.floor(canvas.width / gridScale);
                rows = Math.floor(canvas.height / gridScale);
            } else {
                cols = canvas.width;
                rows = canvas.height;
            }
            return { cols: cols, rows: rows };
        }    var canvas = document.createElement('canvas');
        canvas.id = 'space';
        setCanvasSize(canvas, width, height, keepSquare);
        var grid = createGrid(gridScale, canvas);
        setCanvasStyle(canvas, width, height, positioning);
        if (parent) {
            parent.appendChild(canvas);
        } else {
            document.body.appendChild(canvas);
        }
        dcl.renderContext = canvas.getContext('2d');
        dcl.screen = { width: canvas.width, height: canvas.height };
        MOUSE.pos = vector(width / 2, height / 2);
        document.addEventListener("keydown", (e) => {
            KEYB.keyPressed = e.which;
            KEYB.altPressed = e.altKey;
            KEYB.ctrlPressed = e.ctrlKey;
            KEYB.shiftPressed = e.shiftKey;
        });
        document.addEventListener("keyup", (e) => {
            KEYB.keyPressed = -1;
            KEYB.altPressed = false;
            KEYB.ctrlPressed = false;
            KEYB.shiftPressed = false;
        });
        canvas.addEventListener("mousemove", (e) => {
            MOUSE.pos = vector(e.offsetX, e.offsetY);
        });
        canvas.addEventListener("contextmenu", (e) => { e.preventDefault(); return false; });
        canvas.addEventListener("mousedown", (e) => {
            e.preventDefault();
            if (e.button === 0) {
                MOUSE.clickLeft = true;
                MOUSE.clickRight = false;
            } else if (e.button === 2) {
                MOUSE.clickLeft = false;
                MOUSE.clickRight = true;
            }
            return false;
        });
        canvas.addEventListener("mouseup", (ev) => {
            ev.preventDefault();
            MOUSE.reset();
            return false;
        });
        return {
            ctx: dcl.renderContext,
            width: canvas.width,
            height: canvas.height,
            cols: grid.cols,
            rows: grid.rows,
            setBgColor: function (color) {
                canvas.style.backgroundColor = color;
            },
            randomSpot: function () {
                return vector(Math.floor(Math.random() * grid.cols), Math.floor(Math.random() * grid.rows));
            }
        }
    }

    // Provide global fallback for getCtx and renderContext for legacy code
    function getCtx(ctx) {
        return ctx || (window.dcl && window.dcl.renderContext);
    }

    // Optionally, attach dcl to window/globalThis for legacy scripts
    function attachGlobals(dcl, constants = {}) {
        if (typeof globalThis !== "undefined") {
            globalThis.dcl = dcl;
            Object.entries(constants).forEach(([k, v]) => {
                globalThis[k] = v;
            });
        }
    }

    exports.setupRun = false;
    exports.playAnimation = true;

    function stopAnimation() {
        exports.playAnimation = false;
    }

    function startAnimation() {
        exports.playAnimation = true;
    }

    function animate(dcl, draw, clearEachFrame = true) {
        let last = 0;
        function frame(t) {
            let dt = (t - last) / 50;
            if (!exports.setupRun) {
                dcl.setup();
                exports.setupRun = true;
            }
            let render = dcl.draw || draw;
            if (render) {
                if (clearEachFrame) {
                    dcl.clear();
                }
                render(t, dt);
                last = t;
                if (exports.playAnimation) {
                    requestAnimationFrame(frame);
                }
            }
        }
        requestAnimationFrame(frame);
    }

    /**
     * Created by Espen on 03.03.2017.
     */


    const dcl = {};

    // init function to setup setup and draw methods from the global context of the user
    // Can accept either individual parameters or a single config object
    dcl.init = function (setup, draw, config) {
        // Handle different parameter patterns:
        // init(setup, draw, screenConfig)
        // init(setup, config) where config includes draw
        // init(config) where config includes setup and draw
        
        let screenOptions = null;
        
        // If first parameter is an object and no other params, treat it as full config
        if (typeof setup === 'object' && setup !== null && arguments.length === 1) {
            const fullConfig = setup;
            setup = fullConfig.setup;
            draw = fullConfig.draw;
            screenOptions = fullConfig.screen || fullConfig;
        }
        // If second parameter is an object and no third param, check if it's config with draw
        else if (typeof draw === 'object' && draw !== null && arguments.length === 2) {
            const configWithDraw = draw;
            if (configWithDraw.draw) {
                screenOptions = configWithDraw.screen || configWithDraw;
                draw = configWithDraw.draw;
            } else {
                screenOptions = configWithDraw;
                draw = undefined;
            }
        }
        // Standard three-parameter call
        else if (config && typeof config === 'object') {
            screenOptions = config;
        }

        // Set up the setup function
        if (typeof setup === 'function') {
            dcl.setup = setup;
        } else if (typeof window !== 'undefined' && typeof window.setup === 'function') {
            dcl.setup = window.setup;
        }

        // Set up the draw function
        if (typeof draw === 'function') {
            dcl.draw = draw;
        } else if (typeof window !== 'undefined' && typeof window.draw === 'function') {
            dcl.draw = window.draw;
        }    // Call setupScreen if options are provided
        if (screenOptions && typeof screenOptions === 'object') {
            dcl.screen = setupScreen(
                dcl, 
                screenOptions.width,
                screenOptions.height,
                screenOptions.keepSquare,
                screenOptions.gridScale,
                screenOptions.parent,
                screenOptions.positioning
            );
        }

        // Ensure the setup and draw methods are defined, provide no-op defaults
        if (typeof dcl.setup !== 'function') {
            dcl.setup = function() {}; // Default no-op setup
        }
        if (typeof dcl.draw !== 'function') {
            dcl.draw = function() {}; // Default no-op draw
        }
    };


    // Assign math and utility functions
    Object.assign(dcl, {
        floor, ceil, round, abs, sin, cos, tan, atan, atan2, pow, sqrt, min, max, log, exp,
        mod, clamp, fract, lerp, rad, trig: trig$1
    });

    // Core types and modules
    dcl.vector = vector;
    dcl.matrix = matrix;
    dcl.complex = complex;
    dcl.color = color;
    dcl.palette = palette;
    dcl.KEYB = KEYB;
    dcl.KEYS = KEYS;
    dcl.MOUSE = MOUSE;

    // Shapes and drawing
    dcl.rect = rect$1;
    dcl.circle = circle$1;
    dcl.line = line$1;
    dcl.fill = fill$1;
    dcl.stroke = stroke$1;
    dcl.text = text$1;
    dcl.getCtx = getCtx;

    // Sprite
    dcl.sprite = sprite;
    dcl.createSprite = createSprite;

    // Curve
    dcl.curve = curve;

    // Buffer/screen
    dcl.createBuffer = function(width, height) {
        return createBuffer(width, height, dcl);
    };

    dcl.setupScreen = function(width, height, keepSquare, gridScale, parent) {
        return setupScreen(dcl, width, height, keepSquare, gridScale, parent);
    };

    // Animation
    dcl.setupRun = exports.setupRun;
    dcl.playAnimation = exports.playAnimation;
    dcl.stopAnimation = stopAnimation;
    dcl.startAnimation = startAnimation;
    dcl.animate = function() { // Removed unused 't' parameter, corrected arguments to imported animate
        // The imported animate function from animation.js has signature:
        // animate(dclInstance, drawFunction, clearEachFrameOption)
        // It internally calls dclInstance.setup() and then (dclInstance.draw || drawFunction).
        animate(dcl, dcl.draw, dcl.clearEachFrame);
    };

    // Random
    dcl.random = function (min, max) {
        if (min === undefined) return Math.random();
        if (max === undefined) return Math.random() * min;
        return Math.random() * (max - min) + min;
    };
    dcl.randomi = function (min, max) {
        if (min === undefined) return Math.floor(Math.random()); // Should likely be 0 or 1, or error
        if (max === undefined) return Math.floor(Math.random() * min);
        return Math.floor(dcl.random(min, max));
    };

    // Clear
    dcl.clear = function (colorValue, ctx) {
        ctx = dcl.getCtx(ctx);
        if (!ctx) return;
        if (colorValue !== undefined) {
            let styleColor = colorValue;
            if (colorValue && typeof colorValue.isColor !== 'undefined' && colorValue.isColor) {
                styleColor = colorValue.toStyle();
            }
            ctx.fillStyle = styleColor;
            ctx.fillRect(0, 0, dcl.screen.width, dcl.screen.height);
        } else {
            ctx.clearRect(0, 0, dcl.screen.width, dcl.screen.height);
        }
    };

    // Constants
    dcl.const = {
        phi: (1 + Math.sqrt(5)) / 2,
        iphi: 2 / (1 + Math.sqrt(5)),
        pi: Math.PI,
        e: Math.E,
        r2: Math.sqrt(2),
        ir2: 1 / Math.sqrt(2)
    };

    // Math Constants to be exported/global
    const PI = Math.PI;
    const E = Math.E;
    const TAU = PI * 2;

    // Aliases for global/ES export
    const random = dcl.random;
    const randomi = dcl.randomi;
    const text = text$1; // Direct alias from shapes module
    const rect = rect$1;
    const circle = circle$1;
    const line = line$1;
    const fill = fill$1;
    const stroke = stroke$1;


    // Legacy/UMD/global for browser
    // These will be available on the window object
    attachGlobals(dcl, {
        // Colors
        RED, MAGENTA, YELLOW, GREEN, CYAN, BLUE, TRANS, BLACK, WHITE, GRAY,
        // Math constants
        PI, E, TAU,
        // Input
        KEYS, MOUSE, KEYB,
        // Core types/factories
        matrix, color, vector, palette, complex,
        // Math utils (already top-level imports)
        floor, ceil, round, abs, sin, cos, tan, atan, atan2, pow, sqrt, min, max, log, exp,
        mod, clamp, fract, lerp, rad, trig: trig$1,
        // Random functions (using aliases)
        random, randomi,
        // Sprite
        createSprite, sprite,
        // Modules (full objects)
        shapes, // The entire shapes module
        curve,  // The entire curve module
        // Buffer/Screen
        createBuffer, setupScreen,
        // Legacy
        getCtx,
        // Specific shape functions (using aliases)
        text, rect, circle, line, fill, stroke,
        // Animation functions (already top-level imports)
        setupRun: exports.setupRun, playAnimation: exports.playAnimation, stopAnimation, startAnimation, animate
    });

    exports.BLACK = BLACK;
    exports.BLUE = BLUE;
    exports.CYAN = CYAN;
    exports.E = E;
    exports.GRAY = GRAY;
    exports.GREEN = GREEN;
    exports.KEYB = KEYB;
    exports.KEYS = KEYS;
    exports.MAGENTA = MAGENTA;
    exports.MOUSE = MOUSE;
    exports.PI = PI;
    exports.RED = RED;
    exports.TAU = TAU;
    exports.TRANS = TRANS;
    exports.WHITE = WHITE;
    exports.YELLOW = YELLOW;
    exports.abs = abs;
    exports.animate = animate;
    exports.atan = atan;
    exports.atan2 = atan2;
    exports.ceil = ceil;
    exports.circle = circle;
    exports.clamp = clamp;
    exports.color = color;
    exports.complex = complex;
    exports.cos = cos;
    exports.createBuffer = createBuffer;
    exports.createSprite = createSprite;
    exports.curve = curve;
    exports.default = dcl;
    exports.exp = exp;
    exports.fill = fill;
    exports.floor = floor;
    exports.fract = fract;
    exports.getCtx = getCtx;
    exports.lerp = lerp;
    exports.line = line;
    exports.log = log;
    exports.matrix = matrix;
    exports.max = max;
    exports.min = min;
    exports.mod = mod;
    exports.palette = palette;
    exports.pow = pow;
    exports.rad = rad;
    exports.random = random;
    exports.randomi = randomi;
    exports.rect = rect;
    exports.round = round;
    exports.setupScreen = setupScreen;
    exports.shapes = shapes;
    exports.sin = sin;
    exports.sprite = sprite;
    exports.sqrt = sqrt;
    exports.startAnimation = startAnimation;
    exports.stopAnimation = stopAnimation;
    exports.stroke = stroke;
    exports.tan = tan;
    exports.text = text;
    exports.trig = trig$1;
    exports.vector = vector;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=dcl.js.map
