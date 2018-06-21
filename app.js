// global variable, send in cycle
global.plcData = {
  inputs: {},
  outputs: {},
  merkers: {},
  dbs: {},
  qualitySignal: false
};

// one time send variable
global.configData = {
  plcs: [],
  status: "PLC disconnect"
};

var mainPageController = require('./controllers/mainPageController.js');
var mapfieldPageController = require('./controllers/mapfieldPageController.js');

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
mapfieldPageController(app);
plcCommunication();
socketReadEvents(io);
//todoController(app);
//converterController(app);

//listen to port
http.listen(3000, function () {
  console.log('You are listening to port 3000');
});

