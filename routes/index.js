var express = require('express');
var request = require('request');
var cheerio = require('cheerio')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

/* GET homepage with id */
router.get('/:id', function(req, res, next) {
    var results = [Object];
    var songs = [Object];
    var playlists = [Object];
    request('http://m.nhaccuatui.com/tim-kiem/bai-hat?q=' + req.params.id, function (error, response, body) {
        const $ = cheerio.load(body);
        $('.bgmusic h3 a').each(function(i, elem) {
            var link = $(this).attr('href');
            var title = $(this).attr('title')
            songs[i] =  {
                link : link,
                title: title
            }
        });
        results = {
            'songs': songs,
            'playlists': playlists
        }
        res.send(results);
    });
});

module.exports = router;
