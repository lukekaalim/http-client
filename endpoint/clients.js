// @flow strict
/*:: import type { HTTPStatus, HTTPHeaders } from '../http'; */

/*::

export type EndpointResponse<R> = {
  status: HTTPStatus,
  headers: HTTPHeaders,
  body: R,
};

// An Resource Client is a object that is a strict map of the application side data
// for a particular path and method of a HTTP service.
export type GETEndpointClient<Query, ResponseBody> = {|
  get: (query: Query, headers?: HTTPHeaders) => Promise<EndpointResponse<ResponseBody>>, 
|};
export type POSTEndpointClient<Query, RequestBody, ResponseBody> = {|
  post: (query: Query, body: RequestBody, headers?: HTTPHeaders) => Promise<EndpointResponse<ResponseBody>>, 
|};
export type PUTEndpointClient<Query, RequestBody> = {|
  put: (query: Query, body: RequestBody, headers?: HTTPHeaders) => Promise<EndpointResponse<null>>, 
|};
export type DELETEEndpointClient<Query, RequestBody, ResponseBody> = {|
  delete: (query: Query, body: RequestBody, headers?: HTTPHeaders) => Promise<EndpointResponse<ResponseBody>>, 
|};
*/