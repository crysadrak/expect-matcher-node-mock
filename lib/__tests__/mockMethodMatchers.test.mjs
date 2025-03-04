import { describe, it, mock } from 'node:test';

import { expect } from 'expect';
import stripAnsi from 'strip-ansi';

import '../index.mjs';

describe('mockMethodMatchers', () => {
  it('toHaveBeenCalled - should fail to test when method is not node mock', () => {
    const method = () => {};

    method();

    try {
      expect(method).toHaveBeenCalled();
    } catch (error) {
      expect(stripAnsi(error.message)).toEqual(
        expect.stringContaining(
          'Matcher error: received value must be a node mock function'
        )
      );
    }
  });

  it('toHaveBeenCalled - should test pass and not pass', () => {
    const method = mock.fn();
    const notCalledMethod = mock.fn();

    method();

    expect(method).toHaveBeenCalled();
    expect(notCalledMethod).not.toHaveBeenCalled();
  });

  it('toHaveBeenCalledTimes - should fail to test when method is not node mock', () => {
    const method = () => {};

    method();

    try {
      expect(method).toHaveBeenCalledTimes();
    } catch (error) {
      expect(stripAnsi(error.message)).toEqual(
        expect.stringContaining(
          'Matcher error: received value must be a node mock function'
        )
      );
    }
  });

  it('toHaveBeenCalledTimes - should test pass and not pass', () => {
    const method = mock.fn();
    const notCalledMethod = mock.fn();

    method();
    method();

    expect(method).toHaveBeenCalledTimes(2);
    expect(notCalledMethod).not.toHaveBeenCalledTimes(1);
  });

  it('toHaveBeenCalledWith - should fail to test when method is not node mock', () => {
    const method = () => {};

    method();

    try {
      expect(method).toHaveBeenCalledWith();
    } catch (error) {
      expect(stripAnsi(error.message)).toEqual(
        expect.stringContaining(
          'Matcher error: received value must be a node mock function'
        )
      );
    }
  });

  it('toHaveBeenCalledWith - should test pass and not pass', () => {
    const method = mock.fn();

    method('foo', 'bar');

    expect(method).toHaveBeenCalledWith('foo', 'bar');
    expect(method).not.toHaveBeenCalledWith('bar', 'foo');
  });

  it('toHaveBeenLastCalledWith - should fail to test when method is not node mock', () => {
    const method = () => {};

    method();

    try {
      expect(method).toHaveBeenLastCalledWith();
    } catch (error) {
      expect(stripAnsi(error.message)).toEqual(
        expect.stringContaining(
          'Matcher error: received value must be a node mock function'
        )
      );
    }
  });

  it('toHaveBeenLastCalledWith - should test pass and not pass', () => {
    const method = mock.fn();

    method('foo');
    method('bar');

    expect(method).toHaveBeenLastCalledWith('bar');
    expect(method).not.toHaveBeenLastCalledWith('foo');
  });

  it('toHaveBeenNthCalledWith - should fail to test when method is not node mock', () => {
    const method = () => {};

    method();

    try {
      expect(method).toHaveBeenNthCalledWith();
    } catch (error) {
      expect(stripAnsi(error.message)).toEqual(
        expect.stringContaining(
          'Matcher error: received value must be a node mock function'
        )
      );
    }
  });

  it('toHaveBeenNthCalledWith - should test pass and not pass', () => {
    const method = mock.fn();

    method('foo');
    method('bar');

    expect(method).toHaveBeenNthCalledWith(1, 'foo');
    expect(method).toHaveBeenNthCalledWith(2, 'bar');
    expect(method).not.toHaveBeenNthCalledWith(1, 'bar');
  });

  it('toHaveReturned - should fail to test when method is not node mock', () => {
    const method = () => {};

    method();

    try {
      expect(method).toHaveReturned();
    } catch (error) {
      expect(stripAnsi(error.message)).toEqual(
        expect.stringContaining(
          'Matcher error: received value must be a node mock function'
        )
      );
    }
  });

  it('toHaveReturned - should test pass and not pass', () => {
    const method = mock.fn();
    const notCalledMethod = mock.fn();

    method();

    expect(method).toHaveReturned();
    expect(notCalledMethod).not.toHaveReturned();
  });

  it('toHaveReturned - should not pass when mock method thorws an error', () => {
    const method = mock.fn(() => {
      throw new Error();
    });

    expect(() => {
      method();
    }).toThrow();

    expect(method).not.toHaveReturned();
  });

  it('toHaveReturnedTimes - should fail to test when method is not node mock', () => {
    const method = () => {};

    method();

    try {
      expect(method).toHaveReturnedTimes();
    } catch (error) {
      expect(stripAnsi(error.message)).toEqual(
        expect.stringContaining(
          'Matcher error: received value must be a node mock function'
        )
      );
    }
  });

  it('toHaveReturnedTimes - should test pass and not pass', () => {
    const method = mock.fn();
    const notCalledMethod = mock.fn();

    method();
    method();

    expect(method).toHaveReturnedTimes(2);
    expect(notCalledMethod).not.toHaveReturnedTimes(1);
  });

  it('toHaveReturnedTimes - should not pass when mock method thorws an error', () => {
    const method = mock.fn(() => {
      throw new Error();
    });

    expect(() => {
      method();
    }).toThrow();

    expect(method).not.toHaveReturnedTimes(1);
  });

  it('toHaveReturnedWith - should fail to test when method is not node mock', () => {
    const method = () => {};

    method();

    try {
      expect(method).toHaveReturnedWith();
    } catch (error) {
      expect(stripAnsi(error.message)).toEqual(
        expect.stringContaining(
          'Matcher error: received value must be a node mock function'
        )
      );
    }
  });

  it('toHaveReturnedWith - should test pass and not pass', () => {
    const method = mock.fn(arg => arg);

    method('foo', 'bar');

    expect(method).toHaveReturnedWith('foo', 'bar');
    expect(method).not.toHaveReturnedWith('bar', 'foo');
  });

  it('toHaveReturnedWith - should not pass when mock method thorws an error', () => {
    const method = mock.fn(() => {
      throw new Error();
    });

    expect(() => {
      method();
    }).toThrow();

    expect(method).not.toHaveReturnedWith('foo');
  });

  it('toHaveLastReturnedWith - should fail to test when method is not node mock', () => {
    const method = () => {};

    method();

    try {
      expect(method).toHaveLastReturnedWith();
    } catch (error) {
      expect(stripAnsi(error.message)).toEqual(
        expect.stringContaining(
          'Matcher error: received value must be a node mock function'
        )
      );
    }
  });

  it('toHaveLastReturnedWith - should test pass and not pass', () => {
    const method = mock.fn(arg => arg);

    method('foo');
    method('bar');

    expect(method).toHaveLastReturnedWith('bar');
    expect(method).not.toHaveLastReturnedWith('foo');
  });

  it('toHaveLastReturnedWith - should not pass when mock method thorws an error', () => {
    const method = mock.fn(() => {
      throw new Error();
    });

    expect(() => {
      method();
    }).toThrow();

    expect(method).not.toHaveLastReturnedWith('foo');
  });

  it('toHaveNthReturnedWith - should fail to test when method is not node mock', () => {
    const method = () => {};

    method();

    try {
      expect(method).toHaveNthReturnedWith();
    } catch (error) {
      expect(stripAnsi(error.message)).toEqual(
        expect.stringContaining(
          'Matcher error: received value must be a node mock function'
        )
      );
    }
  });

  it('toHaveNthReturnedWith - should test pass and not pass', () => {
    const method = mock.fn(arg => arg);

    method('foo');
    method('bar');

    expect(method).toHaveNthReturnedWith(1, 'foo');
    expect(method).toHaveNthReturnedWith(2, 'bar');
    expect(method).not.toHaveNthReturnedWith(1, 'bar');
  });

  it('toHaveNthReturnedWith - should not pass when mock method thorws an error', () => {
    const method = mock.fn(() => {
      throw new Error();
    });

    expect(() => {
      method();
    }).toThrow();

    expect(method).not.toHaveNthReturnedWith(1, 'foo');
  });
});
