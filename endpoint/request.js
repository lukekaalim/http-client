// @flow strict
/*:: import type { Cast, JSONValue } from '@lukekaalim/cast'; */
/*:: import type { Endpoint } from '@lukekaalim/api-models'; */
/*:: import type { HTTPService } from '../endpoint'; */
/*:: import type { HTTPResponse, HTTPRequest, HTTPMethod, HTTPStatus } from '../main'; */
/*:: import type { HTTPHeaders } from '../http'; */
/*:: import type { Authorization } from './authorization'; */
/*:: import type { EndpointResponse } from './clients'; */
const { stringify, parse } = require('@lukekaalim/cast');
const { createAuthorizationHeader, createNoneAuthorization } = require('./authorization');
const { getErrorFromResponse } = require('./errors');
const { encodeStringToArrayBuffer } = require('../encoding');

const createRequestURL = (path/*: string*/, baseURL/*: URL*/, query/*: ?{ +[string]: ?string }*/)/*: URL*/ => {
  if (!query)
    return new URL(path, baseURL);
  
  const queryEntries = [];
  for (const prop in query)
    query[prop] && queryEntries.push([prop, query[prop]])
  
  const searchParams = new URLSearchParams(queryEntries);
  const url = new URL(path, baseURL);
  url.search = '?' + searchParams.toString();
  return url;
};

const createRequestHeaders = (body/*: ?string*/, authorization/*: Authorization*/)/*: [string, string][]*/ => {
  return [
    body ? ['content-type', 'application/json'] : null,
    body ? ['content-length', encodeStringToArrayBuffer(body).byteLength.toString()] : null,
    createAuthorizationHeader(authorization),
    ['accept', 'application/json'],
  ].filter(Boolean);
};

const createRequest = /*:: <Q: ?{ +[string]: ?string }>*/(
  method/*: HTTPMethod*/,
  endpoint/*: { ...Endpoint<Q> }*/,
  service/*: HTTPService*/,
  query/*: Q*/,
  body/*: JSONValue*/,
  headers/*: HTTPHeaders*/
)/*: HTTPRequest*/ => {
  const requestBody = stringify(body);
  const requestURL = createRequestURL(endpoint.path, service.baseURL, query);
  const requestHeaders = createRequestHeaders(requestBody, service.authorization || createNoneAuthorization());

  const request = {
    url: requestURL,
    headers: requestHeaders,
    method: method,
    body: requestBody,
  }
  return request;
};

const createResponse = /*::<R>*/(
  request/*: HTTPRequest*/,
  response/*: HTTPResponse*/,
  toResponseBody/*: JSONValue => R*/,
)/*: EndpointResponse<R>*/ => {
  const error = getErrorFromResponse(request, response);
  if (error)
    throw error;
  return {
    status: response.status,
    headers: Object.fromEntries(response.headers),
    body: toResponseBody(parse(response.body)),
  }
};

module.exports = {
  createRequest,
  createResponse,
  createRequestURL,
  createRequestHeaders,
}