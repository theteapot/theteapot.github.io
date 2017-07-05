
var fs = require("fs")
var cheerio = require("cheerio")
var rp = require("request-promise-native")

var promise2 = rp({uri: "http://wh40k.lexicanum.com/wiki/List_of_Archons",
        transform: function(body) {
            return cheerio.load(body)
        }})
        .then(function($) {
            var characterArray = []
            var body = cheerio.load($(""))
        })