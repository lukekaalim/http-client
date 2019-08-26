// @flow strict

/*::
// https://nodejs.org/api/http.html#http_http_request_options_callback
import typeof { request as NodeHTTPSRequestFunc } from 'https';
import typeof { request as NodeHTTPRequestFunc } from 'http';
import type { HTTPClient } from './client';
*/
import { succeed, fail } from './result';

// We need a couple of utilities to handle node
const toTuples = (list) => {
  const tuples = [];
  for (let i  = 0; i < list.length / 2; i++) {
    tuples[i] = [list[i * 2], list[(i * 2) + 1]];
  }
  return tuples;
};

const tuplesToObject = (list) => list.reduce((acc, [name, val]) => ({
  ...acc,
  [name]: val,
}), {});

export const createHTTPClientFromNodeHttpsRequest = (
  nodeRequest/*: NodeHTTPSRequestFunc | NodeHTTPRequestFunc*/
)/*: HTTPClient*/ => {
  const request = (
    url,
    httpHeaders = [],
    httpMethod = 'GET',
    body = null,
  ) => new Promise((resolve, reject) => {
    const headers = tuplesToObject(httpHeaders);
    const options = {
      method: httpMethod,
      headers,
    };
    const onIncomingMessage = (incomingMessage) => {
      const responseFragments = [];
      incomingMessage.on('data', fragment => responseFragments.push(fragment));
      incomingMessage.on('error', error => resolve(fail(error)));
      incomingMessage.on('end', () => {
        resolve(succeed({
          headers: toTuples(incomingMessage.rawHeaders).map(([name, value]) => ({ name, value })),
          body: responseFragments.join(),
          status: incomingMessage.statusCode,
        }));
      });
    };
    const clientRequest = nodeRequest(url, options, onIncomingMessage);
    if (body) {
      clientRequest.write(body);
    }
    clientRequest.on('error', error => resolve(fail(error)));
    clientRequest.end();
  });

  return {
    request,
  };
};