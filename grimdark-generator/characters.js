var request = require("request")
var cheerio = require("cheerio")

function doRequest(requestUri) {
    request({
        uri: requestUri,
        }, function(error, response, body) {
            var characterArray = getCharactersFromHtml(body)
            var transitionMatrix = buildTransitionProbs(characterArray)
        })
}

function getCharactersFromHtml(body) {
    var $ = cheerio.load(body)
    var characterArray = []
    
    var body = cheerio.load($(".mw-content-ltr > table").html())
    
    body("a").each(function() {
        characterArray.push($(this).text())        
    })
    return characterArray
}

function buildTransitionProbs(characterArray) {
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
    name = generateRandomString(transitionMatrix, letterArray, 5)
    console.log(name)    
}

function generateRandomString(matrix, letters, length) {
    var startChar = 'a'
    var nameString = "a"
    while (nameString.length <= length) {
        var row = matrix[letters.indexOf(startChar)]
        
        var random = Math.random()
        var count = 0
        var index = 0
        while (count <= random) {
            count += row[index]
            index += 1
        }
        console.log(row, count, index)
        nameString += letters[index]
        startChar = letters[index]
    }

    // check the string for 3 or more consecutive consonants
    // insert two vowels between them
    return nameString
    
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


doRequest("http://wh40k.lexicanum.com/wiki/Category:Characters_(Dark_Eldar)")

