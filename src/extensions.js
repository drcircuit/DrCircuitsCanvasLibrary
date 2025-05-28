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

