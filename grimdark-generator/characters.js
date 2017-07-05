
var charactersObj = null 
$.getJSON("./grimdark-generator/characters.json", function(json) {
    console.log("lodaded characters.json", json)
    charactersObj = json
})

function generateRandomString(raceName) {
    matrix = charactersObj.race[raceName].transitionMatrix;
    letters = charactersObj.race[raceName].letterArray;
    lengthRange = charactersObj.race[raceName].lengthRange;

    // Pick random letter to start string
    var startChar = letters[randomInt(0, letters.length)]
    var nameString = "a"

    // get a random length
    var length = 6
    console.log(length)

    while (nameString.length <= length) {
        var row = matrix[letters.indexOf(startChar)]
        var random = Math.random()
        var count = 0
        var index = 0
        while (count <= random) {
            count += row[index]
            index += 1
        }
        nameString += letters[index]
        startChar = letters[index]
    }

    // check the string for 3 or more consecutive consonants
    // insert two vowels between them
    return nameString
}

function randomInt(min, max) {
    var randInt = Number(Math.random().toString().slice(2))
    return randInt % (max - min) + min
}
