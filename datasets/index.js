const { readFile } = require('fs/promises');
const path = require('path');

const dataset = {
  AT: require('./at.json'),
  BE: require('./be.json'),
  DE: require('./de.json'),
  ES: require('./es.json'),
  FR: require('./fr.json'),
  LU: require('./lu.json'),
  NL: require('./nl.json'),
};

module.exports = 
{
  hasCountry(country) {
    return dataset[country] !== undefined;
  },
  getData(country, bankCode) {
    return dataset[country][bankCode];
  },
  reload: async () => {
    dataset.AT = JSON.parse(await readFile(path.resolve(__dirname, './at.json'), 'utf8'));
    dataset.BE = JSON.parse(await readFile(path.resolve(__dirname, './be.json'), 'utf8'));
    dataset.DE = JSON.parse(await readFile(path.resolve(__dirname, './de.json'), 'utf8'));
    dataset.ES = JSON.parse(await readFile(path.resolve(__dirname, './es.json'), 'utf8'));
    dataset.FR = JSON.parse(await readFile(path.resolve(__dirname, './fr.json'), 'utf8'));
    dataset.LU = JSON.parse(await readFile(path.resolve(__dirname, './lu.json'), 'utf8'));
    dataset.NL = JSON.parse(await readFile(path.resolve(__dirname, './nl.json'), 'utf8'));
  }
}