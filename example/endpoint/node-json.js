// @flow strict
const { inspect } = require('util');
const { createServer, request } = require('http');
const { createNodeClient, json: { createGETClient }, createBasicAuthorization } = require('../../');
const { router, createRoute, application, readJSONBody, getAuthorization } = require('@lukekaalim/server');
const { createPOSTClient } = require('../../endpoint/json');

const main = async () => {
  const listener = router([createRoute('POST', '/example', async (request) => 
    application.json(200, {
      my: 'response',
      query: [...request.query],
      auth: getAuthorization(request.headers),
      echo: await readJSONBody(request.incoming, request.headers)
    })
  )]);
  const server = createServer(listener);

  await new Promise(r => server.listen(0, 'localhost', () => r()));
  const { port, address } = server.address()

  try {
    const http = createNodeClient(request);
    const authorization = createBasicAuthorization('myUserName', 'mySecretPassword');
    const service = {
      baseURL: new URL(`http://${address}:${port}`),
      authorization,
    };
    const echoEndpoint = {
      method: 'POST',
      path: '/example',
      toResponseBody: (a) => a,
      toRequestBody: (a) => a,
      toQuery: (a) => a,
    };
    const infoEndpoint = {
      method: 'GET',
      path: '/example',
      toResponseBody: (a) => a,
      toQuery: (a) => a,
    }
    const exampleClient = {
      ...createPOSTClient(echoEndpoint, http, service),
      ...createGETClient(infoEndpoint, http, service),
    }
  
    console.log(inspect(await exampleClient.post(
      { hello: 'there' },
      { myRequest: 'Hello there!' }
    ), { depth: null, colors: true }));
  } catch(error) {
    console.error(error);
  } finally {
    server.close();
  }
};

main();