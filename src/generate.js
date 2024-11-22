const at = require('./at');
const be = require('./be');
const de = require('./de');
const frEs = require('./fr-es');
const lu = require('./lu');
const nl = require('./nl');

async function generate() {
  return Promise.all([at(), be(), de(), frEs(), lu(), nl()]);
}

if (module.parent) {
  module.exports = generate;
} else {
  (async () => {
    await generate();
  })();
}