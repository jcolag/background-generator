const fs = require('fs');

class HeadshotGenerator {
  constructor() {
  }

  generate(skintone) {
    const outfile = './public/images/headshot.svg';

    const size = 500;
    const head = '<svg\n  xmlns="http://www.w3.org/2000/svg"\n'
      + `  viewBox="50 50 ${size * 4 / 5} ${size * 4 / 5}"\n  width="${size}"\n`
      + `  height="${size}"\n>\n`
      + '  <style>\n    circle, line, path, polygon, polyline, rect {\n'
      + `      fill: ${skintone};\n      stroke: currentColor;\n`
      + '      stroke-linecap: round;\n      stroke-linejoin: round;\n'
      + '      stroke-width: 2;\n    }\n  </style>\n';
    const foot = '\n  "/>\n</svg>';
    const multiplier = size / 20;

    // crown, parietus, temple, cheek, jaw
    const crown = [
      Math.random() * 3 * multiplier + multiplier,
      Math.random() * multiplier
    ];
    const parietus = [
      Math.random() * 2 * multiplier + multiplier,
      Math.random() * 2 * multiplier + 2 * multiplier
    ];
    const temple = [
      Math.random() * 6 * multiplier + 6 * multiplier,
      Math.random() * multiplier + 2 * multiplier];
    const jaw = [
      Math.random() * 4 * multiplier + 4 * multiplier,
      Math.random() * 4 * multiplier + 2 * multiplier
    ];
    const uppereyeoffset = Math.random();
    const lowereyeoffset = Math.random();
    const height = crown[1] + parietus[1] + 5 * multiplier + jaw[1];
    const width = crown[0] + parietus[0];
    const offsetv = size / 2 - height / 2;
    const path = '  <path d="\n'
      + `    M ${size / 2} ${offsetv}\n`
      + `    a ${crown[0]} ${crown[1]} 0 0 1 ${crown[0]} ${crown[1]}\n`
      + `    a ${parietus[0]} ${parietus[1]} 0 0 1 ${parietus[0]} ${parietus[1]}\n`
      + `    a ${temple[0]} ${temple[0]} 0 0 0 0 ${temple[1]}\n`
      + `    a ${temple[0]} ${temple[0]} 0 0 1 0 ${5 * multiplier - temple[1]}\n`
      + `    a ${jaw[0]} ${jaw[1]} 0 0 1 -${crown[0] + parietus[0]} ${jaw[1]}\n`
      + `    a ${jaw[0]} ${jaw[1]} 0 0 1 -${crown[0] + parietus[0]} -${jaw[1]}\n`
      + `    a ${temple[0]} ${temple[0]} 0 0 1 0 -${5 * multiplier - temple[1]}\n`
      + `    a ${temple[0]} ${temple[0]} 0 0 0 0 -${temple[1]}\n`
      + `    a ${parietus[0]} ${parietus[1]} 0 0 1 ${parietus[0]} -${parietus[1]}\n`
      + `    a ${crown[0]} ${crown[1]} 0 0 1 ${crown[0]} -${crown[1]}\n`
      + '    z"/>\n';
    const eyeleft = '  <path style="fill: ivory" d="\n'
      + `    M ${size / 2 - width * 5 / 8} ${offsetv + height / 2}\n`
      + `    q ${width / 8 + uppereyeoffset * width / 4} -20 ${width / 2} 0\n`
      + `    q -${width / 8 + lowereyeoffset * width / 4} 20 -${width / 2} 0\n`
      + `    m ${width / 4} 5\n`
      + `    a 5 5 0 1 1 5 0\n`
      + '    z"/>\n';
    const eyeright = '  <path style="fill: ivory" d="\n'
      + `    M ${size / 2 + width * 5 / 8} ${offsetv + height / 2}\n`
      + `    q -${width / 8 + uppereyeoffset * width / 4} -20 -${width / 2} 0\n`
      + `    q ${width / 8 + lowereyeoffset * width / 4} 20 ${width / 2} 0\n`
      + `    m -${width / 4} 5\n`
      + `    a 5 5 0 1 1 5 0\n`
      + '    z"/>\n';
      + '"/>\n';
    const nose = '  <path d="\n'
      + `    M ${size / 2} ${size / 2}\n`
      + `    q ${Math.random()*height/4-height/8+Math.random() * multiplier}`
      + ` ${Math.random() * height / 4 + height / 4} 0 ${height / 4}`
      + '"/>\n'
    const mouth = '  <line\n'
      + `    x1="${size / 2 - width / 4}"\n`
      + `    x2="${size / 2 + width / 4}"\n`
      + `    y1="${offsetv + height / 8 * 7}"\n`
      + `    y2="${offsetv + height / 8 * 7}\n`;

    fs.writeFileSync(outfile, head+path+eyeleft+eyeright+nose+mouth+foot);
  }
}

module.exports = HeadshotGenerator;
