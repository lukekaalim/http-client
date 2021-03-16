// @flow strict
const { router, createRoute, respond } = require('@lukekaalim/server');
const { createWebClient } = require('../main.js');
const { createServer } = require('http');
const nodeFetch/*: typeof fetch*/ = require('node-fetch');

const main = async () => {
  const listener = router([createRoute('POST', '/example', async (request) => respond(200, {}, request.incoming))]);
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