function recieveUrl() {
    var url = document.URL;
    document.getElementById('url').innerHTML = url;
    var urlParams = parseUrl(url)
    getUserInformation(url)
}

function parseUrl(url) {
    var urlObj = {}
    // Assume params begin with #, seperated with &, assigned via =
    var start = url.indexOf("#");
    url = url.slice(start + 1).split("&")
    for (var i = 0; i < url.length; i++) {
        var element = url[i].split("=")
        urlObj[element[0]] = element[1]
    }
    console.log("Url object %s", urlObj)
    return urlObj;
}

function getUserInformation(urlObj) {
    // Gets information from spotifyAPI
    var request = new XMLHttpRequest()
    request.addEventListener("load", requestListener)
    request.open("GET", "https://api.spotify.com/v1/me/player/recently-played");
    request.setRequestHeader("Authorization", "Bearer " + urlObj.access_token)
    request.send();
}

function requestListener() {
    console.log(this)
}