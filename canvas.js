$(document).ready(function(){
    var canvas = $("#myCanvas")
    var context = canvas[0].getContext("2d")
    context.fillStyle = "#FF0000"
    context.fillRect(0,0,150,75)

    canvas[0].addEventListener("mousemove", function (e) {
        findxy("move", e)
    })
})