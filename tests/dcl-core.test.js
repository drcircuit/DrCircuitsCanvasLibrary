// DCL core functionality tests
import * as DCL from '../src/dcl.js';
import { setupDOM, assert, assertEqual, assertNotEqual, runTests } from './test-utils.js';

const dclTests = {
    'setup': () => {
        setupDOM();
    },
    
    'dcl object exists': () => {
        assert(DCL !== undefined, 'DCL object should exist');
        assert(typeof DCL === 'object', 'DCL should be an object');
    },
    
    'dcl has init function': () => {
        assert(typeof DCL.init === 'function', 'DCL should have init function');
    },
    
    'dcl init with setup and draw functions': () => {
        let setupCalled = false;
        let drawCalled = false;
        
        function setup() { setupCalled = true; }
        function draw() { drawCalled = true; }
        
        dcl.init(setup, draw, {
            width: 400,
            height: 300,
            parent: document.body
        });
        
        assert(dcl.setup === setup, 'Setup function should be assigned');
        assert(dcl.draw === draw, 'Draw function should be assigned');
        assert(dcl.screen !== undefined, 'Screen should be initialized');
    },
    
    'dcl init with config object': () => {
        function setup() {}
        function draw() {}
        
        dcl.init({
            setup: setup,
            draw: draw,
            width: 500,
            height: 400,
            positioning: 'block'
        });
        
        assert(dcl.setup === setup, 'Setup function should be assigned from config');
        assert(dcl.draw === draw, 'Draw function should be assigned from config');
        assert(dcl.screen !== undefined, 'Screen should be initialized');
    },
    
    'dcl random function': () => {
        const r1 = dcl.random();
        const r2 = dcl.random();
        assert(r1 >= 0 && r1 < 1, 'Random should return value between 0 and 1');
        assert(r2 >= 0 && r2 < 1, 'Random should return value between 0 and 1');
        
        const r3 = dcl.random(10);
        assert(r3 >= 0 && r3 < 10, 'Random with max should return value between 0 and max');
        
        const r4 = dcl.random(5, 15);
        assert(r4 >= 5 && r4 < 15, 'Random with min/max should return value in range');
    },
    
    'dcl randomi function': () => {
        const r1 = dcl.randomi(10);
        assert(Number.isInteger(r1), 'Randomi should return integer');
        assert(r1 >= 0 && r1 < 10, 'Randomi should return value in range');
        
        const r2 = dcl.randomi(5, 15);
        assert(Number.isInteger(r2), 'Randomi should return integer');
        assert(r2 >= 5 && r2 < 15, 'Randomi should return value in range');
    },
    
    'dcl has drawing functions': () => {
        assert(typeof dcl.rect === 'function', 'DCL should have rect function');
        assert(typeof dcl.circle === 'function', 'DCL should have circle function');
        assert(typeof dcl.line === 'function', 'DCL should have line function');
        assert(typeof dcl.clear === 'function', 'DCL should have clear function');
    },
    
    'dcl has utility functions': () => {
        assert(typeof dcl.vector === 'function', 'DCL should have vector function');
        assert(typeof dcl.color === 'function', 'DCL should have color function');
        assert(typeof dcl.matrix === 'function', 'DCL should have matrix function');
    },
    
    'dcl has math functions': () => {
        assert(typeof dcl.sin === 'function', 'DCL should have sin function');
        assert(typeof dcl.cos === 'function', 'DCL should have cos function');
        assert(typeof dcl.lerp === 'function', 'DCL should have lerp function');
        assert(typeof dcl.clamp === 'function', 'DCL should have clamp function');
    },
    
    'dcl has input objects': () => {
        assert(dcl.MOUSE !== undefined, 'DCL should have MOUSE object');
        assert(dcl.KEYB !== undefined, 'DCL should have KEYB object');
        assert(dcl.KEYS !== undefined, 'DCL should have KEYS object');
    },
    
    'dcl constants exist': () => {
        assert(dcl.const !== undefined, 'DCL should have constants object');
        assert(typeof dcl.const.pi === 'number', 'DCL should have pi constant');
        assert(typeof dcl.const.e === 'number', 'DCL should have e constant');
        assert(typeof dcl.const.phi === 'number', 'DCL should have phi constant');
    }
};

export { dclTests };

if (import.meta.url === `file://${process.argv[1]}`) {
    runTests(dclTests, 'DCL Core');
}
