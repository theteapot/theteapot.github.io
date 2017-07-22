
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

/*          Data handling functions             */

function requestApiObjects(accessToken) {
    var requestFactory = new RequestFactory(accessToken);

    requestFactory.createRequest("https://api.spotify.com/v1/me/player/recently-played", {"limit":"50"}, recentlyPlayed).send();
    requestFactory.createRequest("https://api.spotify.com/v1/me/top/artists", {"limit":"50"}, topArtists).send();
    requestFactory.createRequest("https://api.spotify.com/v1/me/top/tracks", {"limit":"50"}, topTracks).send();
    requestFactory.createRequest("https://api.spotify.com/v1/me/albums", {"limit": "50"}, savedAlbums).send()

}

function recentlyPlayed(param) {
    console.log(param)
    // Finds the average popularity of the most recently played tracks
    console.log(this.response)
    var response = this.response.items;
    var popSum = 0
    for (var index = 0; index < response.length; index++) {
        popSum += response[index].track.popularity;
    }
    popSum = popSum / response.length
    console.log("Recetly played popsum ", popSum)
}

function topArtists() {
    // Finds average popularity of their top artists
    var response = this.response.items;
    var popSum = 0
    for (var index = 0; index < responselength; index++) {
        popSum += response[index].artist.popularity;
    }
    popSum = popSum / data.items.length
    console.log("Top artist popsum ", popSum)
}

function topTracks() {
    // Finds average popularity of their top tracks
    var response = this.response.items;
    var popSum = 0
    for (var index = 0; index < responselength; index++) {
        popSum += response[index].track.popularity;
    }
    popSum = popSum / data.items.length
    console.log("Top track popsum ", popSum)
}

function savedAlbums() {
    // Finds average popularity of their saved albums
    var response = this.response.items;
    var popSum = 0
    for (var index = 0; index < responselength; index++) {
        popSum += response[index].album.popularity;
    }
    popSum = popSum / data.items.length
    console.log("Saved album popsum ", popSum)
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