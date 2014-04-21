var express = require('express'),
        app = express(),
     server = require('http').createServer(app),
         io = require('socket.io').listen(server);

server.listen(8080);

app.use(function(req, res, next){
	  console.log('%s %s', req.method, req.url);
		next();
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	  res.sendfile(__dirname + '/templates/index.html');
});

app.get('/player-two', function(req, res){
	  res.sendfile(__dirname + '/templates/player-two.html');
});


io.sockets.on('connection', function (socket) {
	socket.on('player', function (data) {
		if(data === "two") {
			socket.join('player-two');
			socket.on('control', function (data) {
				io.sockets.in('player-one').emit('control', data);
			});
		}
		else {
			socket.join('one');
			socket.on('frame', function (data) {
				io.sockets.in('player-two').emit('frame', data);
			});
		}
	});
});
