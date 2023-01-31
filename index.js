const ibantools = require('ibantools');
const datasets = require('./datasets');

module.exports = {
  ibanIsValid(iban) {
    iban = ibantools.electronicFormatIBAN(iban);
    return ibantools.isValidIBAN(iban);
  },
  ibanToBic(iban) {
    iban = ibantools.electronicFormatIBAN(iban);
    if (!ibantools.isValidIBAN(iban)) return;

    const country = iban.slice(0, 2);
    if (!datasets[country]) return;

    // see https://en.wikipedia.org/wiki/International_Bank_Account_Number#IBAN_formats_by_country
    let bankCode;
    if (country === 'AT') bankCode = iban.substr(4, 5);
    else if (country === 'BE') bankCode = iban.substr(4, 3);
    else if (country === 'DE') bankCode = iban.substr(4, 8);
    else if (country === 'ES') bankCode = iban.substr(4, 4);
    else if (country === 'FR') bankCode = iban.substr(4, 5);
    else if (country === 'LU') bankCode = iban.substr(4, 3);
    else if (country === 'NL') bankCode = iban.substr(4, 4);
    if (!bankCode) return;

    return datasets[country][bankCode];
  },
};
