var m_snap7 = require('node-snap7');
var s7client = new snap7.S7Client();
var bConnected = false;

fillPLCConnectionList();
//connectToPLCSim();

setInterval(function () {
  if (!bConnected) {
    connectToPLC();

    //console.log("set test bit");
    //setBitDataOfSelectedType(20.2, "EBWrite", false);
  };
  //console.log("Connected to PLC: " + bConnected);
  plcData["qualitySignal"] = bConnected;

  if (configData["status"] == "PLC disconnect") {
    s7client.Disconnect();
    bConnected = false;
    return 0;
  }  

  // s7-400 I=412, Q=401, M= 10002 Set these max values
  getDataOfSelectedType(00, 42, "inputs", "I", "EBRead");
  getDataOfSelectedType(00, 41, "outputs", "Q", "ABRead");
  getDataOfSelectedType(00, 12, "merkers", "M", "MBRead");

  //  getIOSim();

}, 500);

function connectToPLC() {

  // get index of selected plc in object array for taking params
  let index = configData["plcs"].findIndex( x => x.ip == configData["status"]);
  // if disconnect status exit from function
  if (index == -1) return 0;

  // connect to S7-300/400
  console.log("Right before CALL s7client.ConnectTo function");
  s7client.ConnectTo(configData["plcs"][index].ip, configData["plcs"][index].slot, configData["plcs"][index].rack, function (err) {
    if (err) {
      bConnected = false;
      return console.log(' >> Connection failed. Code #' + err + ' - ' + s7client.ErrorText(err));
    }
    bConnected = true;
  });
};

function setBitDataOfSelectedType(byteDotBitValue, funcName, bValue) {
  // parse number of bit to be modified
  try {
    var arrValue = byteDotBitValue.toString().split(".");
  }
  catch (error) {
    console.log('!Warning!: setBitDataOfSelectedType() got parameter of non exist function name!');
    return;
  }

  if (arrValue.length != 2 || arrValue[1] < 0 || arrValue[1] > 7) {
    console.log('!Warning!: setBitDataOfSelectedType() got parameter of non exist function name!');
    return;
  }
  var bitToChange = parseInt(arrValue[0]) * 8 + parseInt(arrValue[1]);

  // if true - set to 1
  if (bValue) {
    vBuffer = new Buffer([0x01]);
  // if false - set to 0
  } else {
    vBuffer = new Buffer([0x00]);
  }

  switch (funcName) {
    case "EBWrite":
      s7client.WriteArea(s7client.S7AreaPE, 0, bitToChange, 1, s7client.S7WLBit, vBuffer, pvtErrorFunc);
      break;

    case "ABWrite":
      s7client.WriteArea(s7client.S7AreaPA, 0, bitToChange, 1, s7client.S7WLBit, vBuffer, pvtErrorFunc);
      break;

    case "MBWrite":
      s7client.WriteArea(s7client.S7AreaMK, 0, bitToChange, 1, s7client.S7WLBit, vBuffer, pvtErrorFunc);
      break;

    default:
      console.log('!Warning!: setBitDataOfSelectedType() got parameter of non exist function name!');
      break;
  }

  function pvtErrorFunc(err) {
    if (err) {
      return console.log(' >> ' + funcName + ' failed. Code #' + err + ' - ' + s7client.ErrorText(err));
    }
  }
}

function getDataOfSelectedType(firstByte, numberOfBytes, sDataType, sLabel, funcName) {

  switch (funcName) {
    case "EBRead":
      s7client.EBRead(firstByte, numberOfBytes, pvtReadBufferFromPLC);
      break;

    case "ABRead":
      s7client.ABRead(firstByte, numberOfBytes, pvtReadBufferFromPLC);
      break;

    case "MBRead":
      s7client.MBRead(firstByte, numberOfBytes, pvtReadBufferFromPLC);
      break;

    default:
      console.log('!Warning!: getDataOfSelectedType() got parameter of non exist function name!');
      break;
  }

  // general function in all cases
  function pvtReadBufferFromPLC(err, buffer) {
    if (err) {
      bConnected = false;
      return console.log(' >> ' + funcName + ' failed. Code #' + err + ' - ' + s7client.ErrorText(err));
    }
    else {
      var bits = buffer.toJSON();
      // var bit0 = (bits.data[0] & 0x01)!=0;
      // console.log(parseInt(bits.data[0].toString(2), 2));
      // console.log(bits.data[0].toString(2).padStart(8, '0').split('').reverse());

      for (var i = firstByte; i < firstByte + numberOfBytes; i++) {
        // fill global variable
        plcData[sDataType][sLabel + i] = bits.data[i - firstByte].toString(2).padStart(8, '0').split('').reverse();
      };
    }
  }
};

//==================================================================================
// comment out this block when data will be stored in DB
function fillPLCConnectionList(){
  configData["plcs"].push({ name: "BGA_GS9031", ip: "192.168.0.70", slot:0, rack:4, room: "II/139" });
  configData["plcs"].push({ name: "AAA_GS9030", ip: "192.168.0.10", slot:0, rack:2, room: "I/204" });
  configData["plcs"].push({ name: "BFA_GS9030", ip: "192.168.0.30", slot:0, rack:2, room: "II/109" });
  configData["plcs"].push({ name: "BGA_GS9020", ip: "192.168.0.1", slot:0, rack:2, room: "II/139" });
  configData["plcs"].push({ name: "BKA_GS9031", ip: "192.168.0.50", slot:0, rack:2, room: "II/122" });
  // !!!do not use in debug-mode, X-Cooler running, need protection
  //plcData["plcs"].push({ name: "BHH_GS9034", ip: "192.168.0.60", slot:"0", rack:"2", room: "I/230" });
}
//==================================================================================
// Simulation mode
function connectToPLCSim() {
  for (i = 0; i < 121; i++) {
    let b0 = (Math.random() > 0.5) ? 1 : 0;
    let b1 = (Math.random() > 0.5) ? 1 : 0;
    let b2 = (Math.random() > 0.5) ? 1 : 0;
    let b3 = (Math.random() > 0.5) ? 1 : 0;
    let b4 = (Math.random() > 0.5) ? 1 : 0;
    let b5 = (Math.random() > 0.5) ? 1 : 0;
    let b6 = (Math.random() > 0.5) ? 1 : 0;
    let b7 = (Math.random() > 0.5) ? 1 : 0;

    plcData["inputs"]["I" + i] = [b0, b1, b2, b3, b4, b5, b6, b7];
    plcData["outputs"]["Q" + i] = [b1, b4, b2, b5, b7, b0, b3, b6];
    plcData["merkers"]["M" + i] = [b6, b7, b4, b0, b1, b2, b5, b3];
  }
}

function getIOSim() {
  plcData["inputs"]["I" + Math.floor((Math.random() * 21))][Math.floor((Math.random() * 7))] = (Math.random() > 0.5) ? 1 : 0;
  plcData["outputs"]["Q" + Math.floor((Math.random() * 21))][Math.floor((Math.random() * 7))] = (Math.random() > 0.5) ? 1 : 0;
  plcData["merkers"]["M" + Math.floor((Math.random() * 21))][Math.floor((Math.random() * 7))] = (Math.random() > 0.5) ? 1 : 0;

}
//==================================================================================

module.exports = function () {

};