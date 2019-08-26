// @flow strict
const { expect, expectAll, assert } = require('@lukekaalim/test');
const { request, createServer } = require('http');
const { readFile } = require('fs').promises;
const { join } = require('path');
const {
  createHTTPClientFromNodeHttpsRequest,
  createHTTPClientFromFetch,
} = require('..');
const puppeteer = require('puppeteer');

const withWebServer = (page, mimeType = 'text/plain') => async (webServerHandler) => {
  const server = createServer((inc, res) => {
    res.writeHead(200, { 'Content-Type': mimeType, 'Access-Control-Allow-Origin': '*' })
    res.end(page)
  });
  await new Promise(res => server.listen(0, res));
  try {
    const result = await webServerHandler(server);
    await new Promise(res => server.close(res));
    return result;
  } catch (err) {
    await new Promise(res => server.close(res));
    throw err;
  }
};

const withChromePage = async (chromePageHandler) => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    const result = await chromePageHandler(page);
    await browser.close();
    return result;
  } catch (err) {
    await browser.close();
    throw err;
  }
};

const expectNodeFunctionality = expect(async () => {
  const withApi = withWebServer('howdy there');

  const responseResult = await withApi(async server => {
    const address = server.address();
    // use the inbuilt require('http').request
    const client = createHTTPClientFromNodeHttpsRequest(request);
    return await client.request(`http://localhost:${address.port}`);
  });

  if (responseResult.type !== 'success') {
    return assert('The promise of a request should succeed, instead it failed', false);
  }

  const response = responseResult.success;
  const assertions = [
    assert('The Body of the content should match', response.body === 'howdy there'),
  ];
  return assert(
    'The library should work with the HTTP node module',
    assertions.every(assertion => assertion.validatesExpectation),
    assertions
  );
});

const expectChromeFunctionality = expect(async () => {
  const withApi = withWebServer('howdy there');
  
  const responseResult = await withApi(async server => {
    // Use Puppeteer to create a page
    return withChromePage(async page => {
      // Add the UMD version of the package to the page
      await page.addScriptTag({ path: join(__dirname, '../dist/http-client.umd.js') });
      // And execute the following code
      return page.evaluate(async (port) => {
        const { createHTTPClientFromFetch } = window['LK_HTTP_CLIENT'];
        // Use the page's window.fetch and window.headers
        const client = createHTTPClientFromFetch(window.fetch, window.Headers);
        return client.request(`http://localhost:${port}`);
      }, server.address().port);
    });
  });

  if (responseResult.type !== 'success') {
    return assert('The promise of a request should succeed, instead it failed', false);
  }
  const response = responseResult.success;
  const assertions = [
    assert('The Body of the content should match', response.body === 'howdy there'),
  ];
  return assert(
    'The library should work with Chrome\'s window.fetch',
    assertions.every(assertion => assertion.validatesExpectation),
    assertions
  );
});

const expectIntegration = expectAll('Expect the application to integrate with its environment correctly', [
  expectNodeFunctionality,
  expectChromeFunctionality,
]);

module.exports = {
  expectIntegration,
};