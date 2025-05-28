import { vector } from './vector.js';
import { KEYB } from './keyboard.js';
import { MOUSE } from './mouse.js';

export function createBuffer(width, height, dcl) {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d");
    return {
        canvas: canvas,
        buffer: ctx,
        capture: function () {
            return ctx.getImageData(0, 0, width, height);
        },
        clear: function (color) {
            dcl.clear(color, ctx);
        },
        paint: function (imageData, x = 0, y = 0) {
            ctx.putImageData(imageData, x, y)
        }
    }
}

export function setupScreen(dcl, width, height, keepSquare, gridScale, parent, positioning) {
    function setCanvasSize(canvas, width, height, keepSquare) {
        canvas.width = width || window.innerWidth;
        canvas.height = height || window.innerHeight;
        if (keepSquare) {
            if (canvas.width < canvas.height) {
                canvas.height = canvas.width;
            } else {
                canvas.width = canvas.height;
            }
        }
    }
    function setCanvasStyle(canvas, width, height, positioning) {
        canvas.style.padding = 0;
        
        // Set positioning based on configuration
        if (positioning === 'block' || positioning === 'contained') {
            // Position as block element within container
            canvas.style.position = 'static';
            canvas.style.display = 'block';
            canvas.style.margin = '0 auto';
            canvas.style.maxWidth = '100%';
            canvas.style.height = 'auto';
        } else {
            // Default absolute positioning (legacy behavior)
            canvas.style.margin = 'auto';
            canvas.style.position = 'absolute';
            canvas.style.top = 0;
            canvas.style.left = 0;
            canvas.style.right = 0;
            canvas.style.bottom = 0;
            canvas.style.width = width;
            canvas.style.height = height;
        }
    }
    function createGrid(gridScale, canvas) {
        var cols, rows;
        if (gridScale) {
            cols = Math.floor(canvas.width / gridScale);
            rows = Math.floor(canvas.height / gridScale);
        } else {
            cols = canvas.width;
            rows = canvas.height;
        }
        return { cols: cols, rows: rows };
    }    var canvas = document.createElement('canvas');
    canvas.id = 'space';
    setCanvasSize(canvas, width, height, keepSquare);
    var grid = createGrid(gridScale, canvas);
    setCanvasStyle(canvas, width, height, positioning);
    if (parent) {
        parent.appendChild(canvas);
    } else {
        document.body.appendChild(canvas);
    }
    dcl.renderContext = canvas.getContext('2d');
    dcl.screen = { width: canvas.width, height: canvas.height };
    MOUSE.pos = vector(width / 2, height / 2);
    document.addEventListener("keydown", (e) => {
        KEYB.keyPressed = e.which;
        KEYB.altPressed = e.altKey;
        KEYB.ctrlPressed = e.ctrlKey;
        KEYB.shiftPressed = e.shiftKey;
    });
    document.addEventListener("keyup", (e) => {
        KEYB.keyPressed = -1;
        KEYB.altPressed = false;
        KEYB.ctrlPressed = false;
        KEYB.shiftPressed = false;
    });
    canvas.addEventListener("mousemove", (e) => {
        MOUSE.pos = vector(e.offsetX, e.offsetY);
    });
    canvas.addEventListener("contextmenu", (e) => { e.preventDefault(); return false; });
    canvas.addEventListener("mousedown", (e) => {
        e.preventDefault();
        if (e.button === 0) {
            MOUSE.clickLeft = true;
            MOUSE.clickRight = false;
        } else if (e.button === 2) {
            MOUSE.clickLeft = false;
            MOUSE.clickRight = true;
        }
        return false;
    });
    canvas.addEventListener("mouseup", (ev) => {
        ev.preventDefault();
        MOUSE.reset();
        return false;
    });
    return {
        ctx: dcl.renderContext,
        width: canvas.width,
        height: canvas.height,
        cols: grid.cols,
        rows: grid.rows,
        setBgColor: function (color) {
            canvas.style.backgroundColor = color;
        },
        randomSpot: function () {
            return vector(Math.floor(Math.random() * grid.cols), Math.floor(Math.random() * grid.rows));
        }
    }
}