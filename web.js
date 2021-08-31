// @flow strict
/*:: import type { HTTPClient } from './main'; */
/*:: import type { HTTPStatus } from './http'; */
/*:: import type { JSONValue } from './json'; */


const createWebClient = (fetchImplementation/*: typeof fetch*/)/*: HTTPClient*/ => {
  const handleResponse = async (response) => {
    const status = response.status;
    const headers = [...response.headers];
    const body = await response.text();
    return {
      status,
      headers,
      body,
    };
  };
  const sendRequest = async ({ url, headers, method, body }) => {
    return handleResponse(await fetchImplementation(url, { headers, method, body }));
  };

  return {
    sendRequest,
  };
};

module.exports = {
  createWebClient,
};
