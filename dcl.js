/**
 * Created by Espen on 03.03.2017.
 */
const floor = Math.floor;
const ceil = Math.ceil;
const round = Math.round;
const abs = Math.abs;
const sin = Math.sin;
const cos = Math.cos;
const tan = Math.tan;
const atan = Math.atan;
const atan2 = Math.atan2;
const pow = Math.pow;
const sqrt = Math.sqrt;
const MOUSE = {
    pos: null,
    clickLeft: false,
    clickRight: false
}
const KEYB = {
    keyPressed: -1,
    ctrlPressed: false,
    altPressed: false,
    shiftPressed: false
}

MOUSE.reset = function(){
    MOUSE.clickLeft = false;
    MOUSE.clickRight = false;
}

var dcl = function () {

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

    function setCanvasStyle(canvas, width, height) {
        canvas.style.padding = 0;
        canvas.style.margin = 'auto';
        canvas.style.position = 'absolute';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.right = 0;
        canvas.style.bottom = 0;
        canvas.style.width = width;
        canvas.style.height = height;
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
    }

    return {
        setupScreen: function (width, height, keepSquare, gridScale, parent) {
            var canvas = document.createElement('canvas');
            canvas.id = 'space';
            setCanvasSize(canvas, width, height, keepSquare);
            var grid = createGrid(gridScale, canvas);
            setCanvasStyle(canvas, width, height);
            if (parent) {
                parent.appendChild(canvas);
            } else {
                document.body.appendChild(canvas);
            }
            dcl.renderContext = canvas.getContext('2d');
            dcl.screen = { width: canvas.width, height: canvas.height };
            MOUSE.pos = dcl.vector(width/2, height/2);
            document.addEventListener("keydown", (e)=>{
                KEYB.keyPressed = e.keyCode;
                KEYB.altPressed = e.altKey;
                KEYB.ctrlPressed = e.ctrlKey;
                KEYB.shiftPressed = e.shiftKey;
                //console.log(e.key);
            });
            document.addEventListener("keyup", (e)=>{
                KEYB.keyPressed = -1;
                KEYB.altPressed = false;
                KEYB.ctrlPressed = false;
                KEYB.shiftPressed = false;
                
            });
            canvas.addEventListener("mousemove", (e)=>{
                MOUSE.pos = dcl.vector(e.offsetX, e.offsetY);
            });
            canvas.addEventListener("contextmenu", ( e )=> { e.preventDefault(); return false; } );
            canvas.addEventListener("mousedown", (e)=>{
                e.preventDefault();
                if(e.button === 0){
                    MOUSE.clickLeft = true;
                    MOUSE.clickRight = false;
                } else if(e.button === 2){
                    MOUSE.clickLeft = false;
                    MOUSE.clickRight = true;
                }
                return false;
            });
            canvas.addEventListener("mouseup", (ev)=>{
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
                    return dcl.vector(Math.floor(Math.random() * grid.cols), Math.floor(Math.random() * grid.rows));
                }

            }
        }
    };
}();

dcl.const = {
    phi: (1 + Math.sqrt(5)) / 2,
    iphi: 2 / (1 + Math.sqrt(5)),
    pi: Math.PI,
    e: Math.E,
    r2: Math.sqrt(2),
    ir2: 1 / Math.sqrt(2)
};
dcl.rad = function (deg) {
    return deg * Math.PI / 180;
};
dcl.trig = function (deg) {
    var r = dcl.rad(deg);
    var c = cos(r);
    var s = sin(r);
    return {
        rad: r,
        cos: c,
        sin: s,
        transform: function (a, b) {
            return { a: a * c - b * s, b: a * s + b * c };
        }
    };
};
dcl.matrix = function (m) {
    m = m || [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
    return {
        m: m,
        isMatrix: true,
        mul: function (matrix) {
            let a = m;
            let b = matrix.m;
            let nm = [];
            for (let r = 0; r < a.length; r++) {
                let row = [];
                for (let c = 0; c < b[0].length; c++) {
                    let n = 0;
                    for (let br = 0; br < b.length; br++) {
                        n += a[r][br] * b[br][c];
                    }
                    row.push(n);
                }
                nm.push(row);
            }
            return dcl.matrix(nm);
        }
    };
}
dcl.matrix.rotation = {
    x: function (deg) {
        let theta = deg.toRadians();
        let m = dcl.matrix();
        m.m[0][0] = 1;
        m.m[1][1] = cos(theta);
        m.m[1][2] = -sin(theta);
        m.m[2][1] = sin(theta);
        m.m[2][2] = cos(theta);
        m.m[3][3] = 1;
        return m;
    },
    y: function (deg) {
        let theta = deg.toRadians();
        let m = dcl.matrix();
        m.m[0][0] = cos(theta);
        m.m[0][2] = sin(theta);
        m.m[1][1] = 1
        m.m[2][0] = -sin(theta);
        m.m[2][2] = cos(theta);
        m.m[3][3] = 1;
        return m;
    },
    z: function (deg) {
        let theta = deg.toRadians();
        let m = dcl.matrix();
        m.m[0][1] = -sin(theta);
        m.m[0][0] = cos(theta);
        m.m[1][0] = sin(theta);
        m.m[1][1] = cos(theta);
        m.m[2][2] = 1;
        m.m[3][3] = 1;
        return m;
    }
}
dcl.matrix.projection = function (fov, aspect, znear, zfar) {
    let fovrad = 1 / Math.tan((fov / 2).toRadians());
    let m = dcl.matrix();
    m.m[0][0] = aspect * fovrad;
    m.m[1][1] = fovrad;
    m.m[2][2] = zfar / (zfar - znear);
    m.m[3][2] = (-zfar * znear) / (zfar - znear);
    m.m[2][3] = 1;
    m.m[3][3] = 0;
    return m;
}
dcl.matrix.translation = function (x, y, z) {
    let m = dcl.matrix();
    m.m[3][0] = x;
    m.m[3][1] = y;
    m.m[3][2] = z;
    return m;
}

dcl.vector = function (x, y, z, w) {
    x = x || 0;
    y = y || 0;
    z = z || 0;
    w = w === undefined || w === null ? 1 : w;

    function magsqr() {
        return x * x + y * y + z * z + w * w;
    }

    function mag() {
        return Math.sqrt(magsqr());
    }

    return {
        x: x,
        y: y,
        z: z,
        w: w,
        collidesWith: function (vector, threshold) {
            return Math.abs(x - vector.x) <= threshold && Math.abs(y - vector.y) <= threshold && Math.abs(z - vector.z) <= threshold;
        },
        rotateX: function (angle) {
            var tv = dcl.trig(angle).transform(y, z);
            return dcl.vector(x, tv.a, tv.b);
        },
        rotateY: function (angle) {
            var tv = dcl.trig(angle).transform(x, z);
            return dcl.vector(tv.a, y, tv.b);
        },
        rotateZ: function (angle) {
            var tv = dcl.trig(angle).transform(x, y);
            return dcl.vector(tv.a, tv.b, z);
        },
        project: function (width, height, fov, distance) {
            var factor = fov / (distance + z);
            var nx = x * factor + width / 2;
            var ny = y * factor + height / 2;
            return dcl.vector(nx, ny, z, 0);
        },
        add: function (vx, vy, vz, vw) {
            if (vx.isVector) {
                return dcl.vector(x + vx.x, y + vx.y, z + vx.z, w + vx.w);
            }
            vx = vx || 0;
            vy = vy || 0;
            vz = vz || 0;
            vw = vw || 0;
            return dcl.vector(x + vx, y + vy, z + vz, w + vw);
        },
        sub: function (vx, vy, vz, vw) {
            if (vx.isVector) {
                return dcl.vector(x - vx.x, y - vx.y, z - vx.z, w - vx.w);
            }
            vx = vx || 0;
            vy = vy || 0;
            vz = vz || 0;
            vw = vw || 0;
            return dcl.vector(x - vx, y - vy, z - vz, w - vw);
        },
        smul: function (n) {
            n = n || 0;
            return dcl.vector(x * n, y * n, z * n, w * n);
        },
        div: function (n) {
            n = n || 1;
            return dcl.vector(x / n, y / n, z / n, w / n);
        },
        mul: function (vx, vy, vz, vw) {
            if (vx.isVector) {
                return dcl.vector(x * vx.x, y * vx.y, z * vx.z, w * vx.w);
            }
            vx = vx || 0;
            vy = vy || 0;
            vz = vz || 0;
            vw = vw || 0;
            return dcl.vector(x * vx, y * vy, z * vz, w * vw);
        },
        matrixmul: function (m) {
            let nx = x * m.m[0][0] + y * m.m[1][0] + z * m.m[2][0] + w * m.m[3][0];
            let ny = x * m.m[0][1] + y * m.m[1][1] + z * m.m[2][1] + w * m.m[3][1];
            let nz = x * m.m[0][2] + y * m.m[1][2] + z * m.m[2][2] + w * m.m[3][2];
            let nw = x * m.m[0][3] + y * m.m[1][3] + z * m.m[2][3] + w * m.m[3][3];
            return dcl.vector(nx, ny, nz, nw);
        },
        dot: function (v) {
            return x * v.x + y * v.y + z * v.z;
        },
        cross: function (v) {
            var vx = y * v.z - z * v.y;
            var vy = z * v.x - x * v.z;
            var vz = x * v.y - y * v.x;

            return dcl.vector(vx, vy, vz, 0);
        },
        mag: mag,
        dist: function (v) {
            var d = dcl.vector(x, y, z, w).sub(v);
            return d.mag();
        },
        norm: function () {
            return dcl.vector(x, y, z, w).div(mag());
        },
        floor: function () {
            return dcl.vector(floor(x), floor(y), floor(z), floor(w));
        },
        ceil: function () {
            return dcl.vector(ceil(x), ceil(y), ceil(z), ceil(w));
        },
        round: function () {
            return dcl.vector(round(x), round(y), round(z), round(w));
        },
        magsqr: magsqr,
        isVector: true
    };
}
dcl.clearEachFrame = true;
dcl.playAnimation = true;
dcl.stopAnimation = function () {
    dcl.playAnimation = false;
};
dcl.startAnimation = function () {
    dcl.playAnimation = true;
};
dcl.random = function (min, max) {
    return Math.random() * (max - min) + min;
};
dcl.randomi = function (min, max) {
    return Math.floor(dcl.random(min, max));
};
dcl.clear = function (ctx) {
    ctx = dcl.getCtx(ctx);
    ctx.clearRect(0, 0, dcl.screen.width, dcl.screen.height);
};
dcl.setupRun = false;

dcl.setup = function (){

}

dcl.reset = function(){
    dcl.setupRun = false;
    dcl.clear();
}

dcl.init = function(setup, draw){
    dcl.setup = setup;
    dcl.draw = draw;
}
let last = 0;
dcl.animate = function (t) {
    let dt = (t-last)/50;
    if(!dcl.setupRun){
        dcl.setup();
        dcl.setupRun = true;
    }
    var render = dcl.draw || draw;
    if (render) {
        if (dcl.clearEachFrame) {
            dcl.clear();
        }
        render(t, dt);
        last = t;
        if (dcl.playAnimation) {
            requestAnimationFrame(dcl.animate);
        }
    }
};
dcl.rect = function (x, y, width, height, color, lineWidth, lineColor, ctx) {
    ctx = dcl.getCtx(ctx);
    height = height || width;
    if (color.isColor) {
        color = color.toStyle();
    }
    if (lineColor && lineColor.isColor) {
        lineColor = lineColor.toStyle();
    }
    ctx.fillStyle = color || "blue";
    ctx.fillRect(x, y, width, height);
    if (lineWidth) {
        lineColor = lineColor || "#000088";
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(x, y, width, height);
    }
};
dcl.stroke = function (color, lineWidth, ctx) {
    color = color || "blue";
    if (color.isColor) {
        color = color.toStyle();
    }
    ctx = dcl.getCtx(ctx);
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = color || "#000088";
    ctx.stroke();
};
dcl.fill = function (color, ctx) {
    color = color || "blue";
    if (color.isColor) {
        color = color.toStyle();
    }
    ctx = dcl.getCtx(ctx);
    color = color || "blue";
    ctx.fillStyle = color;
    ctx.fill();
};
dcl.circle = function (x, y, radius, color, lineWidth, lineColor, ctx) {
    ctx = dcl.getCtx(ctx);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, dcl.rad(360));
    dcl.fill(color, ctx);
    if (lineWidth) {
        dcl.stroke(lineColor, lineWidth, ctx);
    }
    ctx.closePath();
};
dcl.line = function (x, y, dx, dy, lineWidth, lineColor, ctx) {
    ctx = dcl.getCtx(ctx);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(dx, dy);
    dcl.stroke(lineColor, lineWidth, ctx);
    ctx.closePath();
};
dcl.getCtx = function (ctx) {
    return ctx || dcl.renderContext;
};

dcl.text = function (text, x, y, color, font, size, maxWidth, align, ctx) {
    ctx = dcl.getCtx(ctx);
    align = align || "center";
    color = color || "blue";
    color = color.isColor ? color.toStyle() : color;
    let style = (size || 16) + "px " + (font || "Arial");
    ctx.font = style;
    ctx.textAlign = align;
    ctx.fillStyle = color;
    if (maxWidth) {
        ctx.fillText(text, x, y, maxWidth);
    } else {
        ctx.fillText(text, x, y);
    }
};

dcl.curve = {
    start: function (x, y, ctx) {
        ctx = dcl.getCtx(ctx);
        ctx.moveTo(x, y);
        ctx.beginPath();
    },
    end: function (ctx) {
        dcl.getCtx(ctx).closePath();
    },
    vertex: function (x, y, ctx) {
        dcl.getCtx(ctx).lineTo(x, y);
    },
    fill: function (color, ctx) {
        ctx = dcl.getCtx(ctx);
        dcl.fill(color, ctx);
    },
    stroke: function (color, width, ctx) {
        ctx = dcl.getCtx(ctx);
        dcl.stroke(color, width, ctx);
    },
    plot: function (points, lineColor, lineWidth, fillColor) {
        if (!points.forEach) {
            console.error("Error! you must supply an array with coordinates as an argument to this function.");
            return;
        }
        points.forEach(function (p, i, a) {
            if (i === 0) {
                dcl.curve.start(p.x, p.y);
            } else if (i === a.length - 1) {
                dcl.curve.vertex(p.x, p.y);                
                dcl.curve.end();
                dcl.curve.stroke(lineColor, lineWidth);
                if(fillColor){
                    dcl.curve.fill(fillColor);
                }
            } else {
                dcl.curve.vertex(p.x, p.y);
            }
        });
    }
};

dcl.color = function (red, green, blue, alpha = 1.0) {
    return {
        r: floor(red),
        g: floor(green),
        b: floor(blue),
        a: alpha,
        toStyle: function () {
            return "rgba(" + red + "," + green + "," + blue + "," + alpha.toFixed(2) + ")";
        },
        isColor: true
    };
}
dcl.color.hue2rgb = function (p, q, t) {
    console.log(p, q, t);
    if (t < 0) {
        t += 1;
    }
    if (t > 1) {
        t -= 1;
    }
    if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
    }
    if (t < 1 / 2) {
        return q;
    }
    if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
};
dcl.color.fromHSL = function (h, s, l) {
    let r = 0, g = 0, b = 0;
    if (s === 0) {
        r = g = b = l;
    } else {
        let hp = h / 60;
        let c = (1 - Math.abs(2 * l - 1)) * s;
        let x = c * (1 - Math.abs(hp % 2 - 1));

        if (hp >= 0 && hp <= 1) {
            r = c;
            g = x;
            b = 0;
        }
        if (hp > 1 && hp <= 2) {
            r = x;
            g = c;
            b = 0;
        }
        if (hp > 2 && hp <= 3) {
            r = 0;
            g = c;
            b = x;
        }
        if (hp > 3 && hp <= 4) {
            r = 0;
            g = x;
            b = c;
        }
        if (hp > 4 && hp <= 5) {
            r = x;
            g = 0;
            b = c;
        }
        if (hp > 5 && hp <= 6) {
            r = c;
            g = 0;
            b = x;
        }
        let m = l - c / 2;
        r = r + m;
        g = g + m;
        b = b + m;
    }
    return dcl.color(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));

}

dcl.color.fromHSB = function (hue, saturation, brightness) {
    hue = hue / 360;
    let r, g, b;
    if (brightness === 0) {
        r = g = b = brightness;
        console.log("Achron red ", r);
    } else {
        let q = brightness < 0.5 ? brightness * (1 + saturation) : brightness + saturation - brightness * saturation;
        let p = 2 * brightness - q;
        console.log(q, p, hue);
        r = dcl.color.hue2rgb(p, q, hue + 1 / 3);
        g = dcl.color.hue2rgb(p, q, hue);
        b = dcl.color.hue2rgb(p, q, hue - 1 / 3);
    }
    return dcl.color(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
}
// Helper Extensions
Number.prototype.toRadians = function () {
    return this.valueOf() * (Math.PI / 180);
};
Number.prototype.toDegrees = function () {
    return this.valueOf() * (180 / Math.PI);
};
Number.prototype.map = function (inputScaleMin, inputScaleMax, outputScaleMin, outputScaleMax) {
    return (this.valueOf() - inputScaleMin) * (outputScaleMax - outputScaleMin) / (inputScaleMax - inputScaleMin) + outputScaleMin;
};

dcl.image = function (img, x, y, w, h, scale = 1, ctx = null) {
    ctx = dcl.getCtx(ctx);
    if (img.isSprite) {
        let sx = img.pos.x;
        let sy = img.pos.y;
        let sw = img.width;
        let sh = img.height;
        let dx = x;
        let dy = y;
        let dw = w ? w * scale : img.width;
        let dh = h ? h * scale : img.height;
        ctx.drawImage(img.img, sx, sy, sw, sh, dx, dy, dw, dh);
    } else {
        ctx.drawImage(img, x, y, w * scale, h * scale);
    }

}
dcl.sprite = function (sheet, x, y, w, h) {
    return {
        isSprite: true,
        img: sheet,
        pos: dcl.vector(x, y),
        width: w,
        height: h
    };
}


dcl.palette = (function () {
    let fire = [];
    let gray = [];
    let rainbow = [];
    for (let i = 0; i < 256; i++) {
        gray.push(dcl.color(i, i, i));
    }
    for (let i = 0; i < 256; i++) {
        let l = i / 255;
        let h = i.map(0, 255, 0, 85); // 0 deg to 85 deg i HSL space is red to yellow
        fire.push(dcl.color.fromHSL(h, 1, l));
    }
    for (let i = 0; i < 256; i++) {
        let l = i / 255;
        let h = i.map(0, 255, 0, 360); // 0 deg to 85 deg i HSL space is red to yellow
        rainbow.push(dcl.color.fromHSL(h, 1, l));
    }
    return {
        fire: fire,
        rainbow: rainbow,
        gray: gray
    };
})();

const RED = dcl.color(255, 0, 0);
const MAGENTA = dcl.color(255, 0, 255);
const YELLOW = dcl.color(255, 255, 0);
const GREEN = dcl.color(0, 255, 0);
const CYAN = dcl.color(0, 255, 255);
const BLUE = dcl.color(0, 0, 255);
const TRANS = dcl.color(0, 0, 0, 0);
const BLACK = dcl.color(0, 0, 0);
const WHITE = dcl.color(255, 255, 255);
const GRAY = dcl.color(128, 128, 128);

const PI = Math.PI;
const E = Math.E;
const TAU = PI*2;

const KEYS = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32,
    CONTROL: 17,
    ALT: 18,
    SHIFT: 16,
    WIN: 91,
    WINCTX: 92,
    ESCAPE: 27,
    PIPE: 220,
    ONE: 49,
    TWO: 50,
    THREE: 51,
    FOUR: 52,
    FIVE: 53,
    SIX: 54,
    SEVEN: 55,
    EIGHT: 56,
    NINE: 57,
    ZERO: 48,
    BACKSLASH: 219,
    A: 65,
    S: 83,
    D: 68,
    F: 70,
    Q: 81,
    W: 87,
    E: 69,
    R: 82,
    Z: 90,
    X: 88,
    C: 67,
    V: 86,
    NONE: 97,
    NTWO: 98,
    NTHREE: 99,
    NFOUR: 100,
    NFIVE: 101,
    NSIX: 102,
    NSEVEN: 103,
    NEIGHT: 104,
    NNINE: 105,
    NZERO: 96,
    NMINUS: 109,
    NPLUS: 107,
    NSTAR: 108,
    NDIV: 111,
    NCOMMA: 110,
    ENTER: 13
}

dcl.complex = function (re, im) {
    return {
        re: re,
        im: im,
        isComplex: true,
        add: function (c) {
            if (!c.isComplex) {
                return dcl.complex(re + c, im);
            }
            return dcl.complex(re + c.re, im + c.im);
        },
        sub: function (c) {
            if (!c.isComplex) {
                return dcl.complex(re - c, im);
            }
            return dcl.complex(re - c.re, im - c.im);
        },
        mul: function (c) {
            if (!c.isComplex) {
                return dcl.complex(re * c, im * c);
            }
            return dcl.complex(re * c.re - im * c.im, re * c.im + im * c.re);
        },
        div: function (c) {
            if (c === 0) {
                return dcl.complex(Infinity, -Infinity);
            }
            if (!c.isComplex) {
                return dcl.complex(re / c, im / c);
            } else {
                let a = dcl.complex(re, im);
                let bcon = c.con();
                a = a.mul(bcon);
                let b = c.mul(bcon);
                return a.div(b.re);
            }
        },
        arg: Math.sqrt(re * re + im * im),
        con: function () {
            return dcl.complex(re, -im);
        }
    }
}

dcl.sprite = function (spriteSheet, pos, width, height) {
    let states = [];
    let buffer = document.createElement("canvas");
    buffer.width = spriteSheet.width;
    buffer.height = spriteSheet.height;
    let p = pos;
    let c = buffer.getContext("2d");
    c.drawImage(spriteSheet, 0, 0);

    function getBbox(sprite) {
        return { x: sprite.pos.x, y: sprite.pos.y, w: sprite.width, h: sprite.height };
    }


    function getPixel(x, y) {
        let pixel = c.getImageData(x, y, 1, 1).data;
        return pixel;
    }

    function boundingBoxCollision(a, b) {
        return ((a.x + a.width) >= b.x) &&
            (a.x <= (b.x + b.w)) &&
            ((a.y + a.height) >= b.height) &&
            (a.y <= (b.y + b.height));
    }

    return {
        add: function (state, x, y) {
            states[state] = {
                state: state,
                pos: dcl.vector(x, y)
            };
        },
        draw(state, ctx) {
            ctx = getCtx(ctx);
            let sprite = states[state];
            if (sprite) {
                ctx.drawImage(spriteSheet, sprite.pos.x, sprite.pos.y, width, height, p.x, p.y, width, height);
            }
        },
        pos: p,
        width: width,
        height: height,
        collidesWith: function (b) {
            return boundingBoxCollision({ x: p.x, y: p.y, w: width, h: height }, getBbos(b));
        }

    }
}

