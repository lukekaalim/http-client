// @flow strict
const { createServer, request } = require('http');
const { createNodeClient, createJSONEndpointClient, createBasicAuthorization } = require('../../');
const { router, createRoute, application, readJSONBody } = require('@lukekaalim/server');

const main = async () => {
  const listener = router([createRoute('POST', '/example', async (request) => 
    application.json(200, {
      my: 'response',
      request: await readJSONBody(request.incoming, request.headers)
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
    };
    const endpoint = {
      method: 'POST',
      path: '/example',
      toResponseBody: (a) => a,
      toRequestBody: (a) => a,
      toQuery: (a) => a,
    };
    const echoClient = createJSONEndpointClient({ endpoint, service, http, authorization });
  
    console.log(await echoClient.call({ my: 'request' }));
  } catch(error) {
    console.error(error);
  } finally {
    server.close();
  }
};

main();