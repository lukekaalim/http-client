// @flow strict
/*::
import type { Result } from '@lukekaalim/result';

export type HTTPHeaders = Array<{ name: string, value: string }>;
export type HTTPMethod =
 | 'GET'
 | 'POST'
 | 'DELETE'
 | 'PUT'
 | 'HEAD'
 | 'OPTIONS'
 | 'PATCH';
 
export type HTTPResponse = {
  status: number,
  headers: HTTPHeaders,
  body: string,
};

export type HTTPClient = {
  request: (
    url: string,
    headers?: HTTPHeaders,
    method?: HTTPMethod,
    body?: string,
  ) => Promise<Result<HTTPResponse, Error>>,
};
*/