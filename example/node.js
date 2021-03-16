// @flow strict
const { router, createRoute, respond } = require('@lukekaalim/server');
const { createNodeClient } = require('../main.js');
const { request, createServer } = require('http');

const main = async () => {
  const listener = router([createRoute('POST', '/example', async (request) => respond(200, {}, request.incoming))]);
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