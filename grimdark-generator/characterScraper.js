/*        
    Scrapes names from wikias etc and writes it to 
    a JSON file    
*/

var fs = require("fs")
var cheerio = require("cheerio")
var rp = require("request-promise-native")


function loadFile(fileName, callback) {
    fs.readFile(fileName, function (err, data) {
        if (err) {
            throw err;
        }
        callback(data)
    })
}

function getDarkEldar() {

    var promise1 = rp({uri: "http://wh40k.lexicanum.com/wiki/Category:Characters_(Dark_Eldar)",
        transform: function(body) {
            return cheerio.load(body);
        }}) 
        .then(function($) {
            var characterArray = []
            var body = cheerio.load($(".mw-content-ltr > table").html())
            
            body("a").each(function() {
                characterArray.push($(this).text())        
            })
            return characterArray
        })
        .catch(function (err) {
            console.log(err)
        });
    
    var promise2 = rp({uri: "http://wh40k.lexicanum.com/wiki/List_of_Archons",
        transform: function(body) {
            return cheerio.load(body)
        }})
        .then(function($) {
            var characterArray = []
            var body = cheerio.load()
        })
    
    promises = [promise1]
    
    Promise.all(promises).then(function() {
        var totalArray = []
        for (var result in arguments) {
            var totalArray = totalArray.concat(arguments[result][0])
        }
        writeCharacters("characters.json", "DarkEldar", totalArray)
    }, function(err) {
        console.log(err)
    })
    
}

function writeCharacters(fileName, raceName, characterArray) {

    loadFile(fileName, function(data) {
        var characterObj = JSON.parse(data);
        // write character names
        races = Object.keys(characterObj.race)
        // only write names that are not already there
        
        matricies = getLetterAndTransMatrix(characterArray)
        transitionMatrix = matricies[0]
        letterArray = matricies[1]
        lenRange = getMaxAndMinLength(characterArray)

        var oldNames = characterObj.race[raceName].names
        var newNames = oldNames
        for (i in characterArray) {
                if (newNames.indexOf(characterArray[i]) === -1) {
                    newNames.push(characterArray[i])
                    console.log("found new name", characterArray[i])
                }
            }

        if (races.indexOf(raceName) != -1) {
            console.log("found", raceName)
            characterObj.race[raceName] = {names: newNames, transitionMatrix: transitionMatrix, letterArray: letterArray, lengthRange: lenRange}
        }
        
        // create transition matrix
        

        // write file back to disk
        fs.writeFile(fileName, JSON.stringify(characterObj), function(err) {
            if (err) {
                console.log(err)
            }
            console.log("Wrote", fileName)
        } )
    });
};

//writeCharacters("characters.json", "SpaceMarines")
getDarkEldar()

function getLetterAndTransMatrix(characterArray) {
    // get all of the letters used
    letterArray = []
    for (i in characterArray) {
        var character = characterArray[i].toLowerCase()
        for (j in character) {
            if (/[()]/.test(character.charAt(j))) {
                break
            }
            if (letterArray.indexOf(character.charAt(j)) == -1) {
                letterArray.push(character.charAt(j))
            }
        }
    }

    // construct an nxn matrix for the transition probabilities

    var transitionMatrix = new Array(letterArray.length)
    for (i = 0; i < letterArray.length; i++) {
        transitionMatrix[i] = new Array(letterArray.length)
        for (j = 0; j < letterArray.length; j++) {
            transitionMatrix[i][j] = 0
        }
    }

    // iterate over all characters, recording transitions
    for (i in characterArray) {
        var character = characterArray[i].toLowerCase()

        for (j = 0; j < character.length-1; j++) {
            // skip ( or ) chars
            if (/[()]/.test(character.charAt(j)+character.charAt(j+1))) {
                break
            } 
     
            var source = letterArray.indexOf(character.charAt(j))
            var dest = letterArray.indexOf(character.charAt(j+1))
            transitionMatrix[source][dest] += 1
        }
    
    }

    transitionMatrix = normaliseMatrix(transitionMatrix)
    return [transitionMatrix, letterArray]
}

function normaliseMatrix(matrix) {
    // return the matrix but rows are expressed proportionally as fractions
    // n.b. each row must have the same length, and each column (but not eachother)
    // i.e. [2,0,6,1] becomes [2/9, 0, 6/9, 1/9]
    var x = matrix.length
    var y = matrix[0].length
    for (i = 0; i < x; i++) {
        var row = matrix[i]
        var rowTotal = 0
        for (j = 0; j < y; j++) {
            rowTotal += matrix[i][j]
        }
        for (j = 0; j < y; j++) {
            matrix[i][j] = matrix[i][j] / rowTotal
        }
    }
    return matrix
}

function getMaxAndMinLength(characterArray) {
    // returns the length of the shortest and longest names 
    var maxLen = 1      // using relativley safe defaults just in case
    var minLen = 15
    for (var i in characterArray) {
        if (characterArray[i].length > maxLen) {
            maxLen = characterArray[i].length
        } else if (characterArray[i].length < minLen) {
            minLen = characterArray[i].length
        }
    }
    return [maxLen, minLen]

}