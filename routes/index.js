var express = require('express');
var rp = require('request-promise');
var cheerio = require('cheerio');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

/* GET songs with key words */
router.get('/songs/:id', function(req, res, next) {
    var results = [Object];
    rp('http://m.nhaccuatui.com/tim-kiem/bai-hat?q=' + req.params.id)
    .then(function (htmlString) {
        const $ = cheerio.load(htmlString);
        $('.bgmusic h3').each(function(i, elem) {
            var link = $(this).children('a').attr('href');
            var title = $(this).children('a').attr('title');
            var artist = $(this).siblings('p').children('img').attr('alt');
            results[i] =  {
                link : link,
                title: title,
                artist: artist
            }
        });
        res.send(results);
    })
    .catch(function (err) {
        console.log(err);
    });
});

/* GET playlists with key words */
router.get('/playlists/:id', function(req, res, next) {
    var results = [Object];
    rp('http://m.nhaccuatui.com/tim-kiem/playlist?q=' + req.params.id)
    .then(function (htmlString) {
        const $ = cheerio.load(htmlString);
        var temp = Object;
        $('.img-40 a').each(function(i, elem) {
            var link = $(this).attr('href');
            var title = $(this).attr('title');
            var imgURL = $(this).children('img').attr('src');
            results[i] =  {
                link : link,
                title: title,
                imgURL: imgURL
            }
        });
        res.send(results);
    })
    .catch(function (err) {
        console.log(err);
    });
});

module.exports = router;
