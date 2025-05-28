// Buffer and screen setup tests
import { createBuffer, setupScreen } from '../src/buffer.js';
import { setupDOM, assert, assertEqual, runTests } from './test-utils.js';

const bufferTests = {
    'setup': () => {
        setupDOM();
    },
    
    'createBuffer creates canvas buffer': () => {
        const mockDcl = {
            clear: function() {}
        };
        
        const buffer = createBuffer(400, 300, mockDcl);
        
        assert(buffer !== undefined, 'Buffer should be created');
        assert(buffer.canvas !== undefined, 'Buffer should have canvas');
        assert(buffer.buffer !== undefined, 'Buffer should have 2D context');
        assert(typeof buffer.capture === 'function', 'Buffer should have capture function');
        assert(typeof buffer.clear === 'function', 'Buffer should have clear function');
        assert(typeof buffer.paint === 'function', 'Buffer should have paint function');
        
        assertEqual(buffer.canvas.width, 400);
        assertEqual(buffer.canvas.height, 300);
    },
    
    'setupScreen creates screen object': () => {
        const mockDcl = {
            renderContext: null,
            screen: null
        };
        
        const screen = setupScreen(mockDcl, 600, 400, false, 1, document.body, 'block');
        
        assert(screen !== undefined, 'Screen should be created');
        assert(screen.ctx !== undefined, 'Screen should have context');
        assertEqual(screen.width, 600);
        assertEqual(screen.height, 400);
        assert(typeof screen.setBgColor === 'function', 'Screen should have setBgColor function');
        assert(typeof screen.randomSpot === 'function', 'Screen should have randomSpot function');
    },
    
    'setupScreen with keepSquare option': () => {
        const mockDcl = {
            renderContext: null,
            screen: null
        };
        
        const screen = setupScreen(mockDcl, 600, 400, true, 1, document.body, 'block');
        
        // Should make canvas square (smaller dimension)
        assertEqual(screen.width, 400);
        assertEqual(screen.height, 400);
    },
    
    'setupScreen with gridScale': () => {
        const mockDcl = {
            renderContext: null,
            screen: null
        };
        
        const screen = setupScreen(mockDcl, 400, 300, false, 10, document.body, 'block');
        
        assertEqual(screen.cols, 40); // 400 / 10
        assertEqual(screen.rows, 30); // 300 / 10
    },
    
    'setupScreen creates canvas with proper positioning': () => {
        const mockDcl = {
            renderContext: null,
            screen: null
        };
        
        // Test block positioning
        setupScreen(mockDcl, 400, 300, false, 1, document.body, 'block');
        const canvas = document.getElementById('space');
        
        assert(canvas !== null, 'Canvas should be created');
        assertEqual(canvas.style.position, 'static');
        assertEqual(canvas.style.display, 'block');
        
        // Test absolute positioning (default)
        setupScreen(mockDcl, 400, 300, false, 1, document.body);
        const canvas2 = document.getElementById('space');
        assertEqual(canvas2.style.position, 'absolute');
    },
    
    'randomSpot returns valid coordinates': () => {
        const mockDcl = {
            renderContext: null,
            screen: null
        };
        
        const screen = setupScreen(mockDcl, 400, 300, false, 10, document.body, 'block');
        const spot = screen.randomSpot();
        
        assert(spot.x >= 0 && spot.x < 40, 'Random spot x should be in grid range');
        assert(spot.y >= 0 && spot.y < 30, 'Random spot y should be in grid range');
    }
};

export { bufferTests };

if (import.meta.url === `file://${process.argv[1]}`) {
    runTests(bufferTests, 'Buffer & Screen');
}
