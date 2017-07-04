/*        
    Scrapes names from wikias etc and writes it to 
    a JSON file    
*/


function doRequest(requestUri, callback(data)) {
    request({
        uri: requestUri,
        }, function(error, response, body) {
            var characterArray = getCharactersFromHtml(body)
            callback(characterArray)
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

doRequest("http://wh40k.lexicanum.com/wiki/Category:Characters_(Dark_Eldar)") 

