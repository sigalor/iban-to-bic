const assert = require('assert');
const fetch = require('node-fetch');
const xlsx = require('xlsx');

const { getCellValue, writeOutputs } = require('./utils');

function rowToObject(worksheet, row) {
  const col = n => getCellValue(worksheet, n, row);
  return {
    bic: col(0),
    code: col(1),
    name: col(2),
  };
}

module.exports = async () => {
  const worksheet = xlsx.read(
    await (await fetch('https://www.betaalvereniging.nl/wp-content/uploads/BIC-lijst-NL.xlsx')).buffer(),
    { type: 'buffer' },
  ).Sheets['BIC-lijst'];

  assert.strictEqual(worksheet['A1'].v, 'BIC-lijst-NL');
  assert.strictEqual(worksheet['A4'].v, 'BIC');
  assert.strictEqual(worksheet['B4'].v, 'Identifier');
  assert.strictEqual(worksheet['C4'].v, 'Naam betaaldienstverlener');

  const bankCodesObj = {};
  for (let i = 5; worksheet['A' + i] !== undefined; i++) {
    const row = rowToObject(worksheet, i);
    assert(bankCodesObj[row.code] === undefined);
    bankCodesObj[row.code] = row;
  }

  await writeOutputs('nl', bankCodesObj);
};
