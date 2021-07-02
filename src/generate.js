const at = require('./at');
const de = require('./de');

(async () => {
  await Promise.all([at(), de()]);
})();
