const assert = require('assert');
const { getCellValue, writeOutputs, downloadXLSX, assertTableHead } = require('./utils');

function rowToObject(worksheet, row) {
  const col = n => getCellValue(worksheet, n, row);
  return {
    bic: col(0),
    code: col(1),
    name: col(2),
  };
}

module.exports = async () => {
  const worksheet = await downloadXLSX(
    'https://www.betaalvereniging.nl/wp-content/uploads/BIC-lijst-NL.xlsx',
    'BIC-lijst',
  );

  assert.strictEqual(worksheet['A1'].v, 'BIC-lijst-NL');
  assertTableHead(worksheet, 4, ['BIC', 'Identifier', 'Naam betaaldienstverlener']);

  const bankCodesObj = {};
  for (let i = 5; worksheet['A' + i] !== undefined; i++) {
    const row = rowToObject(worksheet, i);
    assert(bankCodesObj[row.code] === undefined);
    bankCodesObj[row.code] = row;
  }

  await writeOutputs('nl', bankCodesObj);
};
