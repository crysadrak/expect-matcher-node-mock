import chalk from 'chalk';
import { expect } from 'expect';
import {
  ensureExpectedIsNonNegativeInteger,
  ensureNoExpected,
  ensureNumbers,
  getLabelPrinter,
  matcherErrorMessage,
  matcherHint,
  printDiffOrStringify,
  printExpected,
  printReceived,
  printWithType,
  stringify,
} from 'jest-matcher-utils';

export const EXPECTED_COLOR = chalk.green;
export const RECEIVED_COLOR = chalk.red;
export const INVERTED_COLOR = chalk.inverse;
export const BOLD_WEIGHT = chalk.bold;
export const DIM_COLOR = chalk.dim;

/**
 * Function to ensure that the received value is a mock function
 * @param {Function} received
 * @param {string} matcherName
 * @param {Object} options
 * @returns {boolean}
 * @throws {TypeError}
 */
function ensureReceivedIsNodeMock(received, matcherName, options = {}) {
  if (typeof received !== 'function') {
    throw new TypeError(
      matcherErrorMessage(
        matcherHint(matcherName, typeof received, 'function', options),
        `${RECEIVED_COLOR('received')} value must be a function`
      )
    );
  }

  return typeof received.mock === 'object';
}

/**
 * Factory function to create a matcher object
 * @param {string} matcherName
 * @param {Object} options
 * @param {boolean} options.isNot
 * @param {boolean} options.promise
 * @returns {Object}
 */
function matcherFactory(matcherName, { isNot, promise } = {}) {
  return {
    matcherName,
    options: {
      comment: `${matcherName} of Node.js mock.fn()`,
      isNot,
      promise,
    },
    receivedText: 'mock.fn()',
  };
}

/**
 * toHaveBeenCalled
 *
 * https://jestjs.io/docs/expect#tohavebeencalled
 */
function toHaveBeenCalled(receivedMethod) {
  const { matcherName, options, receivedText } = matcherFactory(
    'toHaveBeenCalled',
    this
  );

  if (ensureReceivedIsNodeMock(receivedMethod, matcherName, options)) {
    const pass = receivedMethod.mock.calls.length > 0;

    if (pass) {
      return {
        pass,
        message: () => {
          return `${matcherHint(
            matcherName,
            receivedText,
            '',
            options
          )}\n\nExpected number of calls: ${EXPECTED_COLOR(
            '0'
          )}\nReceived number of calls: ${RECEIVED_COLOR(
            receivedMethod.mock.calls.length
          )}\n`;
        },
      };
    }

    return {
      pass,
      message: () => {
        return `${matcherHint(
          matcherName,
          receivedText,
          '',
          options
        )}\n\nExpected number of calls: >= ${EXPECTED_COLOR(
          receivedMethod.mock.calls.length
        )}\nReceived number of calls:    ${RECEIVED_COLOR('0')}\n`;
      },
    };
  }
}

/**
 * toHaveBeenCalledTimes
 *
 * https://jestjs.io/docs/expect#tohavebeencalledtimesnumber
 */
function toHaveBeenCalledTimes(receivedMethod, expected) {
  const { matcherName, options, receivedText } = matcherFactory(
    'toHaveBeenCalledTimes',
    this
  );
  const received = receivedMethod.mock.calls.length;

  if (ensureReceivedIsNodeMock(receivedMethod, matcherName, options)) {
    const pass = received === expected;

    if (pass) {
      return {
        pass,
        message: () => {
          return `${matcherHint(
            matcherName,
            receivedText,
            'expected',
            options
          )}\n\nExpected number of calls: not ${EXPECTED_COLOR(received)}\n`;
        },
      };
    }

    return {
      pass,
      message: () => {
        return `${matcherHint(
          matcherName,
          receivedText,
          'expected',
          options
        )}\n\nExpected number of calls: ${EXPECTED_COLOR(
          expected
        )}\nReceived number of calls: ${RECEIVED_COLOR(received)}\n`;
      },
    };
  }

  return expect(receivedMethod).toHaveBeenCalledTimes(expected);
}

/**
 * toHaveBeenCalledWith
 *
 * https://jestjs.io/docs/expect#tohavebeencalledwitharg1-arg2-
 */
function toHaveBeenCalledWith(receivedMethod, ...args) {
  const { matcherName, options, receivedText } = matcherFactory(
    'toHaveBeenCalledWith',
    this
  );

  if (ensureReceivedIsNodeMock(receivedMethod, matcherName, options)) {
    const argsCount = args.length;
    const receivedArgs = [];
    let pass = false;
    let message = '';

    if (!receivedMethod.mock.calls.length) {
      pass = false;
      message = `Expected: `;
      if (argsCount === 0) {
        message += `called with 0 arguments`;
      } else {
        message += `${printExpected(...args)}`;
      }
    } else {
      pass = receivedMethod.mock.calls.some(call => {
        receivedArgs.push(call.arguments);
        return (
          argsCount && args.every((arg, index) => call.arguments[index] === arg)
        );
      });

      message = `Expected: ${pass ? 'not ' : ''}`;

      if (argsCount === 0) {
        message += `called with 0 arguments`;
      } else {
        message += `${printExpected(...args)}`;
      }

      message += `\n\n\nReceived: ${receivedArgs.map(args =>
        args.map(arg => printReceived(arg)).join(', ')
      )}`;
    }

    return {
      pass,
      message: () =>
        `${matcherHint(
          matcherName,
          receivedText,
          '...expected',
          options
        )}\n\n${message}\n\nNumber of calls: ${RECEIVED_COLOR(
          receivedMethod.mock.calls.length
        )}`,
    };
  }

  //   return {
  //     pass,
  //     message: () =>
  //       `${matcherHint(
  //         matcherName,
  //         receivedText,
  //         '...expected',
  //         options
  //       )}\n\nExpected: ${
  //         argsCount > 0 ? printExpected(...args) : 'called with 0 arguments'
  //       }\n${
  //         argsCount > 0
  //           ? 'Received:' + receivedArgs.length > 1
  //             ? receivedArgs.map(args =>
  //                 args.map(arg => printReceived(arg)).join(', ')
  //               )
  //             : printReceived(receivedArgs[0])
  //           : 'Number of calls: ' +
  //             RECEIVED_COLOR(receivedMethod.mock.calls.length)
  //       }`,
  //   };
  // }

  return expect(receivedMethod).toHaveBeenCalledWith(...args);
}

/**
 * toHaveBeenLastCalledWith
 *
 * https://jestjs.io/docs/expect#tohavebeenlastcalledwitharg1-arg2-
 */
function toHaveBeenLastCalledWith(receivedMethod, ...args) {
  const matcherName = 'toHaveBeenLastCalledWith';
  const options = {
    comment: 'toHaveBeenLastCalledWith of Node.js mock.fn()',
    isNot: this.isNot,
    promise: this.promise,
  };
  const lastCall =
    receivedMethod.mock.calls[receivedMethod.mock.calls.length - 1];

  // detect native node test runner mock
  if (ensureReceivedIsNodeMock(receivedMethod, matcherName, options)) {
    expect(receivedMethod.mock.calls.length).toBeGreaterThan(0);

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

  return expect(receivedMethod).toHaveBeenLastCalledWith(...args);
}

/**
 * toHaveBeenNthCalledWith
 *
 * https://jestjs.io/docs/expect#tohavebeennthcalledwithnthcall-arg1-arg2-
 */
function toHaveBeenNthCalledWith(receivedMethod, nthCall, ...args) {
  expect(typeof receivedMethod).toBe('function');

  // detect native node test runner mock
  if (typeof receivedMethod.mock === 'object') {
    expect(receivedMethod.mock.calls.length).toBeGreaterThan(nthCall - 1);

    const matcherName = 'toHaveBeenNthCalledWith';
    const options = {
      isNot: this.isNot,
      promise: this.promise,
    };
    const lastCall = receivedMethod.mock.calls[nthCall - 1];

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

  return expect(receivedMethod).toHaveBeenNthCalledWith(nthCall, ...args);
}

/**
 * toHaveReturned
 *
 * https://jestjs.io/docs/expect#tohavereturned
 */
function toHaveReturned(receivedMethod) {
  expect(typeof receivedMethod).toBe('function');

  // detect native node test runner mock
  if (typeof receivedMethod.mock === 'object') {
    const matcherName = 'toHaveReturned';
    const options = {
      isNot: this.isNot,
      promise: this.promise,
    };

    const pass = receivedMethod.mock.calls.some(
      call => call.error === undefined
    );

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
            'not to return an error'
          )}\nReceived: ${printReceived('returned without error')}`,
      };
    } else {
      return {
        pass,
        message: () =>
          `${matcherHint(
            matcherName,
            undefined,
            undefined,
            options
          )}\nExpected: ${printExpected(
            'not to return an error'
          )}\nReceived: ${printReceived('returned with error')}`,
      };
    }
  }

  return expect(receivedMethod).toHaveReturned();
}

/**
 * toReturn
 *
 * https://jestjs.io/docs/expect#tohavereturned
 */
function toReturn(receivedMethod) {
  return toHaveReturned(receivedMethod);
}

/**
 * toHaveReturnedTimes
 *
 * https://jestjs.io/docs/expect#tohavereturnedtimesnumber
 */
function toHaveReturnedTimes(receivedMethod, times) {
  expect(typeof receivedMethod).toBe('function');

  // detect native node test runner mock
  if (typeof receivedMethod.mock === 'object') {
    const matcherName = 'toHaveReturnedTimes';
    const options = {
      isNot: this.isNot,
      promise: this.promise,
    };

    const noErrorCalls = receivedMethod.mock.calls.filter(
      call => call.error === undefined
    );
    const pass = noErrorCalls.length === times;

    if (pass) {
      return {
        pass,
        message: () =>
          `${matcherHint(
            matcherName,
            undefined,
            undefined,
            options
          )}\nExpected: ${printExpected(times)}\nReceived: ${printReceived(
            receivedMethod.mock.calls.length
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
        )}\nExpected: ${printExpected(times)}\nReceived: ${printReceived(
          receivedMethod.mock.calls.length
        )}`,
    };
  }

  return expect(receivedMethod).toHaveReturnedTimes(times);
}

/**
 * toHaveReturnedWith
 *
 * https://jestjs.io/docs/expect#tohavereturnedwithvalue
 */
function toHaveReturnedWith(receivedMethod, expected) {
  expect(typeof receivedMethod).toBe('function');

  // detect native node test runner mock
  if (typeof receivedMethod.mock === 'object') {
    const matcherName = 'toHaveReturnedWith';
    const options = {
      isNot: this.isNot,
      promise: this.promise,
    };

    const pass = receivedMethod.mock.calls.some(
      call => call.result === expected
    );

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
            receivedMethod.mock.calls.map(call => call.result)
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
          receivedMethod.mock.calls.map(call => call.result)
        )}`,
    };
  }

  return expect(receivedMethod).toHaveReturnedWith(expected);
}

/**
 * toHaveLastReturnedWith
 *
 * https://jestjs.io/docs/expect#tohavelastreturnedwithvalue
 */
function toHaveLastReturnedWith(receivedMethod, expected) {
  expect(typeof receivedMethod).toBe('function');

  // detect native node test runner mock
  if (typeof receivedMethod.mock === 'object') {
    const matcherName = 'toHaveLastReturnedWith';
    const options = {
      isNot: this.isNot,
      promise: this.promise,
    };

    const lastCall =
      receivedMethod.mock.calls[receivedMethod.mock.calls.length - 1];
    const pass = lastCall.result === expected;

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
            lastCall.result
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
          lastCall.result
        )}`,
    };
  }

  return expect(receivedMethod).toHaveLastReturnedWith(expected);
}

/**
 * toHaveNthReturnedWith
 *
 * https://jestjs.io/docs/expect#tohaventhreturnedwithnthcall-value
 */
function toHaveNthReturnedWith(receivedMethod, nthCall, expected) {
  expect(typeof receivedMethod).toBe('function');

  // detect native node test runner mock
  if (typeof receivedMethod.mock === 'object') {
    const matcherName = 'toHaveNthReturnedWith';
    const options = {
      isNot: this.isNot,
      promise: this.promise,
    };

    const nthCallResult = receivedMethod.mock.calls[nthCall - 1].result;
    const pass = nthCallResult === expected;

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
            nthCallResult
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
          nthCallResult
        )}`,
    };
  }

  return expect(receivedMethod).toHaveNthReturnedWith(nthCall, expected);
}

export {
  toHaveBeenCalled,
  toHaveBeenCalledTimes,
  toHaveBeenCalledWith,
  toHaveBeenLastCalledWith,
  toHaveBeenNthCalledWith,
  toReturn,
  toHaveReturned,
  toHaveReturnedTimes,
  toHaveReturnedWith,
  toHaveLastReturnedWith,
  toHaveNthReturnedWith,
};
