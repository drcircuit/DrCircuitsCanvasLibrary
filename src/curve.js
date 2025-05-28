import { getCtx, fill, stroke } from './shapes.js';

export const curve = {
    start: function (x, y, ctx) {
        ctx = getCtx(ctx);
        ctx.beginPath();
        ctx.moveTo(x, y);
    },
    end: function (ctx) {
        ctx = getCtx(ctx);
        ctx.closePath();
    },
    vertex: function (x, y, ctx) {
        ctx = getCtx(ctx);
        ctx.lineTo(x, y);
    },
    fill: function (color, ctx) {
        ctx = getCtx(ctx);
        fill(color, ctx);
    },
    stroke: function (color, width, ctx) {
        ctx = getCtx(ctx);
        stroke(color, width, ctx);
    },
    plot: function (points, lineColor, lineWidth, fillColor, ctx) {
        if (!points.forEach) {
            console.error("Error! you must supply an array with coordinates as an argument to this function.");
            return;
        }
        points.forEach((p, i, a) => {
            if (i === 0) {
                curve.start(p.x, p.y, ctx);
            } else if (i === a.length - 1) {
                curve.vertex(p.x, p.y, ctx);
                curve.end(ctx);
                curve.stroke(lineColor, lineWidth, ctx);
                if (fillColor) {
                    curve.fill(fillColor, ctx);
                }
            } else {
                curve.vertex(p.x, p.y, ctx);
            }
        });
    }
};