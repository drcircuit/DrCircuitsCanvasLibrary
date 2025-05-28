import { floor, lerp } from './utils.js';

export function color(red, green, blue, alpha = 1.0) {
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
export const RED     = color(255, 0, 0);
export const MAGENTA = color(255, 0, 255);
export const YELLOW  = color(255, 255, 0);
export const GREEN   = color(0, 255, 0);
export const CYAN    = color(0, 255, 255);
export const BLUE    = color(0, 0, 255);
export const TRANS   = color(0, 0, 0, 0);
export const BLACK   = color(0, 0, 0);
export const WHITE   = color(255, 255, 255);
export const GRAY    = color(128, 128, 128);