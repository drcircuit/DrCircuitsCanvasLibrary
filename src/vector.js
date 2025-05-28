// src/vector.js

import { min, max, abs, floor, ceil, round, fract, cos, sin, lerp, rad } from './utils.js';

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

export { vector };