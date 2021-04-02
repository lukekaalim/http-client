// @flow strict
/*:: import type { Cast, JSONValue } from '@lukekaalim/cast'; */
/*:: import type { Endpoint, GETEndpoint, POSTEndpoint, PUTEndpoint, DELETEEndpoint } from '@lukekaalim/api-models'; */
/*:: import type { HTTPService, GETEndpointClient, POSTEndpointClient, PUTEndpointClient, DELETEEndpointClient } from '../endpoint'; */
/*:: import type { HTTPClient } from '../main'; */

const { createRequest, createResponse } = require('./request');

const createGETClient = /*:: <ResponseBody: JSONValue, Query: ?{ +[string]: ?string }>*/(
  endpoint/*: GETEndpoint<ResponseBody, Query>*/,
  http/*: HTTPClient*/,
  service/*: HTTPService*/,
)/*: GETEndpointClient<Query, ResponseBody>*/ => {
  const get = async (query, headers = {}) => {
    const request = createRequest('GET', endpoint, service, query, null, headers);
    const response = await http.sendRequest(request);
    return createResponse(request, response, endpoint.toResponseBody);
  };
  return { get };
};

const createPOSTClient = /*:: <RequestBody: JSONValue, ResponseBody: JSONValue, Query: ?{ +[string]: ?string }>*/(
  endpoint/*: POSTEndpoint<RequestBody, ResponseBody, Query>*/,
  http/*: HTTPClient*/,
  service/*: HTTPService*/,
)/*: POSTEndpointClient<Query, RequestBody, ResponseBody>*/ => {
  const post = async (query, body, headers = {}) => {
    const request = createRequest('POST', endpoint, service, query, body, headers);
    const response = await http.sendRequest(request);
    return createResponse(request, response, endpoint.toResponseBody);
  };
  return { post };
};


const createPUTClient = /*:: <RequestBody: JSONValue, Query: ?{ +[string]: ?string }>*/(
  endpoint/*: PUTEndpoint<RequestBody, Query>*/,
  http/*: HTTPClient*/,
  service/*: HTTPService*/,
)/*: PUTEndpointClient<Query, RequestBody>*/ => {
  const put = async (query, body, headers = {}) => {
    const request = createRequest('PUT', endpoint, service, query, body, headers);
    const response = await http.sendRequest(request);
    return createResponse(request, response, () => null);
  };
  return { put };
};

const createDELETEClient = /*:: <RequestBody: JSONValue, ResponseBody: JSONValue, Query: ?{ +[string]: ?string }>*/(
  endpoint/*: DELETEEndpoint<RequestBody, ResponseBody, Query>*/,
  http/*: HTTPClient*/,
  service/*: HTTPService*/,
)/*: DELETEEndpointClient<Query, RequestBody, ResponseBody>*/ => {
  const _delete = async (query, body, headers = {}) => {
    const request = createRequest('PUT', endpoint, service, query, body, headers);
    const response = await http.sendRequest(request);
    return createResponse(request, response, endpoint.toResponseBody);
  };
  return { delete: _delete };
};

module.exports = {
  createGETClient,
  createPOSTClient,
  createDELETEClient,
  createPUTClient,
}