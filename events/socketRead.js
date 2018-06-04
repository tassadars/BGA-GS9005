var tickTac = 0;

setInterval(function () {
  tickTac++;
}, 1000);

/**
 * Module dependencies.
 */
// var m_async = require('async');
// var m_snap7 = require('node-snap7');
// var m_crypto = require('crypto');
// var m_net = require('net');

/**
 * Socket.io event handling
 */
module.exports = function (io) {

  io.on('connection', function (socket) {
    
    var checkInterval;
    console.log('a user connected');

    socket.on('chat message', function (msg) {
      console.log('message: ' + msg);
    });

    socket.on('disconnect', function () {
      clearInterval(checkInterval);
      console.log('user disconnected');
    });

    clearInterval(checkInterval);
    checkInterval = setInterval(function () {
      io.emit('test1', plcData.I0);    
      console.log('current value from PLC plcData.I0: ' + plcData.I0 + ' timestamp: ' + new Date().getMilliseconds());
    }, 1000);

  });


}
