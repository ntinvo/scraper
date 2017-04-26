var express = require('express');
var rp = require('request-promise');
var cheerio = require('cheerio');
var router = express.Router();
var chalk = require('chalk');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});


/*######################################################################*/
/************************************************************************/
/*                                CSN                                   */
/************************************************************************/
/*######################################################################*/
/* GET songs with key words */
router.get('/csn/songs/:keyWords', function(req, res, next) {
    var results = [Object];
    rp('http://search.chiasenhac.vn/search.php?s=' + req.params.keyWords)
    .then(function (htmlString) {
        const $ = cheerio.load(htmlString);
        $('.tenbh').each(function(i, elem) {
            var link = '', title = '', artist = '';
            var isVideo = false;


            $(this).children('p').each(function(j, elem){
                if(j % 2 == 0) {
                    link = $(this).children('a').attr('href');
                    title = $(this).children('a').text();
                } else {
                    artist = $(this).text();
                }
            });

            if(link.indexOf('hd/video') != -1) {
                isVideo = true;
            }

            results[i] =  {
                link : link,
                title: title,
                artist: artist,
                isVideo: isVideo
            }
        });
        res.send(results);
    })
    .catch(function (err) {
        console.log(err);
    });
});

/* GET specific song with given url */
router.get('/csn/getSong/:url', function(req, res, next) {
    var results = [Object];
    rp(req.params.url)
    .then(function (htmlString) {
        var link = '', title = '', lyric = '';
        var artist = '', artistLinkSearch = '', artistImgUrl = '';
        var isVideo = false;
        const $ = cheerio.load(htmlString);
        var tokens = $('#csn_jplayer').next().text().split('\t');
        for (var i = 0; i < tokens.length; i++) {
            if(tokens[i].indexOf('title') != -1) {
                title = tokens[i].split('\"')[1];
            } else if(tokens[i].indexOf('http') != -1 && tokens[i].indexOf('csn') != -1) {
                link = tokens[i].split('\"')[1];
            }
        }
        $('#fulllyric .genmed').last().children('span').remove();
        artist = $('.genmed b a').first().text();
        artistLinkSearch = $('.genmed b a').first().attr('href');
        artistImgUrl = $('link[rel="image_src"]').attr('href');
        lyric = $('#fulllyric .genmed').last().text();
        lyric = lyric.substring(0, lyric.indexOf('<span')) + lyric.substring(lyric.indexOf('</span>'))
        console.log(lyric);
        results[0] = {
            title: title,
            link: link,
            artist: artist,
            artistLinkSearch: artistLinkSearch,
            artistImgUrl: artistImgUrl,
            lyric: lyric,
            isVideo : isVideo
        }
        res.send(results);
    })
    .catch(function (err) {
        console.log(err);
    });
});


/*######################################################################*/
/************************************************************************/
/*                                NCT                                   */
/************************************************************************/
/*######################################################################*/

/* GET a list songs with key words */
router.get('/nct/songs/:keyWords', function(req, res, next) {
    var results = [Object];
    rp('http://m.nhaccuatui.com/tim-kiem/bai-hat?q=' + req.params.keyWords)
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

/* GET specific song with given url */
router.get('/nct/getSong/:keyWords', function(req, res, next) {
    var results = [Object];
    rp(req.params.keyWords)
    .then(function (htmlString) {
        const $ = cheerio.load(htmlString);
        var link = $('.download p a').attr('href');
        var title = $('.player-song h2 img').attr('alt');
        var artist = $('.player-song p img').attr('alt');
        var lyric = $('.lyric').text();
        results[0] = {
            link: link,
            title: title,
            artist: artist,
            lyric: lyric
        }
        res.send(results);
    })
    .catch(function (err) {
        console.log(err);
    });
});

/* GET playlists with key words */
router.get('/nct/playlists/:keyWords', function(req, res, next) {
    var results = [Object];
    rp('http://m.nhaccuatui.com/tim-kiem/playlist?q=' + req.params.keyWords)
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

// /* GET  a specific playlist with keywords */
// router.get('/nct/getPlaylist/:keyWords', function(req, res, next) {
//     var results = [Object];
//     var options = {
//         uri: 'http://m.nhaccuatui.com/playlist/ba-cham-noo-phuoc-thinh.L63hxYdvXeuW.html?st=2',
//         resolveWithFullResponse: true
//     };
//     rp(options)
//     .then(function (response) {
//         // const $ = cheerio.load(htmlString);
//         // var link = $(this).attr('href');
//         // var title = $(this).attr('title');
//         // var imgURL = $(this).children('img').attr('src');
//         // results[i] =  {
//         //     link : link,
//         //     title: title,
//         //     imgURL: imgURL
//         // }
//         // console.log(chalk.blue('Hello world!'));
//         // console.log(chalk.blue.bgRed.bold($('#fullPlayer').html()));
//
//         res.send(response.body);
//     })
//     .catch(function (err) {
//         console.log(err);
//     });
// });


module.exports = router;


// http://data02.chiasenhac.com/stream/90/4/89567-ff63cd5c/128/Tim%20Em%20Trong%20Ky%20Uc%20-%20Noo%20Phuoc%20Thinh.mp3.csn
// http://data02.chiasenhac.com/downloads/90/4/89567-ff63cd5c/320/Tim%20Em%20Trong%20Ky%20Uc%20-%20Noo%20Phuoc%20Thinh%20[MP3%20320kbps].mp3
// http://data2.chiasenhac.com/stream/1613/4/1612439-93209522/32/Lien%20Khuc_%20Gia%20Vo%20Yeu_%20Say%20You%20Do%20-%20Ngo.m4a.csn
