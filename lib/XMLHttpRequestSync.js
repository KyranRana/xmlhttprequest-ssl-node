"use strict";

var _http = _interopRequireDefault(require("http"));

var _https = _interopRequireDefault(require("https"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeSyncRequest(ssl, options, data) {
  return new Promise((resolve, reject) => {
    const doRequest = ssl ? _https.default.request : _http.default.request;
    const request = doRequest(options, response => {
      response.setEncoding('utf8');
      let responseText = '';
      response.on('data', chunk => responseText += chunk);
      response.on('end', () => resolve({
        statusCode: response.statusCode,
        // destructuring
        responseText
      }));
      response.on('error', reject);
    }).on('error', reject);

    if (data) {
      request.write(data);
    }

    request.end();
  });
}

const ssl = process.argv[2] == 'true';
const options = JSON.parse(process.argv[3]);
const data = process.argv[4] == 'null' ? false : process.argv[4];
makeSyncRequest(ssl, options, data).then(data => process.stdout.write(JSON.stringify(data))).catch(error => process.stderr.write(JSON.stringify(error)));