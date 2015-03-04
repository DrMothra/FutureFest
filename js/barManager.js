/**
 * Created by atg on 20/02/2015.
 */
//Creates and renders a number of bars

var barManager = (function() {
    //Default values
    var canvasList = [];
    var offColour = '#646432';
    var onColour = '#ffff0d';
    var numberBars = 11;
    var interGap = 20;
    var lineLength = 70;
    var lineWidth = 5;
    var barAngleDeg = 1.667;
    var startRot = -barAngleDeg * 6;
    var radius = 384;

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
            ctx.translate(canvas.width/2, radius);
            ctx.rotate(degreesToRads(startRot));

            //Draw first tick seperately
            ctx.strokeStyle = '#ff0000';
            ctx.beginPath();
            ctx.moveTo(canvas.xStart, -radius);
            ctx.lineTo(canvas.xStart, -radius + canvas.barLength + (canvas.barLength *0.2));
            //ctx.stroke();
            ctx.arc(canvas.xStart, -radius + canvas.barLength + (canvas.barLength *0.2), 5,0, Math.PI*2, false);
            ctx.stroke();
            ctx.closePath();
            ctx.rotate(degreesToRads(barAngleDeg));

            ctx.strokeStyle = offColour;
            for(var i=0; i<canvas.numBars; ++i) {
                if(i >= level) {
                    ctx.strokeStyle = onColour;
                }
                ctx.beginPath();
                //gap = i*canvas.interGap;
                ctx.moveTo(canvas.xStart, -radius);
                ctx.lineTo(canvas.xStart, -radius + canvas.barLength);
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