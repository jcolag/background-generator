const fs = require('fs');
const unidecode = require('unidecode-plus');

let names = JSON.parse(fs.readFileSync('names.json').toString());
let boys = [];
let girls = [];
let gender = 'girl';
let nameArray;

for (let i = 0; i < names.length; i++) {
  boys.push(...names[i].male);
  girls.push(...names[i].female);
}

boys.filter((v, i, s) => s.indexOf(v) === i).sort();
girls.filter((v, i, s) => s.indexOf(v) === i).sort();

for (i = 0; i < 10; i++) {
  if (Math.random() > 0.5) {
    gender = 'boy';
    nameArray = boys;
  } else {
    gender = 'girl';
    nameArray = girls;
  }

  let name = nameArray[Math.floor(Math.random() * nameArray.length)];
  let xlit  = unidecode(name).trim();

  console.log(`A ${gender} named ${name} (${xlit}).`);
}

