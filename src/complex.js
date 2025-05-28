import { atan2, pow, cos, sin, sqrt } from './utils.js';

export function complex(re, im) {
    let mod = sqrt(re * re + im * im);
    let arg = atan2(im, re);

    return {
        re: re,
        im: im,
        isComplex: true,
        add: function (c) {
            if (!c.isComplex) return complex(re + c, im);
            return complex(re + c.re, im + c.im);
        },
        sub: function (c) {
            if (!c.isComplex) return complex(re - c, im);
            return complex(re - c.re, im - c.im);
        },
        mul: function (c) {
            if (!c.isComplex) return complex(re * c, im * c);
            return complex(re * c.re - im * c.im, re * c.im + im * c.re);
        },
        div: function (c) {
            if (c === 0) return complex(Infinity, -Infinity);
            if (!c.isComplex) return complex(re / c, im / c);
            let a = complex(re, im);
            let bcon = c.con();
            a = a.mul(bcon);
            let b = c.mul(bcon);
            return a.div(b.re);
        },
        arg: arg,
        mod: mod,
        con: function () {
            return complex(re, -im);
        },
        pow: function (e) {
            let the = e * arg;
            let mode = pow(mod, e);
            let r = mode * cos(the);
            let i = mode * sin(the);
            return complex(r, i);
        }
    };
}