var m_snap7 = require('node-snap7');
var s7client = new snap7.S7Client();

connectToPLC();
//connectToPLCSim();

setInterval(function () {
  getInputs();
  //getInputsSim();
}, 500);


module.exports = function () {

};

function connectToPLC() {
  // connect to S7-400
  s7client.ConnectTo('192.168.0.70', 0, 4, function (err) {
    if (err)
      return console.log(' >> Connection failed. Code #' + err + ' - ' + s7client.ErrorText(err));
  });
};

function getInputs() {
  s7client.EBRead(0, 21, function (err, buffer) {
    if (err)
      return console.log(' >> EBRead failed. Code #' + err + ' - ' + s7client.ErrorText(err));
    else {

      var bits = buffer.toJSON();

      // console.log();
      // console.log(bits.data);
      // var bit0 = (bits.data[0] & 0x01)!=0;
      // console.log(`${bit0} ${bit1} ${bit2} ${bit3}`);
      // console.log(parseInt(bits.data[0].toString(2), 2));

      // console.log(bits.data[0].toString(2).padStart(8, '0').split('').reverse());
      // console.log(bits.data[1].toString(2).padStart(8, '0').split('').reverse());
      // console.log(bits.data[2].toString(2).padStart(8, '0').split('').reverse());
      // console.log(bits.data[3].toString(2).padStart(8, '0').split('').reverse());

      // global variable
      plcData["inputs"].I0 = bits.data[0].toString(2).padStart(8, '0').split('').reverse();
      plcData["inputs"].I1 = bits.data[1].toString(2).padStart(8, '0').split('').reverse();
      plcData["inputs"].I2 = bits.data[2].toString(2).padStart(8, '0').split('').reverse();
      plcData["inputs"].I3 = bits.data[3].toString(2).padStart(8, '0').split('').reverse();
      plcData["inputs"].I4 = bits.data[4].toString(2).padStart(8, '0').split('').reverse();
      plcData["inputs"].I5 = bits.data[5].toString(2).padStart(8, '0').split('').reverse();
      plcData["inputs"].I6 = bits.data[6].toString(2).padStart(8, '0').split('').reverse();
      plcData["inputs"].I7 = bits.data[7].toString(2).padStart(8, '0').split('').reverse();
      plcData["inputs"].I8 = bits.data[8].toString(2).padStart(8, '0').split('').reverse();
      plcData["inputs"].I9 = bits.data[9].toString(2).padStart(8, '0').split('').reverse();
      plcData["inputs"].I10 = bits.data[10].toString(2).padStart(8, '0').split('').reverse();
      plcData["inputs"].I11 = bits.data[11].toString(2).padStart(8, '0').split('').reverse();
      plcData["inputs"].I12 = bits.data[12].toString(2).padStart(8, '0').split('').reverse();
      plcData["inputs"].I13 = bits.data[13].toString(2).padStart(8, '0').split('').reverse();
      plcData["inputs"].I14 = bits.data[14].toString(2).padStart(8, '0').split('').reverse();
      plcData["inputs"].I15 = bits.data[15].toString(2).padStart(8, '0').split('').reverse();
      plcData["inputs"].I16 = bits.data[16].toString(2).padStart(8, '0').split('').reverse();
      plcData["inputs"].I17 = bits.data[17].toString(2).padStart(8, '0').split('').reverse();
      plcData["inputs"].I18 = bits.data[18].toString(2).padStart(8, '0').split('').reverse();
      plcData["inputs"].I19 = bits.data[19].toString(2).padStart(8, '0').split('').reverse();
      plcData["inputs"].I20 = bits.data[20].toString(2).padStart(8, '0').split('').reverse();   

      //console.log(plcData);
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
  plcData["inputs"]["I" + Math.floor((Math.random()*21))][Math.floor((Math.random()*7))] = (Math.random() > 0.5) ? 1 : 0;
}