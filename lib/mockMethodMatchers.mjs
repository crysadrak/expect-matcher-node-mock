import { expect } from 'expect';
import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils';

/**
 * toHaveBeenCalled
 */
function toHaveBeenCalled(method) {
  expect(typeof method).toBe('function');

  // detect native node test runner mock
  if (typeof method.mock === 'object') {
    const matcherName = 'toHaveBeenCalled';
    const options = {
      isNot: this.isNot,
      promise: this.promise,
    };

    const pass = method.mock.calls.length > 0;

    if (pass) {
      return {
        pass,
        message: () =>
          `${matcherHint(
            matcherName,
            undefined,
            undefined,
            options
          )}\nexpected ${method.name} not to be called`,
      };
    }

    return {
      pass,
      message: () =>
        `${matcherHint(matcherName, undefined, undefined, options)}\nexpected ${
          method.name
        }  to be called`,
    };
  }

  return expect(method).toHaveBeenCalled();
}

/**
 * toHaveBeenCalledTimes
 */
function toHaveBeenCalledTimes(method, expected) {
  expect(typeof method).toBe('function');

  // detect native node test runßßner mock
  if (typeof method.mock === 'object') {
    const matcherName = 'toHaveBeenCalledTimes';
    const options = {
      isNot: this.isNot,
      promise: this.promise,
    };
    const received = method.mock.calls.length;

    const pass = received === expected;

    if (pass) {
      return {
        pass,
        message: () =>
          `${matcherHint(
            matcherName,
            undefined,
            undefined,
            options
          )}\nExpected: ${printExpected(expected)}\nReceived: ${printReceived(
            received
          )}`,
      };
    }

    return {
      pass,
      message: () =>
        `${matcherHint(
          matcherName,
          undefined,
          undefined,
          options
        )}\nExpected: ${printExpected(expected)}\nReceived: ${printReceived(
          received
        )}`,
    };
  }

  return expect(method).toHaveBeenCalledTimes(expected);
}

/**
 * toHaveBeenCalledWith
 */
function toHaveBeenCalledWith(method, ...args) {
  expect(typeof method).toBe('function');

  // detect native node test runner mock
  if (typeof method.mock === 'object') {
    expect(method.mock.calls.length).toBeGreaterThan(0);

    const matcherName = 'toHaveBeenCalledWith';
    const options = {
      isNot: this.isNot,
      promise: this.promise,
    };
    const receivedArgs = [];

    const pass = method.mock.calls.some(call => {
      receivedArgs.push(call.arguments);
      return args.every((arg, index) => call.arguments[index] === arg);
    });

    if (pass) {
      return {
        pass,
        message: () =>
          `${matcherHint(
            matcherName,
            undefined,
            undefined,
            options
          )}\nExpected: ${printExpected(...args)}\nReceived: ${receivedArgs.map(
            args => args.map(arg => printReceived(arg)).join(', ')
          )}`,
      };
    }

    return {
      pass,
      message: () =>
        `${matcherHint(
          matcherName,
          undefined,
          undefined,
          options
        )}\nExpected: ${printExpected(...args)}\nReceived: ${receivedArgs.map(
          args => args.map(arg => printReceived(arg)).join(', ')
        )}`,
    };
  }

  return expect(method).toHaveBeenCalledWith(...args);
}

/**
 * toHaveBeenLastCalledWith
 */
function toHaveBeenLastCalledWith(method, ...args) {
  expect(typeof method).toBe('function');

  // detect native node test runner mock
  if (typeof method.mock === 'object') {
    expect(method.mock.calls.length).toBeGreaterThan(0);

    const matcherName = 'toHaveBeenLastCalledWith';
    const options = {
      isNot: this.isNot,
      promise: this.promise,
    };
    const lastCall = method.mock.calls[method.mock.calls.length - 1];

    const pass = args.every((arg, index) => lastCall.arguments[index] === arg);

    if (pass) {
      return {
        pass,
        message: () =>
          `${matcherHint(
            matcherName,
            undefined,
            undefined,
            options
          )}\nExpected: ${printExpected(
            ...args
          )}\nReceived: ${lastCall.arguments.map(arg => printReceived(arg))}`,
      };
    }

    return {
      pass,
      message: () =>
        `${matcherHint(
          matcherName,
          undefined,
          undefined,
          options
        )}\nExpected: ${printExpected(
          ...args
        )}\nReceived: ${lastCall.arguments.map(arg => printReceived(arg))}`,
    };
  }

  return expect(method).toHaveBeenLastCalledWith(...args);
}

/**
 * toHaveBeenNthCalledWith
 */
function toHaveBeenNthCalledWith(method, nthCall, ...args) {
  expect(typeof method).toBe('function');

  // detect native node test runner mock
  if (typeof method.mock === 'object') {
    expect(method.mock.calls.length).toBeGreaterThan(nthCall - 1);

    const matcherName = 'toHaveBeenNthCalledWith';
    const options = {
      isNot: this.isNot,
      promise: this.promise,
    };
    const lastCall = method.mock.calls[nthCall - 1];

    const pass = args.every((arg, index) => lastCall.arguments[index] === arg);

    if (pass) {
      return {
        pass,
        message: () =>
          `${matcherHint(
            matcherName,
            undefined,
            undefined,
            options
          )}\nExpected: ${printExpected(
            ...args
          )}\nReceived: ${lastCall.arguments.map(arg => printReceived(arg))}`,
      };
    }

    return {
      pass,
      message: () =>
        `${matcherHint(
          matcherName,
          undefined,
          undefined,
          options
        )}\nExpected: ${printExpected(
          ...args
        )}\nReceived: ${lastCall.arguments.map(arg => printReceived(arg))}`,
    };
  }

  return expect(method).toHaveBeenNthCalledWith(nthCall, ...args);
}

export {
  toHaveBeenCalled,
  toHaveBeenCalledTimes,
  toHaveBeenCalledWith,
  toHaveBeenLastCalledWith,
  toHaveBeenNthCalledWith,
};
