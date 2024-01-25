# salesforce-pageobjects

Page objects provided by Salesforce to test Lightning Experience using the UI Test Automation Model (UTAM) framework.

This package is compatible with the Spring’24 Salesforce release.

This package is compatible with versions `2.0.2` up to `2.2.0` of the [`wdio-utam-service`](https://www.npmjs.com/package/wdio-utam-service) package. Mobile page objects are compatible with versions `2.0.2` up to `2.2.0`.

## Install

Using npm:

```
npm install salesforce-pageobjects --save-dev
```

or using yarn:

```
yarn add salesforce-pageobjects --dev
```

## Usage

To import a page object in a test, use the following syntax. This example imports the login page object.

### ES Modules (ESM)

```js
import Login from 'salesforce-pageobjects/helpers/pageObjects/login';
```

### CommonJS (CJS)

```js
const Login = require('salesforce-pageobjects/helpers/pageObjects/login');
```

For a complete example, see the [utam-js-recipes](https://github.com/salesforce/utam-js-recipes) repo.

For more information about UTAM, see [utam.dev](https://utam.dev/).

For any issues, see [Salesforce Help](https://help.salesforce.com/s/).
