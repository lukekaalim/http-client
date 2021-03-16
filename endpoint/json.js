// @flow strict
/*:: import type { Cast, JSONValue } from '@lukekaalim/cast'; */
/*:: import type { HTTPService, EndpointClient } from '../endpoint'; */
/*:: import type { HTTPClient, HTTPResponse, HTTPMethod, HTTPStatus } from '../main'; */
/*:: import type { Authorization } from './authorization'; */
const { stringify } = require('@lukekaalim/cast');
const { createAuthorizationHeader, createNoneAuthorization } = require('./authorization');
const { getObjectEntries } = require('./object');
const { getErrorFromResponse } = require('./errors');
const { createRequestURL, createRequestHeaders } = require('./request');

/*::
export type JSONEndpoint<Query: { +[string]: ?string }, RequestBody, ResponseBody> = {
  toResponseBody: JSONValue => ResponseBody,
  method: HTTPMethod,
  path: string,
};
*/

const createJSONEndpointClient = /*:: <
  Query: { +[string]: string },
  RequestBody: JSONValue,
  ResponseBody: JSONValue
>*/({
  endpoint,
  http,
  service,
  authorization = createNoneAuthorization(),
}/*: {
  endpoint: JSONEndpoint<Query, RequestBody, ResponseBody>,
  http: HTTPClient,
  service: HTTPService,
  authorization?: Authorization,
}*/)/*: EndpointClient<Query, RequestBody, ResponseBody>*/ => {
  const call = async (requestBodyValue = null, query = null) => {
    const requestURL = createRequestURL(endpoint.path, service.baseURL, query)
    const requestBody = stringify(requestBodyValue);
    const requestHeaders = createRequestHeaders(requestBody, authorization);

    const request = {
      url: requestURL,
      headers: requestHeaders,
      method: endpoint.method,
      body: requestBody,
    }
    const response = await http.sendRequest(request);
    const error = getErrorFromResponse(request, response);
    if (error)
      throw error;
    return endpoint.toResponseBody(JSON.parse(response.body));
  };
  return { call };
};

module.exports = {
  createJSONEndpointClient,
}