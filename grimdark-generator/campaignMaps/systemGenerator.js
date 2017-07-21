/****************************************************** 
    Generates a system of planets and sectors
    takes a name argument as saves it as name.json
    uses data from planet.json, sector.json to generate
    random values 

*******************************************************/
var png = require('../planets.js')
var fs = require('mz/fs')
var planetsJson = null
var planetDetails = null

var namesPromise = fs.readFile('../planets.json')
    .then(function(data) {
        console.log("read planets.json")
        planetsJson = JSON.parse(data)
    })
    .catch(function(err) {
        throw err;
    })

var detailsPromise = fs.readFile('./planetDetails.json')
    .then(function(data) {
        console.log("read planetDetails.json")
        planetDetails = JSON.parse(data)
    })
    .catch(function(err) {
        throw err;
    })

// When all relevant json files are loaded, begin generating
promises = [detailsPromise, namesPromise]
Promise.all(promises).then(function() {
    createSystem("systemName", 5)
})



function createSystem(systemName, numPlanets) {
    console.log("started system creation")
    var planetsObj = generatePlanets(numPlanets)
    planetsObj = addDetails(planetsObj)
}

function generatePlanets(numPlanets) {
    console.log("generating planet names")
    var planetsObj = {}
    while (Object.keys(planetsObj).length < numPlanets) {
        planetsObj[png.randomPlanet(planetsJson)] = []
    }
    console.log(planetsObj)
    return planetsObj
}

function addDetails(planetsObj) {
    var planetNames = Object.keys(planetsObj)
    console.log("adding planet details")

    for (i in planetNames) {
        planetName = planetNames[i]
        planetsObj[planetName]["type"] = randomChoice(planetDetails.types)
    }
    console.log(planetsObj)
    return planetsObj
}

function randomChoice(array) {
    return array[Math.floor(array.length * Math.random())];
}