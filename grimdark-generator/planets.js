var cheerio = require("cheerio")
var fs = require("fs")

function loadFile(fileName, callback) {
    fs.readFile(fileName, function (err, data) {
        if (err) {
            throw err;
        }
        callback(data)
    })
}

function parseHtml(selector, data) {
    var planetObj = {"planetNames":[]}
    var $ = cheerio.load(data)
    $(selector).each(function() {
        planetObj.planetNames.push(($(this).text()))
    })
    return planetObj
}

function writeJSON(object, fileName) {
    fs.writeFile(fileName+".json", JSON.stringify(object), function(err) {
        if(err) {
            return console.log(err)
        }
        console.log("Wrote JSON object as: "+fileName+".json")
    })
}

function randomPlanet(planetObj) {
    //var planetObj = JSON.parse(jsonData)
    var length = planetObj.planetNames.length

    var planet1 = planetObj.planetNames[randomInt(0,length)]
    var planet2 = planetObj.planetNames[randomInt(0,length)]

    //select random substring of planet1 and planet2 and join them

    var subPlanet1 = planet1.slice(randomInt(1, planet1.length))
    var subPlanet2 = planet2.slice(randomInt(1, planet2.length))

    var correctedName = correctPlanetName(subPlanet1 + subPlanet2)
    return correctedName
}

function correctPlanetName(planetName) {

    // remove anything in parentheses (these are comments from the site)
    if ((planetName.indexOf("(")) != -1) {
        var openParen = planetName.indexOf("(")
        if (planetName.lastIndexOf(")") != -1) {
            var closeParen = planetName.lastIndexOf(")")
            planetName = planetName.substr(0,openParen) + planetName.substr(closeParen+1, planetName.length)
        } else {
            planetName = planetName.substr(0,openParen)
        }
    }

    planetName = planetName.toLowerCase();
    planetName = planetName.split(" ")
    var newPlanetName = []

    for (var i in planetName) {
        var str = planetName[i]
        //roman numeral matcher
        var patt = /^[ivx]*$/
        if (patt.test(str)) {
            newPlanetName.push(str.toUpperCase())
        } else {
            str = str.charAt(0).toUpperCase() + str.slice(1)
            if (str.length > 1) {
                newPlanetName.unshift(str)
            }
        }
    }

    return (newPlanetName.join(" "))

}

function randomInt(min, max) {
    var randInt = Number(Math.random().toString().slice(2))
    return randInt % (max - min) + min
}
/*loadFile("planets.json", function(data) {
    var planetName = randomPlanet(data)
    console.log(planetName)
})*/

module.exports = {
    randomPlanet: randomPlanet
}