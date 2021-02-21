const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
var https = require('https');
const PeopleGenerator = require('./generate.js');
const PersonalityGenerator = require('./personality');

const app = express();
const people = new PeopleGenerator();
const personality = new PersonalityGenerator();
const config = JSON.parse(fs.readFileSync('./config.json'));
const useFooter = fs.existsSync('./views/_footer.ejs');
const useFooterStyle = fs.existsSync('./public/css/footer.css');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('helmet')());
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  person = people.generate();
  personality.generate(person[0].age);
  res.render('index', {
    mapboxToken: config.mapboxToken,
    person: person[0],
    personality: personality.result,
    title: 'A Hypothetical Person',
    useFooter: useFooter,
    useFooterStyle: useFooterStyle,
  });
});

try {
  https
    .createServer({
      key: fs.readFileSync('keys/privkey.pem'),
      cert: fs.readFileSync('keys/cert.pem')
    }, app)
    .listen(5000, function () {
      console.log('Example app listening at https://localhost:5000!');
    });
} catch(e) {
  console.warn(e);
  app.listen(5000, function () {
    console.log('HTTPS failed; example app listening at http://localhost:5000!');
  });
}
