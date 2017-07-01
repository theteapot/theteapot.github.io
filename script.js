function addCampaign() {
    var campaignFragment = $("<div class=campaignElement></div>")

    campaignFragment.append($("<input type=number>Set map limit</input>"))
    campaignFragment.append($("<button type='button' onClick=addPlayer()>Add player</button>"))

    $("#campaignBlocks").append($(campaignFragment))
}

function addPlayer() {
    var playerFragment = $("<div class=playerElement></div>")
    playerFragment.append
}


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
    var frag = $("<div class='campaignBlock'></div>")
    var titleFrag = $("<h3></h3>")

    $(".inputElement").each(function() {

        // Put the title as the name field
        var name = $(this).attr("name")
        if (name == "Destination") {
            var destination = $(this).children("li").html()
            titleFrag.append(destination)
        }

        // Add elements
        frag.append("<em>"+$(this).attr("name")+"</em>")
        $(this).clone().attr("class", "campaignElement").appendTo(frag)
    })

    $(".inputBlock .inputElement li").each(function() {
        $(this).detach()
    })

    console.log(frag)
    $("#campaignBlocks").append(titleFrag)
    $("#campaignBlocks").append(frag)
    
    // Refresh the accordion so it sees new elements
    $("#campaignBlocks").accordion("refresh");
}
$(document).ready(function() {

    $("#campaignBlock").accordion({
        header: "h3",
        collapsible: true,
        active: false,
        autoHeight: true,
        autoActivate: true
    });

})

