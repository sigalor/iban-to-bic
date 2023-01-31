# iban-to-bic

[![GitHub license](https://img.shields.io/github/license/sigalor/iban-to-bic)](https://github.com/sigalor/iban-to-bic/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/iban-to-bic)](https://www.npmjs.com/package/iban-to-bic) [![Unit tests workflow status](https://github.com/sigalor/iban-to-bic/actions/workflows/tests.yaml/badge.svg)](https://github.com/sigalor/iban-to-bic/actions/workflows/tests.yaml)

Determines the SWIFT BIC of an IBAN. Currently supports IBANs from the following countries: Austria, Belgium, Germany, Luxembourg, Netherlands, Spain, France.

## Usage

```javascript
const { ibanToBic } = require('iban-to-bic');

const bic = ibanToBic('DE51500105179975341634');
// bic is now "INGDDEFFXXX"
```

`ibanToBic` returns undefined if the IBAN is invalid (checked internally using [ibantools](https://github.com/Simplify/ibantools)) or if no corresponding BIC was found.

## Usage in the browser

Iban-to-Bic is really simple to use inside a browser. You can either pull the package from npm and build it with your favorite packaging tool,
or you can just use it from a CDN like this:

```
<script type="text/javascript" src="https://unpkg.com/iban-to-bic@latest/dist/iban-to-bic.js">
```

Or

```
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/iban-to-bic@latest/dist/iban-to-bic.js">
```

And then just invoke it like this:

```
<script type="text/javascript">
	window.ibanToBic.ibanToBic('********');
</script>
```

Using this code makes it super comfortable to validate user input and provide auto-fill to your application.

## Updating the dataset

The following will fetch the newest data from the respective national bank authorities (e.g. Bundesbank in Germany or OeNB in Austria) and regenerate the files in the `datasets` and the `datasets-extended` directory:

```
npm run generate
```

For Spain and France, data directly from the European Central Bank is used, see [here](https://www.ecb.europa.eu/stats/financial_corporations/list_of_financial_institutions/html/monthly_list-MID.en.html).

## License

MIT
