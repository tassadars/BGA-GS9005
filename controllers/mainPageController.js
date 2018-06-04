var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function (app) {

  app.get('/main', function (req, res) {

    res.render('main', { plcData: plcData });
  });

  app.post('/main', urlencodedParser, function (req, res) {
    // plcData.push(req.body);
    // res.json(plcData);
  });


  app.delete('/main/:item', function (req, res) {
    plcData = plcData.filter(function (main) {
      //return true or false
      return main.item.replace(/ /g, '-') !== req.params.item;
    });
    res.json(plcData);
  });

};