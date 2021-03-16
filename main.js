// @flow strict
/*:: import type { HTTPMethod, HTTPStatus } from './http'; */

/*::
type HTTPRequest = {
  url: string | URL,
  headers: [string, string][],
  method: HTTPMethod,
  body?: null | string | Uint8Array,
};

type HTTPResponse = {
  status: HTTPStatus,
  headers: [string, string][],
  body: string,
};

type HTTPClient = {
  sendRequest: (request: HTTPRequest) => Promise<HTTPResponse>,
};

export type {
  HTTPClient,
  HTTPRequest,
  HTTPResponse,
  HTTPMethod,
  HTTPStatus,
};
*/

module.exports = {
  ...require('./node'),
  ...require('./web'),
  ...require('./endpoint'),
};
