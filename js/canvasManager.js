/**
 * Created by DrTone on 03/03/2015.
 */
//Create and manage all canvases

var canvasManager = (function() {

    var canvasList = [];
    var canvas;
    var width = 130;
    var height = 100;
    var posStyle = 'fixed';

    return {
        createCanvas: function(id, top, left, rotate) {
            canvas = document.createElement('canvas');
            canvas.style.webkitTransform = 'rotate(' + rotate + 'deg)';
            canvas.id = id;
            canvas.width = width;
            canvas.height = height;
            canvas.style.position = posStyle;
            canvas.style.top = top + '%';
            canvas.style.left = left + '%';
            document.body.appendChild(canvas);
        }
    }
})();