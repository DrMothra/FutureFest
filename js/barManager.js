/**
 * Created by atg on 20/02/2015.
 */
//Creates and renders a number of bars

var barManager = (function() {
    //Default values
    var canvasList = [];
    var offColour = '#2a2a2a';
    var onColour = '#ff0000';
    var numberBars = 12;
    var interGap = 20;
    var lineLength = 100;
    var lineWidth = 7;
    var barAngleDeg = 1.667;
    var startRot = -barAngleDeg * 6;
    var radius = 400;

    function degreesToRads(degrees) {
        return Math.PI/180 * degrees;
    }

    return {
        createBars: function(element) {
            //Create canvas
            if(!element) {
                displayError("No element for canvas!");
                return false;
            }
            var c = document.getElementById(element);
            if(!c) {
                displayError("Canvas element not found!");
                return false;
            }
            var ctx = c.getContext("2d");
            ctx.strokeStyle = offColour;
            ctx.lineWidth = lineWidth;
            var canvasItem = {};
            canvasItem.element = element;
            canvasItem.width = c.width;
            canvasItem.height = c.height;
            canvasItem.ctx = ctx;
            canvasItem.xStart = 0;
            canvasItem.yStart = -c.height;
            canvasItem.interGap = interGap;
            canvasItem.numBars = numberBars;
            canvasItem.barLength = lineLength;
            canvasItem.barWidth = lineWidth;
            canvasList.push(canvasItem);

            return true;
        },

        drawBars: function(barNumber, level) {
            if(barNumber >= canvasList.length) {
                displayError("Invalid canvas number");
                return;
            }
            //DEBUG
            level *= 10;

            var canvas = canvasList[barNumber];
            var ctx = canvas.ctx;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width/2, canvas.height + radius);
            ctx.rotate(degreesToRads(startRot));

            ctx.strokeStyle = offColour;
            for(var i=0; i<canvas.numBars; ++i) {
                if(i >= level) {
                    ctx.strokeStyle = onColour;
                }
                ctx.beginPath();
                //gap = i*canvas.interGap;
                ctx.moveTo(canvas.xStart, canvas.yStart - radius);
                ctx.lineTo(canvas.xStart, canvas.yStart  - radius + canvas.barLength);
                ctx.stroke();
                ctx.closePath();
                ctx.rotate(degreesToRads(barAngleDeg));
            }
            ctx.restore();
        }

    };
})();

function displayError(msg) {
    alert(msg);
}
