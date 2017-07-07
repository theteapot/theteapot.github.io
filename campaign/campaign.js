var players = {
    "Ezekiel Fordworth": {
        "race": "Imperial Guard"
    },
    "Aluran": {
        "race": "Eldar"
    },
    "Grokomuk": {
        "race": "Ork"
    }
}

var planets = {
    "planets": [
        {
            "name": "Eliman IV", 
            "regions": [
                {
                    "name": "Red Mountain",
                    "owner": "Ezekiel Fordworth"
                },
                {
                    "name": "Farrow City",
                    "owner": "Aluran"
                }
            ]
        },
        {
            "name": "Foragal",
            "regions": [
                {
                    "name": "Glorom Marsh",
                    "owner": "Gromuk"
                },
                {
                    "name": "The Burrowlands",
                    "owner": "Unowned"
                }
            ]
        }
    ]
}

// Planets are html canvas elements in divs
// when you click on the planet a dialog pops up
// with regions

function createPlanets(planetsObj) {
    for (i in planetsObj.planets) {
        var planet = planetsObj.planets[i]
        var planetCanvas = $(document.createElement("canvas"))
        planetCanvas.attr("id", planet.name)
        planetCanvas.attr("width", 200)
        planetCanvas.attr("height", 200)

        var ctx = planetCanvas[0].getContext("2d")
        ctx.beginPath();
        ctx.arc(95,50,40,0,2*Math.PI);
        ctx.stroke();


        $("body").append(planetCanvas)
    }
}

$(document).ready(function() {
    createPlanets(planets)
})
