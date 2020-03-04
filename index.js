const bodyParser = require('body-parser');
const express = require('express');
const PeopleGenerator = require('./generate.js');
const app = express();
const people = new PeopleGenerator();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  person = people.generate();
  res.render('index', {
    person: person[0],
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
