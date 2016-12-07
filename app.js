var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
//MongoDB
// var MongoClient = require('mongodb').MongoClient;
// var assert = require('assert')
// var url = 'mongodb://localhost:27017/test';
// //var url = 'mongodb://192.168.0.29:27017/test';
// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected correctly to server.");
//   db.close();
// });
// //FINMONGODB

// // TEST IMPORTS
// var MongoClient = require('mongodb').MongoClient;
// var assert = require('assert');
// var ObjectId = require('mongodb').ObjectID;
// var url = 'mongodb://localhost:27017/test';
//FIN TESTS IMPORTS

app.use(express.static('./public')) // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)
 .use(function(req, res){ // Répond enfin
     res.send('Hello');
});

io.on('connection', function (socket) {
  // Test pour TitleReady
  socket.emit('newTitle', { text: 'Bits #40 - 07/12/16', timeout: 6 });
  socket.on('setNewTitle', function (data) {
    console.log(data);
    io.sockets.emit('newTitle', data);
  });
});

io.listen(app.listen(8081));
