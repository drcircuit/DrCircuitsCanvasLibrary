# DrCircuitsCanvasLibrary - Testing Documentation

## Overview

This document describes the comprehensive testing framework implemented for the DrCircuitsCanvasLibrary JavaScript graphics library.

## Test Framework Architecture

### Core Components

1. **Custom Test Runner** (`tests/run-tests.js`)
   - Executes all test modules sequentially
   - Provides detailed reporting and performance metrics
   - Supports JSON output for CI/CD integration
   - Integrated coverage reporting with c8

2. **Test Utilities** (`tests/test-utils.js`)
   - Jest-compatible API (describe, test, expect)
   - DOM and Canvas mocking for Node.js environment
   - Mock function utilities for testing interactions
   - Custom assertions for graphics-specific testing

3. **Coverage Reporting**
   - Uses c8 (Istanbul-based) for code coverage
   - HTML, text, and JSON report formats
   - Configurable coverage thresholds
   - Integration with CI/CD pipelines

## Running Tests

### Basic Test Commands

```bash
# Run all tests with basic output
npm test

# Run tests with coverage reporting
npm run test:coverage

# Run tests with JSON output (CI-friendly)
npm run test:json

# Run tests in watch mode (with nodemon)
npm run test:watch

# Generate coverage report only
npm run test:coverage-report
```

### CI/CD Integration

```bash
# Run tests with coverage and JSON output for CI
npm run test:ci
```

## Test Structure

### Test Files

All test files are located in the `tests/` directory and follow the naming convention `*.test.js`:

- `animation.test.js` - Animation system tests
- `buffer.test.js` - Canvas buffer management tests
- `color.test.js` - Color manipulation and conversion tests
- `complex.test.js` - Complex number operations tests
- `curve.test.js` - Curve drawing and mathematical functions tests
- `dcl-core.test.js` - Core library initialization tests
- `extensions.test.js` - Library extension mechanism tests
- `integration.test.js` - Cross-module integration tests
- `keyboard.test.js` - Keyboard input handling tests
- `legacy.test.js` - Backward compatibility tests
- `math.test.js` - Mathematical utility function tests
- `matrix.test.js` - Matrix operations and transformations tests
- `mouse.test.js` - Mouse input and event handling tests
- `palette.test.js` - Color palette management tests
- `performance.test.js` - Performance benchmarks and optimization tests
- `shapes.test.js` - Basic shape drawing function tests
- `sprite.test.js` - Sprite rendering and management tests
- `vector.test.js` - Vector mathematics and operations tests

### Test Format

Tests use a Jest-compatible API:

```javascript
import { describe, test, expect } from './test-utils.js';
import { ModuleToTest } from '../src/module.js';

describe('Module Name', () => {
    test('should perform expected behavior', () => {
        const result = ModuleToTest.someFunction();
        expect(result).toBe(expectedValue);
    });
});
```

## Coverage Reporting

### Current Coverage Metrics

- **Statements**: 71.22% (995/1397)
- **Branches**: 90.07% (127/141) 
- **Functions**: 37.03% (50/135)
- **Lines**: 71.22% (995/1397)

### Coverage Thresholds

Current thresholds are set to realistic levels:
- Lines: 70%
- Functions: 35%
- Branches: 65%
- Statements: 70%

### Viewing Coverage Reports

1. **Text Report**: Displayed in terminal after running `npm run test:coverage`
2. **HTML Report**: Generated in `coverage/index.html` - open in browser for detailed view
3. **JSON Report**: Generated in `coverage/coverage-final.json` for CI integration

## CI/CD Integration

### GitHub Actions

The project includes a comprehensive GitHub Actions workflow (`.github/workflows/ci.yml`) that:

- Tests across multiple Node.js versions (18.x, 20.x, 22.x)
- Runs full test suite with coverage
- Generates JSON test results for integration
- Provides detailed reporting for pull requests

### Workflow Features

- **Multi-version Testing**: Ensures compatibility across Node.js versions
- **Coverage Integration**: Automatic coverage reporting
- **JSON Output**: Machine-readable results for CI tools
- **Artifact Storage**: Test results and coverage reports stored as artifacts

## Mock System

### Canvas Mocking

The test framework includes comprehensive Canvas API mocking:

```javascript
// Automatically provides mocked canvas and context
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
// ctx is fully mocked with all Canvas 2D API methods
```

### Mock Functions

Jest-compatible mock functions for testing interactions:

```javascript
import { jest } from './test-utils.js';

const mockFn = jest.fn();
mockFn('test');
expect(mockFn).toHaveBeenCalledWith('test');
```

## Performance Testing

### Benchmarking

The `performance.test.js` file includes:
- Function execution timing
- Memory usage analysis
- Graphics operation benchmarks
- Performance regression detection

### Metrics Tracked

- Test execution duration
- Individual test performance
- Memory allocation patterns
- Graphics rendering performance

## Best Practices

### Writing Tests

1. **Use descriptive test names** that explain the expected behavior
2. **Follow the AAA pattern**: Arrange, Act, Assert
3. **Mock external dependencies** to ensure test isolation
4. **Test edge cases and error conditions**
5. **Keep tests focused** on single behaviors

### Test Organization

1. **Group related tests** using describe blocks
2. **Use beforeEach** for common setup
3. **Avoid test interdependencies**
4. **Test public APIs** rather than implementation details

### Performance Considerations

1. **Minimize expensive operations** in test setup
2. **Use mocks** for slow external operations
3. **Profile test execution** to identify bottlenecks
4. **Parallelize independent tests** when possible

## Troubleshooting

### Common Issues

1. **Canvas API not available**: Tests automatically mock canvas - no browser required
2. **Module import errors**: Ensure proper ES6 module syntax
3. **Mock function issues**: Use the enhanced jest.fn() for full compatibility
4. **Coverage threshold failures**: Adjust thresholds in `.c8rc.json`

### Debug Mode

Run tests with additional debugging:
```bash
node tests/run-tests.js --debug
```

## Future Enhancements

### Planned Improvements

1. **Visual Regression Testing**: Compare graphics output across versions
2. **Browser Compatibility Testing**: Automated testing across browsers
3. **Property-Based Testing**: Generate test cases automatically
4. **Performance Regression Detection**: Alert on performance degradation
5. **Test Result Visualization**: Web dashboard for test metrics

### Coverage Goals

- Increase function coverage to 50%
- Maintain line coverage above 75%
- Add integration tests for complex workflows
- Implement visual testing for graphics output

---

*This testing framework provides comprehensive coverage and CI/CD integration for the DrCircuitsCanvasLibrary, ensuring code quality and reliability across all supported environments.*
