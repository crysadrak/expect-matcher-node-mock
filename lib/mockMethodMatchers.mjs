import chalk from 'chalk';
import { expect } from 'expect';
import {
  matcherErrorMessage,
  matcherHint,
  printExpected,
  printReceived,
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

  if (typeof received.mock !== 'object') {
    throw new TypeError(
      matcherErrorMessage(
        matcherHint(matcherName, 'mock.fn()', '', options),
        `${RECEIVED_COLOR('received')} value must be a node mock function`
      )
    );
  }

  return true;
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
function toHaveBeenCalled(receivedMethod, ...args) {
  const { matcherName, options, receivedText } = matcherFactory(
    'toHaveBeenCalled',
    this
  );

  if (ensureReceivedIsNodeMock(receivedMethod, matcherName, options)) {
    let message = `\n${matcherHint(
      matcherName,
      receivedText,
      '',
      options
    )}\n\n`;
    let pass = false;

    if (args && args[0]) {
      message += `Matcher error: this matcher must not have an expected argument
          \nExpected has type:  ${typeof args[0]}\nExpected has value: ${EXPECTED_COLOR(
        args[0]
      )}\n`;
    } else {
      pass = receivedMethod.mock.calls.length > 0;
      if (pass) {
        message += `Expected number of calls: ${EXPECTED_COLOR(
          '0'
        )}\nReceived number of calls: ${RECEIVED_COLOR(
          receivedMethod.mock.calls.length
        )}\n`;
      } else {
        message += `Expected number of calls: >= ${EXPECTED_COLOR(
          '1'
        )}\nReceived number of calls:    ${RECEIVED_COLOR('0')}\n`;
      }
    }

    return {
      pass,
      message: () => message,
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

  if (ensureReceivedIsNodeMock(receivedMethod, matcherName, options)) {
    const received = receivedMethod.mock.calls.length;
    let message = `\n${matcherHint(
      matcherName,
      receivedText,
      'expected',
      options
    )}\n\n`;
    const pass = received === expected;

    if (pass) {
      message += `Expected number of calls: not ${EXPECTED_COLOR(received)}\n`;
    } else {
      message += `Expected number of calls: ${EXPECTED_COLOR(
        expected
      )}\nReceived number of calls: ${RECEIVED_COLOR(received)}\n`;
    }

    return {
      pass,
      message: () => message,
    };
  }
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
        message += `${args.map(arg => printExpected(arg)).join(', ')}`;
      }
    } else {
      pass = receivedMethod.mock.calls.some(call => {
        receivedArgs.push(call.arguments);
        return (
          argsCount &&
          args.every((arg, index) => {
            try {
              expect(call.arguments[index]).toEqual(arg);
              return true;
            } catch (_) {
              return false;
            }
          })
        );
      });

      message = `Expected: ${pass ? 'not ' : ''}`;

      if (argsCount === 0) {
        message += `called with 0 arguments`;
      } else {
        message += `${args.map(arg => printExpected(arg)).join(', ')}`;
      }

      message += `\n\nReceived\n${receivedArgs.reduce(
        (receivedText, args, index) =>
          (receivedText +=
            args.length === 0
              ? '\t' + index + ': called with 0 arguments\n'
              : '\t' +
                index +
                ': ' +
                args.map(arg => printReceived(arg)).join(', ') +
                '\n'),
        ''
      )}`;
    }

    return {
      pass,
      message: () =>
        `\n${matcherHint(
          matcherName,
          receivedText,
          '...expected',
          options
        )}\n\n${message}\n\nNumber of calls: ${RECEIVED_COLOR(
          receivedMethod.mock.calls.length
        )}\n`,
    };
  }
}

/**
 * toHaveBeenLastCalledWith
 *
 * https://jestjs.io/docs/expect#tohavebeenlastcalledwitharg1-arg2-
 */
function toHaveBeenLastCalledWith(receivedMethod, ...args) {
  const { matcherName, options, receivedText } = matcherFactory(
    'toHaveBeenLastCalledWith',
    this
  );

  if (ensureReceivedIsNodeMock(receivedMethod, matcherName, options)) {
    const argsCount = args.length;
    const receivedArgs = [];
    let pass = false;
    let message = '';
    const callsCount = receivedMethod.mock.calls.length;

    if (!callsCount) {
      pass = false;
      message = `Expected: `;
      if (argsCount === 0) {
        message += `called with 0 arguments`;
      } else {
        message += `${args.map(arg => printExpected(arg)).join(', ')}`;
      }
    } else {
      const lastCall = receivedMethod.mock.calls[callsCount - 1];
      receivedArgs.push(lastCall.arguments);
      pass =
        argsCount &&
        args.every((arg, index) => {
          try {
            expect(lastCall.arguments[index]).toEqual(arg);
            return true;
          } catch (_) {
            return false;
          }
        });

      message = `Expected: ${pass ? 'not ' : ''}`;

      if (argsCount === 0) {
        message += `called with 0 arguments`;
      } else {
        message += `${args.map(arg => printExpected(arg)).join(', ')}`;
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
        )}\n`,
    };
  }
}

/**
 * toHaveBeenNthCalledWith
 *
 * https://jestjs.io/docs/expect#tohavebeennthcalledwithnthcall-arg1-arg2-
 */
function toHaveBeenNthCalledWith(receivedMethod, nthCallIndex, ...args) {
  const { matcherName, options, receivedText } = matcherFactory(
    'toHaveBeenNthCalledWith',
    this
  );

  if (ensureReceivedIsNodeMock(receivedMethod, matcherName, options)) {
    const argsCount = args.length;
    const receivedArgs = [];
    let pass = false;
    let message = `n: ${nthCallIndex}\n`;
    const callsCount = receivedMethod.mock.calls.length;

    if (!callsCount || nthCallIndex > callsCount) {
      pass = false;
      message += `Expected: `;
      if (argsCount === 0) {
        message += `called with 0 arguments`;
      } else {
        message += `${args.map(arg => printExpected(arg)).join(', ')}`;
      }
    } else {
      const nthCall = receivedMethod.mock.calls[nthCallIndex - 1];
      receivedArgs.push(nthCall.arguments);
      pass =
        argsCount &&
        args.every((arg, index) => {
          try {
            expect(nthCall.arguments[index]).toEqual(arg);
            return true;
          } catch (_) {
            return false;
          }
        });

      message += `Expected: ${pass ? 'not ' : ''}`;

      if (argsCount === 0) {
        message += `called with 0 arguments`;
      } else {
        message += `${args.map(arg => printExpected(arg)).join(', ')}`;
      }

      message += `\nReceived: ${
        receivedArgs.length
          ? receivedArgs.map(args =>
              args.map(arg => printReceived(arg)).join(', ')
            )
          : 'called with 0 arguments'
      }`;
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
        )}\n`,
    };
  }
}

/**
 * toHaveReturned
 *
 * https://jestjs.io/docs/expect#tohavereturned
 */
function toHaveReturned(receivedMethod) {
  const { matcherName, options, receivedText } = matcherFactory(
    'toHaveReturned',
    this
  );

  if (ensureReceivedIsNodeMock(receivedMethod, matcherName, options)) {
    const pass = receivedMethod.mock.calls.some(
      call => call.error === undefined
    );

    let message = `\n${matcherHint(
      matcherName,
      receivedText,
      '',
      options
    )}\n\n`;

    if (pass) {
      message += `Expected: ${printExpected(
        'not to return an error'
      )}\nReceived: ${printReceived('returned without error')}`;
    } else {
      message += `Expected: ${printExpected(
        'not to return an error'
      )}\nReceived: ${printReceived('returned with error')}`;
    }

    return {
      pass,
      message: () => message,
    };
  }
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
  const { matcherName, options, receivedText } = matcherFactory(
    'toHaveReturnedTimes',
    this
  );

  if (ensureReceivedIsNodeMock(receivedMethod, matcherName, options)) {
    const noErrorCalls = receivedMethod.mock.calls.filter(
      call => call.error === undefined
    );
    const pass = noErrorCalls.length === times;

    let message = `\n${matcherHint(
      matcherName,
      receivedText,
      'expected',
      options
    )}\n\n`;

    if (pass) {
      message += `Expected: ${printExpected(times)}\nReceived: ${printReceived(
        noErrorCalls.length
      )}`;
    } else {
      message += `Expected: ${printExpected(times)}\nReceived: ${printReceived(
        noErrorCalls.length
      )}`;
    }

    return {
      pass,
      message: () => message,
    };
  }
}

/**
 * toHaveReturnedWith
 *
 * https://jestjs.io/docs/expect#tohavereturnedwithvalue
 */
function toHaveReturnedWith(receivedMethod, expected) {
  const { matcherName, options, receivedText } = matcherFactory(
    'toHaveReturnedWith',
    this
  );

  if (ensureReceivedIsNodeMock(receivedMethod, matcherName, options)) {
    const pass = receivedMethod.mock.calls.some(
      call => call.result === expected
    );

    let message = `\n${matcherHint(
      matcherName,
      receivedText,
      'expected',
      options
    )}\n\n`;

    if (pass) {
      message += `Expected: ${printExpected(
        expected
      )}\nReceived: ${printReceived(
        receivedMethod.mock.calls.map(call => call.result)
      )}`;
    } else {
      message += `Expected: ${printExpected(
        expected
      )}\nReceived: ${printReceived(
        receivedMethod.mock.calls.map(call => call.result)
      )}`;
    }

    return {
      pass,
      message: () => message,
    };
  }
}

/**
 * toHaveLastReturnedWith
 *
 * https://jestjs.io/docs/expect#tohavelastreturnedwithvalue
 */
function toHaveLastReturnedWith(receivedMethod, expected) {
  const { matcherName, options, receivedText } = matcherFactory(
    'toHaveLastReturnedWith',
    this
  );

  if (ensureReceivedIsNodeMock(receivedMethod, matcherName, options)) {
    const lastCall =
      receivedMethod.mock.calls[receivedMethod.mock.calls.length - 1];
    const pass = lastCall.result === expected;

    let message = `\n${matcherHint(
      matcherName,
      receivedText,
      'expected',
      options
    )}\n\n`;

    if (pass) {
      message += `Expected: ${printExpected(
        expected
      )}\nReceived: ${printReceived(lastCall.result)}`;
    } else {
      message += `Expected: ${printExpected(
        expected
      )}\nReceived: ${printReceived(lastCall.result)}`;
    }

    return {
      pass,
      message: () => message,
    };
  }
}

/**
 * toHaveNthReturnedWith
 *
 * https://jestjs.io/docs/expect#tohaventhreturnedwithnthcall-value
 */
function toHaveNthReturnedWith(receivedMethod, nthCall, expected) {
  const { matcherName, options, receivedText } = matcherFactory(
    'toHaveNthReturnedWith',
    this
  );

  if (ensureReceivedIsNodeMock(receivedMethod, matcherName, options)) {
    const nthCallResult = receivedMethod.mock.calls[nthCall - 1].result;
    const pass = nthCallResult === expected;

    let message = `\n${matcherHint(
      matcherName,
      receivedText,
      'expected',
      options
    )}\n\n`;

    if (pass) {
      message += `Expected: ${printExpected(
        expected
      )}\nReceived: ${printReceived(nthCallResult)}`;
    } else {
      message += `Expected: ${printExpected(
        expected
      )}\nReceived: ${printReceived(nthCallResult)}`;
    }

    return {
      pass,
      message: () => message,
    };
  }
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
