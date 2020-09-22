// @flow strict
/*:: import type { Readable } from 'stream'; */
/*:: import type { HTTPClient } from './main'; */
/*:: import type { HTTPStatus } from './http'; */
/*::
type NodeHTTPRequestOptions = {
  auth?: string,
  defaultPort?: number,
  family?: number,
  headers?: { [key: string] : mixed, ... },
  host?: string,
  hostname?: string,
  localAddress?: string,
  method?: string,
  path?: string,
  port?: number,
  protocol?: string,
  setHost?: boolean,
  socketPath?: string,
  timeout?: number,
};

type NodeHTTPRequestParams = {
  ...NodeHTTPRequestOptions,
  agent?: any,
  createConnection?: any,
  ...
};
type NodeHTTPResponse = Readable & {
  headers: Object,
  statusCode: number,
};
type NodeHTTPClientRequest = $ReadOnly<{
 on: (eventName: string, eventHandler: Function) => NodeHTTPClientRequest,
 end: () => NodeHTTPClientRequest,
 ...,
}>;
type NodeHTTPRequestFunction = (options: NodeHTTPRequestParams) => NodeHTTPClientRequest;
*/

const readStream = async (stream/*: Readable*/) => {
  const chunks = [];
  stream.setEncoding('utf8');
  for await (const chunk of stream)
    chunks.push(chunk.toString());
  return chunks.join('');
};

const createNodeClient = (nodeRequest/*: NodeHTTPRequestFunction*/)/*: HTTPClient*/ => {
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
      clientRequest.on('response', async (response/*: NodeHTTPResponse*/) => {
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