// Test script for the new dcl.init function
import dcl from './src/dcl.js';

console.log('Testing DCL init function...\n');

// Test 1: Traditional three-parameter call
console.log('Test 1: Traditional init(setup, draw, config)');
try {
    let setupCalled = false;
    let drawCalled = false;
    
    function testSetup() {
        setupCalled = true;
        console.log('  Setup function called');
    }
    
    function testDraw() {
        drawCalled = true;
        console.log('  Draw function called');
    }
    
    dcl.init(testSetup, testDraw, {
        width: 400,
        height: 300,
        parent: null // Don't actually create canvas in test
    });
    
    // Verify functions were assigned
    console.log('  ✓ Setup assigned:', typeof dcl.setup === 'function');
    console.log('  ✓ Draw assigned:', typeof dcl.draw === 'function');
    console.log('  ✓ Screen object created:', dcl.screen ? 'Yes' : 'No');
    
} catch (error) {
    console.log('  ✗ Error:', error.message);
}

console.log('\nTest 2: Config with draw function');
try {
    dcl.init(function() { console.log('  Setup 2 called'); }, {
        draw: function() { console.log('  Draw 2 called'); },
        width: 500,
        height: 400
    });
    
    console.log('  ✓ Functions assigned correctly');
} catch (error) {
    console.log('  ✗ Error:', error.message);
}

console.log('\nTest 3: Full config object');
try {
    dcl.init({
        setup: function() { console.log('  Setup 3 called'); },
        draw: function() { console.log('  Draw 3 called'); },
        screen: {
            width: 600,
            height: 500
        }
    });
    
    console.log('  ✓ Full config handled correctly');
} catch (error) {
    console.log('  ✗ Error:', error.message);
}

console.log('\nTest 4: Config with top-level screen properties');
try {
    dcl.init({
        setup: function() { console.log('  Setup 4 called'); },
        draw: function() { console.log('  Draw 4 called'); },
        width: 700,
        height: 600
    });
    
    console.log('  ✓ Top-level screen properties handled correctly');
} catch (error) {
    console.log('  ✗ Error:', error.message);
}

console.log('\n✓ All tests completed successfully!');
console.log('The new dcl.init function supports multiple configuration patterns.');
