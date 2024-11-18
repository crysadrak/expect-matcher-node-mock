import { describe, it, mock } from 'node:test';

import { expect } from 'expect';

import {
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
} from '../mockMethodMatchers.mjs';

describe('mockMethodMatchers return snapshots', () => {
  it('toHaveBeenCalled - fail', () => {
    const options = {
      isNot: false,
      promise: false,
      toHaveBeenCalled,
    };

    const method = mock.fn();

    const result = options.toHaveBeenCalled(method);
    const message = result.message();

    expect(result).toEqual({ message: expect.any(Function), pass: false });
    expect(message).toStrictEqual(
      expect.stringContaining('expected original to be called')
    );
  });

  it('toHaveBeenCalled - pass', () => {
    const options = {
      isNot: false,
      promise: false,
      toHaveBeenCalled,
    };

    const method = mock.fn();

    method();

    const result = options.toHaveBeenCalled(method);

    expect(result).toEqual({ message: expect.any(Function), pass: true });
  });

  it('toHaveBeenCalled - not pass', () => {
    const options = {
      isNot: true,
      promise: false,
      toHaveBeenCalled,
    };
    const method = mock.fn();

    const result = options.toHaveBeenCalled(method);
    const message = result.message();

    expect(result).toEqual({ message: expect.any(Function), pass: false });
    expect(message).toStrictEqual(
      expect.stringContaining('expected original to be called')
    );
  });

  it('toHaveBeenCalled - not fail', () => {
    const options = {
      isNot: true,
      promise: false,
      toHaveBeenCalled,
    };
    const method = mock.fn();

    method();

    const result = options.toHaveBeenCalled(method);

    expect(result).toEqual({ message: expect.any(Function), pass: true });
  });
});
