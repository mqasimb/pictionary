var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var connectedUsers = 0;

io.on('connection', function(socket) {
    console.log('Connection Started');

    if(connectedUsers === 0) {
        socket.join('Drawer');
        socket.room = 'Drawer';
        connectedUsers++;
        io.to('Drawer').emit('message', 'You are the drawer!');
    }
    else {
        socket.join('Guesser');
        socket.room = 'Guesser';
        connectedUsers++;
        io.to('Guesser').emit('message', 'You are a Guesser');
    }
    
    socket.on('draw', function(position) {
        if(socket.room === 'Drawer') {
       socket.broadcast.to('Guesser').emit('draw', position); 
        }
    });
    
    socket.on('guess', function(guess) {
       io.emit('guess', guess); 
    });
    
    socket.on('disconnect', function() {
       connectedUsers--; 
    });
});

server.listen(process.env.PORT || 8080);