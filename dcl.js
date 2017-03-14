/**
 * Created by Espen on 03.03.2017.
 */
var dcl    = {
    setupScreen: function (width, height, keepSquare, gridScale) {
        var canvas    = document.createElement('canvas');
        var cols, rows;
        canvas.id     = 'space';
        canvas.width  = width || window.innerWidth;
        canvas.height = height || window.innerHeight;
        if (keepSquare) {
            if (canvas.width < canvas.height) {
                canvas.height = canvas.width;
            } else {
                canvas.width = canvas.height;
            }
        }
        if (gridScale) {
            cols = Math.floor(canvas.width / gridScale);
            rows = Math.floor(canvas.height / gridScale);
        } else {
            cols = canvas.width;
            rows = canvas.height;
        }
        document.body.appendChild(canvas);

        return {
            ctx: canvas.getContext('2d'),
            width: canvas.width,
            height: canvas.height,
            cols: cols,
            rows: rows,
            setBgColor: function(color){
              canvas.style.backgroundColor = color;
            },
            randomSpot: function () {
                return vector.creteVector(Math.floor(Math.random() * cols), Math.floor(Math.random() * rows));
            }

        }
    },
};
var vector = {
    creteVector: function (x, y) {
        return {
            x: x,
            y: y,
            collidesWith: function (vector) {
                return x === vector.x & y === vector.y;
            }
        };
    }
};