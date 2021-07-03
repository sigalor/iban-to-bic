const path = require('path');
const fs = require('fs-extra');

async function writeOutputs(name, bankCodesObj) {
  await fs.writeJSON(path.join(__dirname, `../datasets-extended/${name}.json`), bankCodesObj);

  const bankCodesToBic = Object.entries(bankCodesObj).reduce((prev, [code, { bic, branches }]) => {
    if (bic) prev[code] = bic;
    else if (branches && branches[0] && branches[0].bic) prev[code] = branches[0].bic;
    return prev;
  }, {});

  await fs.writeJSON(path.join(__dirname, `../datasets/${name}.json`), bankCodesToBic);
}

module.exports = { writeOutputs };
