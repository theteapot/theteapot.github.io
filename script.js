function addInput(block) {

    // if there are any input elements in the div turn them into bullets
    var inputElements = $("#" + block + " input").each(function() {
        var inputString = $(this).val()
        $("#" + block + " ul").append("<li>" + inputString + "</li>")
        $(this).detach()
        
    })
    
    // create a new input element and put it and the button on the bottom
    var inputNode = document.createElement("input")
    inputNode.setAttribute("type", "text")
    console.log(inputNode)
    $("<input type='text'/>").appendTo($("#" + block))
    $("#" + block + " #addButton").insertAfter("#" + block + " input")
    
}

function addBlock() {
    // create the block element
    var frag = document.createDocumentFragment();
    $(".inputElement").each(function() {
        console.log($(this))
        frag.appendChild($(this)[0])
    })
    console.log(frag)
    $("#campaignBlocks")[0].appendChild(frag)
    // detatch the unorder lists from entry fields
    //$(".inputElement").detach()
}