
/*              Classes             */

class RequestFactory {
    constructor(accessToken) {
        this.accessToken = accessToken;
    }

    createRequest(endpoint, parameters, callback) {
        /* creates XMLHttpRequest object with certain parameters
         * endpoint = url string
         * callback = function that processes response
         * parameters = javascript object { parameter: value, ... , parameter: value}
         */ 

        var parameterString = ""; 
        for (var i = 0; i < Object.keys(parameters).length; i++) {
            var property = Object.keys(parameters)[i];
            var value = parameters[property];
            var string = "?" + property + "=" + value;
            parameterString += string;
        }

        var request = new XMLHttpRequest();
        request.addEventListener("load", callback);
        request.open("GET", endpoint + parameterString);
        request.setRequestHeader("Authorization", "Bearer " + this.accessToken);
        request.responseType = "json";
        return request;
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

function authorizeApi() {
    // Redirects the user to spotify authorization page
    var authUrl = "https://accounts.spotify.com/authorize?client_id=e62d86020b9841e2bbc5c191b73c00ae&redirect_uri=https:%2F%2Ftheteapot.github.io%2Fhipster&scope=user-read-recently-played user-top-read user-follow-read user-library-read&response_type=token"
    window.location.assign(authUrl)
}

function addRangeInput(id, onchange) {
    // Add range slider and associated display
    // n.b. if elementId = artists then displayId = artistsDisplay
    var rangeFragment = document.createDocumentFragment();
    var rangeInput = document.createElement("input");
    rangeInput.setAttribute("type", "range");
    rangeInput.setAttribute("value", "20")
    rangeInput.setAttribute("min", 0);
    rangeInput.setAttribute("onchange", "handleRangeChange(this")
    rangeInput.setAttribute('step', 1)
    rangeInput.setAttribute("max", scoreObj[id].items.length);
    rangeInput.setAttribute('id', id)

    var rangeDisplay = document.createElement("h2")
    rangeDisplay.setAttribute("id", id + "Display")

    rangeFragment.appendChild(rangeDisplay);
    rangeFragment.appendChild(rangeInput);

    document.getElementById("rangeInputs").appendChild(rangeFragment);
    
}

function handleRangeChange(element) {
    // Update the value in the display
    console.log(element)
    var amount = element.value;
    var id = element.getAttribute("id")
    var displayNode = document.getElementById(id + "Display");
    displayNode.innerHTML = avgPopularity(id, amount)
}

/*          Data handling functions             */

var scoreObj = {}

function requestApiObjects(accessToken) {
    var requestFactory = new RequestFactory(accessToken);

    //requestFactory.createRequest("https://api.spotify.com/v1/me/player/recently-played", {"limit":"50"}, recieveResponse).send();
    requestFactory.createRequest("https://api.spotify.com/v1/me/top/artists", {"limit":"50"}, recieveResponse).send();
    requestFactory.createRequest("https://api.spotify.com/v1/me/top/tracks", {"limit":"50"}, recieveResponse).send();
    requestFactory.createRequest("https://api.spotify.com/v1/me/albums", {"limit": "50"}, recieveResponse).send()

}

function recieveResponse() {
    // Takes the response and passes it to the appropriate part of scoreObj
    var response = this.response;
    console.log(response)
    // Finds the right category by looking at href
    var start = response.href.lastIndexOf("/") + 1
    var end = response.href.indexOf("?") !== -1 ? response.href.indexOf("?") : response.href.length - 1
    var name = response.href.slice(start, end)
    console.log("Recieved response %s", name)

    if (Object.keys(scoreObj).indexOf(name) === -1) { // sees if the entry exists in the score object
        scoreObj[name] = {"score": 0, "items": response.items}
    } else {
        scoreObj[name].items = response.items;
    }
    addRangeInput(name, handleRangeChange) // once the data is loaded add the range slider to control popularity
    console.log("Updated score obj %s", scoreObj)
}

function avgPopularity(id, amount) {
    var items = scoreObj[id].items;
    var avgPop = 0
    for (var i = 0; i < amount; i++) {
        sum += items[i].popularity;
    }
    avgPop = avgPop / amount
    return avgPop;
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