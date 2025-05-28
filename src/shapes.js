// All shape and drawing primitives for dcl

export function getCtx(ctx) {
    return ctx || (window.dcl && window.dcl.renderContext);
}

export function rect(x, y, width, height, color, lineWidth, lineColor, ctx, dcl) {
    ctx = getCtx(ctx, dcl);
    height = height || width;
    if (color && color.isColor) color = color.toStyle();
    if (lineColor && lineColor.isColor) lineColor = lineColor.toStyle();
    ctx.fillStyle = color || "blue";
    ctx.fillRect(x, y, width, height);
    if (lineWidth) {
        lineColor = lineColor || "#000088";
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(x, y, width, height);
    }
}

export function stroke(color, lineWidth, ctx, dcl) {
    color = color || "blue";
    if (color.isColor) color = color.toStyle();
    ctx = getCtx(ctx, dcl);
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = color || "#000088";
    ctx.stroke();
}

export function fill(color, ctx, dcl) {
    color = color || "blue";
    if (color.isColor) color = color.toStyle();
    ctx = getCtx(ctx, dcl);
    ctx.fillStyle = color;
    ctx.fill();
}

export function circle(x, y, radius, color, lineWidth, lineColor, ctx, dcl) {
    ctx = getCtx(ctx, dcl);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, (dcl ? dcl.rad(360) : Math.PI * 2));
    fill(color, ctx, dcl);
    if (lineWidth) {
        stroke(lineColor, lineWidth, ctx, dcl);
    }
    ctx.closePath();
}

export function line(x, y, dx, dy, lineWidth, lineColor, ctx, dcl) {
    ctx = getCtx(ctx, dcl);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(dx, dy);
    stroke(lineColor, lineWidth, ctx, dcl);
    ctx.closePath();
}

export function text(text, x, y, color, font, size, maxWidth, align, ctx, dcl) {
    ctx = getCtx(ctx, dcl);
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
}