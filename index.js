const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const PeopleGenerator = require('./generate.js');
const app = express();
const people = new PeopleGenerator();
const config = JSON.parse(fs.readFileSync('./config.json'));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  person = people.generate();
  res.render('index', {
    person: person[0],
    mapboxToken: config.mapboxToken,
    title: 'A Hypothetical Person',
  });
});

app.post('/', function (req, res) {
  res.render('index');
  console.log(req.body.city);
});

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});
