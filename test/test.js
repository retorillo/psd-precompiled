const PSD = require('../');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const should = require('should');
const fixturesDir = path.resolve(__dirname, '../psd.js/test/fixtures');
const psdPath = path.resolve(__dirname, '../psd.js/examples/images/example.psd');

function hashstream(stream) {
  return new Promise((resolve, reject) => {
    var hash;
    var hex = '';
    var expectedPath = path.join(fixturesDir, 'out.png');
    fs.createReadStream(expectedPath)
      .pipe(hash = crypto.createHash('sha256'))
      .on('readable', () => {
        var data = hash.read();
        if (data)
          hex += data.toString('hex');
      })
      .on('end', () => { resolve(hex); });
  });
}

var expectedHash = '';
describe('Computing SHA256', () => {
  it('should dump SHA256 of stream', () => {
    const expectedPath = path.join(fixturesDir, 'out.png');
    return hashstream(fs.createReadStream(expectedPath)).then((hash) => {
      should(hash).match(/^[0-9a-z]{64}$/i);
      expectedHash = hash;
    });
  });
});

describe('Exporting from a PSD', () => {
  it('should export a png', done => {
    var hash;
    var actualHash = '';
    var psd = PSD.fromFile(psdPath);
    psd.parse();
    var png = psd.image.toPng();
    png.pack();
    png.pipe(hash = crypto.createHash('sha256'))
      .on('readable', () => {
        var data= hash.read();
        if (data)
          actualHash += data.toString('hex');
      })
      .on('end', () => {
        should(actualHash).eql(expectedHash);
        done();
      });
  });
});
