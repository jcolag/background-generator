const fs = require('fs');

class PersonalityGenerator {
  constructor() {
  }

  generate() {
    this.zodiac = JSON.parse(fs.readFileSync('zodiac.json'));

    const jday = Math.floor(Math.random() * 365);
    const year = Math.floor(Math.random() * this.zodiac.Chinese.length);
    const chiSign = this.getChinese(year);
    const helSign = this.getHellenic(jday);
    const keywords = this.getKeywords(chiSign, helSign);
    let date = new Date('December 31, 1998 12:00:00');

    date.setDate(date.getDate() + jday);
    this.result = {
      date: date,
      julianDay: jday,
      keywords: keywords,
      sign: helSign,
      year: chiSign,
    }
  }

  getChinese(year) {
    const cSign = this.zodiac.Chinese[year];

    cSign.element = this.zodiac.chineseElement
      .filter(e => e.name === cSign.element)[0];
    return cSign;
  }

  getHellenic(jday) {
    jday = jday % 366;

    let hSign = this.zodiac.Hellenic
      .filter(h => jday >= h.start && jday <= h.end)[0];
    let first = this.zodiac.Hellenic[0];
    let last = this.zodiac.Hellenic[this.zodiac.Hellenic.length - 1];

    if (hSign === null || typeof hSign === 'undefined') {
      const idx = Math.floor(Math.random() * this.zodiac.Hellenic.length);
      hSign = this.zodiac.Hellenic[idx];
      console.log(`Generated a day of ${jday}; picking random sign`);
    }

    hSign.element = this.zodiac.element
      .filter(e => e.name === hSign.element)[0];
    hSign.modality = this.zodiac.modality
      .filter(m => m.name === hSign.modality)[0];
    if (hSign.start !== first.start && jday < hSign.start + 5) {
      hSign.cuspOf = this.getHellenic(jday - 15 + 365);
    } else if (hSign.end !== last.end && jday > hSign.end - 5) {
      hSign.cuspOf = this.getHellenic(jday + 15);
    }

    return hSign;
  }

  getKeywords(chinese, hellenic) {
    const keywords = [
      chinese.keywords,
      chinese.element.keywords,
      hellenic.element.keywords,
      hellenic.modality.keywords,
    ];
    const result = {};

    if (hellenic.hasOwnProperty('cuspOf')) {
      keywords.push(hellenic.cuspOf.element.keywords);
      keywords.push(hellenic.cuspOf.modality.keywords);
    }

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

