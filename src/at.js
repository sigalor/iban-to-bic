const assert = require('assert');
const path = require('path');
const fs = require('fs-extra');
const fetch = require('node-fetch');
const iconv = require('iconv-lite');
const neatCsv = require('neat-csv');

module.exports = async () => {
  const csvLines = iconv
    .decode(
      await (await fetch('https://www.oenb.at/docroot/downloads_observ/sepa-zv-vz_gesamt.csv')).buffer(),
      'iso-8859-1',
    )
    .split('\r\n');
  while (!csvLines[0].startsWith('Kennzeichen;')) csvLines.splice(0, 1);
  let banks = await neatCsv(csvLines.join('\n'), { separator: ';' });

  // filter by allowed sectors
  const allowedSectors = ['Raiffeisen', 'Aktienbanken', '§ 9 Institute', 'Sparkassen', 'Volksbanken'];
  banks = banks.filter(d => allowedSectors.includes(d.Sektor));

  // make sure that BLZ is unique
  assert.strictEqual(banks.length, new Set(banks.map(b => b.Bankleitzahl)).size);

  const bankCodesObj = banks.reduce((out, b) => {
    const ret = {
      code: b.Bankleitzahl, // is unique
      bic: b['SWIFT-Code'] ? b['SWIFT-Code'] : null,
      name: b.Bankenname,
      addresses: [{ type: 'home', streetAndNumber: b['Straße'], postalCode: b.PLZ, city: b.Ort }],
      contacts: [
        ['Telefon', 'phone'],
        ['Fax', 'fax'],
        ['E-Mail', 'email'],
        ['Homepage', 'url'],
      ].reduce((contacts, [kOrig, kNew]) => {
        if (b[kOrig]) contacts[kNew] = b[kOrig];
        return contacts;
      }, {}),
    };

    // banks can have a separate postal address
    if (b['Postadresse / PLZ'] && b['Postadresse / Ort']) {
      const post = { type: 'post', postalCode: b['Postadresse / PLZ'], city: b['Postadresse / Ort'] };
      if (b['Postadresse / Straße']) post.streetAndNumber = b['Postadresse / Straße'];
      if (b.Postfach) post.poBoxNumber = b.Postfach;
      ret.addresses.push(post);
    }

    out[ret.code] = ret;
    return out;
  }, {});

  await fs.writeJSON(path.join(__dirname, '../datasets-extended/at.json'), bankCodesObj);

  const bankCodesToBic = Object.entries(bankCodesObj).reduce((prev, [code, { bic }]) => {
    if (bic) prev[code] = bic;
    return prev;
  }, {});

  await fs.writeJSON(path.join(__dirname, '../datasets/at.json'), bankCodesToBic);
};
