import { color } from './color.js';

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

export const palette = {
    fire,
    rainbow,
    gray,
    cga,
    ega,
    egadef
};

