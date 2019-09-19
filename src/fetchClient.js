// @flow strict
/*::
import type { HTTPClient } from './client';
*/
import { succeed, fail } from '@lukekaalim/result';

const tuplesToObject = (list) => list.reduce((acc, [name, val]) => ({
  ...acc,
  [name]: val,
}), {});

// We need to ask for both the fetch function and a header constructor, as it's a custom
// object and not an interface we can implement
// https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
// https://developer.mozilla.org/en-US/docs/Web/API/Headers
export const createHTTPClientFromFetch = (
  fetch/*: typeof fetch*/,
  Headers/*: typeof Headers*/,
)/*: HTTPClient*/ => {
  const request = async (
    url,
    httpHeaders = [],
    httpMethod = 'GET',
    body = null,
  ) => {
    try {
      const headers = new Headers(tuplesToObject(httpHeaders))
      const options = {
        method: httpMethod,
        headers,
        body,
      };
      const response = await fetch(url, options);

      return succeed({
        status: response.status,
        headers: [...response.headers.entries()].map(([name, value]) => ({ name, value })),
        body: await response.text(),
      });
    } catch (error) {
      return fail(error);
    }
  };

  return {
    request,
  };
};