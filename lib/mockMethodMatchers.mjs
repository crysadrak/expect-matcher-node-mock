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
 * Helper function to check if arguments match using deep equality
 * @param {Array} callArgs - The arguments from the actual call
 * @param {Array} expectedArgs - The expected arguments
 * @returns {boolean} - Whether the arguments match
 */
function argumentsMatch(callArgs, expectedArgs) {
  if (callArgs.length !== expectedArgs.length) {
    return false;
  }
  return expectedArgs.every((arg, index) => {
    try {
      expect(callArgs[index]).toEqual(arg);
      return true;
    } catch (_) {
      return false;
    }
  });
}

/**
 * Helper function to format expected arguments message
 * @param {Array} args - The arguments to format
 * @returns {string} - Formatted message
 */
function formatExpectedArgs(args) {
  return args.length === 0
    ? 'called with 0 arguments'
    : args.map(arg => printExpected(arg)).join(', ');
}

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

  ensureReceivedIsNodeMock(receivedMethod, matcherName, options);

  const hint = `\n${matcherHint(matcherName, receivedText, '', options)}\n\n`;

  if (args.length > 0) {
    return {
      pass: false,
      message: () =>
        `${hint}Matcher error: this matcher must not have an expected argument\n` +
        `Expected has type:  ${typeof args[0]}\nExpected has value: ${EXPECTED_COLOR(args[0])}\n`,
    };
  }

  const pass = receivedMethod.mock.calls.length > 0;
  const callsCount = receivedMethod.mock.calls.length;
  const message = pass
    ? `Expected number of calls: ${EXPECTED_COLOR('0')}\nReceived number of calls: ${RECEIVED_COLOR(callsCount)}\n`
    : `Expected number of calls: >= ${EXPECTED_COLOR('1')}\nReceived number of calls:    ${RECEIVED_COLOR('0')}\n`;

  return {
    pass,
    message: () => hint + message,
  };
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

  ensureReceivedIsNodeMock(receivedMethod, matcherName, options);

  const calls = receivedMethod.mock.calls;
  const pass = calls.some(call => argumentsMatch(call.arguments, args));

  const expectedMsg = `Expected: ${pass ? 'not ' : ''}${formatExpectedArgs(args)}`;

  let receivedMsg = '';
  if (calls.length === 0) {
    receivedMsg = 'But the function was not called';
  } else {
    receivedMsg = `\n\nReceived\n${calls
      .map((call, index) => {
        const callArgs = call.arguments;
        return callArgs.length === 0
          ? `\t${index}: called with 0 arguments`
          : `\t${index}: ${callArgs.map(arg => printReceived(arg)).join(', ')}`;
      })
      .join('\n')}`;
  }

  return {
    pass,
    message: () =>
      `\n${matcherHint(matcherName, receivedText, '...expected', options)}\n\n` +
      `${expectedMsg}${receivedMsg}\n\nNumber of calls: ${RECEIVED_COLOR(calls.length)}\n`,
  };
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

  ensureReceivedIsNodeMock(receivedMethod, matcherName, options);

  const calls = receivedMethod.mock.calls;
  const callsCount = calls.length;

  if (callsCount === 0) {
    return {
      pass: false,
      message: () =>
        `${matcherHint(matcherName, receivedText, '...expected', options)}\n\n` +
        `Expected: ${formatExpectedArgs(args)}\n` +
        `But the function was not called\n\nNumber of calls: ${RECEIVED_COLOR(0)}\n`,
    };
  }

  const lastCall = calls[callsCount - 1];
  const pass = argumentsMatch(lastCall.arguments, args);
  const receivedArgs = lastCall.arguments
    .map(arg => printReceived(arg))
    .join(', ');

  return {
    pass,
    message: () =>
      `${matcherHint(matcherName, receivedText, '...expected', options)}\n\n` +
      `Expected: ${pass ? 'not ' : ''}${formatExpectedArgs(args)}\n\n\n` +
      `Received: ${receivedArgs || 'called with 0 arguments'}\n\n` +
      `Number of calls: ${RECEIVED_COLOR(callsCount)}\n`,
  };
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

  ensureReceivedIsNodeMock(receivedMethod, matcherName, options);

  const calls = receivedMethod.mock.calls;
  const callsCount = calls.length;

  if (nthCallIndex < 1 || nthCallIndex > callsCount) {
    return {
      pass: false,
      message: () =>
        `${matcherHint(matcherName, receivedText, '...expected', options)}\n\n` +
        `n: ${nthCallIndex}\n` +
        `Expected: ${formatExpectedArgs(args)}\n` +
        `But the function was ${callsCount === 0 ? 'not called' : `only called ${callsCount} time(s)`}\n\n` +
        `Number of calls: ${RECEIVED_COLOR(callsCount)}\n`,
    };
  }

  const nthCall = calls[nthCallIndex - 1];
  const pass = argumentsMatch(nthCall.arguments, args);
  const receivedArgs = nthCall.arguments
    .map(arg => printReceived(arg))
    .join(', ');

  return {
    pass,
    message: () =>
      `${matcherHint(matcherName, receivedText, '...expected', options)}\n\n` +
      `n: ${nthCallIndex}\n` +
      `Expected: ${pass ? 'not ' : ''}${formatExpectedArgs(args)}\n` +
      `Received: ${receivedArgs || 'called with 0 arguments'}\n\n` +
      `Number of calls: ${RECEIVED_COLOR(callsCount)}\n`,
  };
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

  ensureReceivedIsNodeMock(receivedMethod, matcherName, options);

  const successfulReturns = receivedMethod.mock.calls.filter(
    call => call.error === undefined
  ).length;
  const pass = successfulReturns === times;

  return {
    pass,
    message: () =>
      `\n${matcherHint(matcherName, receivedText, 'expected', options)}\n\n` +
      `Expected: ${pass ? 'not ' : ''}${printExpected(times)}\n` +
      `Received: ${printReceived(successfulReturns)}`,
  };
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

  ensureReceivedIsNodeMock(receivedMethod, matcherName, options);

  const pass = receivedMethod.mock.calls.some(call => {
    try {
      expect(call.result).toEqual(expected);
      return true;
    } catch (_) {
      return false;
    }
  });

  const allResults = receivedMethod.mock.calls.map(call => call.result);

  return {
    pass,
    message: () =>
      `\n${matcherHint(matcherName, receivedText, 'expected', options)}\n\n` +
      `Expected: ${pass ? 'not ' : ''}${printExpected(expected)}\n` +
      `Received: ${printReceived(allResults)}`,
  };
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

  ensureReceivedIsNodeMock(receivedMethod, matcherName, options);

  const calls = receivedMethod.mock.calls;
  if (calls.length === 0) {
    return {
      pass: false,
      message: () =>
        `\n${matcherHint(matcherName, receivedText, 'expected', options)}\n\nExpected: ${printExpected(expected)}\nBut the function was not called`,
    };
  }

  const lastCall = calls[calls.length - 1];
  let pass = false;
  try {
    expect(lastCall.result).toEqual(expected);
    pass = true;
  } catch (_) {
    pass = false;
  }

  return {
    pass,
    message: () =>
      `\n${matcherHint(matcherName, receivedText, 'expected', options)}\n\n` +
      `Expected: ${pass ? 'not ' : ''}${printExpected(expected)}\n` +
      `Received: ${printReceived(lastCall.result)}`,
  };
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

  ensureReceivedIsNodeMock(receivedMethod, matcherName, options);

  const calls = receivedMethod.mock.calls;
  if (nthCall < 1 || nthCall > calls.length) {
    return {
      pass: false,
      message: () =>
        `\n${matcherHint(matcherName, receivedText, 'expected', options)}\n\n` +
        `n: ${nthCall}\n` +
        `Expected: ${printExpected(expected)}\n` +
        `But the function was ${calls.length === 0 ? 'not called' : `only called ${calls.length} time(s)`}`,
    };
  }

  const nthCallResult = calls[nthCall - 1].result;
  let pass = false;
  try {
    expect(nthCallResult).toEqual(expected);
    pass = true;
  } catch (_) {
    pass = false;
  }

  return {
    pass,
    message: () =>
      `\n${matcherHint(matcherName, receivedText, 'expected', options)}\n\n` +
      `n: ${nthCall}\n` +
      `Expected: ${pass ? 'not ' : ''}${printExpected(expected)}\n` +
      `Received: ${printReceived(nthCallResult)}`,
  };
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
