var express = require('express');
var app = express();

var opentok = require('opentok');
var key = 'XXXX'; // Replace with your API key  
var secret = 'XXXX'; // Replace with your API secret  
var openTok = new opentok.OpenTokSDK(key, secret);

var location = '127.0.0.1'; // use an IP or 'localhost'
var session = '';

var ConnectionInfo = function (sessionId, token) {
    var self = this;
    self.apiKey = key;
    self.sessionId = sessionId;
    self.token = token;
}

var getToken = function (sessionid) {
    console.log('creating token for session ' + sessionid);
    var token = openTok.generateToken({
        session_id: sessionid
    });
    console.log('token: ' + token);
    return new ConnectionInfo(sessionid, token);
}

app.configure(function () {
    app.use(express.static(__dirname + '/public'));
    app.use(express.logger('dev'));
    app.use(express.methodOverride());
});

app.get('/enter', function (req, res) {
    console.log('entered' + req);
    if (session === '') {
        console.log('creating session');
        openTok.createSession(location, function (result) {
            session = result;
            res.json(getToken(session));
        });
    } else {
        res.json(getToken(session));
    }
});
app.listen(8000);
console.log("App listening on port 8000");