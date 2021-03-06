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
    var startRot = -barAngleDeg * 5.5;
    var radius = 384;
    var textXOffset = 10;

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
            //Text styles
            ctx.fontFamily = '12px "eurostileregular"';
            //ctx.fontFamily = '12px bold "Arial"';
            //ctx.font = '12px Times';
            ctx.fillStyle = '#ffffff';
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

        drawBars: function(barNumber, level, text) {
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
            //Draw text seperately
            if(text.length >= 4) {
                ctx.save();
                ctx.rotate(degreesToRads(barAngleDeg*3.5));
                ctx.fillText(text, canvas.xStart-20, -radius + canvas.barLength + (canvas.barLength *0.2));
                ctx.restore();
            } else {
                ctx.fillText(text, canvas.xStart + textXOffset, -radius + canvas.barLength + (canvas.barLength *0.2));
            }

            ctx.closePath();
            ctx.rotate(degreesToRads(barAngleDeg));

            for(var i=0; i<canvas.numBars; ++i) {
                ctx.strokeStyle = offColour;
                if(level >= i) {
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