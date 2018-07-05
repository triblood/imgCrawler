var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');
var rp = require('request-promise');


// http://imgur.com/gallery

var pageToVisit = "http://imgur.com/gallery";
console.log("Visiting page " + pageToVisit);
request(pageToVisit, function(error, response, body) {
   if(error) {
     console.log("Error: " + error);
   }
   // Check status code (200 is HTTP OK)
   console.log("Status code: " + response.statusCode);
   if(response.statusCode === 200) {
     // Parse the document body
     var $ = cheerio.load(body);
     console.log("Page title:  " + $('title').text());
    var x = 0;
     $('.cards .post').each(function(){
        console.log('- ' + $(this).find('.image-list-link img').attr('src'));
        var imgSrc = $(this).find('.image-list-link img').attr('src');

        var options = {
            uri: 'http:' + imgSrc,
            encoding : null
        };


        rp(options)
        .then(function(body){
            console.log(body instanceof Buffer);
            fs.writeFile('img/test'+x+'.jpg', body, {
                encoding : null
            }, function(err) {
        
                if (err)
                    throw err;
                console.log('It\'s saved!');
            });
            x = x + 1;
        })
        .catch(function (err) {
            // Crawling failed...
            console.log(err)
        });
 
     });
   }
});
