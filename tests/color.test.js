// Color module tests
import { color, RED, GREEN, BLUE, BLACK, WHITE, CYAN, MAGENTA, YELLOW, TRANS, GRAY } from '../src/color.js';
import { assert, assertEqual, assertApproxEqual, runTests } from './test-utils.js';

const colorTests = {
    'color creation with RGB values': () => {
        const c = color(255, 128, 64);
        assertEqual(c.r, 255);
        assertEqual(c.g, 128);
        assertEqual(c.b, 64);
        assertEqual(c.a, 1.0); // default alpha
    },
    
    'color creation with RGBA values': () => {
        const c = color(255, 128, 64, 0.5);
        assertEqual(c.r, 255);
        assertEqual(c.g, 128);
        assertEqual(c.b, 64);
        assertEqual(c.a, 0.5);
    },
    
    'color has isColor property': () => {
        const c = color(255, 0, 0);
        assert(c.isColor === true, 'Color should have isColor property set to true');
    },
    
    'color toStyle method for RGB': () => {
        const c = color(255, 128, 64);
        const style = c.toStyle();
        assertEqual(style, 'rgba(255,128,64,1.00)');
    },
    
    'color toStyle method for RGBA': () => {
        const c = color(255, 128, 64, 0.5);
        const style = c.toStyle();
        assertEqual(style, 'rgba(255,128,64,0.50)');
    },
    
    'color.lerp interpolates between colors': () => {
        const c1 = color(0, 0, 0);
        const c2 = color(100, 200, 255);
        
        // Test at 25% interpolation
        const quarterInterp = c1.lerp(c2, 0.25);
        assertEqual(quarterInterp.r, 25);
        assertEqual(quarterInterp.g, 50);
        assertEqual(quarterInterp.b, 64);
        
        // Test at 50% interpolation
        const halfInterp = c1.lerp(c2, 0.5);
        assertEqual(halfInterp.r, 50);
        assertEqual(halfInterp.g, 100);
        assertEqual(halfInterp.b, 128);
        
        // Test at 75% interpolation
        const threeQuarterInterp = c1.lerp(c2, 0.75);
        assertEqual(threeQuarterInterp.r, 75);
        assertEqual(threeQuarterInterp.g, 150);
        assertEqual(threeQuarterInterp.b, 191);
    },
    
    'color.fromHSL creates color from HSL values': () => {
        // Red (hue 0)
        const red = color.fromHSL(0, 1.0, 0.5);
        assertEqual(red.r, 255);
        assertEqual(red.g, 0);
        assertEqual(red.b, 0);
        
        // Green (hue 120)
        const green = color.fromHSL(120, 1.0, 0.5);
        assertEqual(green.r, 0);
        assertEqual(green.g, 255);
        assertEqual(green.b, 0);
        
        // Blue (hue 240)
        const blue = color.fromHSL(240, 1.0, 0.5);
        assertEqual(blue.r, 0);
        assertEqual(blue.g, 0);
        assertEqual(blue.b, 255);
        
        // Gray (saturation 0)
        const gray = color.fromHSL(0, 0, 0.5);
        assertEqual(gray.r, 128);
        assertEqual(gray.g, 128);
        assertEqual(gray.b, 128);
        
        // Black (lightness 0)
        const black = color.fromHSL(0, 0, 0);
        assertEqual(black.r, 0);
        assertEqual(black.g, 0);
        assertEqual(black.b, 0);
        
        // White (lightness 1)
        const white = color.fromHSL(0, 0, 1);
        assertEqual(white.r, 255);
        assertEqual(white.g, 255);
        assertEqual(white.b, 255);
    },
    
    'color.fromHSB creates color from HSB values': () => {
        // Red (hue 0)
        const red = color.fromHSB(0, 1.0, 1.0);
        assertEqual(red.r, 255);
        assertEqual(red.g, 0);
        assertEqual(red.b, 0);
        
        // Green (hue 120)
        const green = color.fromHSB(120, 1.0, 1.0);
        assertEqual(green.r, 0);
        assertEqual(green.g, 255);
        assertEqual(green.b, 0);
        
        // Blue (hue 240)
        const blue = color.fromHSB(240, 1.0, 1.0);
        assertEqual(blue.r, 0);
        assertEqual(blue.g, 0);
        assertEqual(blue.b, 255);
        
        // Black (brightness 0)
        const black = color.fromHSB(0, 0, 0);
        assertEqual(black.r, 0);
        assertEqual(black.g, 0);
        assertEqual(black.b, 0);
    },
    
    'color.fromHex creates color from hex string': () => {
        // Test with # prefix
        const red = color.fromHex('#FF0000');
        assertEqual(red.r, 255);
        assertEqual(red.g, 0);
        assertEqual(red.b, 0);
        
        // Test without # prefix
        const green = color.fromHex('00FF00');
        assertEqual(green.r, 0);
        assertEqual(green.g, 255);
        assertEqual(green.b, 0);
        
        // Test shorthand hex (3 characters)
        const blue = color.fromHex('#00F');
        assertEqual(blue.r, 0);
        assertEqual(blue.g, 0);
        assertEqual(blue.b, 255);
        
        // Test for error on invalid format
        let errorThrown = false;
        try {
            color.fromHex('XYZ');
        } catch (e) {
            errorThrown = true;
            assert(e.message.includes('Invalid hex color format'), 'Should throw correct error message');
        }
        assert(errorThrown, 'Should throw error for invalid hex format');
    },
    
    'color hue2rgb helper function': () => {
        // Test specific cases
        assertApproxEqual(color.hue2rgb(0.1, 0.9, 0), 0.1, 0.001); // t < 0
        assertApproxEqual(color.hue2rgb(0.1, 0.9, 1.2), 0.1, 0.001); // t > 1
        assertApproxEqual(color.hue2rgb(0.1, 0.9, 0.1), 0.5, 0.001); // t < 1/6
        assertApproxEqual(color.hue2rgb(0.1, 0.9, 0.25), 0.9, 0.001); // t < 1/2
        assertApproxEqual(color.hue2rgb(0.1, 0.9, 0.6), 0.3, 0.001); // t < 2/3
        assertApproxEqual(color.hue2rgb(0.1, 0.9, 0.8), 0.1, 0.001); // t >= 2/3
    },
    
    'predefined color constants': () => {
        assertEqual(RED.r, 255);
        assertEqual(RED.g, 0);
        assertEqual(RED.b, 0);
        
        assertEqual(GREEN.r, 0);
        assertEqual(GREEN.g, 255);
        assertEqual(GREEN.b, 0);
        
        assertEqual(BLUE.r, 0);
        assertEqual(BLUE.g, 0);
        assertEqual(BLUE.b, 255);
        
        assertEqual(BLACK.r, 0);
        assertEqual(BLACK.g, 0);
        assertEqual(BLACK.b, 0);
        
        assertEqual(WHITE.r, 255);
        assertEqual(WHITE.g, 255);
        assertEqual(WHITE.b, 255);
        
        assertEqual(CYAN.r, 0);
        assertEqual(CYAN.g, 255);
        assertEqual(CYAN.b, 255);
        
        assertEqual(MAGENTA.r, 255);
        assertEqual(MAGENTA.g, 0);
        assertEqual(MAGENTA.b, 255);
        
        assertEqual(YELLOW.r, 255);
        assertEqual(YELLOW.g, 255);
        assertEqual(YELLOW.b, 0);
        
        assertEqual(GRAY.r, 128);
        assertEqual(GRAY.g, 128);
        assertEqual(GRAY.b, 128);
        
        assertEqual(TRANS.r, 0);
        assertEqual(TRANS.g, 0);
        assertEqual(TRANS.b, 0);
        assertEqual(TRANS.a, 0);
    },
    
    'color rounding on creation': () => {
        const c = color(100.7, 200.2, 150.5);
        assertEqual(c.r, 101); // rounds to nearest integer
        assertEqual(c.g, 200); // rounds to nearest integer
        assertEqual(c.b, 151); // rounds to nearest integer
    },
    
    'color copy creates new instance': () => {
        const c1 = color(255, 128, 64);
        const c2 = c1.copy();
        assertEqual(c2.r, 255);
        assertEqual(c2.g, 128);
        assertEqual(c2.b, 64);
        assert(c1 !== c2, 'Copy should create new instance');
    }
};

export { colorTests };

if (import.meta.url === `file://${process.argv[1]}`) {
    runTests(colorTests, 'Color');
}
