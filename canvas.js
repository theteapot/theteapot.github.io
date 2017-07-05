$(document).ready(function(){

    var canvas = $("#myCanvas");
    var context = canvas[0].getContext("2d");

    var canvasDrawMode = false;

    canvas.mousemove(function(e) {
        mouseX = e.pageX - $("#myCanvas").offset().left;
        mouseY = e.pageY - $("#myCanvas").offset().top;
        if (canvasDrawMode) {
            context.lineTo(mouseX, mouseY);
            context.stroke(); 
        }
    })

    canvas.mousedown(function(e) {
        mouseX = e.pageX - $("#myCanvas").offset().left;
        mouseY = e.pageY - $("#myCanvas").offset().top;
        context.moveTo(mouseX, mouseY);
        context.beginPath(); 
        canvasDrawMode = true;
    })   

    canvas.mouseup(function(e) {
        canvasDrawMode = false;
    })     

})

