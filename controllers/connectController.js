var m_snap7 = require('node-snap7');
var s7client = new snap7.S7Client();

var bodyParser = require('body-parser');
var stuff = {};
var inputs = {};
var urlencodedParser = bodyParser.urlencoded({ extended: false });

function connectToPLC() {
  // connect to S7-400
  s7client.ConnectTo('192.168.0.70', 0, 4, function (err) {
    if (err)
      return console.log(' >> Connection failed. Code #' + err + ' - ' + s7client.ErrorText(err));
  });
};

function getInputs() {
  s7client.EBRead(0, 4, function (err, buffer) {
    if (err)
      return console.log(' >> EBRead failed. Code #' + err + ' - ' + s7client.ErrorText(err));
    else {

      var bits = buffer.toJSON();

      console.log();
      console.log(bits.data);
      // var bit0 = (bits.data[0] & 0x01)!=0;
      // console.log(`${bit0} ${bit1} ${bit2} ${bit3}`);
      // console.log(parseInt(bits.data[0].toString(2), 2));

      console.log(bits.data[0].toString(2).padStart(8, '0').split('').reverse());
      console.log(bits.data[1].toString(2).padStart(8, '0').split('').reverse());
      console.log(bits.data[2].toString(2).padStart(8, '0').split('').reverse());
      console.log(bits.data[3].toString(2).padStart(8, '0').split('').reverse());

      stuff.I0 = bits.data[0].toString(2).padStart(8, '0').split('').reverse();
    
      //console.log(inputs.I0);

    }
  });
};

//connectToPLC();
//getInputs();

module.exports = function (app) {

  app.get('/todo', function (req, res) {

    res.render('todo', { stuff: stuff });
  });

  app.post('/todo', urlencodedParser, function (req, res) {
    // stuff.push(req.body);
    // res.json(stuff);
  });


  app.delete('/todo/:item', function (req, res) {
    stuff = stuff.filter(function (todo) {
      //return true or false
      return todo.item.replace(/ /g, '-') !== req.params.item;
    });
    res.json(stuff);
  });

};