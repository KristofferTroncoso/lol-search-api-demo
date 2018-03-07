const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const request = require('request');
const apikey = require('./apikey');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index');
});

app.post('/', function(req, res) {
    var q = req.body.q;
    res.redirect('/' + q);
});

app.get('/:summonername', function(req, res) {
    var summonername = req.params.summonername;
    request('https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + summonername + '?api_key=' + apikey, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var summ = JSON.parse(body);
            request('https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/' + summ.id + '?api_key=' + apikey, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    var league = JSON.parse(body);
                    res.render('summoner', {summ: summ, league: league});
                } else {
                    res.send("summoner id not found");
                }
            });
        } else {
            res.send("summoner not found");
        }
    });
});

app.listen(process.env.PORT, function() {
    console.log('server started!');
});