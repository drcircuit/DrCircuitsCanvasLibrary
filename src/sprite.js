import { vector } from './vector.js';

export function createSprite(sheet, x, y, w, h) {
    return {
        isSprite: true,
        img: sheet,
        pos: vector(x, y),
        width: w,
        height: h
    };
}

export function sprite(spriteSheet, pos, width, height) {
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
                pos: vector(x, y)
            };
        },
        draw(state, ctx) {
            let sprite = states[state];
            if (sprite) {
                ctx.drawImage(spriteSheet, sprite.pos.x, sprite.pos.y, width, height, p.x, p.y, width, height);
            }
        },
        pos: p,
        width: width,
        height: height,
        collidesWith: function (b) {
            return boundingBoxCollision({ x: p.x, y: p.y, w: width, h: height }, getBbox(b));
        }
    };
}