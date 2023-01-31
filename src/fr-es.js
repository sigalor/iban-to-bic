const { writeOutputs, downloadJSDOM, downloadCSV } = require('./utils');

module.exports = async () => {
  const domain = 'https://www.ecb.europa.eu';
  const document = await downloadJSDOM(
    domain + '/stats/financial_corporations/list_of_financial_institutions/html/monthly_list-MID.en.html',
  );
  const csvUrl = domain + document.querySelectorAll('main table a')[1].getAttribute('href');

  const banks = await downloadCSV(csvUrl, { separator: '\t' }, 'utf16');
  const consideredCountries = ['fr', 'es'];

  const bankCodesObj = consideredCountries.reduce((out, country) => {
    out[country] = {};
    return out;
  }, {});

  for (const bank of banks) {
    const riadCode = bank.RIAD_CODE;
    const riadCountry = riadCode.substring(0, 2).toLowerCase();
    if (!consideredCountries.includes(riadCountry) || !bank.BIC) continue;

    const bankCode = riadCode.substring(2);
    bankCodesObj[riadCountry][bankCode] = {
      bic: bank.BIC,
      name: bank.NAME,
      address: {
        box: bank.BIX,
        street: bank.ADDRESS,
        postalCode: bank.POSTAL,
        city: bank.CITY,
        country: bank.COUNTRY_OF_REGISTRATION.toUpperCase(),
      },
    };
  }

  for (const country of consideredCountries) {
    await writeOutputs(country, bankCodesObj[country]);
  }
};
