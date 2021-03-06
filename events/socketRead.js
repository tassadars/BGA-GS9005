var tickTac = 0;

setInterval(function () {
  tickTac++;
}, 300);

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

    socket.on('selectedPLCByClient', function (msg) {
      configData["status"] = msg;

      if (msg == "PLC disconnect") {        
        // need to 
        // clearInterval(checkInterval);
        // need to disconnect from current plc
      }
      else {
        // need to connect to plc and set update interval

      }

      console.log("Message from client: " + msg);
    });


    // send config data to the client (one time action)
    io.emit('configData', configData);

    clearInterval(checkInterval);
    checkInterval = setInterval(function () {
      io.emit('readDataFromPLC', plcData);    
      //console.log('current value from PLC plcData["inputs"].I1: ' + plcData["inputs"].I1 + ' timestamp: ' + new Date().getMilliseconds());
      //console.log('current value from PLC plcData["outputs"].Q81: ' + plcData["outputs"].Q81 + ' timestamp: ' + new Date().getMilliseconds());
      console.log("Quality of signal: " + plcData["qualitySignal"] + '; timestamp: ' + new Date().getSeconds() + ' ' + new Date().getMilliseconds());
    }, 300);

  });


}
