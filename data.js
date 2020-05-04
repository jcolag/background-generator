const fs = require('fs');

class Data {
  loadGrid(filename) {
    const result = [];
    const lines = fs
      .readFileSync(filename)
      .toString()
      .split('\n');

    for (let i = 0; i < lines.length; i++) {
      result.push(lines[i].split(','));
    }

    return result;
  }
}

module.exports = Data;
