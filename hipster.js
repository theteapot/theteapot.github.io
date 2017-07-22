
/*              Classes             */

class RequestFactory {
    constructor(accessToken) {
        this.accessToken = accessToken;
    }

    createRequest(endpoint, callback) {
        var request = new XMLHttpRequest();
        request.addEventListener(callback);
        request.open("GET", endpoint);
        request.setRequestHeader("Authorization", "Bearer " + this.accessToken);
        request.responseType = "json";
        request.send();
    }
}

/*          UI functions            */

function handleUrl() {
    // Check if access is due to redirect from spotify
    // if this is the case there will be url parameters
    var urlParams = parseUrl(document.URL)
    console.log(Object.keys(urlParams), urlParams.constructor)
    if (Object.keys(urlParams).length === 1 && urlParams.constructor === Object) { //check to see if url has no parameters
        console.log("Auth page")
        document.getElementById("beginPage").setAttribute("style", "visibility: visible");
        document.getElementById("landingPage").setAttribute("style", "visibility: hidden");
    } else {
        console.log("Landing page")
        requestApiObjects(urlParams.access_token);
        document.getElementById("beginPage").setAttribute("style", "visibility: hidden");
        document.getElementById("landingPage").setAttribute("style", "visibility: visible");
    }
}

/*          Data handling functions             */

function requestApiObjects(accessToken) {
    var responseObj = {};
    var requestFactory = new RequestFactory(accessToken);
    requestFactory.createRequest("/v1/me/player/recently-played", recentlyPlayed)
}

function recentlyPlayed(data) {
    console.log(JSON.stringify(data))
}


/*          Utility functions           */

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