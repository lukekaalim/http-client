// @flow strict

/*:: export type * from './endpoint/authorization'; */
/*:: export type * from './endpoint/base64'; */
/*:: export type * from './endpoint/json'; */
/*:: export type * from './endpoint/object'; */
/*:: export type * from './endpoint/errors'; */

/*::
export type HTTPService = {
  baseURL: URL,
};

// An Resource Client is a object that is a strict map of the application side data
// for a particular path and method of a HTTP service.
export type EndpointClient<Query, RequestBody, ResponseBody> = {
  call: (body?: RequestBody, query?: Query) => Promise<ResponseBody>, 
};
*/

module.exports = {
  ...require('./endpoint/authorization'),
  ...require('./endpoint/base64'),
  ...require('./endpoint/json'),
  ...require('./endpoint/object'),
  ...require('./endpoint/errors'),
}