var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function (app) {

  app.get('/mapfield', function (req, res) {

    res.render('mapfield', { plcData: plcData });
  });

  app.post('/mapfield', urlencodedParser, function (req, res) {
    // plcData.push(req.body);
    // res.json(plcData);
  });

};