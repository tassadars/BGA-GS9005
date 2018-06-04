var todoController = require('./controllers/todoController');
var connectController = require('./controllers/connectController');
var socketReadEvents = require('./events/socketRead.js');
//var converterController = require('./controllers/converterController');

// global variable
global.plcData = {};

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//static files
app.use(express.static('./public'));

//set up template engine
app.set('view engine', 'ejs');

//fire controllers
connectController(app);
socketReadEvents(io);
//todoController(app);
//converterController(app);

//listen to port
http.listen(3000, function (){
  console.log('You are listening to port 3000');
  console.log(connectController.stuff);
});

