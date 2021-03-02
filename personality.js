const fs = require('fs');
const calendars = require('date-chinese');

class PersonalityGenerator {
  constructor() {
  }

  generate(age) {
    this.zodiac = JSON.parse(fs.readFileSync('zodiac.json'));

    const chcal = new calendars.CalendarChinese();
    const jday = Math.floor(Math.random() * 365);
    const year = Math.floor(Math.random() * this.zodiac.Chinese.length);
    const chiSign = this.getChinese(year);
    const helSign = this.getHellenic(jday);
    const keywords = this.getKeywords(chiSign, helSign);
    // Adding days should put us entirely in 1999,
    // which we know isn't a Leap Year,
    // making sure the probilities are even.
    let date = new Date('January 1, 1998 12:00:00');

    const ages = this.extractAges(age);
    let thisYear = new Date().getFullYear();
    const birthYears = [];

    // Add a maximum age for senior citizens.
    if (ages.length === 1) {
      ages.push(120);
    }

    // Find the years that fit the right Chinese zodiac sign and
    // the person's age.
    for (let y = thisYear - ages[1] - 1; y < thisYear - ages[0]; y++) {
      if (y % 12 === chiSign.year) {
        let yy = y;
        const ny = chcal.newYear(y);
        chcal.fromJDE(ny);
        const nyg = chcal.toGregorian();
        const newyear = new Date(nyg.year, nyg.month, nyg.day);
        let when = new Date(yy, 0);

        when.setDate(date.getDate() + jday);

        if (when < newyear) {
          yy += 1;
        }

        birthYears.push(yy);
      }
    }

    date.setDate(date.getDate() + jday);
    this.result = {
      birthYears: birthYears,
      date: date,
      julianDay: jday,
      keywords: keywords,
      sign: helSign,
      year: chiSign,
    }
  }

  extractAges(age) {
    return age.match(/\d+/g);
  }

  getChinese(year) {
    const cSign = this.zodiac.Chinese[year];

    cSign.element = this.zodiac.chineseElement
      .filter(e => e.name === cSign.element)[0];
    return cSign;
  }

  getHellenic(jday) {
    jday = jday % 366;

    // We need the sigh where the day is in its bounds
    let hSign = this.zodiac.Hellenic
      .filter(h => jday >= h.start && jday <= h.end)[0];
    let first = this.zodiac.Hellenic[0];
    let last = this.zodiac.Hellenic[this.zodiac.Hellenic.length - 1];

    // This code will probably never be called, but is wedged in on the chance that
    // the randomly generated day is out of bounds.
    if (hSign === null || typeof hSign === 'undefined') {
      const idx = Math.floor(Math.random() * this.zodiac.Hellenic.length);
      hSign = this.zodiac.Hellenic[idx];
      console.log(`Generated a day of ${jday}; picking random sign`);
    }

    hSign.element = this.zodiac.element
      .filter(e => e.name === hSign.element)[0];
    hSign.modality = this.zodiac.modality
      .filter(m => m.name === hSign.modality)[0];
    // If the date is close to the sign's boundary, then it's on the cusp
    // of another sign
    // ...except, the first and last sign are actually the same, so those
    // boundaries don't count
    if (hSign.start !== first.start && jday < hSign.start + 5) {
      hSign.cuspOf = this.getHellenic(jday - 15 + 365);
    } else if (hSign.end !== last.end && jday > hSign.end - 5) {
      hSign.cuspOf = this.getHellenic(jday + 15);
    }

    return hSign;
  }

  getKeywords(chinese, hellenic) {
    // Collect the keyword lists we know exist
    const keywords = [
      chinese.keywords,
      chinese.element.keywords,
      hellenic.element.keywords,
      hellenic.modality.keywords,
    ];
    const result = {};

    // Add the keyword lists that only come when the character is on the cusp
    // of two signs
    if (hellenic.hasOwnProperty('cuspOf')) {
      keywords.push(hellenic.cuspOf.element.keywords);
      keywords.push(hellenic.cuspOf.modality.keywords);
    }

    // Join the keyword lists, then count up the frequency of each word
    [].concat(...keywords).forEach(k => {
      if (result.hasOwnProperty(k)) {
        result[k] += 1;
      } else {
        result[k] = 1;
      }
    });
    return result;
  }
}

module.exports = PersonalityGenerator;

