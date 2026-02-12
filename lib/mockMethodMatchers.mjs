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
 * @param {Function} received - The value to check if it's a mock function
 * @param {string} matcherName - The name of the matcher being used
 * @param {Object} [options={}] - Optional configuration for error messages
 * @returns {boolean} - Returns true if validation passes
 * @throws {TypeError} - Throws if received is not a function or not a mock function
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
 * @param {string} matcherName - The name of the matcher
 * @param {Object} [options={}] - Optional configuration
 * @param {boolean} [options.isNot] - Whether this is a negated matcher
 * @param {boolean} [options.promise] - Whether this is a promise matcher
 * @returns {Object} - An object containing matcherName, options, and receivedText
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
 * Matcher to verify that a mock function was called at least once
 * @param {Function} receivedMethod - The mock function to check
 * @param {...any} args - Should not be provided (will cause an error if present)
 * @returns {Object} - An object with pass and message properties
 * @see https://jestjs.io/docs/expect#tohavebeencalled
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
 * Matcher to verify that a mock function was called an exact number of times
 * @param {Function} receivedMethod - The mock function to check
 * @param {number} expected - The expected number of calls
 * @returns {Object} - An object with pass and message properties
 * @see https://jestjs.io/docs/expect#tohavebeencalledtimesnumber
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
 * Matcher to verify that a mock function was called with specific arguments at least once
 * @param {Function} receivedMethod - The mock function to check
 * @param {...any} args - The expected arguments
 * @returns {Object} - An object with pass and message properties
 * @see https://jestjs.io/docs/expect#tohavebeencalledwitharg1-arg2-
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
 * Matcher to verify that a mock function was last called with specific arguments
 * @param {Function} receivedMethod - The mock function to check
 * @param {...any} args - The expected arguments
 * @returns {Object} - An object with pass and message properties
 * @see https://jestjs.io/docs/expect#tohavebeenlastcalledwitharg1-arg2-
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
 * Matcher to verify that a mock function was called with specific arguments on the nth call
 * @param {Function} receivedMethod - The mock function to check
 * @param {number} nthCallIndex - The call number to check (1-indexed)
 * @param {...any} args - The expected arguments
 * @returns {Object} - An object with pass and message properties
 * @see https://jestjs.io/docs/expect#tohavebeennthcalledwithnthcall-arg1-arg2-
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
 * Matcher to verify that a mock function successfully returned (without error) at least once
 * @param {Function} receivedMethod - The mock function to check
 * @returns {Object} - An object with pass and message properties
 * @see https://jestjs.io/docs/expect#tohavereturned
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
 * Alias for toHaveReturned - verifies that a mock function successfully returned at least once
 * @param {Function} receivedMethod - The mock function to check
 * @returns {Object} - An object with pass and message properties
 * @see https://jestjs.io/docs/expect#tohavereturned
 */
function toReturn(receivedMethod) {
  return toHaveReturned(receivedMethod);
}

/**
 * Matcher to verify that a mock function successfully returned a specific number of times
 * @param {Function} receivedMethod - The mock function to check
 * @param {number} times - The expected number of successful returns
 * @returns {Object} - An object with pass and message properties
 * @see https://jestjs.io/docs/expect#tohavereturnedtimesnumber
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
 * Matcher to verify that a mock function returned a specific value at least once
 * @param {Function} receivedMethod - The mock function to check
 * @param {any} expected - The expected return value
 * @returns {Object} - An object with pass and message properties
 * @see https://jestjs.io/docs/expect#tohavereturnedwithvalue
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
 * Matcher to verify that a mock function's last return value matches the expected value
 * @param {Function} receivedMethod - The mock function to check
 * @param {any} expected - The expected return value
 * @returns {Object} - An object with pass and message properties
 * @see https://jestjs.io/docs/expect#tohavelastreturnedwithvalue
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
 * Matcher to verify that a mock function's nth return value matches the expected value
 * @param {Function} receivedMethod - The mock function to check
 * @param {number} nthCall - The call number to check (1-indexed)
 * @param {any} expected - The expected return value
 * @returns {Object} - An object with pass and message properties
 * @see https://jestjs.io/docs/expect#tohaventhreturnedwithnthcall-value
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
