var m_snap7 = require('node-snap7');
var s7client = new snap7.S7Client();
var bConnected = false;

//connectToPLCSim();

setInterval(function () {
  if (!bConnected) {
    connectToPLC();
  };
  //console.log("Connected to PLC: " + bConnected);
  plcData["qualitySignal"] = bConnected;
  getInputs(0, 100);
  getOutputs(80, 90);
  //getInputsSim();
}, 500);

function connectToPLC() {
  // connect to S7-400
  console.log("Right before CALL s7client.ConnectTo function");
  s7client.ConnectTo('192.168.0.70', 0, 4, function (err) {
    if (err) {
      bConnected = false;
      return console.log(' >> Connection failed. Code #' + err + ' - ' + s7client.ErrorText(err));
    }
    bConnected = true;
  });
};

function getInputs(firstByte, numberOfBytes) {
  s7client.EBRead(firstByte, numberOfBytes, function (err, buffer) {
    if (err) {
      bConnected = false;
      return console.log(' >> EBRead failed. Code #' + err + ' - ' + s7client.ErrorText(err));
    }
    else {
      var bits = buffer.toJSON();
      // var bit0 = (bits.data[0] & 0x01)!=0;
      // console.log(parseInt(bits.data[0].toString(2), 2));
      // console.log(bits.data[0].toString(2).padStart(8, '0').split('').reverse());

      for (var i = firstByte; i < numberOfBytes; i++) {
        // fill global variable
        plcData["inputs"]["I" + i] = bits.data[i - firstByte].toString(2).padStart(8, '0').split('').reverse();
      };
    }
  });
};

function getOutputs(firstByte, numberOfBytes) {
  s7client.ABRead(firstByte, numberOfBytes, function (err, buffer) {
    if (err) {
      bConnected = false;
      return console.log(' >> ABRead failed. Code #' + err + ' - ' + s7client.ErrorText(err));
    }
    else {
      var bits = buffer.toJSON();
      for (var i = firstByte; i < numberOfBytes; i++) {
        // fill global variable
        plcData["outputs"]["Q" + i] = bits.data[i - firstByte].toString(2).padStart(8, '0').split('').reverse();
      };
    }
  });
};

function connectToPLCSim() {
  for (i = 0; i < 21; i++) {
    let b0 = (Math.random() > 0.5) ? 1 : 0;
    let b1 = (Math.random() > 0.5) ? 1 : 0;
    let b2 = (Math.random() > 0.5) ? 1 : 0;
    let b3 = (Math.random() > 0.5) ? 1 : 0;
    let b4 = (Math.random() > 0.5) ? 1 : 0;
    let b5 = (Math.random() > 0.5) ? 1 : 0;
    let b6 = (Math.random() > 0.5) ? 1 : 0;
    let b7 = (Math.random() > 0.5) ? 1 : 0;

    plcData["inputs"]["I" + i] = [b0, b1, b2, b3, b4, b5, b6, b7];
  }
}

function getInputsSim() {
  plcData["inputs"]["I" + Math.floor((Math.random() * 21))][Math.floor((Math.random() * 7))] = (Math.random() > 0.5) ? 1 : 0;
}

module.exports = function () {

};