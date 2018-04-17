// basic web server
'use strict';
var http = require('http');
var port = process.env.PORT || 1337;
var twitter = require('./calls');

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    twitter.call;
    res.end('Tweeter\n');
}).listen(port);
