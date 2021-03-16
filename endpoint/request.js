// @flow strict
/*:: import type { Authorization } from './authorization'; */
const { createAuthorizationHeader } = require('./authorization');

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

const createRequestHeaders = (body/*: string*/, authorization/*: Authorization*/)/*: [string, string][]*/ => {
  return [
    body ? ['content-type', 'application/json'] : null,
    body ? ['content-length', Buffer.from(body, 'utf8').byteLength.toString()] : null,
    createAuthorizationHeader(authorization),
    ['accept', 'application/json'],
  ].filter(Boolean);
};

module.exports = {
  createRequestURL,
  createRequestHeaders,
}