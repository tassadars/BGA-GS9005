// global variable
global.plcData = {
  inputs: {},
  outputs: {},
  merkers: {},
  dbs: {},
  qualitySignal: false
};

var mainPageController = require('./controllers/mainPageController.js');
var plcCommunication = require('./controllers/plcCommunication.js');
var socketReadEvents = require('./events/socketRead.js');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//static files
app.use(express.static('./public'));

//set up template engine
app.set('view engine', 'ejs');

//fire controllers
mainPageController(app);
plcCommunication();
socketReadEvents(io);
//todoController(app);
//converterController(app);

//listen to port
http.listen(3000, function (){
  console.log('You are listening to port 3000');
});

