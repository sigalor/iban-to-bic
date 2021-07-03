const assert = require('assert');
const { getCellValue, writeOutputs, downloadXLSX, downloadJSDOM, assertTableHead } = require('./utils');

function rowToObject(worksheet, row) {
  const col = n => getCellValue(worksheet, n, row);
  if (!col(1)) return;
  return {
    name: col(0),
    code: col(1),
    bic: col(2).replace(/ /g, ''),
  };
}

async function getWorksheet() {
  const document = await downloadJSDOM('https://www.abbl.lu/topic/iban-and-bic-codes/');

  let url;
  const links = document.getElementsByTagName('a');
  for (let i = 0; i < links.length; i++) {
    const currUrl = links[i].getAttribute('href');
    if (links[i].innerHTML.startsWith('IBAN_BIC_CODES_LUX_') && currUrl.endsWith('.xlsx')) {
      url = currUrl;
      break;
    }
  }

  return downloadXLSX(url, 'Organizations');
}

module.exports = async () => {
  const worksheet = await getWorksheet();
  assertTableHead(worksheet, 2, ['Credit institution', 'IBAN Code ', ' BIC Code']);

  const bankCodesObj = {};
  for (let i = 3; worksheet['A' + i] !== undefined; i++) {
    const row = rowToObject(worksheet, i);
    if (!row) continue;

    assert(bankCodesObj[row.code] === undefined);
    bankCodesObj[row.code] = row;
  }

  await writeOutputs('lu', bankCodesObj);
};
