var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  db.close();
});

app.use(express.static('./public')) // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)
 .use(function(req, res){ // Répond enfin
     res.send('Hello');
});

io.on('connection', function (socket) {
  socket.emit('newTitle', { text: 'Title ready !', timeout: 5 });
  socket.on('setNewTitle', function (data) {
    console.log(data);
    io.sockets.emit('newTitle', data);
  });
});

io.listen(app.listen(8081));
