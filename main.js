// @flow strict
/*:: import type { HTTPMethod, HTTPStatus } from './http'; */

/*::
type HTTPRequest = {
  url: string | URL,
  headers: [string, string][],
  method: HTTPMethod,
  body?: string,
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
};
*/

module.exports = {
  ...require('./node'),
  ...require('./web'),
};
