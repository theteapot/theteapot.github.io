function recieveUrl() {
    var url = document.URL;
    document.getElementById('url').innerHTML = url;
    var urlParams = parseUrl(url)
    console.log(urlParams)
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

function sendApiRequests(urlObj) {
    // Sends requests to spotify API
    var accesCode = urlObj.access_code
    
}

function requestListener() {
    console.log(this)
}