const ibantools = require('ibantools');
const { ibanToBic } = require('..');

test('determines the correct BIC for a German IBAN', () => {
  expect(ibanToBic('DE51500105179975341634')).toBe('INGDDEFFXXX');
});

test('determines the correct BIC for an Austrian IBAN', () => {
  expect(ibanToBic('AT781400039828399259')).toBe('BAWAATWWXXX');
});

test('returns undefined for an unknown bank code in a valid IBAN', () => {
  // this IBAN was handcrafted so that the checksum is correct, even though the bank code does not exist
  const iban = 'DE98500205175996372411';
  expect(ibantools.isValidIBAN(iban)).toBe(true);
  expect(ibanToBic(iban)).toBe(undefined);
});

test('returns undefined for an invalid IBAN', () => {
  expect(ibanToBic('not an IBAN')).toBe(undefined);
});
