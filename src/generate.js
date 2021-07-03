const at = require('./at');
const de = require('./de');
const nl = require('./nl');

(async () => {
  await Promise.all([at(), de(), nl()]);
})();
