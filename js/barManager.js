/**
 * Created by atg on 20/02/2015.
 */
//Creates and renders a number of bars

var barManager = (function() {
    //Default values
    var canvasList = [];
    var offColour = '#2a2a2a';
    var onColour = '#ff0000';
    var numberBars = 11;
    var interGap = 20;
    var lineLength = 100;
    var lineWidth = 7;

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
            canvasItem.xStart = 50;
            canvasItem.yStart = 50;
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
            var gap;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = offColour;
            for(var i=0; i<canvas.numBars; ++i) {
                if(i >= level) {
                    ctx.strokeStyle = onColour;
                }
                ctx.beginPath();
                gap = i*canvas.interGap;
                ctx.moveTo(canvas.xStart + gap, canvas.yStart);
                ctx.lineTo(canvas.xStart + gap, canvas.yStart + canvas.barLength);
                ctx.stroke();
                ctx.closePath();
            }
        }

    };
})();

function displayError(msg) {
    alert(msg);
}
