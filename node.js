// @flow strict
/*:: import type { Readable, Writable } from 'stream'; */
/*:: import type { HTTPClient } from './main'; */
/*:: import type { HTTPStatus } from './http'; */
/*:: import typeof { request } from 'http'; */
/*:: import type { IncomingMessage } from 'http'; */

const readStream = async (stream/*: Readable*/) => {
  const chunks = [];
  stream.setEncoding('utf8');
  for await (const chunk of stream)
    chunks.push(chunk.toString());
  return chunks.join('');
};

const createNodeClient = (nodeRequest/*: request*/)/*: HTTPClient*/ => {
  const sendRequest = async (request) => {
    const url = request.url instanceof URL ? request.url : new URL(request.url);

    const headers = (Object.fromEntries(request.headers)/*: any*/);

    const clientRequest = nodeRequest({
      method: request.method,
      headers: headers,
      path: url.pathname + url.search,
      host: url.hostname,
      port: Number.parseInt(url.port, 10),
    });
    const response = await new Promise((resolve, reject) => {
      clientRequest.on('response', async (response/*: IncomingMessage*/) => {
        try {
          response.on('error', reject);
          const body = await readStream(response);
          resolve({
            status: response.statusCode,
            headers: (Object.entries(response.headers)/*: any*/),
            body,
          });
        } catch (error) {
          reject(error);
        }
      });
      clientRequest.on('error', reject);

      if (request.body)
        clientRequest.write(request.body);

      clientRequest.end();
    });

    return response;
  };
  return {
    sendRequest,
  };
};

module.exports = {
  createNodeClient,
};