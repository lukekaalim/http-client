// @flow strict
const { createListener, methods: { post }, stream: { ok } } = require('@lukekaalim/server');
const { createNodeClient } = require('../main.js');
const { request, createServer } = require('http');

const main = async () => {
  const listener = createListener([post('/example', async (request) => ok(request.stream))]);
  const server = createServer(listener);
  const port = await new Promise(r => server.listen(0, () => void r(server.address().port)));

  const client = createNodeClient(request);
  const response = await client.sendRequest({
    url: `http://localhost:${port}/example`, method: 'POST', headers: [], body: Buffer.from(':>')
  });
  console.log(response);
  server.close();
};

main();