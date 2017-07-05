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
    
}

$(document).ready(function() {
    $("#campaignBlocks").accordion({
        collapsible: true,
        active: false,
        heightStyle: "content",
        header: ".campaignBlock > h4"
    })

    // Player Block jQuery
    $(".playerBlock").accordion({
        collapsible: true,
        active: false,
        heightStyle: "content",
        header: ".name"
    })
    $("#addPlayerDialog").dialog({
        autoOpen: false
    })
    var raceTags = ["Space Marines", "Chaos Space Marines", "Tau", "Eldar", "Dark Eldar", "Imperial Guard", "Orks", "Tyrannids", "Necrons", "Sisters of Battle"];
    $("#raceInput").autocomplete({
        source: function( request, response ) {
            var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
            response( $.grep( raceTags, function( item ){
                return matcher.test( item );
            }) 
        );}
    });
    $("#submitPlayerDialog").button({
        label: "Done"
    })
    $("#submitPlayerDialog").click(function() {
        
    })
    $("#openAddPlayerButton").button({
        label: "Add player"
    })
    $("#openAddPlayerButton").click(function() {
        $("#addPlayerDialog").dialog("open")
    })

    // Map block jQuery
    $(".mapList").accordion({
        collapsible: true,
        active: false,
        heightStyle: "content",
        header: ".planet"
    })
    $(".map").accordion({
        collapsible: true,
        active: false,
        heightStyle: "content",
        header: ".mapName"
    })

    
})