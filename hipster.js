function generateUrl(obj) {
    var scope = "";
    var checkNodes = document.querySelectorAll(".dataCheckbox");
    
    for (var index = 0; index < checkNodes.length; index++) {
        var node = checkNodes[index]
        if (node.checked) {
            scope += node.value + " "
        }
    }

    scope = scope.trim();

    var url = "https://accounts.spotify.com/authorize?client_id=e62d86020b9841e2bbc5c191b73c00ae" +
    "&redirect_uri=https:%2F%2Ftheteapot.github.io%2Fhipster&scope="+scope+"&response_type=token"
    console.log(url)

    window.location.assign(url)
  
}

function handleUrl() {
    // Check if access is due to redirect from spotify
    // if this is the case there will be url parameters
    var urlParams = parseUrl(document.URL)
    getUserInformation(urlParams)
}

function parseUrl(url) {
    // Turns url string into JSON object with parameters as keys
    // Assume params begin with #, seperated with &, assigned via =
    var urlObj = {}    
    var start = url.indexOf("#");
    url = url.slice(start + 1).split("&")
    for (var i = 0; i < url.length; i++) {
        var element = url[i].split("=")
        urlObj[element[0]] = element[1]
    }
    console.log("Url object %s", JSON.stringify(urlObj))
    return urlObj;
}