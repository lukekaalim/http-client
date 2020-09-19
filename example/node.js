// @flow strict
const { createListener, get, ok } = require('@lukekaalim/server');
const { createNodeClient } = require('../main.js');
const { request, createServer } = require('http');

const main = async () => {
  const listener = createListener([get('/example', async () => ok({ hello: 'world' }))]);
  const server = createServer(listener);
  const port = await new Promise(r => server.listen(0, () => void r(server.address().port)));

  const client = createNodeClient(request);
  const response = await client.sendRequest({ url: `http://localhost:${port}/example`, method: 'GET', headers: [] });
  console.log(response);
  server.close();
};

main();