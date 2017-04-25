var express = require('express');
var rp = require('request-promise');
var cheerio = require('cheerio');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

/* GET homepage with id */
router.get('/songs/:id', function(req, res, next) {
    var results = [Object];
    rp('http://m.nhaccuatui.com/tim-kiem/bai-hat?q=' + req.params.id)
    .then(function (htmlString) {
        const $ = cheerio.load(htmlString);
        $('.bgmusic h3 a').each(function(i, elem) {
            var link = $(this).attr('href');
            var title = $(this).attr('title')
            results[i] =  {
                link : link,
                title: title
            }
        });
        res.send(results);
    })
    .catch(function (err) {
        console.log(err);
    });


    // request('http://m.nhaccuatui.com/tim-kiem/bai-hat?q=' + req.params.id, function (error, response, body) {
    //     const $ = cheerio.load(body);
    //     $('.bgmusic h3 a').each(function(i, elem) {
    //         var link = $(this).attr('href');
    //         var title = $(this).attr('title')
    //         songs[i] =  {
    //             link : link,
    //             title: title
    //         }
    //     });
    //     res.send(results);
    // });
});

module.exports = router;
