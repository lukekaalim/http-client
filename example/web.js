// @flow strict
const { createListener, methods: { post }, stream: { ok } } = require('@lukekaalim/server');
const { createWebClient } = require('../main.js');
const { createServer } = require('http');
const nodeFetch/*: typeof fetch*/ = require('node-fetch');

const main = async () => {
  const listener = createListener([post('/example', async (request) => ok(request.stream))]);
  const server = createServer(listener);
  const port = await new Promise(r => server.listen(0, () => void r(server.address().port)));

  const client = createWebClient(nodeFetch);
  const response = await client.sendRequest({
    url: `http://localhost:${port}/example`, method: 'POST', headers: [], body: Buffer.from(':)')
  });
  console.log(response);
  server.close();
};

main();