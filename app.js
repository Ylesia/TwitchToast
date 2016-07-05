var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var uuid = require('node-uuid');
var fs = require('fs');
var Busboy = require('busboy');

var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scenes');

var extension = function(filename){
  if(!filename) filename = "";
  return filename.substr(filename.lastIndexOf('.')+1)
}

var checkFolder = function(path){
  var ok = false;
  try{
    ok = !fs.accessSync(path);
    return ok;
  }catch(e){
    return false;
  }
}

if(!checkFolder("public")){
  fs.mkdirSync("public");
}
if(!checkFolder("public/upload")){
  fs.mkdirSync("public/upload");
}

app
.use(express.static('./public')) // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)
.post("/api/upload", function(req, res){

  var busboy = new Busboy({ headers: req.headers });
  var path = "";
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    path = "/upload/"+uuid.v4()+"."+extension(filename);
    var saveTo = "public"+path;
    console.log("uploading to "+saveTo);
    file.pipe(fs.createWriteStream(saveTo));

  });
  busboy.on('finish', function() {
    if(path){
      res.send(JSON.stringify({path:path}), {'Content-Type': 'text/plain'}, 200);
    }else{
      res.send(JSON.stringify({err:"err"}), {'Content-Type': 'text/plain'}, 200);
    }
  });
  return req.pipe(busboy);
})
.use(function(req, res){ // Répond enfin
  res.send('Answer');
});

io.on('connection', function (socket) {
  // Test pour TitleReady
  socket.emit('newTitle', { text: 'Good Morning Zombies', timeout: 6 });
  socket.on('setNewTitle', function (data) {
    console.log(data);
    io.sockets.emit('newTitle', data);
  });
  socket.on('setData', function (data) {
    console.log("saving");
    console.log(data);
    data = JSON.stringify(data);
    localStorage.setItem("data", data);
  });
  socket.on('getData', function (data) {
    var data = localStorage.getItem("data");

    if(!data) data = [];
    else data = JSON.parse(data);

    socket.emit('data', data);
  });
});

io.listen(app.listen(8081));
