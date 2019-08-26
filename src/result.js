// @flow strict

/*::
export type Success<T> = { type: 'success', success: T };
export type Failure<T> = { type: 'failure', failure: T };

export type Result<TSuccess, TFailure> =
  | Success<TSuccess>
  | Failure<TFailure>
*/

export const succeed = /*::<T>*/(success/*: T*/)/*: Success<T>*/ => ({
  success,
  type: 'success',
});

export const fail = /*::<T>*/(failure/*: T*/)/*: Failure<T>*/ => ({
  failure,
  type: 'failure',
});
