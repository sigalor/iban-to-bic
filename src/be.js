const assert = require('assert');
const { getCellValue, writeOutputs, downloadXLSX, assertTableHead } = require('./utils');

function rowToObject(worksheet, row) {
  const col = n => getCellValue(worksheet, n, row);
  return {
    code: col(0),
    bic: col(1).replace(/ /g, ''),
    name: {
      nl: col(2) || undefined,
      fr: col(3) || undefined,
      de: col(4) || undefined,
      en: col(5) || undefined,
    },
  };
}

module.exports = async () => {
  const worksheet = await downloadXLSX(
    'https://www.nbb.be/doc/be/be/protocol/r_fulllist_of_codes_current.xlsx',
    'Q_FULL_LIST_XLS_REPORT',
  );

  assertTableHead(worksheet, 2, [
    'T_Identification_Number',
    'Biccode',
    'T_Institutions_Dutch',
    'T_Institutions_French',
    'T_Institutions_German',
    'T_Institutions_English',
  ]);

  const bankCodesObj = {};

  for (let i = 3; worksheet['A' + i] !== undefined; i++) {
    const row = rowToObject(worksheet, i);
    if (['VRIJ', 'VRIJ-LIBRE'].indexOf(row.bic) !== -1) continue;
    if (['nav', 'NAV', 'NAP', 'NYA', '-'].indexOf(row.bic) !== -1) delete row.bic;

    assert(bankCodesObj[row.code] === undefined);
    bankCodesObj[row.code] = row;
  }

  await writeOutputs('be', bankCodesObj);
};
