const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
var https = require('https');
const PeopleGenerator = require('./generate.js');
const app = express();
const people = new PeopleGenerator();
const config = JSON.parse(fs.readFileSync('./config.json'));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('helmet')());
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  person = people.generate();
  res.render('index', {
    person: person[0],
    mapboxToken: config.mapboxToken,
    title: 'A Hypothetical Person',
  });
});

try {
  https
    .createServer({
      key: fs.readFileSync('keys/privkey.pem'),
      cert: fs.readFileSync('keys/cert.pem')
    }, app)
    .listen(5000, function () {
      console.log('Example app listening on HTTPS port 5000!');
    });
} catch(e) {
  console.warn(e);
  app.listen(5000, function () {
    console.log('HTTPS failed; example app listening on HTTP port 5000!');
  });
}
