// @flow strict
/*:: import type { HTTPResponse, HTTPRequest } from '../main'; */

/*::
export type HTTPStatus =
  | 'ok'
  | 'created'
  | 'accepted'
  | 'no-content'
*/
class HTTPError extends Error {
  /*:: response: HTTPResponse */
  /*:: request: HTTPRequest */
  constructor(request/*: HTTPRequest*/, response/*: HTTPResponse*/) {
    super();
    this.response = response;
    this.request = request;
  }
}

// 4XX
class HTTPRequestError extends HTTPError {}
class HTTPNotFoundError extends HTTPRequestError {}
class HTTPBadRequestError extends HTTPRequestError {}
class HTTPUnauthorizedError extends HTTPRequestError {}
class HTTPForbiddenError extends HTTPRequestError {}
// 5XX
class HTTPServerError extends HTTPError {}
class HTTPInternalError extends HTTPServerError {}

const getErrorFromResponse = (request/*: HTTPRequest*/, response/*: HTTPResponse*/)/*: ?Error*/ => {
  const { status: statusCode } = response;
  const statusCodeCategory = Math.floor(statusCode / 100);
  switch (statusCodeCategory) {
    case 1:
    case 2:
    case 3:
    default:
      return null;
    case 4:
      switch (statusCode) {
        case 400:
          return new HTTPBadRequestError(request, response);
        case 401:
          return new HTTPUnauthorizedError(request, response);
        case 403:
          return new HTTPForbiddenError(request, response);
        case 404:
          return new HTTPNotFoundError(request, response);
        default:
          return new HTTPRequestError(request, response)
      }
    case 5:
      switch (statusCode) {
        case 500:
          return new HTTPInternalError(request, response);
        default:
          return new HTTPServerError(request, response);
      }
  }
};

module.exports = {
  HTTPError,

  HTTPRequestError,
  HTTPNotFoundError,
  HTTPBadRequestError,
  HTTPUnauthorizedError,
  HTTPForbiddenError,

  HTTPServerError,
  HTTPInternalError,

  getErrorFromResponse,
}