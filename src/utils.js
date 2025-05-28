import './extensions.js'; // Ensure prototype extensions are loaded

export const floor = Math.floor;
export const ceil = Math.ceil;
export const round = Math.round;
export const abs = Math.abs;
export const sin = Math.sin;
export const cos = Math.cos;
export const tan = Math.tan;
export const atan = Math.atan;
export const atan2 = Math.atan2;
export const pow = Math.pow;
export const sqrt = Math.sqrt;
export const min = Math.min;
export const max = Math.max;
export const log = Math.log;
export const exp = Math.exp;

export const mod = (n, m) => n - floor(n / m) * m;
export const clamp = (n, mn, mx) => min(max(n, mn), mx);
export const fract = n => n - floor(n);
export const lerp = (a, b, t) => a + (b - a) * t;

export const rad = deg => deg.toRadians();

export function trig(deg) {
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