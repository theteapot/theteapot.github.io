/*                        Global Vars                                        */
var scoreObj = {}

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

function handleUrl() {
    // Check if access is due to redirect from spotify
    // if this is the case there will be url parameters
    var urlParams = parseUrl(document.URL)
    console.log(Object.keys(urlParams), urlParams.constructor)
    if (Object.keys(urlParams).length === 1 && urlParams.constructor === Object) { //check to see if url has no parameters
        console.log("Auth page")
        document.getElementById("beginPage").setAttribute("style", "display: block");
        document.getElementById("landingPage").setAttribute("style", "display: none");
    } else {
        console.log("Landing page")
        requestApiObjects(urlParams.access_token);
        document.getElementById("beginPage").setAttribute("style", "display: none");
        document.getElementById("landingPage").setAttribute("style", "display: block");
    }
}

function authorizeApi() {
    // Redirects the user to spotify authorization page
    var authUrl = "https://accounts.spotify.com/authorize?client_id=e62d86020b9841e2bbc5c191b73c00ae&redirect_uri=https:%2F%2Ftheteapot.github.io%2Fhipster&scope=user-read-recently-played user-top-read user-follow-read user-library-read&response_type=token"
    window.location.assign(authUrl)
}

/*              UI functions            */

function addRangeInput(id, onchange) {
    // Add range slider and associated display
    // n.b. if elementId = artists then displayId = artistsDisplay
    var rangeDiv = document.createElement("div")
    var rangeInput = document.createElement("input");
    rangeInput.setAttribute("type", "range");
    rangeInput.setAttribute("value", "20")
    rangeInput.setAttribute("min", 0);
    rangeInput.setAttribute("onchange", "handleRangeChange(this)")
    rangeInput.setAttribute('step', 1)
    rangeInput.setAttribute("max", scoreObj[id].items.length);
    rangeInput.setAttribute('id', id)
    rangeInput.setAttribute("class", "rangeInput");

    var rangeLabel = document.createElement("label")
    rangeLabel.setAttribute("for", id)
    rangeLabel.setAttribute("class", "rangeLabel")
    rangeLabel.setAttribute("float", "left")
    rangeLabel.innerHTML = id;

    var rangeDisplay = document.createElement("em")
    rangeDisplay.setAttribute("id", id + "Display")
    rangeDisplay.setAttribute("float", "left")
    rangeDisplay.setAttribute("class", "rangeDisplay")
    rangeDisplay.innerHTML = "00"

    rangeDiv.appendChild(rangeLabel);
    rangeDiv.appendChild(rangeInput);
    rangeDiv.appendChild(rangeDisplay);

    document.getElementById("rangeInputs").appendChild(rangeDiv);
    
}

function handleRangeChange(element) {
    // Update the value in the display
    console.log("Got onchange event from %s", element.getAttribute('id'))
    var amount = element.value;
    var id = element.getAttribute("id")
    var displayNode = document.getElementById(id + "Display");
    displayNode.innerHTML = avgPopularity(id, amount)
    updateAggregate()
}

function updateAggregate() {
    // updates some large number to measure average hipsterness
    // get every score by looking for id's in scoreObj and getting the innerHtml from displays
    var aggSum = 0
    var nonZero = 0; // how many elements are numbers, not empty strings or 0
    for (var i = 0; i < Object.keys(scoreObj).length; i++) {
        var id = Object.keys(scoreObj)[i]
        var score = parseFloat(document.getElementById(id + "Display").innerHTML);
        (isNaN(score) || score === 0) ? 0 : (aggSum += score, nonZero += 1); // if score is a number, increase score and nonZero
    }
    aggSum = Math.round(aggSum / nonZero, 1)
    document.getElementById("aggregateScore").innerHTML = aggSum + "/100"
}

function addPopularityTable(objects, type) {
    // elements to consider based on type of object
    var tableData = {}
    switch (type) {
        case "albums":
            tableData.names = objects.map(obj => obj.name);
            tableData.artists = objects.map(obj => obj.artists[0].name);
            tableData.popularity = objects.map(obj => obj.popularity)

        case "tracks":
            tableData.names = objects.map(obj => obj.name);
            tableData.artists = objects.map(obj => obj.artists[0].name);
            tableData.popularity = objects.map(obj => obj.popularity)

        case "artist":
            tableData.names = objects.map(obj => obj.name);
            tableData.popularity = objects.map(obj => obj.popularity)
            tableData.followers = objects.map(obj => obj.followers.total)
        
        case "recently-played":
            tableData.name = objects.map(obj => obj.track.name)
            tableData.artist = objects.map(obj => obj.track.artists[0].name)
            tableData.popularity = objects.map(obj => obj.track.popularity)
    }
    console.log("Popularity data %s", JSON.stringify(tableData))
}

/*          Data handling functions             */

function requestApiObjects(accessToken) {
    var requestFactory = new RequestFactory(accessToken);

    requestFactory.createRequest("https://api.spotify.com/v1/me/player/recently-played", {"limit":"50"}, recieveResponse).send();
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


    //Different responses have different structures, must enusre array of objects with 'popularity' property
    var popularityItems = [];
    switch (name) {
        case "artists":
        case "tracks":
            popularityItems = response.items
            break;
        case "recently-played":
            for (var i = 0; i < response.items.length; i++) {
                var element = response.items[i].track;
                popularityItems.push(element)
            }
            break;
        case "albums":
            for (var i = 0; i < response.items.length; i++) {
                var element = response.items[i].album;
                popularityItems.push(element)
            }
            break;
        default:
            console.log("did not recognise name %s", name);
            break;
    }

    if (Object.keys(scoreObj).indexOf(name) === -1) { // sees if the entry exists in the score object
        scoreObj[name] = {"score": 0, "items": popularityItems}
    } else {
        scoreObj[name].items = popularityItems;
    }
    // sort the data in order of popularity
    scoreObj[name].items = popularityObjectSort(scoreObj[name].items, "popularity")
    // once the data is loaded add the range slider to control amount considered in averages
    addRangeInput(name, handleRangeChange) 
    // create a table highlighting popular/unpopular items
    addPopularityTable(getTopElements("asc", 3, name), name);

    console.log("Updated score obj %s", JSON.stringify(scoreObj))
}

function avgPopularity(id, amount) {
    //Returns the average popularity rounded to 1dp
    var items = scoreObj[id].items;
    var avgPop = 0
    for (var i = 0; i < amount; i++) {
        avgPop += items[i].popularity;
    }
    avgPop = Math.round(avgPop / amount, 1)
    avgPop = isNaN(avgPop) ? 0 : avgPop
    avgPop = String("0" + avgPop).slice(-2); //return 01 instead of 1, etc.
    return avgPop
}

function getTopElements(order, amount, id) {
    var objects = scoreObj[id].items;
    if (order === "asc") {
        return objects.slice(0, amount)
    } else if (order === "desc") {
        return objects.slice(amount * -1)
    } else {
        throw Error;
    }

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

function stringToColor(string) {
    var color = hashCode(string)
    var maxColor = parseInt("0xFFFFFF", 16);
    var hexColor = (color % maxColor).toString(16);
    return hexColor
}

function hashCode(s){
      return s.split("").reduce(function(a,b){a=((a<<13)-a)+b.charCodeAt(0);return a&a},0);              
}

function popularityObjectSort(array, key) {
    return array.sort(function(a, b) {
        let x = a[key], y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
    })
}
